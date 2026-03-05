import React, { useState, useEffect } from "react";
// id: 0
function AddTransaction({ addTransaction, updateTransaction, editingTransaction, setEditingTransaction }) {
  const [formData, setFormData] = useState({
    type: "income",
    category: "Crop Sale",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const incomeCategories = ["Crop Sale", "Government Subsidy", "Other Income"];
  const expenseCategories = ["Other Income", "Expenses", "Travel"];
  const categories =
    formData.type === "income" ? incomeCategories : expenseCategories;

  useEffect(() => {
    if (editingTransaction) {
      setFormData(editingTransaction);
    } else {
      setFormData({
        type: "income",
        category: "Crop Sale",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount || !formData.date) {
      alert("Please fill in all required fields");
      return;
    }
    if (editingTransaction) {
      updateTransaction(formData);
    } else {
      addTransaction(formData);
    }
    setFormData({
      type: "income",
      category: "Crop Sale",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
  };

  const handleCancel = () => {
    setEditingTransaction(null);
  };


  return (
    <div className="add-transaction">
      <h2>{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type</label>
          <select name="type" value={formData.type} onChange={handleChange} style={{ color: 'black' }}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ color: 'black' }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            placeholder="0"
            required
            style={{ color: 'black' }}
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{ color: 'black' }}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description"
            rows="3"
            style={{ color: 'black' }}
          />
        </div>
        <div className="form-actions">
          <button type="submit" style={{ backgroundColor: 'green', color: 'white' }}>{editingTransaction ? "Update" : "Add"} Transaction</button>
          {editingTransaction && (
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddTransaction;
