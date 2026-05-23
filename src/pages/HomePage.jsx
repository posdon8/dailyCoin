import { useBudgets } from '../hooks/useBudgets';
import { useWallets } from '../hooks/useWallets';
import BudgetSummary from '../components/budget/BudgetSummary';
import BudgetAlerts from '../components/budget/BudgetAlerts';
import Dashboard from '../components/dashboard/Dashboard';
import { formatCurrency } from '../utils/format';

const HomePage = ({ expenses = [], budgetSummary: externalBudgetSummary }) => {
  const { summary: budgetSummary, loading: budgetLoading } = useBudgets();
  const { summary: walletSummary, loading: walletLoading } = useWallets();

  // Use external summary if provided (from App.jsx), otherwise use hook
  const currentBudgetSummary = externalBudgetSummary || budgetSummary;

  return (
    <div className="container p-3">
      {/* Budget Summary & Alerts */}
      <BudgetSummary summary={currentBudgetSummary} loading={budgetLoading} />

      {/* Budget Alerts */}
      {currentBudgetSummary?.alerts && currentBudgetSummary.alerts.length > 0 && (
        <BudgetAlerts alerts={currentBudgetSummary.alerts} onDismiss={() => {}} />
      )}

      {/* Wallet Summary */}
      {walletSummary && (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '16px',
            marginBottom: '16px',
            borderRadius: '8px',
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>💳 Tổng số dư tất cả ví</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>
            {formatCurrency(walletSummary.totalBalance)}
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
            {walletSummary.walletCount} ví • {Object.keys(walletSummary.byType || {}).length} loại
          </p>
        </div>
      )}

      {/* Main Dashboard */}
      <Dashboard expenses={expenses} />
    </div>
  );
};

export default HomePage;
