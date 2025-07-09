import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

// Queue for pending backend sync operations
interface PendingSyncOperation {
    id: string;
    type: 'user_registration' | 'profile_update';
    data: Record<string, unknown>;
    timestamp: number;
    retryCount: number;
}

class ApiService {
    private pendingSyncQueue: PendingSyncOperation[] = [];
    private syncInProgress = false;
    private readonly MAX_RETRIES = 3;

    private async getAuthToken(): Promise<string | null> {
        const user = auth.currentUser;
        if (!user) return null;

        try {
            return await user.getIdToken();
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    }

    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        console.log(`📡 API Request: ${endpoint}`);

        const token = await this.getAuthToken();
        console.log(`🔑 Auth token: ${token ? 'Present' : 'Missing'}`);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            console.log(`🚀 Making request to: ${API_BASE_URL}${endpoint}`);
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            console.log(`📨 Response status: ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ API Error ${response.status}: ${errorText}`);
                throw new Error(`API Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log(`✅ API Response:`, data);
            return data;
        } catch (error) {
            console.error(`❌ Request failed:`, error);
            throw error;
        }
    }

    // Backend health check
    async isBackendAvailable(): Promise<boolean> {
        try {
            console.log('🔍 Checking backend health at:', `${API_BASE_URL.replace('/api', '')}/health`);
            const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000) // 5 second timeout
            });

            if (response.ok) {
                console.log('✅ Backend is available');
                return true;
            } else {
                console.log('❌ Backend responded with error:', response.status);
                return false;
            }
        } catch (error) {
            console.log('🔴 Backend not available:', error);
            return false;
        }
    }

    // Industry Standard Registration Flow
    async registerUser(userData: {
        email: string;
        displayName: string;
        firstName?: string;
        lastName?: string;
        role?: string;
    }) {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('No authenticated user found');
        }

        const backendData = {
            firebaseUser: {
                uid: currentUser.uid,
                email: currentUser.email,
                name: userData.displayName
            },
            role: userData.role || 'learner',
            first_name: userData.firstName,
            last_name: userData.lastName
        };

        // Try immediate registration
        const isBackendUp = await this.isBackendAvailable();

        if (isBackendUp) {
            try {
                return await this.makeRequest('/users/register', {
                    method: 'POST',
                    body: JSON.stringify(backendData),
                });
            } catch (error) {
                // If backend call fails, add to sync queue
                this.addToSyncQueue('user_registration', backendData);
                throw error;
            }
        } else {
            // Backend is down, add to sync queue
            console.log('📋 Backend down, adding registration to sync queue');
            this.addToSyncQueue('user_registration', backendData);
            throw new Error('Backend unavailable - queued for sync');
        }
    }

    // Industry Standard Login Flow - Backend Validation (Modified for current backend)
    async validateUserSession(firebaseUser: { uid: string; email: string | null; displayName: string | null }) {
        try {
            console.log('🔐 Validating user session with backend...');
            console.log('Firebase user:', firebaseUser);

            // Since /api/auth/validate doesn't exist, we'll use getUserProfile instead
            // This serves the same purpose - if user exists in backend, validation succeeds
            const profile = await this.getUserProfile();

            if (profile) {
                console.log('✅ Backend session validation successful (via profile fetch)');
                return profile;
            } else {
                throw new Error('User not found in backend');
            }

        } catch (error) {
            console.error('❌ Backend session validation failed:', error);
            throw error;
        }
    }

    async getUserProfile() {
        return this.makeRequest('/users/profile');
    }

    // Sync queue management
    private addToSyncQueue(type: PendingSyncOperation['type'], data: Record<string, unknown>) {
        const operation: PendingSyncOperation = {
            id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            data,
            timestamp: Date.now(),
            retryCount: 0
        };

        this.pendingSyncQueue.push(operation);
        console.log(`📋 Added to sync queue: ${operation.id}`);

        // Save to localStorage for persistence
        this.saveSyncQueueToStorage();

        // Try to process queue
        this.processSyncQueue();
    }

    private saveSyncQueueToStorage() {
        try {
            localStorage.setItem('stellarion_sync_queue', JSON.stringify(this.pendingSyncQueue));
        } catch (error) {
            console.error('Failed to save sync queue to storage:', error);
        }
    }

    private loadSyncQueueFromStorage() {
        try {
            const stored = localStorage.getItem('stellarion_sync_queue');
            if (stored) {
                this.pendingSyncQueue = JSON.parse(stored);
                console.log(`📋 Loaded ${this.pendingSyncQueue.length} items from sync queue`);
            }
        } catch (error) {
            console.error('Failed to load sync queue from storage:', error);
            this.pendingSyncQueue = [];
        }
    }

    async processSyncQueue() {
        if (this.syncInProgress || this.pendingSyncQueue.length === 0) {
            return;
        }

        this.syncInProgress = true;
        console.log(`🔄 Processing sync queue: ${this.pendingSyncQueue.length} items`);

        const isBackendUp = await this.isBackendAvailable();
        if (!isBackendUp) {
            console.log('🔴 Backend still down, skipping sync');
            this.syncInProgress = false;
            return;
        }

        const operations = [...this.pendingSyncQueue];

        for (let i = operations.length - 1; i >= 0; i--) {
            const operation = operations[i];

            try {
                console.log(`🔄 Syncing operation: ${operation.id}`);

                if (operation.type === 'user_registration') {
                    await this.makeRequest('/users/register', {
                        method: 'POST',
                        body: JSON.stringify(operation.data),
                    });
                }

                // Remove successful operation from queue
                this.pendingSyncQueue.splice(this.pendingSyncQueue.indexOf(operation), 1);
                console.log(`✅ Synced operation: ${operation.id}`);

            } catch (error) {
                console.error(`❌ Failed to sync operation ${operation.id}:`, error);

                // Increment retry count
                operation.retryCount++;

                // Remove if max retries exceeded
                if (operation.retryCount >= this.MAX_RETRIES) {
                    console.error(`❌ Max retries exceeded for operation ${operation.id}, removing from queue`);
                    this.pendingSyncQueue.splice(this.pendingSyncQueue.indexOf(operation), 1);
                }
            }
        }

        // Save updated queue
        this.saveSyncQueueToStorage();

        console.log(`✅ Sync queue processed. Remaining items: ${this.pendingSyncQueue.length}`);
        this.syncInProgress = false;
    }

    // Initialize sync queue from storage
    init() {
        this.loadSyncQueueFromStorage();

        // Set up periodic sync attempts
        setInterval(() => {
            this.processSyncQueue();
        }, 30000); // Try every 30 seconds
    }

    // Get sync queue status
    getSyncQueueStatus() {
        return {
            pending: this.pendingSyncQueue.length,
            operations: this.pendingSyncQueue.map(op => ({
                id: op.id,
                type: op.type,
                retryCount: op.retryCount,
                timestamp: op.timestamp
            }))
        };
    }

    // Manual sync trigger
    async forceSyncNow() {
        console.log('🔄 Manual sync triggered');
        await this.processSyncQueue();
    }

    // Other existing methods...
    async updateUserRole(userId: string, role: string) {
        return this.makeRequest(`/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role }),
        });
    }

    async getAllUsers(page = 1, limit = 10, filters?: { role?: string; isActive?: boolean }) {
        const queryParams = new URLSearchParams();
        queryParams.set('page', page.toString());
        queryParams.set('limit', limit.toString());

        if (filters?.role) queryParams.set('role', filters.role);
        if (filters?.isActive !== undefined) queryParams.set('isActive', filters.isActive.toString());

        return this.makeRequest(`/users?${queryParams}`);
    }

    async activateUser(userId: string) {
        return this.makeRequest(`/users/${userId}/activate`, {
            method: 'PUT',
        });
    }

    async deactivateUser(userId: string) {
        return this.makeRequest(`/users/${userId}/deactivate`, {
            method: 'PUT',
        });
    }

    async healthCheck() {
        return fetch(`${API_BASE_URL.replace('/api', '')}/health`).then(res => res.json());
    }
}

// Create singleton instance
export const apiService = new ApiService();

// Initialize on app start
apiService.init();
