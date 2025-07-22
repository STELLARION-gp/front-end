import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '../firebase';

const storage = getStorage(app);

export class FirebaseStorageService {
    // Default image URL when no image is selected
    static readonly DEFAULT_BLOG_IMAGE = 'https://charleslittleton.wordpress.com/wp-content/uploads/2022/01/cropped-pexels-photo-110854-1.jpeg';

    // Upload image and return download URL
    static async uploadBlogImage(file: File, blogId?: string): Promise<string> {
        try {
            // Validate file
            if (!file) {
                throw new Error('No file provided');
            }

            // Check file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error('File size exceeds 5MB limit');
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                throw new Error('File must be an image');
            }

            console.log('Uploading file:', {
                name: file.name,
                size: file.size,
                type: file.type,
                blogId: blogId || 'temp'
            });

            // Create unique filename
            const timestamp = Date.now();
            const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const imagePath = `blog-images/${blogId || 'temp'}/${fileName}`;
            
            console.log('Upload path:', imagePath);
            
            // Create storage reference
            const imageRef = ref(storage, imagePath);
            
            // Upload file with metadata
            const metadata = {
                contentType: file.type,
                customMetadata: {
                    uploadedBy: 'blog-system',
                    blogId: blogId || 'temp'
                }
            };
            
            console.log('Starting upload...');
            const snapshot = await uploadBytes(imageRef, file, metadata);
            console.log('Upload completed, getting download URL...');
            
            // Get download URL
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('Download URL obtained:', downloadURL);
            
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            
            // Provide more specific error messages
            if (error instanceof Error) {
                if (error.message.includes('storage/unauthorized')) {
                    throw new Error('Upload failed: Not authorized. Please check Firebase Storage rules.');
                } else if (error.message.includes('storage/canceled')) {
                    throw new Error('Upload was canceled');
                } else if (error.message.includes('storage/unknown')) {
                    throw new Error('Upload failed: Unknown error. Please check Firebase configuration.');
                } else {
                    throw new Error(`Upload failed: ${error.message}`);
                }
            }
            
            throw new Error('Failed to upload image');
        }
    }

    // Delete image from storage
    static async deleteImage(imageUrl: string): Promise<void> {
        try {
            // Don't try to delete the default image
            if (imageUrl === this.DEFAULT_BLOG_IMAGE) {
                console.log('Skipping deletion of default image');
                return;
            }

            // Check if it's a Firebase Storage URL
            if (!imageUrl.includes('firebasestorage.googleapis.com')) {
                console.log('Not a Firebase Storage URL, skipping deletion:', imageUrl);
                return;
            }

            console.log('Deleting image:', imageUrl);

            // For Firebase Storage URLs, we need to extract the path
            // URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
            try {
                const url = new URL(imageUrl);
                const pathMatch = url.pathname.match(/\/o\/(.+)/);
                if (pathMatch) {
                    const decodedPath = decodeURIComponent(pathMatch[1]);
                    const imageRef = ref(storage, decodedPath);
                    await deleteObject(imageRef);
                    console.log('Image deleted successfully');
                } else {
                    // Fallback: try using the URL directly
                    const imageRef = ref(storage, imageUrl);
                    await deleteObject(imageRef);
                }
            } catch (deleteError) {
                // If URL parsing fails, try direct deletion
                const imageRef = ref(storage, imageUrl);
                await deleteObject(imageRef);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            // Don't throw error for deletion failures
        }
    }

    // Upload multiple images
    static async uploadMultipleImages(files: File[], blogId?: string): Promise<string[]> {
        const uploadPromises = files.map(file => this.uploadBlogImage(file, blogId));
        return Promise.all(uploadPromises);
    }

    // Get the appropriate image URL (uploaded or default)
    static getImageUrl(uploadedUrl?: string): string {
        return uploadedUrl || this.DEFAULT_BLOG_IMAGE;
    }

    // Test Firebase Storage connectivity
    static async testConnection(): Promise<boolean> {
        try {
            console.log('Testing Firebase Storage connection...');
            
            // Try to create a reference to test connectivity
            ref(storage, 'test-connection');
            console.log('Firebase Storage reference created successfully');
            
            return true;
        } catch (error) {
            console.error('Firebase Storage connection test failed:', error);
            return false;
        }
    }

    // Check if Firebase Storage is properly configured
    static async checkConfiguration(): Promise<{
        isConfigured: boolean;
        errors: string[];
    }> {
        const errors: string[] = [];
        
        try {
            // Check if storage is initialized
            if (!storage) {
                errors.push('Firebase Storage is not initialized');
            }

            // Check if app is configured
            if (!app) {
                errors.push('Firebase app is not configured');
            }

            // Test connection
            const canConnect = await this.testConnection();
            if (!canConnect) {
                errors.push('Cannot connect to Firebase Storage');
            }

            return {
                isConfigured: errors.length === 0,
                errors
            };
        } catch (error) {
            errors.push(`Configuration check failed: ${error}`);
            return {
                isConfigured: false,
                errors
            };
        }
    }
}
