import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (!description || !amount) return;

    if (editingId) {
      setTransactions(
        transactions.map((t) =>
          t.id === editingId
            ? {
                ...t,
                description,
                amount: Number(amount),
                type,
                category,
                date,
              }
            : t
        )
      );

      setEditingId(null);
    } else {
      const newTransaction = {
        id: Date.now(),
        description,
        amount: Number(amount),
        type,
        category,
        date,
      };

      setTransactions([...transactions, newTransaction]);
    }

    setDescription("");
    setAmount("");
    setType("income");
    setCategory("Food");
    setDate("");
  };

  const deleteTransaction = (id) => {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
  };

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  const chartData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "42px",
          marginBottom: "30px",
        }}
      >
        💰 Personal Budget Tracker
      </h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <Card title="💵 Income" value={income} color="#22c55e" />
        <Card title="📉 Expense" value={expense} color="#ef4444" />
        <Card title="🏦 Balance" value={balance} color="#3b82f6" />
      </div>

      <div
        style={{
          background: "#0f172a",
          padding: "25px",
          borderRadius: "15px",
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        <h2>Add Transaction</h2>

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Salary</option>
          <option>Freelance</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={inputStyle}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <button
          onClick={addTransaction}
          style={{
            width: "100%",
            padding: "12px",
            background: editingId ? "#3b82f6" : "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {editingId ? "Update Transaction" : "Add Transaction"}
        </button>
      </div>

      <div
        style={{
          marginTop: "40px",
          background: "#0f172a",
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <h2>Transactions</h2>

        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
                padding: "15px",
                background: "#1e293b",
                borderRadius: "10px",
              }}
            >
              <div>
                <div style={{ fontWeight: "bold" }}>
                  {transaction.description}
                </div>

                <div>
                  ₹{transaction.amount} • {transaction.category}
                </div>

                <small>{transaction.date}</small>
              </div>

              <div>
                <button
                  onClick={() => {
                    setDescription(transaction.description);
                    setAmount(transaction.amount);
                    setType(transaction.type);
                    setCategory(transaction.category);
                    setDate(transaction.date);
                    setEditingId(transaction.id);
                  }}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    marginRight: "8px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTransaction(transaction.id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          marginTop: "40px",
          background: "#0f172a",
          padding: "20px",
          borderRadius: "15px",
          height: "400px",
        }}
      >
        <h2>Income vs Expense</h2>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              outerRadius={130}
            >
              <Cell fill="#22c55e" />
              <Cell fill="#ef4444" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: "25px",
        borderRadius: "15px",
        width: "220px",
        textAlign: "center",
        borderTop: `4px solid ${color}`,
      }}
    >
      <h3>{title}</h3>
      <h2 style={{ color }}>{value >= 0 ? `₹${value}` : `-₹${Math.abs(value)}`}</h2>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #334155",
};

export default App;