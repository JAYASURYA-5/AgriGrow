import React from "react";

function Dashboard({ totalIncome, totalExpenses, netProfit }) {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="summary">
        <div className="card income">
          <h3>Total Income</h3>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
        <div className="card expenses">
          <h3>Total Expenses</h3>
          <p>${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="card profit">
          <h3>Net Profit</h3>
          <p>${netProfit.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
