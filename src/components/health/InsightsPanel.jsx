import React from 'react';
import './InsightsPanel.css';

/**
 * InsightsPanel - Displays AI-generated insights
 */
const InsightsPanel = ({ insights, breakdown }) => {
  const getIcon = (category) => {
    switch (category) {
      case 'positive':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'action':
        return '💡';
      default:
        return '📌';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'positive':
        return 'Positive';
      case 'warning':
        return 'Warning';
      case 'action':
        return 'Action Item';
      default:
        return 'Insight';
    }
  };

  return (
    <div className="insights-panel">
      <h3 className="insights-title">📊 Your Insights</h3>

      {/* Insights List */}
      <div className="insights-list">
        {insights && insights.length > 0 ? (
          insights.map((insight, idx) => (
            <div
              key={idx}
              className={`insight-card insight-${insight.category}`}
            >
              <div className="insight-header">
                <span className="insight-icon">{getIcon(insight.category)}</span>
                <h4 className="insight-title">{insight.title}</h4>
                <span className="insight-label">
                  {getCategoryLabel(insight.category)}
                </span>
              </div>
              <p className="insight-text">{insight.text}</p>
              {insight.metric && (
                <span className="insight-metric">🎯 {insight.metric}</span>
              )}
            </div>
          ))
        ) : (
          <p className="no-insights">
            No insights yet. Calculate your score to see recommendations.
          </p>
        )}
      </div>

      {/* Metrics Breakdown */}
      {breakdown && (
        <div className="metrics-breakdown">
          <h4>📈 Score Breakdown</h4>
          <div className="metrics-grid">
            {Object.entries(breakdown).map(([key, value]) => (
              <div key={key} className="metric-item">
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{
                      width: `${(value / getMaxValue(key)) * 100}%`,
                    }}
                  />
                </div>
                <div className="metric-info">
                  <span className="metric-name">{formatMetricName(key)}</span>
                  <span className="metric-value">
                    {Math.round(value)}/{getMaxValue(key)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const getMaxValue = (metric) => {
  const maxValues = {
    expenseControl: 25,
    savingsRate: 20,
    categoryBalance: 20,
    trendAnalysis: 20,
    budgetAdherence: 15,
  };
  return maxValues[metric] || 25;
};

const formatMetricName = (metric) => {
  const names = {
    expenseControl: 'Expense Control',
    savingsRate: 'Savings Rate',
    categoryBalance: 'Category Balance',
    trendAnalysis: 'Trend Analysis',
    budgetAdherence: 'Budget Adherence',
  };
  return names[metric] || metric;
};

export default InsightsPanel;
