import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import '../../styles/pages/admin/RevenueAnalytics.scss';

interface RevenueOverview {
  total: number;
  subscriptions: { amount: number; count: number };
  services: { amount: number; count: number };
  sessions: { amount: number; count: number };
  timeRange: string;
}

interface RevenueTrend {
  date: string;
  subscriptions: number;
  services: number;
  sessions: number;
  total: number;
}

interface PaymentMethodStat {
  method: string;
  subscriptions: number;
  services: number;
  sessions: number;
  total: number;
}

interface TopUser {
  user_id: number;
  user_name: string;
  user_email: string;
  total_revenue: number;
  subscription_revenue: number;
  service_revenue: number;
  session_revenue: number;
}

interface MRRTrend {
  month: string;
  mrr: number;
  new_subscribers: number;
  churned_subscribers: number;
}

interface PaymentStatusDistribution {
  subscriptions: Record<string, number>;
  services: Record<string, number>;
  sessions: Record<string, number>;
}

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const RevenueAnalytics: React.FC = () => {
  const [overview, setOverview] = useState<RevenueOverview | null>(null);
  const [trends, setTrends] = useState<RevenueTrend[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodStat[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [mrrTrends, setMRRTrends] = useState<MRRTrend[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusDistribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [trendGroupBy, setTrendGroupBy] = useState<'day' | 'week' | 'month'>('day');

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchAllData();
  }, [timeRange, trendGroupBy]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        overviewRes,
        trendsRes,
        methodsRes,
        usersRes,
        mrrRes,
        statusRes,
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/finance/overview`).catch(err => {
          console.error('Error fetching overview:', err);
          return { data: { data: null } };
        }),
        axios.get(`${API_BASE_URL}/api/finance/revenue-trends`, {
          params: { timeRange, groupBy: trendGroupBy },
        }).catch(err => {
          console.error('Error fetching trends:', err);
          return { data: { data: [] } };
        }),
        axios.get(`${API_BASE_URL}/api/finance/payment-methods`).catch(err => {
          console.error('Error fetching payment methods:', err);
          return { data: { data: [] } };
        }),
        axios.get(`${API_BASE_URL}/api/finance/top-users`, {
          params: { limit: 10 },
        }).catch(err => {
          console.error('Error fetching top users:', err);
          return { data: { data: [] } };
        }),
        axios.get(`${API_BASE_URL}/api/finance/mrr-trends`, {
          params: { months: 12 },
        }).catch(err => {
          console.error('Error fetching MRR trends:', err);
          return { data: { data: [] } };
        }),
        axios.get(`${API_BASE_URL}/api/finance/payment-status`).catch(err => {
          console.error('Error fetching payment status:', err);
          return { data: { data: { subscriptions: {}, services: {}, sessions: {} } } };
        }),
      ]);

      setOverview(overviewRes.data.data);
      setTrends(trendsRes.data.data || []);
      setPaymentMethods(methodsRes.data.data || []);
      setTopUsers(usersRes.data.data || []);
      setMRRTrends(mrrRes.data.data || []);
      setPaymentStatus(statusRes.data.data);
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Prepare data for revenue sources pie chart
  const revenueSourceData = overview
    ? [
        { name: 'Subscriptions', value: overview.subscriptions.amount },
        { name: 'Services', value: overview.services.amount },
        { name: 'Sessions', value: overview.sessions.amount },
      ]
    : [];

  // Prepare data for payment methods pie chart
  const paymentMethodChartData = paymentMethods.map((method) => ({
    name: method.method || 'Unknown',
    value: method.total,
  }));

  // Prepare payment status data for stacked bar chart
  const prepareStatusData = () => {
    if (!paymentStatus) return [];
    
    return [
      {
        source: 'Subscriptions',
        completed: paymentStatus.subscriptions?.completed || 0,
        pending: paymentStatus.subscriptions?.pending || 0,
        failed: paymentStatus.subscriptions?.failed || 0,
        refunded: paymentStatus.subscriptions?.refunded || 0,
      },
      {
        source: 'Services',
        completed: paymentStatus.services?.completed || 0,
        pending: paymentStatus.services?.pending || 0,
        failed: paymentStatus.services?.failed || 0,
        refunded: paymentStatus.services?.refunded || 0,
      },
      {
        source: 'Sessions',
        completed: paymentStatus.sessions?.completed || 0,
        pending: paymentStatus.sessions?.pending || 0,
        failed: paymentStatus.sessions?.failed || 0,
        refunded: paymentStatus.sessions?.refunded || 0,
      },
    ];
  };

  if (loading) {
    return (
      <div className="revenue-analytics loading">
        <div className="spinner"></div>
        <p>Loading financial analytics...</p>
      </div>
    );
  }

  return (
    <div className="revenue-analytics">
      <div className="analytics-header">
        <h1>Revenue & Finance Analytics</h1>
        <div className="time-controls">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-select"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <select
            value={trendGroupBy}
            onChange={(e) => setTrendGroupBy(e.target.value as 'day' | 'week' | 'month')}
            className="time-select"
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="overview-cards">
        <div className="stat-card total-revenue">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Revenue</h3>
            <p className="amount">{formatCurrency(overview?.total || 0)}</p>
            <span className="period">{timeRange}</span>
          </div>
        </div>
        <div className="stat-card subscriptions">
          <div className="card-icon">🔄</div>
          <div className="card-content">
            <h3>Subscriptions</h3>
            <p className="amount">{formatCurrency(overview?.subscriptions.amount || 0)}</p>
            <span className="count">{overview?.subscriptions.count || 0} transactions</span>
          </div>
        </div>
        <div className="stat-card services">
          <div className="card-icon">🛠️</div>
          <div className="card-content">
            <h3>Services</h3>
            <p className="amount">{formatCurrency(overview?.services.amount || 0)}</p>
            <span className="count">{overview?.services.count || 0} bookings</span>
          </div>
        </div>
        <div className="stat-card sessions">
          <div className="card-icon">📚</div>
          <div className="card-content">
            <h3>Sessions</h3>
            <p className="amount">{formatCurrency(overview?.sessions.amount || 0)}</p>
            <span className="count">{overview?.sessions.count || 0} enrollments</span>
          </div>
        </div>
      </div>

      {/* Revenue Trends Chart */}
      <div className="chart-section">
        <div className="chart-card">
          <h2>Revenue Trends</h2>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="colorSubscriptions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorServices" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${value}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="subscriptions"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorSubscriptions)"
              />
              <Area
                type="monotone"
                dataKey="services"
                stroke="#ec4899"
                fillOpacity={1}
                fill="url(#colorServices)"
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorSessions)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Charts Row */}
      <div className="charts-row">
        <div className="chart-card half-width">
          <h2>Revenue by Source</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueSourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueSourceData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card half-width">
          <h2>Payment Methods</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethodChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MRR Trends Chart */}
      <div className="chart-section">
        <div className="chart-card">
          <h2>Monthly Recurring Revenue (MRR) Trends</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={mrrTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${value}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="mrr"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="new_subscribers"
                stroke="#10b981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="churned_subscribers"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Status Distribution */}
      <div className="chart-section">
        <div className="chart-card">
          <h2>Payment Status Distribution</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={prepareStatusData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="source" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#10b981" />
              <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
              <Bar dataKey="failed" stackId="a" fill="#ef4444" />
              <Bar dataKey="refunded" stackId="a" fill="#6b7280" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Revenue Users Table */}
      {/* <div className="table-section">
        <div className="table-card">
          <h2>Top Revenue Generating Users</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Subscriptions</th>
                  <th>Services</th>
                  <th>Sessions</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topUsers.map((user, index) => (
                  <tr key={user.user_id}>
                    <td>{index + 1}</td>
                    <td className="user-name">{user.user_name}</td>
                    <td className="user-email">{user.user_email}</td>
                    <td>{formatCurrency(user.subscription_revenue)}</td>
                    <td>{formatCurrency(user.service_revenue)}</td>
                    <td>{formatCurrency(user.session_revenue)}</td>
                    <td className="total-revenue">{formatCurrency(user.total_revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default RevenueAnalytics;
