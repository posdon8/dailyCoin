import { useState } from 'react';

const ExpenseSearch = ({ onSearch, placeholder = 'Tìm kiếm chi tiêu...' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-input"
        />
        {searchTerm && (
          <button
            className="search-clear"
            onClick={handleClear}
            title="Xóa"
          >
            ✕
          </button>
        )}
      </div>

      <style>{`
        .search-container {
          margin-bottom: 16px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          font-size: 1.1rem;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 10px 12px 10px 40px !important;
          border: 1px solid #bdc3c7 !important;
          border-radius: 6px !important;
          font-size: 1rem !important;
          transition: var(--transition);
        }

        .search-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1) !important;
        }

        .search-input::placeholder {
          color: #bdc3c7;
        }

        .search-clear {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          color: #7f8c8d;
          padding: 0;
          transition: color 0.2s;
        }

        .search-clear:hover {
          color: #e74c3c;
        }

        @media (max-width: 768px) {
          .search-input {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ExpenseSearch;
