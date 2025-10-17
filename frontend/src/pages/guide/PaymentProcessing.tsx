import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import LoadingSpinner from '../../components/LoadingSpinner';
import '../../styles/pages/guide/PaymentProcessing.scss';
import { 
  getBookingPaymentStats, 
  getBookingPaymentTransactions,
  getBookingPaymentDetails,
  processBookingRefund,
  type PaymentStats as ImportedPaymentStats,
  type Transaction as ImportedTransaction
} from '../../services/paymentService';

// Types for payment data
interface Transaction extends ImportedTransaction {
  bookingId?: number;
  serviceId?: number;
}

interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successRate: number;
  pendingAmount: number;
  refundedAmount: number;
  monthlyGrowth: number;
}

const PaymentProcessing: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  // Fetch payment statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getBookingPaymentStats(parseInt(dateRange));
        setPaymentStats(stats);
      } catch (err) {
        console.error('Error fetching payment stats:', err);
        setError('Failed to load payment statistics');
      }
    };

    fetchStats();
  }, [dateRange]);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await getBookingPaymentTransactions({
          status: statusFilter,
          dateRange: parseInt(dateRange),
          page: currentPage,
          limit: itemsPerPage,
          sortBy: sortBy,
          sortOrder: sortOrder,
        });

        setTransactions(result.transactions);
        setTotalTransactions(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [statusFilter, dateRange, currentPage, sortBy, sortOrder]);

  // Filter transactions by search term and gateway (client-side filtering)
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesGateway = selectedGateway === 'all' || transaction.gateway === selectedGateway;
      const matchesSearch = searchTerm === '' || 
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesGateway && matchesSearch;
    });
  }, [transactions, selectedGateway, searchTerm]);

  const getStatusBadgeClass = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      case 'refunded': return 'status-refunded';
      default: return '';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const handleRefund = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to process a refund for this booking?')) {
      return;
    }

    const reason = prompt('Please provide a reason for the refund:');
    if (!reason) return;

    try {
      await processBookingRefund(bookingId, {
        reason,
        refundType: 'full'
      });
      alert('Refund processed successfully!');
      // Refresh transactions
      window.location.reload();
    } catch (err) {
      console.error('Error processing refund:', err);
      alert(err instanceof Error ? err.message : 'Failed to process refund');
    }
  };

  const handleViewDetails = async (bookingId: number) => {
    try {
      const details = await getBookingPaymentDetails(bookingId);
      // For now, show an alert with details. You can create a modal later.
      alert(`
Booking Details:
Order ID: ${details.orderId}
Amount: Rs. ${details.amount.toLocaleString()}
Status: ${details.paymentStatus}
Customer: ${details.customer.name}
Email: ${details.customer.email}
Service: ${details.service.title}
Date: ${new Date(details.bookingDetails.date).toLocaleDateString()}
Participants: ${details.bookingDetails.participants}
      `.trim());
    } catch (err) {
      console.error('Error fetching payment details:', err);
      alert('Failed to load payment details');
    }
  };

  if (loading) {
    return (
      <div className="payment-processing-page">
        <div className="page-header">
          <h1>Payment Processing</h1>
        </div>
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-processing-page">
      <div className="page-header">
        <h1>Payment Processing</h1>
        <p>Manage and monitor all payment transactions</p>
      </div>

      {/* Payment Statistics */}
      <div className="payment-stats-section">
        <div className="payment-stats-grid">
          <Card className="payment-stat-card payment-revenue">
            <div className="payment-stat-content">
              <div className="payment-stat-label">Total Revenue</div>
              <div className="payment-stat-value">{formatCurrency(paymentStats?.totalRevenue || 0)}</div>
              <div className="payment-stat-change positive">+{paymentStats?.monthlyGrowth}% this month</div>
            </div>
          </Card>

          <Card className="payment-stat-card payment-transactions">
            <div className="payment-stat-content">
              <div className="payment-stat-label">Total Transactions</div>
              <div className="payment-stat-value">{paymentStats?.totalTransactions.toLocaleString()}</div>
              <div className="payment-stat-change neutral">Last {dateRange} days</div>
            </div>
          </Card>

          <Card className="payment-stat-card payment-pending">
            <div className="payment-stat-content">
              <div className="payment-stat-label">Pending Amount</div>
              <div className="payment-stat-value">{formatCurrency(paymentStats?.pendingAmount || 0)}</div>
              <div className="payment-stat-change neutral">Awaiting processing</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="payment-filters-section">
        <div className="payment-filters-header">
          <h3>Transaction Filters</h3>
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => {
              setSelectedGateway('all');
              setStatusFilter('all');
              setDateRange('30');
              setSearchTerm('');
              setCurrentPage(1);
            }}
          >
            Reset Filters
          </Button>
        </div>
        
        <div className="payment-filters-grid">
          <div className="payment-filter-group">
            <label>Payment Gateway</label>
            <select 
              value={selectedGateway} 
              onChange={(e) => setSelectedGateway(e.target.value)}
              className="payment-filter-select"
              title="Select payment gateway"
              aria-label="Payment Gateway Filter"
            >
              <option value="all">All Gateways</option>
              <option value="payhere">PayHere</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          <div className="payment-filter-group">
            <label>Status</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="payment-filter-select"
              title="Select status filter"
              aria-label="Status Filter"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="payment-filter-group">
            <label>Date Range</label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="payment-filter-select"
              title="Select date range"
              aria-label="Date Range Filter"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>

          <div className="payment-filter-group">
            <label>Search</label>
            <InputField
              id="search-transactions"
              label=""
              type="text"
              placeholder="Search by ID, customer, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="payment-transactions-table-section">
        <div className="payment-table-header">
          <h3>Recent Transactions ({filteredTransactions.length} results)</h3>
          <div className="payment-table-controls">
            <div className="payment-sort-controls">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'status')}
                className="payment-sort-select"
                title="Sort by field"
                aria-label="Sort By"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="status">Status</option>
              </select>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </div>

        <div className="payment-table-container">
          <table className="payment-transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="payment-transaction-id">{transaction.id}</td>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>
                      <div className="payment-customer-info">
                        <div className="payment-customer-name">{transaction.customerName}</div>
                        <div className="payment-customer-email">{transaction.customerEmail}</div>
                      </div>
                    </td>
                    <td className="payment-amount">{formatCurrency(transaction.amount)}</td>
                    <td>
                      <span className={`payment-status-badge ${getStatusBadgeClass(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>
                      <div className="payment-action-buttons">
                        {transaction.bookingId && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="small"
                              onClick={() => handleViewDetails(transaction.bookingId!)}
                            >
                              View
                            </Button>
                            {transaction.status === 'completed' && (
                              <Button 
                                variant="ghost" 
                                size="small"
                                onClick={() => handleRefund(transaction.bookingId!)}
                              >
                                Refund
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="payment-pagination">
          <div className="payment-pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, totalTransactions)} of{' '}
            {totalTransactions} transactions
          </div>
          <div className="payment-pagination-controls">
            <Button
              variant="ghost"
              size="small"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + Math.max(1, currentPage - 2);
              if (pageNum > totalPages) return null;
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "primary" : "ghost"}
                  size="small"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              variant="ghost"
              size="small"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="payment-quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="payment-action-buttons-grid">
          <Button variant="primary" icon={<span>📊</span>}>
            Export Report
          </Button>
          <Button variant="secondary" icon={<span>⚙️</span>}>
            Gateway Settings
          </Button>
          <Button variant="success" icon={<span>💳</span>}>
            Process Refund
          </Button>
          <Button variant="warning" icon={<span>🔍</span>}>
            Investigate Transaction
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
