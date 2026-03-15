import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Charts({ transactions }) {
  // Prepare data for Pie Chart - Income vs Expenses
  const pieData = [
    {
      name: "Income",
      value: transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
    },
    {
      name: "Expenses",
      value: transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
    },
  ];

  // Prepare data for Bar Chart - By Category
  const categoryData = {};
  transactions.forEach((t) => {
    if (!categoryData[t.category]) {
      categoryData[t.category] = { income: 0, expense: 0 };
    }
    if (t.type === "income") {
      categoryData[t.category].income += parseFloat(t.amount || 0);
    } else {
      categoryData[t.category].expense += parseFloat(t.amount || 0);
    }
  });

  const barData = Object.keys(categoryData).map((category) => ({
    category: category.substring(0, 10), // Truncate for display
    income: categoryData[category].income,
    expense: categoryData[category].expense,
  }));

  const COLORS = {
    Income: "#28a745",
    Expenses: "#dc3545",
    income: "#28a745",
    expense: "#dc3545",
  };

  return (
    <div className="charts-container">
      <div className="chart-section">
        <h3>Income vs Expenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              <Cell fill={COLORS.Income} />
              <Cell fill={COLORS.Expenses} />
            </Pie>
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "2px solid #2d5016",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Income & Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "2px solid #2d5016",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="income" fill={COLORS.income} name="Income" />
            <Bar dataKey="expense" fill={COLORS.expense} name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Charts;
