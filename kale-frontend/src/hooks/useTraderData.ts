import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Trader } from '../types';

// API endpoint for trader data
const API_URL = 'http://localhost:3000';

/**
 * Hook for fetching and managing trader data from the off-chain API
 */
export const useTraderData = () => {
  const [traders, setTraders] = useState<Trader[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all traders for the leaderboard
  const fetchTraders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<Trader[]>(`${API_URL}/leaderboard`);
      setTraders(response.data);
    } catch (err) {
      console.error('Error fetching trader data:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to fetch trader data. Please try again later.'
      );
      
      // Use mock data in development or when API is unavailable
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock trader data for development');
        setTraders(getMockTraders());
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch a specific trader by address
  const fetchTraderByAddress = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<Trader>(`${API_URL}/traders/${address}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching trader ${address}:`, err);
      setError(
        err instanceof Error 
          ? err.message 
          : `Failed to fetch trader ${address}. Please try again later.`
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load trader data on component mount
  useEffect(() => {
    fetchTraders();
  }, [fetchTraders]);

  // Refresh data at regular intervals (every 30 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchTraders();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchTraders]);

  return {
    traders,
    isLoading,
    error,
    fetchTraders,
    fetchTraderByAddress
  };
};

// Mock data for development or when API is unavailable
const getMockTraders = (): Trader[] => {
  return [
    {
      address: 'kale1abcdefghijklmnopqrstuvwxyz123456789',
      profit: 24.5,
      followers: 156,
      trades: 42,
      rank: 1,
      description: 'Experienced DeFi trader specializing in arbitrage strategies'
    },
    {
      address: 'kale2abcdefghijklmnopqrstuvwxyz123456789',
      profit: 18.7,
      followers: 89,
      trades: 31,
      rank: 2,
      description: 'Long-term holder with focus on fundamental analysis'
    },
    {
      address: 'kale3abcdefghijklmnopqrstuvwxyz123456789',
      profit: 15.2,
      followers: 67,
      trades: 28,
      rank: 3
    },
    {
      address: 'kale4abcdefghijklmnopqrstuvwxyz123456789',
      profit: 12.8,
      followers: 45,
      trades: 19,
      rank: 4,
      description: 'Technical analyst with 5+ years experience in crypto markets'
    },
    {
      address: 'kale5abcdefghijklmnopqrstuvwxyz123456789',
      profit: 10.3,
      followers: 34,
      trades: 15,
      rank: 5
    },
    {
      address: 'kale6abcdefghijklmnopqrstuvwxyz123456789',
      profit: 8.9,
      followers: 28,
      trades: 22,
      rank: 6,
      description: 'Swing trader focusing on market cycles and momentum'
    },
    {
      address: 'kale7abcdefghijklmnopqrstuvwxyz123456789',
      profit: 6.5,
      followers: 19,
      trades: 14,
      rank: 7
    },
    {
      address: 'kale8abcdefghijklmnopqrstuvwxyz123456789',
      profit: 4.2,
      followers: 12,
      trades: 9,
      rank: 8
    },
    {
      address: 'kale9abcdefghijklmnopqrstuvwxyz123456789',
      profit: -2.1,
      followers: 5,
      trades: 7,
      rank: 9,
      description: 'New trader learning the ropes'
    },
    {
      address: 'kale10abcdefghijklmnopqrstuvwxyz12345678',
      profit: -5.8,
      followers: 3,
      trades: 11,
      rank: 10
    }
  ];
}; 