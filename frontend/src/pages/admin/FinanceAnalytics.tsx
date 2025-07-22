import '../../styles/pages/admin/FinanceAnalytics.scss'
import React, { useState } from 'react';
import Button from '../../components/Button';

import {
  DollarSign,
  
  Users,
  Eye,
  Download,

  Search,
  CheckCircle,
  Clock,
  XCircle,
 
  BarChart3,
 
  FileText,
  
  Wallet,
 
  Activity,
  Crown,
  Star,
  BookOpen,
  UserCheck,
  
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: 'Basic' | 'Premium';
  monthlyPrice: number;
  yearlyPrice: number;
  subscribers: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  churnRate: number;
}

interface SessionData {
  totalRevenue: number;
  totalSessions: number;
  influencerPayments: number;
  balance: number;
  completedSessions: number;
  pendingSessions: number;
}

interface GuideData {
  totalRevenue: number;
  totalSessions: number;
  guidePayments: number;
  balance: number;
  activeGuides: number;
  completedSessions: number;
}

interface Transaction {
  id: string;
  type: 'subscription' | 'session' | 'guide' | 'payment';
  subType: 'basic' | 'premium' | 'influencer_payment' | 'guide_payment';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
  user?: string;
}

const FinanceAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('30d');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Mock data for subscription plans
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 29,
      yearlyPrice: 290,
      subscribers: 1847,
      monthlyRevenue: 53563,
      yearlyRevenue: 535630,
      churnRate: 3.2
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 79,
      yearlyPrice: 790,
      subscribers: 923,
      monthlyRevenue: 72917,
      yearlyRevenue: 729170,
      churnRate: 2.1
    }
  ];

  const sessionData: SessionData = {
    totalRevenue: 145230,
    totalSessions: 2847,
    influencerPayments: 58092,
    balance: 87138,
    completedSessions: 2698,
    pendingSessions: 149
  };

  const guideData: GuideData = {
    totalRevenue: 89450,
    totalSessions: 1567,
    guidePayments: 35780,
    balance: 53670,
    activeGuides: 156,
    completedSessions: 1432
  };

  const transactions: Transaction[] = [
    {
      id: 'TXN-001',
      type: 'subscription',
      subType: 'premium',
      amount: 79.00,
      status: 'completed',
      date: '2024-07-22',
      description: 'Premium subscription renewal',
      user: 'Alice Johnson'
    },
    {
      id: 'TXN-002',
      type: 'session',
      subType: 'influencer_payment',
      amount: 120.00,
      status: 'completed',
      date: '2024-07-22',
      description: 'Payment to influencer - React masterclass',
      user: 'Bob Smith'
    },
    {
      id: 'TXN-003',
      type: 'guide',
      subType: 'guide_payment',
      amount: 45.00,
      status: 'pending',
      date: '2024-07-21',
      description: 'Guide payment - Python consultation',
      user: 'Carol Davis'
    },
    {
      id: 'TXN-004',
      type: 'subscription',
      subType: 'basic',
      amount: 29.00,
      status: 'completed',
      date: '2024-07-21',
      description: 'Basic subscription - New user',
      user: 'David Wilson'
    }
  ];

  const handleExportData = () => {
    console.log('Exporting financial data...');
  };

  const renderTabNavigation = () => (
    <div className="tab-navigation">
      {[
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'subscriptions', label: 'Subscriptions', icon: Crown },
        { id: 'sessions', label: 'Sessions', icon: Users },
        { id: 'guides', label: 'Guides', icon: BookOpen },
        { id: 'transactions', label: 'Transactions', icon: Activity }
      ].map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon size={20} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  const monthlyRevenueData = [
    { month: 'Jan', revenue: 120000 },
    { month: 'Feb', revenue: 135000 },
    { month: 'Mar', revenue: 142000 },
    { month: 'Apr', revenue: 148000 },
    { month: 'May', revenue: 151000 },
    { month: 'Jun', revenue: 158000 },
    { month: 'Jul', revenue: 162000 },
  ];

  // Chart rendering function
  const renderMonthlyRevenueChart = () => {
    const maxRevenue = Math.max(...monthlyRevenueData.map(d => d.revenue));
    return (
      <div className="monthly-revenue-chart">
        <h3 className="section-title">Monthly Revenue Trend</h3>
        <div className="chart-bars">
          {monthlyRevenueData.map((data) => (
            <div key={data.month} className="chart-bar-item">
              <div
                className="chart-bar-fill"
                style={{
                  height: `${(data.revenue / maxRevenue) * 100}%`
                }}
                title={`$${data.revenue.toLocaleString()}`}
              />
              <div className="chart-bar-label">{data.month}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    const totalRevenue = subscriptionPlans.reduce((sum, plan) => sum + plan.monthlyRevenue, 0) + 
                        sessionData.totalRevenue + guideData.totalRevenue;
    const totalSubscribers = subscriptionPlans.reduce((sum, plan) => sum + plan.subscribers, 0);
    const totalBalance = sessionData.balance + guideData.balance;
    const totalPayments = sessionData.influencerPayments + guideData.guidePayments;

    return (
      <div className="overview-section">
        <div className="time-range-selector">
          <label>Time Period:</label>
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="time-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card kpi-card--primary">
            <div className="kpi-card__header">
              <DollarSign className="kpi-card__icon" />
              <span className="kpi-card__label">Total Revenue</span>
            </div>
            <div className="kpi-card__value">${totalRevenue.toLocaleString()}</div>
            <div className="kpi-card__trend kpi-card__trend--positive">
              <ArrowUpRight size={16} />
              <span>+12.5% from last month</span>
            </div>
          </div>

          <div className="kpi-card kpi-card--secondary">
            <div className="kpi-card__header">
              <Users className="kpi-card__icon" />
              <span className="kpi-card__label">Active Subscribers</span>
            </div>
            <div className="kpi-card__value">{totalSubscribers.toLocaleString()}</div>
            <div className="kpi-card__trend kpi-card__trend--positive">
              <ArrowUpRight size={16} />
              <span>+8.3% growth</span>
            </div>
          </div>

          <div className="kpi-card kpi-card--success">
            <div className="kpi-card__header">
              <Wallet className="kpi-card__icon" />
              <span className="kpi-card__label">Available Balance</span>
            </div>
            <div className="kpi-card__value">${totalBalance.toLocaleString()}</div>
            <div className="kpi-card__trend kpi-card__trend--neutral">
              <span>After payments: ${totalPayments.toLocaleString()}</span>
            </div>
          </div>

          <div className="kpi-card kpi-card--warning">
            <div className="kpi-card__header">
              <Activity className="kpi-card__icon" />
              <span className="kpi-card__label">Profit Margin</span>
            </div>
            <div className="kpi-card__value">{((totalBalance / totalRevenue) * 100).toFixed(1)}%</div>
            <div className="kpi-card__trend kpi-card__trend--positive">
              <ArrowUpRight size={16} />
              <span>Healthy margin</span>
            </div>
          </div>
        </div>

        <div className="revenue-breakdown">
          <h3 className="section-title">Revenue Breakdown</h3>
          <div className="breakdown-chart">
            <div className="breakdown-item">
              <div className="breakdown-item__header">
                <Crown size={24} className="breakdown-icon breakdown-icon--subscription" />
                <div>
                  <h4>Subscription Revenue</h4>
                  <p>Basic & Premium plans</p>
                </div>
              </div>
              <div className="breakdown-item__value">
                ${subscriptionPlans.reduce((sum, plan) => sum + plan.monthlyRevenue, 0).toLocaleString()}
              </div>
              <div className="breakdown-item__bar">
                <div 
                  className="breakdown-bar breakdown-bar--subscription" 
                  style={{width: `${(subscriptionPlans.reduce((sum, plan) => sum + plan.monthlyRevenue, 0) / totalRevenue) * 100}%`}}
                />
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-item__header">
                <Users size={24} className="breakdown-icon breakdown-icon--sessions" />
                <div>
                  <h4>Sessions Revenue</h4>
                  <p>Influencer-led sessions</p>
                </div>
              </div>
              <div className="breakdown-item__value">
                ${sessionData.totalRevenue.toLocaleString()}
              </div>
              <div className="breakdown-item__bar">
                <div 
                  className="breakdown-bar breakdown-bar--sessions" 
                  style={{width: `${(sessionData.totalRevenue / totalRevenue) * 100}%`}}
                />
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-item__header">
                <BookOpen size={24} className="breakdown-icon breakdown-icon--guides" />
                <div>
                  <h4>Guide Services</h4>
                  <p>1-on-1 consultations</p>
                </div>
              </div>
              <div className="breakdown-item__value">
                ${guideData.totalRevenue.toLocaleString()}
              </div>
              <div className="breakdown-item__bar">
                <div 
                  className="breakdown-bar breakdown-bar--guides" 
                  style={{width: `${(guideData.totalRevenue / totalRevenue) * 100}%`}}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Monthly Revenue Chart */}
        {renderMonthlyRevenueChart()}
      </div>
    );
  };

  const renderSubscriptions = () => (
    <div className="subscriptions-section">
      <div className="section-header">
        <h2 className="section-title">Subscription Plans</h2>
        <button className="export-btn" onClick={handleExportData}>
          <Download size={16} />
          Export Data
        </button>
      </div>

      <div className="subscription-cards">
        {subscriptionPlans.map(plan => (
          <div key={plan.id} className={`subscription-card subscription-card--${plan.name.toLowerCase()}`}>
            <div className="subscription-card__header">
              <div className="subscription-card__icon">
                {plan.name === 'Premium' ? <Crown size={32} /> : <Star size={32} />}
              </div>
              <div className="subscription-card__title">
                <h3>{plan.name} Plan</h3>
                <p>${plan.monthlyPrice}/month</p>
              </div>
            </div>

            <div className="subscription-card__metrics">
              <div className="metric">
                <span className="metric__label">Subscribers</span>
                <span className="metric__value">{plan.subscribers.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="metric__label">Monthly Revenue</span>
                <span className="metric__value">${plan.monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="metric__label">Yearly Revenue</span>
                <span className="metric__value">${plan.yearlyRevenue.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="metric__label">Churn Rate</span>
                <span className={`metric__value ${plan.churnRate < 3 ? 'metric__value--good' : 'metric__value--warning'}`}>
                  {plan.churnRate}%
                </span>
              </div>
            </div>

            <div className="subscription-card__chart">
              <div className="revenue-trend">
                <div className="trend-bar" style={{height: `${(plan.monthlyRevenue / 80000) * 100}%`}} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="subscription-summary">
        <h3 className="section-title">Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Total Subscribers</span>
            <span className="summary-value">
              {subscriptionPlans.reduce((sum, plan) => sum + plan.subscribers, 0).toLocaleString()}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Monthly Recurring Revenue</span>
            <span className="summary-value">
              ${subscriptionPlans.reduce((sum, plan) => sum + plan.monthlyRevenue, 0).toLocaleString()}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Annual Recurring Revenue</span>
            <span className="summary-value">
              ${subscriptionPlans.reduce((sum, plan) => sum + plan.yearlyRevenue, 0).toLocaleString()}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Average Churn Rate</span>
            <span className="summary-value">
              {(subscriptionPlans.reduce((sum, plan) => sum + plan.churnRate, 0) / subscriptionPlans.length).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="sessions-section">
      <div className="section-header">
        <h2 className="section-title">Sessions Revenue</h2>
        <button className="export-btn" onClick={handleExportData}>
          <Download size={16} />
          Export Data
        </button>
      </div>

      <div className="session-overview">
        <div className="session-card session-card--revenue">
          <div className="session-card__header">
            <DollarSign className="session-card__icon" />
            <h3>Total Revenue</h3>
          </div>
          <div className="session-card__value">${sessionData.totalRevenue.toLocaleString()}</div>
          <div className="session-card__detail">From {sessionData.totalSessions} sessions</div>
        </div>

        <div className="session-card session-card--payments">
          <div className="session-card__header">
            <ArrowDownRight className="session-card__icon" />
            <h3>Influencer Payments</h3>
          </div>
          <div className="session-card__value">${sessionData.influencerPayments.toLocaleString()}</div>
          <div className="session-card__detail">
            {((sessionData.influencerPayments / sessionData.totalRevenue) * 100).toFixed(1)}% of revenue
          </div>
        </div>

        <div className="session-card session-card--balance">
          <div className="session-card__header">
            <Wallet className="session-card__icon" />
            <h3>Net Balance</h3>
          </div>
          <div className="session-card__value">${sessionData.balance.toLocaleString()}</div>
          <div className="session-card__detail">
            {((sessionData.balance / sessionData.totalRevenue) * 100).toFixed(1)}% profit margin
          </div>
        </div>
      </div>

      <div className="session-analytics">
        <div className="analytics-chart">
          <h4>Session Performance</h4>
          <div className="chart-container">
            <div className="chart-item">
              <div className="chart-label">Completed Sessions</div>
              <div className="chart-bar">
                <div 
                  className="chart-fill chart-fill--success" 
                  style={{width: `${(sessionData.completedSessions / sessionData.totalSessions) * 100}%`}}
                />
              </div>
              <div className="chart-value">{sessionData.completedSessions}</div>
            </div>
            <div className="chart-item">
              <div className="chart-label">Pending Sessions</div>
              <div className="chart-bar">
                <div 
                  className="chart-fill chart-fill--warning" 
                  style={{width: `${(sessionData.pendingSessions / sessionData.totalSessions) * 100}%`}}
                />
              </div>
              <div className="chart-value">{sessionData.pendingSessions}</div>
            </div>
          </div>
        </div>

        <div className="revenue-flow">
          <h4>Revenue Flow</h4>
          <div className="flow-diagram">
            <div className="flow-step">
              <div className="flow-amount">${sessionData.totalRevenue.toLocaleString()}</div>
              <div className="flow-label">Total Revenue</div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-amount">-${sessionData.influencerPayments.toLocaleString()}</div>
              <div className="flow-label">Influencer Payments</div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-amount">${sessionData.balance.toLocaleString()}</div>
              <div className="flow-label">Net Balance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGuides = () => (
    <div className="guides-section">
      <div className="section-header">
        <h2 className="section-title">Guide Services</h2>
        <button className="export-btn" onClick={handleExportData}>
          <Download size={16} />
          Export Data
        </button>
      </div>

      <div className="guide-overview">
        <div className="guide-card guide-card--revenue">
          <div className="guide-card__header">
            <DollarSign className="guide-card__icon" />
            <h3>Total Revenue</h3>
          </div>
          <div className="guide-card__value">${guideData.totalRevenue.toLocaleString()}</div>
          <div className="guide-card__detail">From {guideData.totalSessions} sessions</div>
        </div>

        <div className="guide-card guide-card--payments">
          <div className="guide-card__header">
            <ArrowDownRight className="guide-card__icon" />
            <h3>Guide Payments</h3>
          </div>
          <div className="guide-card__value">${guideData.guidePayments.toLocaleString()}</div>
          <div className="guide-card__detail">
            {((guideData.guidePayments / guideData.totalRevenue) * 100).toFixed(1)}% of revenue
          </div>
        </div>

        <div className="guide-card guide-card--balance">
          <div className="guide-card__header">
            <Wallet className="guide-card__icon" />
            <h3>Net Balance</h3>
          </div>
          <div className="guide-card__value">${guideData.balance.toLocaleString()}</div>
          <div className="guide-card__detail">
            {((guideData.balance / guideData.totalRevenue) * 100).toFixed(1)}% profit margin
          </div>
        </div>

        <div className="guide-card guide-card--guides">
          <div className="guide-card__header">
            <UserCheck className="guide-card__icon" />
            <h3>Active Guides</h3>
          </div>
          <div className="guide-card__value">{guideData.activeGuides}</div>
          <div className="guide-card__detail">Serving clients</div>
        </div>
      </div>

      <div className="guide-analytics">
        <div className="analytics-chart">
          <h4>Service Performance</h4>
          <div className="chart-container">
            <div className="chart-item">
              <div className="chart-label">Completed Sessions</div>
              <div className="chart-bar">
                <div 
                  className="chart-fill chart-fill--success" 
                  style={{width: `${(guideData.completedSessions / guideData.totalSessions) * 100}%`}}
                />
              </div>
              <div className="chart-value">{guideData.completedSessions}</div>
            </div>
            <div className="chart-item">
              <div className="chart-label">Average per Session</div>
              <div className="chart-bar">
                <div className="chart-fill chart-fill--info" style={{width: '75%'}} />
              </div>
              <div className="chart-value">${Math.round(guideData.totalRevenue / guideData.totalSessions)}</div>
            </div>
          </div>
        </div>

        <div className="revenue-flow">
          <h4>Revenue Flow</h4>
          <div className="flow-diagram">
            <div className="flow-step">
              <div className="flow-amount">${guideData.totalRevenue.toLocaleString()}</div>
              <div className="flow-label">Total Revenue</div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-amount">-${guideData.guidePayments.toLocaleString()}</div>
              <div className="flow-label">Guide Payments</div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-amount">${guideData.balance.toLocaleString()}</div>
              <div className="flow-label">Net Balance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => {
    const filteredTransactions = transactions.filter(transaction =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="transactions-section">
        <div className="section-header">
          <h2 className="section-title">Recent Transactions</h2>
          <div className="transactions-controls">
            <div className="search-input">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="export-btn" onClick={handleExportData}>
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>
                    <div className="transaction-info">
                      <span className="transaction-id">{transaction.id}</span>
                      <span className="transaction-desc">{transaction.description}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`transaction-type transaction-type--${transaction.type}`}>
                      {transaction.type === 'subscription' && <Crown size={14} />}
                      {transaction.type === 'session' && <Users size={14} />}
                      {transaction.type === 'guide' && <BookOpen size={14} />}
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className={`transaction-amount ${
                      transaction.subType.includes('payment') ? 'transaction-amount--negative' : 'transaction-amount--positive'
                    }`}>
                      {transaction.subType.includes('payment') ? '-' : '+'}${transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className={`transaction-status transaction-status--${transaction.status}`}>
                      {transaction.status === 'completed' && <CheckCircle size={14} />}
                      {transaction.status === 'pending' && <Clock size={14} />}
                      {transaction.status === 'failed' && <XCircle size={14} />}
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td>{transaction.date}</td>
                  <td>{transaction.user}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTransactionModal = () => {
    if (!selectedTransaction) return null;

    return (
      <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Transaction Details</h3>
            <button className="modal-close" onClick={() => setSelectedTransaction(null)}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="transaction-details">
              <div className="detail-row">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{selectedTransaction.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{selectedTransaction.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount:</span>
                <span className="detail-value">${selectedTransaction.amount.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">{selectedTransaction.status}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{selectedTransaction.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{selectedTransaction.description}</span>
              </div>
              {selectedTransaction.user && (
                <div className="detail-row">
                  <span className="detail-label">User:</span>
                  <span className="detail-value">{selectedTransaction.user}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="finance-analytics">
      <div className="analytics-header">
        <h1 className="page-title">Financial Analytics</h1>
        <div className="header-actions">
          <Button 
            variant="secondary" 
            onClick={() => window.print()}
            className="print-btn"
          >
            <FileText size={16} />
            Print Report
          </Button>
          <Button 
            variant="primary" 
            onClick={handleExportData}
            className="export-btn"
          >
            <Download size={16} />
            Export All Data
          </Button>
        </div>
      </div>

      {renderTabNavigation()}

      <div className="analytics-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'subscriptions' && renderSubscriptions()}
        {activeTab === 'sessions' && renderSessions()}
        {activeTab === 'guides' && renderGuides()}
        {activeTab === 'transactions' && renderTransactions()}
      </div>

      {renderTransactionModal()}
    </div>
  );
};
export default FinanceAnalytics;