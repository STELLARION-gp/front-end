import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import LoadingSpinner from '../../components/LoadingSpinner';
import PaymentDetailsModal from '../../components/PaymentDetailsModal';
import RefundDialog from '../../components/RefundDialog';
import '../../styles/pages/guide/PaymentProcessing.scss';
import { 
  getBookingPaymentStats, 
  getBookingPaymentTransactionsForGuide,
  getBookingPaymentDetails,
  processBookingRefund,
  type BookingPaymentDetails,
  type Transaction as ImportedTransaction
} from '../../services/paymentService';

// Types for payment data
type TransactionStatus = ImportedTransaction['status'] | 'approved' | 'rejected';

interface Transaction extends Omit<ImportedTransaction, 'status'> {
  bookingId?: number;
  serviceId?: number;
  status: TransactionStatus;
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
  // default to showing only confirmed (approved) booking payments for this guide
  const [statusFilter, setStatusFilter] = useState<string>('approved');
  const [dateRange, setDateRange] = useState<string>('30');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState<BookingPaymentDetails | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);

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
        
        const result = await getBookingPaymentTransactionsForGuide({
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
        const message = err instanceof Error ? err.message : String(err);
        setError(`Failed to load transactions: ${message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    // Listen for cross-window updates (e.g., booking accepted/rejected)
    const onPaymentsUpdated = () => {
      fetchTransactions();
      // Also refresh stats
      getBookingPaymentStats(parseInt(dateRange)).then(setPaymentStats).catch((err) => console.error('Failed to refresh stats after payments-updated', err));
    };
    window.addEventListener('payments-updated', onPaymentsUpdated);

    return () => {
      window.removeEventListener('payments-updated', onPaymentsUpdated);
    };
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
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      case 'refunded': return 'status-refunded';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const handleViewDetails = async (bookingId: number) => {
    try {
      const details = await getBookingPaymentDetails(bookingId);
      setSelectedPaymentDetails(details);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error fetching payment details:', err);
      alert('Failed to load payment details');
    }
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedPaymentDetails(null);
  };

  const handleRefundFromModal = () => {
    if (selectedPaymentDetails) {
      // Close payment details modal and open refund dialog
      setShowDetailsModal(false);
      setShowRefundDialog(true);
    }
  };

  const handleRefundConfirm = async (reason: string) => {
    if (!selectedPaymentDetails) return;

    try {
      await processBookingRefund(selectedPaymentDetails.bookingId, {
        reason,
        refundType: 'full'
      });
      
      alert('Refund processed successfully! The learner has been notified.');
      setShowRefundDialog(false);
      setSelectedPaymentDetails(null);
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      console.error('Error processing refund:', err);
      alert(err instanceof Error ? err.message : 'Failed to process refund');
    }
  };

  const handleRefundCancel = () => {
    setShowRefundDialog(false);
    // Reopen payment details modal
    setShowDetailsModal(true);
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

      {error && (
        <div className="error-message" style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          color: '#f87171'
        }}>
          {error}
        </div>
      )}

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
              <div className="payment-stat-value">{(paymentStats && typeof paymentStats.totalTransactions === 'number') ? paymentStats.totalTransactions.toLocaleString() : '0'}</div>
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
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="rejected">Rejected</option>
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
          <h3>Confirmed Booking Payments ({filteredTransactions.length} results)</h3>
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
                              
                              size="small"
                              onClick={() => handleViewDetails(transaction.bookingId!)}
                            >
                              View
                            </Button>
                           
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
                  
                  size="small"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
             
              size="small"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        isOpen={showDetailsModal}
        details={selectedPaymentDetails}
        onClose={handleCloseModal}
        onRefund={handleRefundFromModal}
        showRefundButton={true}
      />

      {/* Refund Dialog */}
      <RefundDialog
        isOpen={showRefundDialog}
        bookingDetails={selectedPaymentDetails ? {
          orderId: selectedPaymentDetails.orderId,
          customerName: selectedPaymentDetails.customer.name,
          amount: selectedPaymentDetails.amount,
          serviceTitle: selectedPaymentDetails.service.title,
        } : null}
        onConfirm={handleRefundConfirm}
        onCancel={handleRefundCancel}
      />
    </div>
  );
};

export default PaymentProcessing;
