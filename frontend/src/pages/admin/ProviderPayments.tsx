import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
} from 'lucide-react';
import '../../styles/pages/admin/ProviderPayments.scss';
import * as ProviderPaymentsService from '../../services/providerPayments.service';
import type { 
  ProviderPayment, 
  PaymentStats 
} from '../../services/providerPayments.service';

// Helper function to get month name
const getMonthName = (monthNum: number): string => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthNum - 1] || '';
};

const ProviderPayments: React.FC = () => {
  const [filteredPayments, setFilteredPayments] = useState<ProviderPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<ProviderPayment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState<PaymentStats>({
    pending_amount: 0,
    pending_count: 0,
    paid_this_month: 0,
    paid_count_this_month: 0,
    active_providers: 0,
    current_month_total: 0,
    current_month_count: 0,
  });

  // Fetch payments from API
  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        provider_type: typeFilter !== 'all' ? typeFilter as 'guide' | 'influencer' : undefined,
        month: monthFilter !== 'all' ? parseInt(monthFilter) : undefined,
        year: yearFilter !== 'all' ? parseInt(yearFilter) : undefined,
        search: searchTerm || undefined,
      };

      const data = await ProviderPaymentsService.getProviderPayments(filters);
      setFilteredPayments(data);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics from API
  const fetchStats = async () => {
    try {
      const data = await ProviderPaymentsService.getPaymentStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Update payment status
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await ProviderPaymentsService.updatePaymentStatus(id, newStatus);
      
      // Refresh data
      await Promise.all([fetchPayments(), fetchStats()]);
      
      setSelectedPayment(null);
      setShowDetailsModal(false);
      alert(`Payment status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Failed to update payment status. Please try again.');
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [statusFilter, typeFilter, monthFilter, yearFilter, searchTerm]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { icon: <CheckCircle size={16} />, class: 'status-paid', label: 'Paid' },
      pending: { icon: <Clock size={16} />, class: 'status-pending', label: 'Pending' },
      processing: { icon: <TrendingUp size={16} />, class: 'status-processing', label: 'Processing' },
      failed: { icon: <XCircle size={16} />, class: 'status-failed', label: 'Failed' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getProviderTypeBadge = (type: string) => {
    return (
      <span className={`provider-type ${type}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const exportToCSV = async () => {
    try {
      const filters = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        provider_type: typeFilter !== 'all' ? typeFilter as 'guide' | 'influencer' : undefined,
        month: monthFilter !== 'all' ? parseInt(monthFilter) : undefined,
        year: yearFilter !== 'all' ? parseInt(yearFilter) : undefined,
      };

      const csvBlob = await ProviderPaymentsService.exportPayments(filters);
      
      // Create download link
      const url = window.URL.createObjectURL(csvBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `provider_payments_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Failed to export CSV. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="provider-payments loading">
        <div className="spinner"></div>
        <p>Loading payment data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="provider-payments error">
        <div className="error-message">
          <XCircle size={48} />
          <h2>{error}</h2>
          <button onClick={() => fetchPayments()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-payments">
      {/* Header */}
      <div className="payments-header">
        <div className="header-content">
          <h1>Provider Payments</h1>
          <p className="subtitle">Manage payments to guides and influencers (90% revenue share)</p>
        </div>
        <button className="export-btn" onClick={exportToCSV}>
          <Download size={20} />
          Export PDF
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card pending">
          <div className="stat-icon">
            <Clock size={28} />
          </div>
          <div className="stat-content">
            <h3>Pending Payments</h3>
            <p className="stat-value">{formatCurrency(stats.pending_amount)}</p>
            <span className="stat-label">Awaiting processing ({stats.pending_count} payments)</span>
          </div>
        </div>

        <div className="stat-card paid">
          <div className="stat-icon">
            <CheckCircle size={28} />
          </div>
          <div className="stat-content">
            <h3>Paid This Month</h3>
            <p className="stat-value">{formatCurrency(stats.paid_this_month)}</p>
            <span className="stat-label">Successfully transferred ({stats.paid_count_this_month} payments)</span>
          </div>
        </div>

        <div className="stat-card providers">
          <div className="stat-icon">
            <Users size={28} />
          </div>
          <div className="stat-content">
            <h3>Active Providers</h3>
            <p className="stat-value">{stats.active_providers}</p>
            <span className="stat-label">Guides & Influencers</span>
          </div>
        </div>

        <div className="stat-card total">
          <div className="stat-icon">
            <DollarSign size={28} />
          </div>
          <div className="stat-content">
            <h3>Current Month Total</h3>
            <p className="stat-value">{formatCurrency(stats.current_month_total)}</p>
            <span className="stat-label">{getMonthName(new Date().getMonth() + 1)} {new Date().getFullYear()} ({stats.current_month_count} payments)</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by provider name, email, or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <Filter size={18} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="filter-group">
            <Users size={18} />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="guide">Guides</option>
              <option value="influencer">Influencers</option>
            </select>
          </div>

          <div className="filter-group">
            <Calendar size={18} />
            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
              <option value="all">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>

          <div className="filter-group">
            <Calendar size={18} />
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
              <option value="all">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="payments-table-section">
        <div className="table-header">
          <h2>Payment Records</h2>
          <span className="record-count">{filteredPayments.length} records</span>
        </div>

        <div className="table-wrapper">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Type</th>
                <th>Period</th>
                <th>Total Revenue</th>
                <th>Platform Fee (10%)</th>
                <th>Provider Earnings (90%)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <div className="provider-info">
                      <div className="provider-name">{payment.provider_name}</div>
                      <div className="provider-email">{payment.provider_email}</div>
                    </div>
                  </td>
                  <td>{getProviderTypeBadge(payment.provider_type)}</td>
                  <td>
                    <div className="period-info">
                      <div className="month">{getMonthName(payment.month)} {payment.year}</div>
                      <div className="date-created">Created: {formatDate(payment.created_at)}</div>
                    </div>
                  </td>
                  <td className="amount-cell">{formatCurrency(payment.total_revenue)}</td>
                  <td className="amount-cell fee">{formatCurrency(payment.platform_fee)}</td>
                  <td className="amount-cell earnings">{formatCurrency(payment.provider_earnings)}</td>
                  <td>{getStatusBadge(payment.payment_status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowDetailsModal(true);
                        }}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {payment.payment_status === 'pending' && (
                        <button
                          className="btn-mark-paid"
                          onClick={() => handleUpdateStatus(payment.id, 'paid')}
                          title="Mark as Paid"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
            <div className="no-data">
              <p>No payment records found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payment Details</h2>
              <button className="close-btn" onClick={() => setShowDetailsModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Provider Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedPayment.provider_name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedPayment.provider_email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span>{getProviderTypeBadge(selectedPayment.provider_type)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Provider ID:</label>
                    <span>#{selectedPayment.provider_id}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Payment Period</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Month:</label>
                    <span>{getMonthName(selectedPayment.month)} {selectedPayment.year}</span>
                  </div>
                  <div className="detail-item">
                    <label>Created:</label>
                    <span>{formatDate(selectedPayment.created_at)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Updated:</label>
                    <span>{formatDate(selectedPayment.updated_at)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Revenue Breakdown</h3>
                <div className="revenue-breakdown">
                  <div className="breakdown-item">
                    <label>Services Revenue:</label>
                    <span className="value">{formatCurrency(selectedPayment.services_revenue)}</span>
                    <span className="meta">({selectedPayment.services_count} bookings)</span>
                  </div>
                  <div className="breakdown-item">
                    <label>Sessions Revenue:</label>
                    <span className="value">{formatCurrency(selectedPayment.sessions_revenue)}</span>
                    <span className="meta">({selectedPayment.sessions_count} enrollments)</span>
                  </div>
                  <div className="breakdown-item total">
                    <label>Total Revenue:</label>
                    <span className="value">{formatCurrency(selectedPayment.total_revenue)}</span>
                  </div>
                  <div className="breakdown-item fee">
                    <label>Platform Fee (10%):</label>
                    <span className="value">- {formatCurrency(selectedPayment.platform_fee)}</span>
                  </div>
                  <div className="breakdown-item earnings">
                    <label>Provider Earnings (90%):</label>
                    <span className="value">{formatCurrency(selectedPayment.provider_earnings)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Payment Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Status:</label>
                    <span>{getStatusBadge(selectedPayment.payment_status)}</span>
                  </div>
                  {selectedPayment.payment_method && (
                    <div className="detail-item">
                      <label>Payment Method:</label>
                      <span className="payment-method">{selectedPayment.payment_method.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  )}
                  {selectedPayment.payment_date && (
                    <div className="detail-item">
                      <label>Payment Date:</label>
                      <span>{formatDate(selectedPayment.payment_date)}</span>
                    </div>
                  )}
                  {selectedPayment.transaction_id && (
                    <div className="detail-item">
                      <label>Transaction ID:</label>
                      <span className="transaction-id">{selectedPayment.transaction_id}</span>
                    </div>
                  )}
                  {selectedPayment.notes && (
                    <div className="detail-item full-width">
                      <label>Notes:</label>
                      <span className="notes">{selectedPayment.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {selectedPayment.payment_status === 'pending' && (
                <>
                  <button
                    className="btn btn-processing"
                    onClick={() => {
                      handleUpdateStatus(selectedPayment.id, 'processing');
                    }}
                  >
                    Mark as Processing
                  </button>
                  <button
                    className="btn btn-paid"
                    onClick={() => {
                      handleUpdateStatus(selectedPayment.id, 'paid');
                    }}
                  >
                    <CheckCircle size={18} />
                    Mark as Paid
                  </button>
                </>
              )}
              {selectedPayment.payment_status === 'processing' && (
                <>
                  <button
                    className="btn btn-failed"
                    onClick={() => {
                      handleUpdateStatus(selectedPayment.id, 'failed');
                    }}
                  >
                    <XCircle size={18} />
                    Mark as Failed
                  </button>
                  <button
                    className="btn btn-paid"
                    onClick={() => {
                      handleUpdateStatus(selectedPayment.id, 'paid');
                    }}
                  >
                    <CheckCircle size={18} />
                    Mark as Paid
                  </button>
                </>
              )}
              {selectedPayment.payment_status === 'failed' && (
                <button
                  className="btn btn-processing"
                  onClick={() => {
                    handleUpdateStatus(selectedPayment.id, 'pending');
                  }}
                >
                  Retry Payment
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderPayments;
