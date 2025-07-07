import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import LoadingSpinner from '../../components/LoadingSpinner';
import '../../styles/pages/guide/PaymentProcessing.scss';

// Types for payment data
interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  type: 'payment' | 'refund' | 'subscription' | 'booking';
  description: string;
  gateway: 'stripe' | 'paypal' | 'razorpay' | 'square';
  reference: string;
  customerEmail: string;
  customerName: string;
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
  const [selectedGateway, setSelectedGateway] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const itemsPerPage = 10;

  // Mock data generation
  useEffect(() => {
    const generateMockData = () => {
      const mockTransactions: Transaction[] = [];
      const gateways: Transaction['gateway'][] = ['stripe', 'paypal', 'razorpay', 'square'];
      const statuses: Transaction['status'][] = ['completed', 'pending', 'failed', 'refunded'];
      const types: Transaction['type'][] = ['payment', 'refund', 'subscription', 'booking'];
      
      for (let i = 0; i < 100; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 90));
        
        mockTransactions.push({
          id: `TXN${String(i + 1).padStart(6, '0')}`,
          date: date.toISOString().split('T')[0],
          amount: Math.floor(Math.random() * 50000) + 100,
          currency: 'USD',
          status: statuses[Math.floor(Math.random() * statuses.length)],
          type: types[Math.floor(Math.random() * types.length)],
          description: `Stellarion ${types[Math.floor(Math.random() * types.length)]} service`,
          gateway: gateways[Math.floor(Math.random() * gateways.length)],
          reference: `REF${Math.random().toString(36).substring(2, 15)}`,
          customerEmail: `user${i + 1}@stellarion.com`,
          customerName: `Customer ${i + 1}`
        });
      }

      const totalRevenue = mockTransactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const mockStats: PaymentStats = {
        totalRevenue,
        totalTransactions: mockTransactions.length,
        successRate: 94.2,
        pendingAmount: mockTransactions
          .filter(t => t.status === 'pending')
          .reduce((sum, t) => sum + t.amount, 0),
        refundedAmount: mockTransactions
          .filter(t => t.status === 'refunded')
          .reduce((sum, t) => sum + t.amount, 0),
        monthlyGrowth: 12.5
      };

      setTransactions(mockTransactions);
      setPaymentStats(mockStats);
      setLoading(false);
    };

    // Simulate API call
    setTimeout(generateMockData, 1000);
  }, []);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = transactions.filter(transaction => {
      const matchesGateway = selectedGateway === 'all' || transaction.gateway === selectedGateway;
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
      
      const transactionDate = new Date(transaction.date);
      const daysAgo = parseInt(dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      const matchesDate = transactionDate >= cutoffDate;

      return matchesGateway && matchesStatus && matchesSearch && matchesDate;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [transactions, selectedGateway, statusFilter, searchTerm, dateRange, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
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

      {/* Payment Statistics Charts */}
      <div className="payment-stats-section">
        <div className="payment-stats-grid">
          <Card className="payment-stat-card payment-revenue">
            <div className="payment-stat-icon">💰</div>
            <div className="payment-stat-content">
              <h3>Total Revenue</h3>
              <div className="payment-stat-value">{formatCurrency(paymentStats?.totalRevenue || 0)}</div>
              <div className="payment-stat-change positive">+{paymentStats?.monthlyGrowth}% this month</div>
            </div>
          </Card>

          <Card className="payment-stat-card payment-transactions">
            <div className="payment-stat-icon">📊</div>
            <div className="payment-stat-content">
              <h3>Total Transactions</h3>
              <div className="payment-stat-value">{paymentStats?.totalTransactions.toLocaleString()}</div>
              <div className="payment-stat-change neutral">Last 90 days</div>
            </div>
          </Card>

          <Card className="payment-stat-card payment-success-rate">
            <div className="payment-stat-icon">✅</div>
            <div className="payment-stat-content">
              <h3>Success Rate</h3>
              <div className="payment-stat-value">{paymentStats?.successRate}%</div>
              <div className="payment-stat-change positive">Above average</div>
            </div>
          </Card>

          <Card className="payment-stat-card payment-pending">
            <div className="payment-stat-icon">⏳</div>
            <div className="payment-stat-content">
              <h3>Pending Amount</h3>
              <div className="payment-stat-value">{formatCurrency(paymentStats?.pendingAmount || 0)}</div>
              <div className="payment-stat-change neutral">Awaiting processing</div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="payment-charts-section">
          <Card className="payment-chart-card">
            <h3>Revenue Trend (Last 30 Days)</h3>
            <div className="payment-chart-placeholder">
              <div className="payment-chart-bars">
                {Array.from({ length: 30 }, (_, i) => (
                  <div 
                    key={i} 
                    className={`payment-chart-bar payment-chart-bar-${Math.floor(Math.random() * 5) + 1}`}
                  />
                ))}
              </div>
            </div>
          </Card>

          <Card className="payment-chart-card">
            <h3>Payment Gateway Distribution</h3>
            <div className="payment-pie-chart-placeholder">
              <div className="payment-gateway-stats">
                <div className="payment-gateway-item">
                  <span className="payment-gateway-color stripe"></span>
                  <span>Stripe (45%)</span>
                </div>
                <div className="payment-gateway-item">
                  <span className="payment-gateway-color paypal"></span>
                  <span>PayPal (30%)</span>
                </div>
                <div className="payment-gateway-item">
                  <span className="payment-gateway-color razorpay"></span>
                  <span>Razorpay (15%)</span>
                </div>
                <div className="payment-gateway-item">
                  <span className="payment-gateway-color square"></span>
                  <span>Square (10%)</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card className="payment-filters-section">
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
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="razorpay">Razorpay</option>
              <option value="square">Square</option>
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
      </Card>

      {/* Transactions Table */}
      <Card className="payment-transactions-table-section">
        <div className="payment-table-header">
          <h3>Recent Transactions ({filteredAndSortedTransactions.length} results)</h3>
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
                <th>Gateway</th>
                <th>Status</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction) => (
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
                    <span className={`payment-gateway-badge ${transaction.gateway}`}>
                      {transaction.gateway}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-status-badge ${getStatusBadgeClass(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="payment-transaction-type">{transaction.type}</td>
                  <td>
                    <div className="payment-action-buttons">
                      <Button variant="ghost" size="small">View</Button>
                      {transaction.status === 'completed' && (
                        <Button variant="ghost" size="small">Refund</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="payment-pagination">
          <div className="payment-pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)} of{' '}
            {filteredAndSortedTransactions.length} transactions
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
      </Card>

      {/* Quick Actions */}
      <Card className="payment-quick-actions-section">
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
      </Card>
    </div>
  );
};

export default PaymentProcessing;
