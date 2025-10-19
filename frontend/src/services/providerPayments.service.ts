// services/providerPayments.service.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ProviderPayment {
  id: number;
  provider_id: number;
  provider_name: string;
  provider_email: string;
  provider_type: 'guide' | 'influencer';
  month: number;
  year: number;
  total_revenue: number;
  platform_fee: number;
  provider_earnings: number;
  services_revenue: number;
  services_count: number;
  sessions_revenue: number;
  sessions_count: number;
  payment_status: string;
  payment_method: string | null;
  transaction_id: string | null;
  payment_date: Date | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentStats {
  pending_amount: number;
  pending_count: number;
  paid_this_month: number;
  paid_count_this_month: number;
  active_providers: number;
  current_month_total: number;
  current_month_count: number;
}

export interface PaymentFilters {
  status?: string;
  provider_type?: 'guide' | 'influencer';
  month?: number;
  year?: number;
  search?: string;
}

/**
 * Get all provider payments with optional filters
 */
export const getProviderPayments = async (filters?: PaymentFilters): Promise<ProviderPayment[]> => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.provider_type) params.append('provider_type', filters.provider_type);
    if (filters?.month) params.append('month', filters.month.toString());
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.search) params.append('search', filters.search);

    const response = await axios.get(`${API_BASE_URL}/provider-payments?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching provider payments:', error);
    throw error;
  }
};

/**
 * Get payment details by ID
 */
export const getPaymentById = async (id: number): Promise<ProviderPayment> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/provider-payments/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (
  id: number,
  status: string,
  data?: {
    payment_method?: string;
    transaction_id?: string;
    notes?: string;
  }
): Promise<ProviderPayment> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/provider-payments/${id}/status`, {
      status,
      ...data,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

/**
 * Generate provider payments for a specific month/year
 */
export const generateProviderPayments = async (month: number, year: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/provider-payments/generate`, {
      month,
      year,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error generating provider payments:', error);
    throw error;
  }
};

/**
 * Get payment statistics
 */
export const getPaymentStats = async (): Promise<PaymentStats> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/provider-payments/stats`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    throw error;
  }
};

/**
 * Export payments as CSV
 */
export const exportPayments = async (filters?: PaymentFilters): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.provider_type) params.append('provider_type', filters.provider_type);
    if (filters?.month) params.append('month', filters.month.toString());
    if (filters?.year) params.append('year', filters.year.toString());

    const response = await axios.get(
      `${API_BASE_URL}/provider-payments/export?${params.toString()}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error exporting payments:', error);
    throw error;
  }
};
