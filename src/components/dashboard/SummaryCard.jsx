import { formatCurrency } from '../../utils/format';

const SummaryCard = ({ title, amount, icon = '💰', color = '#3498db' }) => {
  return (
    <div className="summary-card" style={{ borderLeftColor: color }}>
      <div className="card-icon">{icon}</div>
      <div className="card-info">
        <p className="card-title">{title}</p>
        <p className="card-amount">{formatCurrency(amount)}</p>
      </div>

      <style>{`
        .summary-card {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: var(--shadow);
          border-left: 4px solid;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: var(--transition);
        }

        .summary-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .card-icon {
          font-size: 1.5rem;
          min-width: 40px;
          text-align: center;
        }

        .card-info {
          flex: 1;
        }

        .card-title {
          margin: 0;
          font-size: 0.875rem;
          color: #7f8c8d;
          font-weight: 500;
        }

        .card-amount {
          margin: 4px 0 0 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
        }

        @media (max-width: 768px) {
          .summary-card {
            padding: 12px;
          }

          .card-amount {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SummaryCard;
