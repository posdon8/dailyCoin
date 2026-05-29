import React from 'react';
import ScoreCard from './ScoreCard';
import InsightsPanel from './InsightsPanel';
import FinancialChatBox from './FinancialChatBox';
import { useHealthScore } from '../../hooks/useHealthScore';
import './HealthScoreDashboard.css';

/**
 * HealthScoreDashboard - Main Financial Health Score page
 */
const HealthScoreDashboard = () => {
  const {
    score,
    breakdown,
    insights,
    loading,
    chatLoading,
    error,
    recalculateScore,
    askAI,
    getProgress,
    getBadge,
  } = useHealthScore();

  return (
    <div className="health-score-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>💰 Financial Health Score</h1>
            <p className="header-subtitle">
              Track your financial wellness and get personalized advice
            </p>
          </div>
          {score && !loading && (
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-label">Current Score</span>
                <span className="stat-value">{score}/100</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Progress</span>
                <span className="stat-value">{Math.round(getProgress())}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Empty State - No Score Yet */}
          {!score && !loading && !error && (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h2>Get Your Financial Health Score</h2>
              <p>
                Start by calculating your financial health score. We'll analyze your expenses,
                savings, and budget adherence to give you actionable insights.
              </p>
              <button 
                className="calculate-button"
                onClick={recalculateScore}
              >
                🚀 Calculate Your Score Now
              </button>
              <div className="empty-state-info">
                <div className="info-item">
                  <span className="info-icon">✨</span>
                  <p>Get personalized insights based on your spending</p>
                </div>
                <div className="info-item">
                  <span className="info-icon">💬</span>
                  <p>Chat with AI financial advisor</p>
                </div>
                <div className="info-item">
                  <span className="info-icon">📈</span>
                  <p>Track your progress over time</p>
                </div>
              </div>
            </div>
          )}

          {/* Score Card */}
          {(score || loading) && (
            <div className="score-section">
              <ScoreCard
                score={score}
                badge={getBadge()}
                progress={getProgress()}
                loading={loading}
                onRecalculate={recalculateScore}
              />
            </div>
          )}

          {/* Insights Panel */}
          {score && (
            <div className="insights-section">
              <InsightsPanel insights={insights} breakdown={breakdown} />
            </div>
          )}

          {/* Info Cards */}
          {score && breakdown && (
            <div className="info-cards">
              <div className="info-card">
                <h4>💡 About Your Score</h4>
                <p>
                  Your Financial Health Score is calculated based on 5 key metrics:
                </p>
                <ul>
                  <li>
                    <strong>Expense Control:</strong> How well you manage spending
                  </li>
                  <li>
                    <strong>Savings Rate:</strong> Percentage of income saved
                  </li>
                  <li>
                    <strong>Category Balance:</strong> Diversity in spending
                  </li>
                  <li>
                    <strong>Trend Analysis:</strong> Monthly spending changes
                  </li>
                  <li>
                    <strong>Budget Adherence:</strong> How close you stick to budget
                  </li>
                </ul>
              </div>

              <div className="info-card">
                <h4>🎯 Score Ranges</h4>
                <div className="score-ranges">
                  <div className="range-item">
                    <span className="range-score">90-100</span>
                    <span className="range-label">⭐ Expert</span>
                  </div>
                  <div className="range-item">
                    <span className="range-score">75-89</span>
                    <span className="range-label">👍 Responsible</span>
                  </div>
                  <div className="range-item">
                    <span className="range-score">50-74</span>
                    <span className="range-label">📈 Developing</span>
                  </div>
                  <div className="range-item">
                    <span className="range-score">0-49</span>
                    <span className="range-label">🌱 Beginner</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Box */}
      <FinancialChatBox onChat={askAI} loading={chatLoading} score={score} />
    </div>
  );
};

export default HealthScoreDashboard;
