/**
 * Health Score API Service
 */

import { API_URL } from './api.js';

const getAuthToken = () => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('dailyExpensesAuthToken');
};

const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Calculate new health score
 */
export const calculateHealthScore = async () => {
  const response = await apiCall('/health/calculate', {
    method: 'POST',
  });
  return response.data;
};

/**
 * Get current health score
 */
export const getHealthScore = async () => {
  const response = await apiCall('/health/score');
  return response.data;
};

/**
 * Get health score history (last 30 days)
 */
export const getHealthScoreHistory = async () => {
  const response = await apiCall('/health/history');
  return response.data;
};

/**
 * Chat with AI about finances
 */
export const chatWithFinancialAI = async (message) => {
  const response = await apiCall('/health/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
  return response.data;
};
