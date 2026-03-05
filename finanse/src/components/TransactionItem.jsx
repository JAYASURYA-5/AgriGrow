import React from "react";

function TransactionItem({ transaction, setEditingTransaction }) {
  const isIncome = transaction.type === "income";
  const badgeClass = isIncome ? "badge badge-income" : "badge badge-expense";
  const amountClass = isIncome
    ? "amount amount-income"
    : "amount amount-expense";
  const amountSign = isIncome ? "+" : "-";
  const formattedDate = new Date(transaction.date).toLocaleDateString("en-CA");

  return (
    <tr>
      <td>{formattedDate}</td>
      <td>
        <span className={badgeClass} style={{ backgroundColor: isIncome ? 'green' : 'red', color: 'white' }}>{isIncome ? "Income" : "Expense"}</span>
      </td>
      <td>{transaction.category}</td>
      <td className={amountClass}>
        {amountSign}₹
        {parseFloat(transaction.amount).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
      <td>{transaction.description}</td>
      <td>
        <button
          className="edit-btn"
          onClick={() => setEditingTransaction(transaction)}
        >
          Edit
        </button>
      </td>
    </tr>
  );
}

export default TransactionItem;
