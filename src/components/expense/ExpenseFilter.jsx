import { EXPENSE_CATEGORIES } from '../../utils/constants';

const ExpenseFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="filter-container">
      <div className="filter-label">
        <span>🏷️ Lọc theo danh mục:</span>
      </div>
      <div className="filter-buttons">
        <button
          className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onCategoryChange(null)}
        >
          Tất cả
        </button>
        {Object.values(EXPENSE_CATEGORIES).map((category) => (
          <button
            key={category.id}
            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
            style={{
              borderLeftColor: selectedCategory === category.id ? category.color : 'transparent',
            }}
          >
            {category.icon} {category.label.split(' ')[1]}
          </button>
        ))}
      </div>

      <style>{`
        .filter-container {
          background: white;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: var(--shadow);
        }

        .filter-label {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-weight: 500;
          color: var(--text);
        }

        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-btn {
          padding: 8px 16px;
          border: 1px solid #bdc3c7;
          border-left: 4px solid transparent;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .filter-btn:hover {
          background-color: #f8f9fa;
          border-color: #3498db;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        @media (max-width: 768px) {
          .filter-buttons {
            gap: 6px;
          }

          .filter-btn {
            padding: 6px 12px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ExpenseFilter;
