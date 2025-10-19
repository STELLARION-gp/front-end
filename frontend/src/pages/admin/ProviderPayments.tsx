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

// Interfaces
interface ProviderPayment {
  id: number;
  providerId: number;
  providerName: string;
  providerEmail: string;
  providerType: 'guide' | 'influencer';
  month: string;
  year: number;
  totalRevenue: number;
  platformFee: number;
  providerEarnings: number;
  servicesRevenue: number;
  sessionsRevenue: number;
  servicesCount: number;
  sessionsCount: number;
  paymentStatus: 'pending' | 'paid' | 'processing' | 'failed';
  paymentMethod?: string;
  paymentDate?: string;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentStats {
  totalPending: number;
  totalPaid: number;
  totalProviders: number;
  currentMonthTotal: number;
}

// Dummy Data
const generateDummyData = (): ProviderPayment[] => {
  const providers = [
    { id: 1, name: 'Dr. Samantha Perera', email: 'samantha.perera@stellar.com', type: 'guide' as const },
    { id: 2, name: 'Prof. Kamal Fernando', email: 'kamal.fernando@stellar.com', type: 'guide' as const },
    { id: 3, name: 'Sarah Johnson', email: 'sarah.j@stellar.com', type: 'influencer' as const },
    { id: 4, name: 'Nimal Jayasinghe', email: 'nimal.j@stellar.com', type: 'guide' as const },
    { id: 5, name: 'Emily Watson', email: 'emily.w@stellar.com', type: 'influencer' as const },
    { id: 6, name: 'Rajitha Silva', email: 'rajitha.s@stellar.com', type: 'guide' as const },
    { id: 7, name: 'Michael Chen', email: 'michael.c@stellar.com', type: 'influencer' as const },
    { id: 8, name: 'Priya Wickramasinghe', email: 'priya.w@stellar.com', type: 'guide' as const },
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'];
  const statuses: Array<'pending' | 'paid' | 'processing' | 'failed'> = ['pending', 'paid', 'processing', 'failed'];
  
  const payments: ProviderPayment[] = [];
  let id = 1;

  providers.forEach(provider => {
    // Generate payments for last 3 months
    for (let i = 0; i < 3; i++) {
      const monthIndex = 9 - i; // October backwards
      const servicesRevenue = Math.floor(Math.random() * 150000) + 50000;
      const sessionsRevenue = Math.floor(Math.random() * 100000) + 30000;
      const totalRevenue = servicesRevenue + sessionsRevenue;
      const platformFee = totalRevenue * 0.1; // 10% platform fee
      const providerEarnings = totalRevenue * 0.9; // 90% to provider

      const status = i === 0 ? 'pending' : statuses[Math.floor(Math.random() * statuses.length)];
      
      payments.push({
        id: id++,
        providerId: provider.id,
        providerName: provider.name,
        providerEmail: provider.email,
        providerType: provider.type,
        month: months[monthIndex],
        year: 2025,
        totalRevenue,
        platformFee,
        providerEarnings,
        servicesRevenue,
        sessionsRevenue,
        servicesCount: Math.floor(Math.random() * 20) + 5,
        sessionsCount: Math.floor(Math.random() * 15) + 3,
        paymentStatus: status,
        paymentMethod: status === 'paid' ? 'bank_transfer' : undefined,
        paymentDate: status === 'paid' ? new Date(2025, monthIndex, 28).toISOString() : undefined,
        transactionId: status === 'paid' ? `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined,
        notes: status === 'failed' ? 'Bank details verification failed' : undefined,
        createdAt: new Date(2025, monthIndex, 1).toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  });

  return payments.sort((a, b) => {
    const monthOrder = ['October', 'September', 'August', 'July', 'June', 'May', 'April', 'March', 'February', 'January'];
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
  });
};

const ProviderPayments: React.FC = () => {
  const [payments, setPayments] = useState<ProviderPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<ProviderPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<ProviderPayment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState<PaymentStats>({
    totalPending: 0,
    totalPaid: 0,
    totalProviders: 0,
    currentMonthTotal: 0,
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const dummyData = generateDummyData();
      setPayments(dummyData);
      setFilteredPayments(dummyData);
      calculateStats(dummyData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchTerm, statusFilter, typeFilter, monthFilter, payments]);

  const calculateStats = (data: ProviderPayment[]) => {
    const pending = data.filter(p => p.paymentStatus === 'pending').reduce((sum, p) => sum + p.providerEarnings, 0);
    const paid = data.filter(p => p.paymentStatus === 'paid').reduce((sum, p) => sum + p.providerEarnings, 0);
    const providers = new Set(data.map(p => p.providerId)).size;
    const currentMonth = data.filter(p => p.month === 'October' && p.year === 2025).reduce((sum, p) => sum + p.providerEarnings, 0);

    setStats({
      totalPending: pending,
      totalPaid: paid,
      totalProviders: providers,
      currentMonthTotal: currentMonth,
    });
  };

  const filterPayments = () => {
    let filtered = [...payments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.providerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.paymentStatus === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(p => p.providerType === typeFilter);
    }

    // Month filter
    if (monthFilter !== 'all') {
      filtered = filtered.filter(p => p.month === monthFilter);
    }

    setFilteredPayments(filtered);
  };

  const handleUpdateStatus = (paymentId: number, newStatus: 'pending' | 'paid' | 'processing' | 'failed') => {
    const updatedPayments = payments.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          paymentStatus: newStatus,
          paymentDate: newStatus === 'paid' ? new Date().toISOString() : p.paymentDate,
          paymentMethod: newStatus === 'paid' ? 'bank_transfer' : p.paymentMethod,
          transactionId: newStatus === 'paid' ? `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}` : p.transactionId,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });

    setPayments(updatedPayments);
    calculateStats(updatedPayments);

    // Close modal if open
    if (selectedPayment?.id === paymentId) {
      setSelectedPayment(updatedPayments.find(p => p.id === paymentId) || null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
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

  const exportToCSV = () => {
    const headers = ['Provider Name', 'Email', 'Type', 'Month', 'Year', 'Total Revenue', 'Platform Fee', 'Provider Earnings', 'Services', 'Sessions', 'Status', 'Payment Date', 'Transaction ID'];
    const csvData = filteredPayments.map(p => [
      p.providerName,
      p.providerEmail,
      p.providerType,
      p.month,
      p.year,
      p.totalRevenue,
      p.platformFee,
      p.providerEarnings,
      p.servicesCount,
      p.sessionsCount,
      p.paymentStatus,
      p.paymentDate ? formatDate(p.paymentDate) : 'N/A',
      p.transactionId || 'N/A',
    ]);

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `provider-payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="provider-payments loading">
        <div className="spinner"></div>
        <p>Loading payment data...</p>
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
            <p className="stat-value">{formatCurrency(stats.totalPending)}</p>
            <span className="stat-label">Awaiting processing</span>
          </div>
        </div>

        <div className="stat-card paid">
          <div className="stat-icon">
            <CheckCircle size={28} />
          </div>
          <div className="stat-content">
            <h3>Paid This Month</h3>
            <p className="stat-value">{formatCurrency(stats.totalPaid)}</p>
            <span className="stat-label">Successfully transferred</span>
          </div>
        </div>

        <div className="stat-card providers">
          <div className="stat-icon">
            <Users size={28} />
          </div>
          <div className="stat-content">
            <h3>Active Providers</h3>
            <p className="stat-value">{stats.totalProviders}</p>
            <span className="stat-label">Guides & Influencers</span>
          </div>
        </div>

        <div className="stat-card total">
          <div className="stat-icon">
            <DollarSign size={28} />
          </div>
          <div className="stat-content">
            <h3>Current Month Total</h3>
            <p className="stat-value">{formatCurrency(stats.currentMonthTotal)}</p>
            <span className="stat-label">October 2025</span>
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
              <option value="October">October 2025</option>
              <option value="September">September 2025</option>
              <option value="August">August 2025</option>
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
                      <div className="provider-name">{payment.providerName}</div>
                      <div className="provider-email">{payment.providerEmail}</div>
                    </div>
                  </td>
                  <td>{getProviderTypeBadge(payment.providerType)}</td>
                  <td>
                    <div className="period-info">
                      <div className="month">{payment.month} {payment.year}</div>
                      <div className="date-created">Created: {formatDate(payment.createdAt)}</div>
                    </div>
                  </td>
                  <td className="amount-cell">{formatCurrency(payment.totalRevenue)}</td>
                  <td className="amount-cell fee">{formatCurrency(payment.platformFee)}</td>
                  <td className="amount-cell earnings">{formatCurrency(payment.providerEarnings)}</td>
                  <td>{getStatusBadge(payment.paymentStatus)}</td>
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
                      {payment.paymentStatus === 'pending' && (
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
                    <span>{selectedPayment.providerName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedPayment.providerEmail}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span>{getProviderTypeBadge(selectedPayment.providerType)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Provider ID:</label>
                    <span>#{selectedPayment.providerId}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Payment Period</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Month:</label>
                    <span>{selectedPayment.month} {selectedPayment.year}</span>
                  </div>
                  <div className="detail-item">
                    <label>Created:</label>
                    <span>{formatDate(selectedPayment.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Updated:</label>
                    <span>{formatDate(selectedPayment.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Revenue Breakdown</h3>
                <div className="revenue-breakdown">
                  <div className="breakdown-item">
                    <label>Services Revenue:</label>
                    <span className="value">{formatCurrency(selectedPayment.servicesRevenue)}</span>
                    <span className="meta">({selectedPayment.servicesCount} bookings)</span>
                  </div>
                  <div className="breakdown-item">
                    <label>Sessions Revenue:</label>
                    <span className="value">{formatCurrency(selectedPayment.sessionsRevenue)}</span>
                    <span className="meta">({selectedPayment.sessionsCount} enrollments)</span>
                  </div>
                  <div className="breakdown-item total">
                    <label>Total Revenue:</label>
                    <span className="value">{formatCurrency(selectedPayment.totalRevenue)}</span>
                  </div>
                  <div className="breakdown-item fee">
                    <label>Platform Fee (10%):</label>
                    <span className="value">- {formatCurrency(selectedPayment.platformFee)}</span>
                  </div>
                  <div className="breakdown-item earnings">
                    <label>Provider Earnings (90%):</label>
                    <span className="value">{formatCurrency(selectedPayment.providerEarnings)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Payment Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Status:</label>
                    <span>{getStatusBadge(selectedPayment.paymentStatus)}</span>
                  </div>
                  {selectedPayment.paymentMethod && (
                    <div className="detail-item">
                      <label>Payment Method:</label>
                      <span className="payment-method">{selectedPayment.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  )}
                  {selectedPayment.paymentDate && (
                    <div className="detail-item">
                      <label>Payment Date:</label>
                      <span>{formatDate(selectedPayment.paymentDate)}</span>
                    </div>
                  )}
                  {selectedPayment.transactionId && (
                    <div className="detail-item">
                      <label>Transaction ID:</label>
                      <span className="transaction-id">{selectedPayment.transactionId}</span>
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
              {selectedPayment.paymentStatus === 'pending' && (
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
                      setShowDetailsModal(false);
                    }}
                  >
                    <CheckCircle size={18} />
                    Mark as Paid
                  </button>
                </>
              )}
              {selectedPayment.paymentStatus === 'processing' && (
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
                      setShowDetailsModal(false);
                    }}
                  >
                    <CheckCircle size={18} />
                    Mark as Paid
                  </button>
                </>
              )}
              {selectedPayment.paymentStatus === 'failed' && (
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
