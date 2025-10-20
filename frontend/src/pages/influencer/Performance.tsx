import React, { useState, useEffect } from 'react';
import { Download, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import '../../styles/pages/influencer/Performance.scss';
import { useToast } from '../../contexts/ToastContext';
import { auth } from '../../firebase';
import { API_CONFIG } from '../../config/api.config';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const API_BASE_URL = API_CONFIG.API_BASE_URL;

interface ProviderPayment {
  id: number;
  provider_id: number;
  provider_name: string;
  provider_email: string;
  provider_type: string;
  month: number;
  year: number;
  total_revenue: number;
  platform_fee: number;
  provider_earnings: number;
  services_revenue: number;
  sessions_revenue: number;
  services_count: number;
  sessions_count: number;
  payment_status: string;
  payment_method: string | null;
  payment_date: string | null;
  transaction_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ChartData {
  month: string;
  earnings: number;
  revenue: number;
}

const Performance: React.FC = () => {
  const [payments, setPayments] = useState<ProviderPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get Firebase auth token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Please log in to view your payments');
      }

      const token = await user.getIdToken(true);
      
      const response = await fetch(`${API_BASE_URL}/provider-payments/my-payments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setPayments(data.data);
      } else {
        throw new Error(data.message || 'Failed to load payments');
      }
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      const errorMessage = err?.message || 'Failed to load payment data';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number): string => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[month - 1] || '';
  };

  const prepareChartData = (): ChartData[] => {
    return payments
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
      .map((payment) => ({
        month: `${getMonthName(payment.month)} ${payment.year}`,
        earnings: Number(payment.provider_earnings),
        revenue: Number(payment.total_revenue),
      }));
  };

  const handleDownloadCSV = () => {
    try {
      if (payments.length === 0) {
        showError('No payment data available to download');
        return;
      }

      const headers = [
        'Month',
        'Year',
        'Total Revenue',
        'Platform Fee',
        'Your Earnings',
        'Services Revenue',
        'Sessions Revenue',
        'Services Count',
        'Sessions Count',
        'Payment Status',
        'Payment Method',
        'Transaction ID',
        'Payment Date',
      ];

      const rows = payments.map((payment) => [
        getMonthName(payment.month),
        payment.year,
        payment.total_revenue,
        payment.platform_fee,
        payment.provider_earnings,
        payment.services_revenue,
        payment.sessions_revenue,
        payment.services_count,
        payment.sessions_count,
        payment.payment_status,
        payment.payment_method || 'N/A',
        payment.transaction_id || 'N/A',
        payment.payment_date
          ? new Date(payment.payment_date).toLocaleDateString()
          : 'N/A',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `income_report_${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccess('Report downloaded successfully');
    } catch (err) {
      console.error('Error downloading report:', err);
      showError('Failed to download report');
    }
  };

  const totalEarnings = payments.reduce(
    (sum, payment) => sum + Number(payment.provider_earnings),
    0
  );
  const totalRevenue = payments.reduce(
    (sum, payment) => sum + Number(payment.total_revenue),
    0
  );
  const totalPlatformFee = payments.reduce(
    (sum, payment) => sum + Number(payment.platform_fee),
    0
  );

  const paidPayments = payments.filter((p) => p.payment_status === 'paid');
  const pendingPayments = payments.filter((p) => p.payment_status === 'pending');

  if (loading) {
    return (
      <div className="performance-page">
        <div className="performance-loading">
          <div className="spinner"></div>
          <p>Loading income data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="performance-page">
        <div className="performance-error">
          <p>{error}</p>
          <button onClick={fetchPayments} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-page">
      <div className="performance-header">
        <div>
          <h1>Income Performance</h1>
          <p>Track your monthly earnings and revenue statistics</p>
        </div>
        <button onClick={handleDownloadCSV} className="btn-download" disabled={payments.length === 0}>
          <Download size={20} />
          <span>Download Report</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="performance-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <DollarSign size={24} />
          </div>
          <div className="summary-content">
            <h3>Total Earnings</h3>
            <p className="summary-value">LKR{totalEarnings.toFixed(2)}</p>
            <span className="summary-subtitle">{paidPayments.length} paid payments</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <TrendingUp size={24} />
          </div>
          <div className="summary-content">
            <h3>Total Revenue</h3>
            <p className="summary-value">LKR{totalRevenue.toFixed(2)}</p>
            <span className="summary-subtitle">Before platform fees</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Calendar size={24} />
          </div>
          <div className="summary-content">
            <h3>Platform Fees</h3>
            <p className="summary-value">LKR{totalPlatformFee.toFixed(2)}</p>
            <span className="summary-subtitle">Total deducted</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <TrendingUp size={24} />
          </div>
          <div className="summary-content">
            <h3>Pending Payments</h3>
            <p className="summary-value">{pendingPayments.length}</p>
            <span className="summary-subtitle">
              LKR{pendingPayments.reduce((sum, p) => sum + Number(p.provider_earnings), 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {payments.length > 0 && (
        <div className="chart-section">
          <h2>Monthly Income Overview</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="earnings" fill="#4f46e5" name="Your Earnings" />
                <Bar dataKey="revenue" fill="#10b981" name="Total Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="payments-table-section">
        <h2>Payment Details</h2>
        {payments.length === 0 ? (
          <div className="no-payments">
            <p>No payment records found yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Total Revenue</th>
                  <th>Platform Fee</th>
                  <th>Your Earnings</th>
                  <th>Services</th>
                  <th>Sessions</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <strong>
                        {getMonthName(payment.month)} {payment.year}
                      </strong>
                    </td>
                    <td className="amount">LKR{Number(payment.total_revenue).toFixed(2)}</td>
                    <td className="amount">LKR{Number(payment.platform_fee).toFixed(2)}</td>
                    <td className="amount earnings">
                      LKR{Number(payment.provider_earnings).toFixed(2)}
                    </td>
                    <td>
                      <div className="service-info">
                        <span className="count">{payment.services_count}</span>
                        <span className="revenue">
                          LKR{Number(payment.services_revenue).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="service-info">
                        <span className="count">{payment.sessions_count}</span>
                        <span className="revenue">
                          LKR{Number(payment.sessions_revenue).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`payment-status ${payment.payment_status.toLowerCase()}`}>
                        {payment.payment_status}
                      </span>
                    </td>
                    <td>
                      {payment.payment_date
                        ? new Date(payment.payment_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </td>
                    <td className="transaction-id">
                      {payment.transaction_id || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Performance;
