import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

export interface PaymentOrder {
  payment_id: number;
  order_id: string;
  payhere_data: {
    sandbox: boolean;
    merchant_id: string;
    return_url: string;
    cancel_url: string;
    notify_url: string;
    order_id: string;
    items: string;
    amount: string;
    currency: string;
    hash: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    delivery_address: string;
    delivery_city: string;
    delivery_country: string;
    custom_1: string;
    custom_2: string;
  };
  plan_details: {
    id: number;
    name: string;
    type: string;
    price: number;
  };
}

export interface PaymentNotification {
  merchant_id: string;
  order_id: string;
  payhere_amount: number;
  payhere_currency: string;
  status_code: number;
  md5sig: string;
}

export interface PaymentStatus {
  id: number;
  order_id: string;
  user_id: string;
  subscription_id?: number;
  amount: number;
  currency: string;
  payment_status: string;
  payment_method?: string;
  payment_gateway: string;
  transaction_id?: string;
  payment_date?: string;
}

class PaymentService {
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

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Create a payment order
  async createPaymentOrder(planId: number, amount: number, currency: string = 'LKR'): Promise<PaymentOrder> {
    try {
      const response = await this.makeRequest<{success: boolean, data: PaymentOrder}>('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({
          planId,
          amount,
          currency
        })
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  }

  // Get payment status
  async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
    try {
      return await this.makeRequest<PaymentStatus>(`/payments/status/${orderId}`);
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error;
    }
  }

  // Get user's payment history
  async getUserPayments(userId: string): Promise<PaymentStatus[]> {
    try {
      return await this.makeRequest<PaymentStatus[]>(`/payments/user/${userId}`);
    } catch (error) {
      console.error('Error fetching user payments:', error);
      throw error;
    }
  }

  // Process PayHere payment
  processPayHerePayment(paymentOrder: PaymentOrder): void {
    // Use the payhere_data directly from the backend response
    const payment = paymentOrder.payhere_data;

    // Check if PayHere is available
    if (typeof (window as any).payhere !== 'undefined') {
      console.log('Starting PayHere payment with:', payment);
      // Show payment
      (window as any).payhere.startPayment(payment);
    } else {
      console.error('PayHere library not loaded');
      throw new Error('PayHere payment gateway is not available');
    }
  }

  // Initialize PayHere callbacks
  initializePayHereCallbacks(): void {
    if (typeof (window as any).payhere !== 'undefined') {
      (window as any).payhere.onCompleted = (orderId: string) => {
        console.log("Payment completed. OrderID:" + orderId);
        // Verify payment on backend
        this.checkPaymentCompletion(orderId);
      };

      (window as any).payhere.onDismissed = () => {
        console.log("Payment dismissed");
      };

      (window as any).payhere.onError = (error: any) => {
        console.log("Error:" + error);
      };
    }
  }

  // Check payment completion status with backend
  private async checkPaymentCompletion(orderId: string): Promise<void> {
    try {
      // Get payment status from backend
      const paymentStatus = await this.getPaymentStatus(orderId);
      
      if (paymentStatus.payment_status === 'completed') {
        console.log('Payment verified as completed');
        // Reload the page or redirect to success page
        window.location.reload();
      } else {
        console.log(`Payment status: ${paymentStatus.payment_status}`);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  }
}

export default new PaymentService();
