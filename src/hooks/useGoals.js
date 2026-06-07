import { useState, useEffect } from 'react';
import { API_URL } from '../services/api';

export const useGoals = (isAuthenticated = true) => {
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all goals
  const loadGoals = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/goals`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to load goals');

      const data = await response.json();
      setGoals(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading goals:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load goal statistics
  const loadStats = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`${API_URL}/goals/stats`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to load stats');

      const data = await response.json();
      setStats(data.data || null);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  // Create goal
  const createGoal = async (goalData) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to create goal');

      const data = await response.json();
      setGoals([...goals, data.data]);
      await loadStats();
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating goal:', err);
      throw err;
    }
  };

  // Update goal
  const updateGoal = async (id, updates) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to update goal');

      const data = await response.json();
      setGoals(goals.map(g => g._id === id ? data.data : g));
      await loadStats();
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating goal:', err);
      throw err;
    }
  };

  // Delete goal
  const deleteGoal = async (id) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete goal');

      setGoals(goals.filter(g => g._id !== id));
      await loadStats();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting goal:', err);
      throw err;
    }
  };

  // Add amount to goal
  const addAmount = async (id, amount) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/goals/${id}/add-amount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to add amount');

      const data = await response.json();
      setGoals(goals.map(g => g._id === id ? data.data : g));
      await loadStats();
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error adding amount:', err);
      throw err;
    }
  };

  // Load goals on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadGoals();
      loadStats();
    }
  }, [isAuthenticated]);

  return {
    goals,
    stats,
    loading,
    error,
    loadGoals,
    loadStats,
    createGoal,
    updateGoal,
    deleteGoal,
    addAmount,
  };
};
