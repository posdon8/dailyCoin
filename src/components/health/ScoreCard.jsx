import React from 'react';
import './ScoreCard.css';

/**
 * ScoreCard - Displays the financial health score
 */
const ScoreCard = ({ score, badge, progress, loading, onRecalculate }) => {
  if (loading && !score) {
    return (
      <div className="score-card loading">
        <p>計算中...</p>
      </div>
    );
  }

  return (
    <div className="score-card">
      {/* Score Circle */}
      <div className="score-circle">
        <svg viewBox="0 0 100 100" className="progress-ring-svg">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeDasharray={`${(progress / 100) * 283} 283`}
            strokeLinecap="round"
            className="progress-ring"
          />
          <defs>
            <linearGradient
              id="scoreGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#4CAF50" />
              <stop offset="100%" stopColor="#45a049" />
            </linearGradient>
          </defs>
        </svg>
        <div className="score-display">
          <span className="score-number">{score}</span>
          <span className="score-total">/100</span>
        </div>
      </div>

      {/* Badge & Info */}
      <div className="score-info">
        <div className="badge" style={{ backgroundColor: getBadgeColor(badge?.color) }}>
          {badge?.name}
        </div>
        <p className="progress-text">
          {score >= 85 ? '🎉 Excelente! Seu score está ótimo!' : 
           score >= 75 ? '👍 Bom progresso! Você está no caminho certo.' : 
           score >= 50 ? '📈 Continua assim! Há espaço para melhorar.' :
           '🌱 Comece agora! Você vai melhorar em breve.'}
        </p>
      </div>

      {/* Action Button */}
      <button
        className="btn btn-primary recalculate-btn"
        onClick={onRecalculate}
        disabled={loading}
      >
        {loading ? '⏳ Recalculando...' : '🔄 Recalcular Agora'}
      </button>
    </div>
  );
};

const getBadgeColor = (color) => {
  const colors = {
    gold: '#FFD700',
    blue: '#2196F3',
    green: '#4CAF50',
    orange: '#FF9800',
    gray: '#9E9E9E',
  };
  return colors[color] || '#2196F3';
};

export default ScoreCard;
