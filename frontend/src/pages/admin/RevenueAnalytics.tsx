import React, { useEffect, useState } from "react";
import axios from "axios";
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
} from "recharts";
import * as ProviderPaymentsService from "../../services/providerPayments.service";
import type { ProviderPayment } from "../../services/providerPayments.service";
import "../../styles/pages/admin/RevenueAnalytics.scss";

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

const COLORS = [
  "#8b5cf6",
  "#ec4899",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

const RevenueAnalytics: React.FC = () => {
  const [overview, setOverview] = useState<RevenueOverview | null>(null);
  const [trends, setTrends] = useState<RevenueTrend[]>([]);
  // @ts-ignore - topUsers is set but used in commented section
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [mrrTrends, setMRRTrends] = useState<MRRTrend[]>([]);
  const [providerPayments, setProviderPayments] = useState<ProviderPayment[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [trendGroupBy, setTrendGroupBy] = useState<"day" | "week" | "month">(
    "day"
  );

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchAllData();
  }, [timeRange, trendGroupBy]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [overviewRes, trendsRes, usersRes, mrrRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/finance/overview`).catch((err) => {
          console.error("Error fetching overview:", err);
          return { data: { data: null } };
        }),
        axios
          .get(`${API_BASE_URL}/api/finance/revenue-trends`, {
            params: { timeRange, groupBy: trendGroupBy },
          })
          .catch((err) => {
            console.error("Error fetching trends:", err);
            return { data: { data: [] } };
          }),
        axios
          .get(`${API_BASE_URL}/api/finance/top-users`, {
            params: { limit: 10 },
          })
          .catch((err) => {
            console.error("Error fetching top users:", err);
            return { data: { data: [] } };
          }),
        axios
          .get(`${API_BASE_URL}/api/finance/mrr-trends`, {
            params: { months: 12 },
          })
          .catch((err) => {
            console.error("Error fetching MRR trends:", err);
            return { data: { data: [] } };
          }),
      ]);

      setOverview(overviewRes.data.data);
      setTrends(trendsRes.data.data || []);
      setTopUsers(usersRes.data.data || []);
      setMRRTrends(mrrRes.data.data || []);

      // Fetch provider payments data
      try {
        const payments = await ProviderPaymentsService.getProviderPayments();
        setProviderPayments(payments);
      } catch (err) {
        console.error("Error fetching provider payments:", err);
      }
    } catch (error) {
      console.error("Error fetching finance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Prepare data for revenue sources pie chart
  const revenueSourceData = overview
    ? [
        { name: "Subscriptions", value: overview.subscriptions.amount },
        { name: "Services", value: overview.services.amount },
        { name: "Sessions", value: overview.sessions.amount },
      ]
    : [];

  // Prepare provider payments data for pie chart (payment status distribution)
  const prepareProviderPaymentsPieData = () => {
    const statusCount: Record<string, number> = {};

    providerPayments.forEach((payment) => {
      const status = payment.payment_status || "unknown";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  };

  // Prepare provider payments data for bar chart (by provider type and status)
  const prepareProviderPaymentsBarData = () => {
    const guideData: Record<string, number> = {
      pending: 0,
      paid: 0,
      processing: 0,
      failed: 0,
    };
    const influencerData: Record<string, number> = {
      pending: 0,
      paid: 0,
      processing: 0,
      failed: 0,
    };

    providerPayments.forEach((payment) => {
      const status = payment.payment_status || "pending";
      const type = payment.provider_type;

      if (type === "guide") {
        guideData[status] = (guideData[status] || 0) + 1;
      } else if (type === "influencer") {
        influencerData[status] = (influencerData[status] || 0) + 1;
      }
    });

    return [
      {
        type: "Guide",
        pending: guideData.pending,
        paid: guideData.paid,
        processing: guideData.processing || 0,
        failed: guideData.failed || 0,
      },
      {
        type: "Influencer",
        pending: influencerData.pending,
        paid: influencerData.paid,
        processing: influencerData.processing || 0,
        failed: influencerData.failed || 0,
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
            onChange={(e) =>
              setTrendGroupBy(e.target.value as "day" | "week" | "month")
            }
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
            <p className="amount">
              {formatCurrency(overview?.subscriptions.amount || 0)}
            </p>
            <span className="count">
              {overview?.subscriptions.count || 0} transactions
            </span>
          </div>
        </div>
        <div className="stat-card services">
          <div className="card-icon">🛠️</div>
          <div className="card-content">
            <h3>Services</h3>
            <p className="amount">
              {formatCurrency(overview?.services.amount || 0)}
            </p>
            <span className="count">
              {overview?.services.count || 0} bookings
            </span>
          </div>
        </div>
        <div className="stat-card sessions">
          <div className="card-icon">📚</div>
          <div className="card-content">
            <h3>Sessions</h3>
            <p className="amount">
              {formatCurrency(overview?.sessions.amount || 0)}
            </p>
            <span className="count">
              {overview?.sessions.count || 0} enrollments
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Trends Chart */}
      <div className="chart-section">
        <div className="chart-card">
          <h2>Revenue Trends</h2>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={trends}>
              <defs>
                <linearGradient
                  id="colorSubscriptions"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorServices" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${value}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
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
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={revenueSourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label={(entry: any) =>
                  `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={85}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueSourceData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card half-width">
          <h2>Provider Payments Status</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={prepareProviderPaymentsPieData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label={(entry: any) =>
                  `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={85}
                fill="#8884d8"
                dataKey="value"
              >
                {prepareProviderPaymentsPieData().map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MRR Trends Chart */}
      <div className="chart-section">
        <div className="chart-card">
          <h2>Monthly Recurring Revenue (MRR) Trends</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={mrrTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${value}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
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

      {/* Provider Payments Status Distribution by Type */}
      <div className="chart-section">
        <div className="chart-card">
          <h2>Provider Payments Distribution by Type</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={prepareProviderPaymentsBarData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="type" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="paid" stackId="a" fill="#10b981" name="Paid" />
              <Bar
                dataKey="pending"
                stackId="a"
                fill="#f59e0b"
                name="Pending"
              />
              <Bar
                dataKey="processing"
                stackId="a"
                fill="#3b82f6"
                name="Processing"
              />
              <Bar dataKey="failed" stackId="a" fill="#ef4444" name="Failed" />
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
