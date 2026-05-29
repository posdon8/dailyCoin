import { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Notification from './components/common/Notification';
import HomePage from './pages/HomePage';
import ExpensePage from './pages/ExpensePage';
import AnalyticsPage from './pages/AnalyticsPage';
import BudgetPage from './pages/BudgetPage';
import WalletPage from './pages/WalletPage';
import AttachmentPage from './pages/AttachmentPage';
import HealthScorePage from './pages/HealthScorePage';
import { useExpenses } from './hooks/useExpensesAPI';
import { useBudgets } from './hooks/useBudgets';
import { useWallets } from './hooks/useWallets';
import { useAttachments } from './hooks/useAttachments';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import { MESSAGES } from './utils/constants';
import { NotificationProvider } from './context/NotificationContext';
import './styles/globals.css';

const AppContent = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [currentPage, setCurrentPage] = useState('home');
  const [notification, setNotification] = useState(null);
  const auth = useAuth();

  const {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses(auth.isAuthenticated);

  // Hiển thị error nếu có
  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => {
      setNotification({
        message: `❌ Lỗi: ${error}`,
        type: 'danger',
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [error]);
  const {
  budgets,
  summary: budgetSummary,
  loading: budgetLoading,
  loadBudgets,
  loadBudgetSummary,
  saveBudget,
  deleteBudget,
  getWarnings,
} = useBudgets();

const {
  wallets,
  summary: walletSummary,
  loading: walletLoading,
  loadWallets,
  loadWalletsSummary,
  createWallet,
  updateWallet,
  deleteWallet,
} = useWallets(auth.isAuthenticated); // tự load trong useEffect rồi

const {
  loadAttachments,
  uploadAttachment,
  deleteAttachment,
  getAttachmentsByExpense,
} = useAttachments();

const handleLogin = async (email, password) => {
  try {
    await auth.login(email, password);
    setNotification({ message: '✅ Đăng nhập thành công', type: 'success' });
  } catch (err) {
    setNotification({ message: `❌ Lỗi: ${err.message}`, type: 'danger' });
    throw err;
  }
};

const handleRegister = async (name, email, password) => {
  try {
    await auth.register(email, password, name);
    setNotification({ message: '✅ Đăng ký thành công', type: 'success' });
  } catch (err) {
    setNotification({ message: `❌ Lỗi: ${err.message}`, type: 'danger' });
    throw err;
  }
};

// Load budget khi đổi tháng/năm và khi người dùng đăng nhập
useEffect(() => {
  if (auth.isAuthenticated) {
    loadBudgets(selectedMonth, selectedYear);
    loadBudgetSummary(selectedMonth, selectedYear);
  }
}, [selectedMonth, selectedYear, auth.isAuthenticated]);

// Cảnh báo budget
useEffect(() => {
  const warnings = getWarnings();
  if (warnings.length > 0) {
    const exceeded = warnings.filter(w => w.type === 'exceeded');
    if (exceeded.length > 0) {
        const timer = window.setTimeout(() => {
          setNotification({
            message: `🚨 Vượt ngân sách: ${exceeded.map(w => w.category).join(', ')}`,
            type: 'danger',
          });
        }, 0);
        return () => window.clearTimeout(timer);
      }
    }
  }, [budgetSummary]);

if (!auth.isAuthenticated) {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <AuthPage
          onLogin={handleLogin}
          onRegister={handleRegister}
          loading={auth.loading}
          authError={auth.error}
        />
      </main>
      <Footer />
    </div>
  );
}

const handleAddExpense = async (data) => {
    try {
      await addExpense(data);
      setNotification({
        message: MESSAGES.addSuccess,
        type: 'success',
      });
      await loadBudgetSummary(selectedMonth, selectedYear);
      await loadWallets();
      await loadWalletsSummary();
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
      await loadBudgetSummary(selectedMonth, selectedYear);
      await loadWallets();
      await loadWalletsSummary();
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
      await loadBudgetSummary(selectedMonth, selectedYear);
      await loadWallets();
      await loadWalletsSummary();
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
      <div className="auth-bar">
        <div className="container">
          <div className="auth-status">
            <span>Xin chào, {auth.user?.email}</span>
            <button className="btn btn-secondary" onClick={() => { auth.logout(); setCurrentPage('home'); setNotification({ message: '✅ Đã đăng xuất', type: 'success' }); }}>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

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
            <button
              className={`nav-tab ${currentPage === 'budget' ? 'active' : ''}`}
              onClick={() => navigateTo('budget')}
            >
              📊 Ngân sách
            </button>
            <button
              className={`nav-tab ${currentPage === 'wallet' ? 'active' : ''}`}
              onClick={() => navigateTo('wallet')}
            >
              💰 Ví tiền
            </button>
            <button
              className={`nav-tab ${currentPage === 'attachments' ? 'active' : ''}`}
              onClick={() => navigateTo('attachments')}
            >
              📎 Đính kèm
            </button>
            <button onClick={() => setCurrentPage('health')}>💰 Financial Health</button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {/* ✅ ĐÚNG - chỉ 1 main duy nhất */}
<main className="main-content">
  {currentPage === 'home' && <HomePage expenses={expenses} budgetSummary={budgetSummary} />}
  {currentPage === 'expenses' && (
    <ExpensePage
      expenses={expenses}
      onAddExpense={handleAddExpense}
      onUpdateExpense={handleUpdateExpense}
      onDeleteExpense={handleDeleteExpense}
      loading={loading}
    />
  )}
  {currentPage === 'health' && <HealthScorePage />}

  {currentPage === 'analytics' && <AnalyticsPage expenses={expenses} />}
  {currentPage === 'budget' && (
    <BudgetPage
      budgets={budgets}
      summary={budgetSummary}
      loading={budgetLoading}
      selectedMonth={selectedMonth}
      selectedYear={selectedYear}
      onMonthChange={setSelectedMonth}
      onYearChange={setSelectedYear}
      onSaveBudget={async (category, limit, notes) => {
        await saveBudget(category, limit, selectedMonth, selectedYear, notes);
        setNotification({ message: '✅ Lưu ngân sách thành công', type: 'success' });
        loadBudgets(selectedMonth, selectedYear);
        loadBudgetSummary(selectedMonth, selectedYear);
      }}
      onDeleteBudget={async (id) => {
        await deleteBudget(id);
        setNotification({ message: '🗑️ Đã xóa ngân sách', type: 'success' });
      }}
    />
  )}
  {currentPage === 'wallet' && (
    <WalletPage
      wallets={wallets}
      summary={walletSummary}
      loading={walletLoading}
      onCreateWallet={createWallet}
      onUpdateWallet={updateWallet}
      onDeleteWallet={deleteWallet}
    />
  )}
  {currentPage === 'attachments' && (
    <AttachmentPage
      expenses={expenses}
      onLoadAttachments={loadAttachments}
      onUpload={uploadAttachment}
      onDelete={deleteAttachment}
      getAttachmentsByExpense={getAttachmentsByExpense}
    />
  )}
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

        .auth-bar {
          background-color: #fff;
          border-bottom: 1px solid #ecf0f1;
          padding: 12px 0;
        }

        .auth-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .auth-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 100px);
          padding: 40px 16px;
          background: #f4f7fb;
        }

        .auth-box {
          width: min(520px, 100%);
          background: #fff;
          border: 1px solid #e6eaef;
          border-radius: 14px;
          padding: 28px;
          box-shadow: 0 16px 40px rgba(16, 44, 88, 0.05);
        }

        .auth-error {
          margin-bottom: 18px;
          color: #c0392b;
          background: #fdecea;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 12px 14px;
        }

        .auth-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          gap: 12px;
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
