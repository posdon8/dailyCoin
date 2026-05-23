import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import ExpenseForm from '../components/expense/ExpenseForm';
import ExpenseList from '../components/expense/ExpenseList';
import ExpenseFilter from '../components/expense/ExpenseFilter';
import ExpenseSearch from '../components/expense/ExpenseSearch';

const ExpensePage = ({ expenses, onAddExpense, onUpdateExpense, onDeleteExpense, loading = false }) => {
  const { showNotification } = useNotification();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Filter expenses
  let filtered = expenses;

  if (selectedCategory) {
    filtered = filtered.filter((exp) => exp.category === selectedCategory);
  }

  if (searchTerm) {
    filtered = filtered.filter((exp) =>
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  // Sort by date (newest first)
  filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleEditClick = (expense) => {
    setEditingId(expense.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = (formData) => {
    if (editingId) {
      onUpdateExpense(editingId, formData);
      setEditingId(null);
    } else {
      onAddExpense(formData);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const editingExpense = editingId ? expenses.find((e) => e.id === editingId) : null;

  return (
    <div className="container p-3">
      <ExpenseForm
        key={editingId || 'new'}
        onSubmit={handleFormSubmit}
        initialData={editingExpense || undefined}
        isEditing={!!editingId}
        onNotification={showNotification}
      />

      {editingId && (
        <div className="alert alert-info mb-2">
          <span>✎ Đang chỉnh sửa chi tiêu. </span>
          <button
            onClick={handleCancelEdit}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Hủy
          </button>
        </div>
      )}

      <ExpenseSearch onSearch={setSearchTerm} />

      <ExpenseFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <ExpenseList
        expenses={filtered}
        onDelete={onDeleteExpense}
        onEdit={handleEditClick}
        loading={loading}
      />
    </div>
  );
};

export default ExpensePage;
