import React, { useState } from "react";
import Dashboard from "../finanse/src/components/Dashboard";
import AddTransaction from "../finanse/src/components/AddTransaction";
import TransactionList from "../finanse/src/components/TransactionList";
import Charts from "../finanse/src/components/Charts";
import "../finanse/src/App.css";

function App() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: "2025-10-27",
      type: "income",
      category: "Crop Sale",
      amount: "15000",
      description: "rice sale",
    },
    {
      id: 2,
      date: "2025-10-27",
      type: "expense",
      category: "Other Income",
      amount: "5000",
      description: "travelling expenses",
    },
    {
      id: 3,
      date: "2025-10-27",
      type: "income",
      category: "Government Subsidy",
      amount: "100000",
      description: "subsidy",
    },
  ]);

  const [editingTransaction, setEditingTransaction] = useState(null);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now() }]);
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions(
      transactions.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      )
    );
    setEditingTransaction(null);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="App">
      <h1>Financial Management System</h1>
      <Dashboard
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
      />
      <Charts transactions={transactions} />
      <div className="main-container">
        <AddTransaction
          addTransaction={addTransaction}
          updateTransaction={updateTransaction}
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
        />
        <TransactionList
          transactions={transactions}
          setEditingTransaction={setEditingTransaction}
        />
      </div>
    </div>
  );
}

export default App;
