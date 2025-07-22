import '../../styles/pages/admin/FinanceAnalytics.scss'
import React, { useState } from 'react';
import Button from '../../components/Button';

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Download,
  Filter,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  FileText,
  CreditCard,
  Wallet,
  Target,
  Activity
} from 'lucide-react';


interface Transaction {
  id: string;
  type: 'earning' | 'expense';
  category: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
  user?: string;
  campId?: string;
  campName?: string;
}

interface Payout {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  requestDate: string;
  payoutDate?: string;
  method: 'bank_transfer' | 'paypal' | 'stripe';
  earnings: Transaction[];
}

interface KPIData {
  totalRevenue: number;
  totalPayouts: number;
  pendingPayouts: number;
  activeUsers: number;
  monthlyGrowth: number;
  completionRate: number;
}

interface ChartData {
  month: string;
  revenue: number;
  payouts: number;
  refunds: number;
  commissions: number;
}

interface CategoryData {
  category: string;
  income: number;
  expense: number;
}

const FinanceAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  // Removed unused selectedPayout state
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  // Removed unused filtersVisible state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data
  const kpiData: KPIData = {
    totalRevenue: 125430.50,
    totalPayouts: 89340.25,
    pendingPayouts: 12450.75,
    activeUsers: 1247,
    monthlyGrowth: 15.8,
    completionRate: 94.2
  };

  const chartData: ChartData[] = [
    { month: 'Jan', revenue: 8500, payouts: 6200, refunds: 450, commissions: 850 },
    { month: 'Feb', revenue: 9200, payouts: 6800, refunds: 380, commissions: 920 },
    { month: 'Mar', revenue: 10800, payouts: 7900, refunds: 520, commissions: 1080 },
    { month: 'Apr', revenue: 12300, payouts: 8950, refunds: 410, commissions: 1230 },
    { month: 'May', revenue: 11900, payouts: 8650, refunds: 590, commissions: 1190 },
    { month: 'Jun', revenue: 13500, payouts: 9800, refunds: 340, commissions: 1350 }
  ];

  const categoryData: CategoryData[] = [
    { category: 'Night Camps', income: 45000, expense: 5000 },
    { category: 'Sessions', income: 32000, expense: 3200 },
    { category: 'Guides', income: 18000, expense: 1800 },
    { category: 'Events', income: 15000, expense: 8000 },
    { category: 'Mentor Commissions', income: 0, expense: 12000 },
    { category: 'Influencer Commissions', income: 0, expense: 8500 }
  ];

  const payouts: Payout[] = [
    {
      id: 'PO-001',
      userId: 'U-001',
      userName: 'John Mitchell',
      amount: 2450.00,
      status: 'pending',
      requestDate: '2024-07-15',
      method: 'bank_transfer',
      earnings: []
    },
    {
      id: 'PO-002',
      userId: 'U-002',
      userName: 'Sarah Chen',
      amount: 1890.50,
      status: 'processing',
      requestDate: '2024-07-12',
      method: 'paypal',
      earnings: []
    },
    {
      id: 'PO-003',
      userId: 'U-003',
      userName: 'David Wilson',
      amount: 3200.75,
      status: 'paid',
      requestDate: '2024-07-08',
      payoutDate: '2024-07-10',
      method: 'stripe',
      earnings: []
    }
  ];

  const transactions: Transaction[] = [
    {
      id: 'TXN-001',
      type: 'earning',
      category: 'Night Camps',
      amount: 150.00,
      status: 'completed',
      date: '2024-07-20',
      description: 'Payment for Advanced JavaScript Camp',
      user: 'Alice Johnson',
      campId: 'NC-001',
      campName: 'Advanced JavaScript'
    },
    {
      id: 'TXN-002',
      type: 'expense',
      category: 'Mentor Commissions',
      amount: 45.00,
      status: 'completed',
      date: '2024-07-20',
      description: 'Mentor commission for JavaScript Camp',
      user: 'Bob Smith'
    },
    {
      id: 'TXN-003',
      type: 'earning',
      category: 'Sessions',
      amount: 75.00,
      status: 'pending',
      date: '2024-07-19',
      description: 'One-on-one React consultation',
      user: 'Carol Davis'
    }
  ];

  const handlePayoutAction = (payoutId: string, action: 'approve' | 'reject' | 'process') => {
    console.log(`${action} payout ${payoutId}`);
    // Handle payout action logic
  };

  const handleExportReport = (format: 'excel' | 'pdf') => {
    console.log(`Exporting report as ${format}`);
    // Handle export logic
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderTabNavigation = () => (
    <div className="earnings__navigation">
      {[
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'payouts', label: 'Payouts', icon: CreditCard },
        { id: 'transactions', label: 'Transactions', icon: Activity },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'reports', label: 'Reports', icon: FileText }
      ].map(tab => {
        const Icon = tab.icon;
        return (
          <Button
            key={tab.id}
            className={`earnings__nav-btn ${activeTab === tab.id ? 'earnings__nav-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon size={20} />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );

  const renderKPIPanel = () => (
    <div className="kpi-panel">
      <div className="kpi-panel__grid">
        <div className="kpi-card">
          <div className="kpi-card__header">
            <DollarSign className="kpi-card__icon kpi-card__icon--revenue" />
            <span className="kpi-card__label">Total Revenue</span>
          </div>
          <div className="kpi-card__value">${kpiData.totalRevenue.toLocaleString()}</div>
          <div className="kpi-card__trend kpi-card__trend--positive">
            <TrendingUp size={16} />
            <span>+{kpiData.monthlyGrowth}% this month</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__header">
            <Wallet className="kpi-card__icon kpi-card__icon--payouts" />
            <span className="kpi-card__label">Total Payouts</span>
          </div>
          <div className="kpi-card__value">${kpiData.totalPayouts.toLocaleString()}</div>
          <div className="kpi-card__trend kpi-card__trend--neutral">
            <Clock size={16} />
            <span>${kpiData.pendingPayouts.toLocaleString()} pending</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__header">
            <Users className="kpi-card__icon kpi-card__icon--users" />
            <span className="kpi-card__label">Active Users</span>
          </div>
          <div className="kpi-card__value">{kpiData.activeUsers.toLocaleString()}</div>
          <div className="kpi-card__trend kpi-card__trend--positive">
            <TrendingUp size={16} />
            <span>Growing steadily</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__header">
            <Target className="kpi-card__icon kpi-card__icon--completion" />
            <span className="kpi-card__label">Completion Rate</span>
          </div>
          <div className="kpi-card__value">{kpiData.completionRate}%</div>
          <div className="kpi-card__trend kpi-card__trend--positive">
            <CheckCircle size={16} />
            <span>Excellent performance</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCharts = () => (
    <div className="charts-section">
      <div className="charts-section__header">
        <h3 className="charts-section__title">Revenue Analytics</h3>
        <div className="charts-section__actions">
          <button className="btn btn--outline btn--sm">
            <Download size={16} />
            Export Data
          </button>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container chart-container--large">
          <h4 className="chart-container__title">Monthly Revenue Trends</h4>
          <div className="revenue-chart">
            {chartData.map((data) => (
              <div key={data.month} className="revenue-chart__bar-group">
                <div className="revenue-chart__bars">
                  <div
                    className="revenue-chart__bar revenue-chart__bar--revenue"
                    style={{ height: `${(data.revenue / 15000) * 100}%` }}
                    title={`Revenue: $${data.revenue}`}
                  />
                  <div
                    className="revenue-chart__bar revenue-chart__bar--payouts"
                    style={{ height: `${(data.payouts / 15000) * 100}%` }}
                    title={`Payouts: $${data.payouts}`}
                  />
                  <div
                    className="revenue-chart__bar revenue-chart__bar--refunds"
                    style={{ height: `${(data.refunds / 15000) * 100}%` }}
                    title={`Refunds: $${data.refunds}`}
                  />
                  <div
                    className="revenue-chart__bar revenue-chart__bar--commissions"
                    style={{ height: `${(data.commissions / 15000) * 100}%` }}
                    title={`Commissions: $${data.commissions}`}
                  />
                </div>
                <div className="revenue-chart__label">{data.month}</div>
              </div>
            ))}
          </div>
          <div className="revenue-chart__legend">
            <div className="revenue-chart__legend-item">
              <div className="revenue-chart__legend-color revenue-chart__legend-color--revenue" />
              <span>Revenue</span>
            </div>
            <div className="revenue-chart__legend-item">
              <div className="revenue-chart__legend-color revenue-chart__legend-color--payouts" />
              <span>Payouts</span>
            </div>
            <div className="revenue-chart__legend-item">
              <div className="revenue-chart__legend-color revenue-chart__legend-color--refunds" />
              <span>Refunds</span>
            </div>
            <div className="revenue-chart__legend-item">
              <div className="revenue-chart__legend-color revenue-chart__legend-color--commissions" />
              <span>Commissions</span>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h4 className="chart-container__title">Category Breakdown</h4>
          <div className="category-chart">
            {categoryData.map((category) => {
              const total = category.income + category.expense;
              const incomePercent = (category.income / total) * 100;
              return (
                <div key={category.category} className="category-chart__item">
                  <div className="category-chart__label">{category.category}</div>
                  <div className="category-chart__bar">
                    <div
                      className="category-chart__income"
                      style={{ width: `${incomePercent}%` }}
                    />
                    <div
                      className="category-chart__expense"
                      style={{ width: `${100 - incomePercent}%` }}
                    />
                  </div>
                  <div className="category-chart__values">
                    <span className="category-chart__income-value">+${category.income.toLocaleString()}</span>
                    {category.expense > 0 && (
                      <span className="category-chart__expense-value">-${category.expense.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayoutsTable = () => (
    <div className="payouts-section">
      <div className="payouts-section__header">
        <h3 className="payouts-section__title">Payout Management</h3>
        <div className="payouts-section__actions">
          <button className="btn btn--outline btn--sm">
            <Filter size={16} />
            Filter
          </button>
          <button className="btn btn--primary btn--sm">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="payouts-table">
        <div className="payouts-table__container">
          <table className="payouts-table__table">
            <thead>
              <tr>
                <th>Payout ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Request Date</th>
                <th>Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map(payout => (
                <tr key={payout.id} className="payouts-table__row">
                  <td className="payouts-table__cell">
                    <span className="payouts-table__id">{payout.id}</span>
                  </td>
                  <td className="payouts-table__cell">
                    <div className="payouts-table__user">
                      <span className="payouts-table__user-name">{payout.userName}</span>
                      <span className="payouts-table__user-id">{payout.userId}</span>
                    </div>
                  </td>
                  <td className="payouts-table__cell">
                    <span className="payouts-table__amount">${payout.amount.toFixed(2)}</span>
                  </td>
                  <td className="payouts-table__cell">
                    <span className={`payouts-table__status payouts-table__status--${payout.status}`}>
                      {payout.status === 'pending' && <Clock size={14} />}
                      {payout.status === 'processing' && <AlertCircle size={14} />}
                      {payout.status === 'paid' && <CheckCircle size={14} />}
                      {payout.status === 'failed' && <XCircle size={14} />}
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </span>
                  </td>
                  <td className="payouts-table__cell">
                    <span className="payouts-table__date">{payout.requestDate}</span>
                  </td>
                  <td className="payouts-table__cell">
                    <span className="payouts-table__method">
                      {payout.method.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="payouts-table__cell payouts-table__cell--actions">
                    <div className="payouts-table__actions">
                      <button
                        className="btn btn--outline btn--xs"
                        // Removed setSelectedPayout as selectedPayout is unused
                      >
                        <Eye size={14} />
                      </button>
                      {payout.status === 'pending' && (
                        <>
                          <button
                            className="btn btn--primary btn--xs"
                            onClick={() => handlePayoutAction(payout.id, 'approve')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn--danger btn--xs"
                            onClick={() => handlePayoutAction(payout.id, 'reject')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTransactionsTable = () => (
    <div className="transactions-section">
      <div className="transactions-section__header">
        <h3 className="transactions-section__title">Transaction History</h3>
        <div className="transactions-section__controls">
          <div className="transactions-section__search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="transactions-section__filter"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="transactions-table">
        <div className="transactions-table__container">
          <table className="transactions-table__table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id} className="transactions-table__row">
                  <td className="transactions-table__cell">
                    <span className="transactions-table__id">{transaction.id}</span>
                  </td>
                  <td className="transactions-table__cell">
                    <span className={`transactions-table__type transactions-table__type--${transaction.type}`}>
                      {transaction.type === 'earning' ? (
                        <>
                          <TrendingUp size={14} />
                          Earning
                        </>
                      ) : (
                        <>
                          <TrendingDown size={14} />
                          Expense
                        </>
                      )}
                    </span>
                  </td>
                  <td className="transactions-table__cell">
                    <span className="transactions-table__category">{transaction.category}</span>
                  </td>
                  <td className="transactions-table__cell">
                    <span className={`transactions-table__amount transactions-table__amount--${transaction.type}`}>
                      {transaction.type === 'earning' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="transactions-table__cell">
                    <span className={`transactions-table__status transactions-table__status--${transaction.status}`}>
                      {transaction.status === 'completed' && <CheckCircle size={14} />}
                      {transaction.status === 'pending' && <Clock size={14} />}
                      {transaction.status === 'failed' && <XCircle size={14} />}
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="transactions-table__cell">
                    <span className="transactions-table__date">{transaction.date}</span>
                  </td>
                  <td className="transactions-table__cell">
                    <span className="transactions-table__description">{transaction.description}</span>
                    {transaction.user && (
                      <span className="transactions-table__user">by {transaction.user}</span>
                    )}
                  </td>
                  <td className="transactions-table__cell transactions-table__cell--actions">
                    <button
                      className="btn btn--outline btn--xs"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReportsSection = () => (
    <div className="reports-section">
      <div className="reports-section__header">
        <h3 className="reports-section__title">Reports Library</h3>
        <p className="reports-section__subtitle">Generate and export comprehensive platform reports</p>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <div className="report-card__icon">
            <BarChart3 />
          </div>
          <h4 className="report-card__title">Revenue Report</h4>
          <p className="report-card__description">
            Comprehensive revenue analysis including earnings, payouts, and growth metrics
          </p>
          <div className="report-card__actions">
            <button
              className="btn btn--outline btn--sm"
              onClick={() => handleExportReport('excel')}
            >
              <Download size={16} />
              Excel
            </button>
            <button
              className="btn btn--primary btn--sm"
              onClick={() => handleExportReport('pdf')}
            >
              <FileText size={16} />
              PDF
            </button>
          </div>
        </div>

        <div className="report-card">
          <div className="report-card__icon">
            <Users />
          </div>
          <h4 className="report-card__title">User Analytics</h4>
          <p className="report-card__description">
            User engagement, participation rates, and demographic insights
          </p>
          <div className="report-card__actions">
            <button
              className="btn btn--outline btn--sm"
              onClick={() => handleExportReport('excel')}
            >
              <Download size={16} />
              Excel
            </button>
            <button
              className="btn btn--primary btn--sm"
              onClick={() => handleExportReport('pdf')}
            >
              <FileText size={16} />
              PDF
            </button>
          </div>
        </div>

        <div className="report-card">
          <div className="report-card__icon">
            <CreditCard />
          </div>
          <h4 className="report-card__title">Payout Summary</h4>
          <p className="report-card__description">
            Complete payout history, pending requests, and payment method analysis
          </p>
          <div className="report-card__actions">
            <button
              className="btn btn--outline btn--sm"
              onClick={() => handleExportReport('excel')}
            >
              <Download size={16} />
              Excel
            </button>
            <button
              className="btn btn--primary btn--sm"
              onClick={() => handleExportReport('pdf')}
            >
              <FileText size={16} />
              PDF
            </button>
          </div>
        </div>

        <div className="report-card">
          <div className="report-card__icon">
            <PieChart />
          </div>
          <h4 className="report-card__title">Category Breakdown</h4>
          <p className="report-card__description">
            Income and expense analysis by category with trend comparisons
          </p>
          <div className="report-card__actions">
            <button
              className="btn btn--outline btn--sm"
              onClick={() => handleExportReport('excel')}
            >
              <Download size={16} />
              Excel
            </button>
            <button
              className="btn btn--primary btn--sm"
              onClick={() => handleExportReport('pdf')}
            >
              <FileText size={16} />
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactionModal = () => {
    if (!selectedTransaction) return null;

    return (
      <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Transaction Details</h3>
            <button
              className="modal-close"
              onClick={() => setSelectedTransaction(null)}
            >
              ×
            </button>
          </div>

          <div className="modal-body">
            <div className="transaction-details">
              <div className="transaction-details__row">
                <span className="transaction-details__label">Transaction ID:</span>
                <span className="transaction-details__value">{selectedTransaction.id}</span>
              </div>

              <div className="transaction-details__row">
                <span className="transaction-details__label">Type:</span>
                <span className={`transaction-details__type transaction-details__type--${selectedTransaction.type}`}>
                  {selectedTransaction.type === 'earning' ? (
                    <>
                      <TrendingUp size={16} />
                      Earning
                    </>
                  ) : (
                    <>
                      <TrendingDown size={16} />
                      Expense
                    </>
                  )}
                </span>
              </div>

              <div className="transaction-details__row">
                <span className="transaction-details__label">Category:</span>
                <span className="transaction-details__value">{selectedTransaction.category}</span>
              </div>

              <div className="transaction-details__row">
                <span className="transaction-details__label">Amount:</span>
                <span className={`transaction-details__amount transaction-details__amount--${selectedTransaction.type}`}>
                  {selectedTransaction.type === 'earning' ? '+' : '-'}${selectedTransaction.amount.toFixed(2)}
                </span>
              </div>

              <div className="transaction-details__row">
                <span className="transaction-details__label">Status:</span>
                <span className={`transaction-details__status transaction-details__status--${selectedTransaction.status}`}>
                  {selectedTransaction.status === 'completed' && <CheckCircle size={16} />}
                  {selectedTransaction.status === 'pending' && <Clock size={16} />}
                  {selectedTransaction.status === 'failed' && <XCircle size={16} />}
                  {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                </span>
              </div>

              <div className="transaction-details__row">
                <span className="transaction-details__label">Date:</span>
                <span className="transaction-details__value">{selectedTransaction.date}</span>
              </div>

              <div className="transaction-details__row">
                <span className="transaction-details__label">Description:</span>
                <span className="transaction-details__value">{selectedTransaction.description}</span>
              </div>

              {selectedTransaction.user && (
                <div className="transaction-details__row">
                  <span className="transaction-details__label">User:</span>
                  <span className="transaction-details__value">{selectedTransaction.user}</span>
                </div>
              )}

              {selectedTransaction.campName && (
                <div className="transaction-details__row">
                  <span className="transaction-details__label">Camp:</span>
                  <span className="transaction-details__value">
                    {selectedTransaction.campName} ({selectedTransaction.campId})
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button
              className="btn btn--outline"
              onClick={() => setSelectedTransaction(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {renderKPIPanel()}
            {renderCharts()}
          </>
        );
      case 'payouts':
        return renderPayoutsTable();
      case 'transactions':
        return renderTransactionsTable();
      case 'analytics':
        return renderCharts();
      case 'reports':
        return renderReportsSection();
      default:
        return (
          <>
            {renderKPIPanel()}
            {renderCharts()}
          </>
        );
    }
  };

  return (
    <div className="earnings-payouts">
      <div className="earnings-payouts__header">
        <h1 className="earnings-payouts__title">Earnings & Payouts</h1>
        <p className="earnings-payouts__subtitle">
          Manage platform revenue, track payouts, and analyze financial performance
        </p>
      </div>

      {renderTabNavigation()}

      <div className="earnings-payouts__content">
        {renderContent()}
      </div>

      {renderTransactionModal()}
    </div>
  );
};

export default FinanceAnalytics;