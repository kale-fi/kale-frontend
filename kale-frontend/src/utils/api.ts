import axios from 'axios';
import { Trader, Pool, Reward } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const getLeaderboard = async (): Promise<Trader[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leaderboard`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    throw error;
  }
};

export const getTrader = async (address: string): Promise<Trader> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/trader/${address}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch trader ${address}:`, error);
    throw error;
  }
};

export const getPools = async (): Promise<Pool[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pools`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pools:', error);
    throw error;
  }
};

export const getRewards = async (address: string): Promise<Reward[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rewards/${address}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch rewards for ${address}:`, error);
    throw error;
  }
}; 