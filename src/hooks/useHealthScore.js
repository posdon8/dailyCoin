import { useEffect, useState, useCallback } from 'react';
import {
  calculateHealthScore,
  getHealthScore,
  getHealthScoreHistory,
  chatWithFinancialAI,
} from '../services/healthApi.js';

const CACHE_KEY = 'healthScoreCache';
const CACHE_EXPIRY_KEY = 'healthScoreCacheExpiry';

/**
 * Hook for managing Financial Health Score
 */
export const useHealthScore = () => {
  const [score, setScore] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [insights, setInsights] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFromCache, setIsFromCache] = useState(false);

  // Check if cache is still valid
  const isCacheValid = useCallback(() => {
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    if (!expiry) return false;
    return new Date(expiry) > new Date();
  }, []);

  // Load from cache
  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached && isCacheValid()) {
        const data = JSON.parse(cached);
        setScore(data.score);
        setBreakdown(data.breakdown);
        setInsights(data.insights);
        setIsFromCache(true);
        console.log('[HealthScore] Loaded from cache');
        return true;
      }
    } catch (err) {
      console.error('[Cache Error]', err);
    }
    return false;
  }, [isCacheValid]);

  // Save to cache
  const saveToCache = useCallback((data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      localStorage.setItem(CACHE_EXPIRY_KEY, expiry.toISOString());
      setIsFromCache(true);
      console.log('[HealthScore] Saved to cache');
    } catch (err) {
      console.error('[Cache Save Error]', err);
    }
  }, []);

  // Fetch score from server
  const fetchScore = useCallback(async () => {
    // Try cache first
    if (loadFromCache()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getHealthScore();
      setScore(data.score);
      setBreakdown(data.breakdown);
      setInsights(data.insights);
      setIsFromCache(data.isFromCache);
      saveToCache(data);
    } catch (err) {
      // "No health score yet" is not an error - it's just initial state
      if (err.message?.includes('No health score calculated yet')) {
        console.log('[HealthScore] No score yet - user should calculate first');
        setScore(null);
        setBreakdown(null);
        setInsights([]);
        setError(null);
      } else {
        console.error('[Fetch Score Error]', err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loadFromCache, saveToCache]);

  // Calculate new score
  const recalculateScore = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('[HealthScore] Calculating new score...');
      const data = await calculateHealthScore();
      setScore(data.score);
      setBreakdown(data.breakdown);
      setInsights(data.insights);
      setIsFromCache(false);
      saveToCache(data);
      console.log('[HealthScore] Calculated:', data.score);
    } catch (err) {
      console.error('[Recalculate Error]', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [saveToCache]);

  // Fetch history
  const fetchHistory = useCallback(async () => {
    try {
      const data = await getHealthScoreHistory();
      setHistory(data.history);
    } catch (err) {
      console.error('[History Error]', err);
    }
  }, []);

  // Chat with AI
  const askAI = useCallback(async (message) => {
    setChatLoading(true);
    setError(null);

    try {
      const data = await chatWithFinancialAI(message);
      return data.response;
    } catch (err) {
      console.error('[Chat Error]', err);
      setError(err.message);
      throw err;
    } finally {
      setChatLoading(false);
    }
  }, []);

  // Load score on mount
  useEffect(() => {
    fetchScore();
  }, [fetchScore]);

  // Calculate progress to goal
  const getProgress = useCallback(() => {
    if (!score) return 0;
    const goalScore = 85;
    return Math.min(100, (score / goalScore) * 100);
  }, [score]);

  // Get score badge
  const getBadge = useCallback(() => {
    if (!score) return null;
    if (score === 100) return { name: '🏆 Perfect', color: 'gold' };
    if (score >= 90) return { name: '⭐ Expert', color: 'blue' };
    if (score >= 75) return { name: '👍 Responsible', color: 'green' };
    if (score >= 50) return { name: '📈 Developing', color: 'orange' };
    return { name: '🌱 Beginner', color: 'gray' };
  }, [score]);

  return {
    // State
    score,
    breakdown,
    insights,
    history,
    loading,
    chatLoading,
    error,
    isFromCache,

    // Methods
    fetchScore,
    recalculateScore,
    fetchHistory,
    askAI,
    getProgress,
    getBadge,
  };
};
