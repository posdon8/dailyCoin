import { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Notification from './components/common/Notification';
import HomePage from './pages/HomePage';
import ExpensePage from './pages/ExpensePage';
import AnalyticsPage from './pages/AnalyticsPage';
import { useExpenses } from './hooks/useExpensesAPI';
//import { useBudget } from './hooks/useBudget';
import { MESSAGES } from './utils/constants';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import './styles/globals.css';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [notification, setNotification] = useState(null);
  const {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses();

  // Hiển thị error nếu có
  useEffect(() => {
    if (error) {
      setNotification({
        message: `❌ Lỗi: ${error}`,
        type: 'danger',
      });
    }
  }, [error]);

  const handleAddExpense = async (data) => {
    try {
      await addExpense(data);
      setNotification({
        message: MESSAGES.addSuccess,
        type: 'success',
      });
    } catch (err) {
      setNotification({
        message: `❌ Lỗi: ${err.message}`,
        type: 'danger',
      });
    }
  };

  const handleUpdateExpense = async (id, data) => {
    try {
      await updateExpense(id, data);
      setNotification({
        message: MESSAGES.editSuccess,
        type: 'success',
      });
    } catch (err) {
      setNotification({
        message: `❌ Lỗi: ${err.message}`,
        type: 'danger',
      });
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setNotification({
        message: MESSAGES.deleteSuccess,
        type: 'success',
      });
    } catch (err) {
      setNotification({
        message: `❌ Lỗi: ${err.message}`,
        type: 'danger',
      });
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      <Header />

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <div className="container">
          <div className="nav-wrapper">
            <button
              className={`nav-tab ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => navigateTo('home')}
            >
              📊 Tổng quan
            </button>
            <button
              className={`nav-tab ${currentPage === 'expenses' ? 'active' : ''}`}
              onClick={() => navigateTo('expenses')}
            >
              📝 Chi tiêu
            </button>
            <button
              className={`nav-tab ${currentPage === 'analytics' ? 'active' : ''}`}
              onClick={() => navigateTo('analytics')}
            >
              📈 Phân tích
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="main-content">
        {currentPage === 'home' && <HomePage expenses={expenses} />}
        {currentPage === 'expenses' && (
          <ExpensePage
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            loading={loading}
          />
        )}
        {currentPage === 'analytics' && <AnalyticsPage expenses={expenses} />}
      </main>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Footer />

      <style>{`
        .app {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .nav-tabs {
          background-color: white;
          border-bottom: 1px solid #ecf0f1;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-wrapper {
          display: flex;
          gap: 0;
          border-bottom: 2px solid transparent;
        }

        .nav-tab {
          flex: 1;
          padding: 12px 16px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 500;
          color: #7f8c8d;
          transition: var(--transition);
          font-size: 1rem;
        }

        .nav-tab:hover {
          color: var(--primary);
          background-color: #f8f9fa;
        }

        .nav-tab.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
          background-color: rgba(52, 152, 219, 0.02);
        }

        .main-content {
          flex: 1;
          padding: 20px 0;
        }

        @media (max-width: 768px) {
          .nav-tab {
            padding: 10px 12px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;
