import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Leaderboard from '../src/components/Leaderboard';
import { Trader, PaginationResponse } from '../src/types';

// Mock the useTraderData hook
jest.mock('../src/hooks/useTraderData', () => ({
  useTraderData: jest.fn(),
}));

// Import the mocked hook
import { useTraderData } from '../src/hooks/useTraderData';

describe('Leaderboard Component', () => {
  // Sample traders data for testing
  const mockTraders: Trader[] = [
    {
      address: 'kale1abc123def456',
      profit: 5000,
      followers: 120,
      displayName: 'Trader Alpha',
      rank: 1,
      successRate: 78.5,
      joinedAt: '2023-01-15T12:00:00Z',
    },
    {
      address: 'kale1ghi789jkl012',
      profit: 8500,
      followers: 250,
      displayName: 'Trader Beta',
      rank: 2,
      successRate: 82.3,
      joinedAt: '2023-02-20T14:30:00Z',
    },
    {
      address: 'kale1mno345pqr678',
      profit: 3200,
      followers: 85,
      displayName: 'Trader Gamma',
      rank: 3,
      successRate: 65.7,
      joinedAt: '2023-03-10T09:15:00Z',
    },
    {
      address: 'kale1stu901vwx234',
      profit: 12000,
      followers: 420,
      displayName: 'Trader Delta',
      rank: 4,
      successRate: 91.2,
      joinedAt: '2023-01-05T16:45:00Z',
    },
    {
      address: 'kale1yz5678abc90',
      profit: 6800,
      followers: 180,
      displayName: 'Trader Epsilon',
      rank: 5,
      successRate: 75.9,
      joinedAt: '2023-02-28T11:20:00Z',
    },
  ];

  // Mock pagination response
  const mockPaginationResponse: PaginationResponse<Trader> = {
    items: mockTraders,
    total: 50,
    page: 1,
    limit: 10,
    hasMore: true,
  };

  // Mock loading state
  const mockLoadingState = {
    isLoading: true,
    data: null,
    error: null,
    refetch: jest.fn(),
  };

  // Mock loaded state
  const mockLoadedState = {
    isLoading: false,
    data: mockPaginationResponse,
    error: null,
    refetch: jest.fn(),
  };

  // Mock error state
  const mockErrorState = {
    isLoading: false,
    data: null,
    error: 'Failed to fetch trader data',
    refetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTraderData as jest.Mock).mockReturnValue(mockLoadedState);
  });

  it('renders loading state correctly', () => {
    (useTraderData as jest.Mock).mockReturnValue(mockLoadingState);
    render(<Leaderboard />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    (useTraderData as jest.Mock).mockReturnValue(mockErrorState);
    render(<Leaderboard />);
    
    expect(screen.getByText(/failed to fetch trader data/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders the leaderboard with trader data', () => {
    render(<Leaderboard />);
    
    // Check if table headers are rendered
    expect(screen.getByText(/rank/i)).toBeInTheDocument();
    expect(screen.getByText(/trader/i)).toBeInTheDocument();
    expect(screen.getByText(/profit/i)).toBeInTheDocument();
    expect(screen.getByText(/followers/i)).toBeInTheDocument();
    expect(screen.getByText(/success rate/i)).toBeInTheDocument();
    
    // Check if trader data is rendered
    mockTraders.forEach(trader => {
      expect(screen.getByText(trader.displayName || trader.address)).toBeInTheDocument();
      expect(screen.getByText(trader.profit.toString())).toBeInTheDocument();
    });
  });

  it('sorts traders by profit in descending order by default', () => {
    render(<Leaderboard />);
    
    // Get all profit cells (excluding header)
    const profitCells = screen.getAllByTestId('profit-cell');
    
    // Check if profits are sorted in descending order
    const profits = profitCells.map(cell => parseInt(cell.textContent || '0'));
    const sortedProfits = [...profits].sort((a, b) => b - a);
    
    expect(profits).toEqual(sortedProfits);
  });

  it('sorts traders by profit in ascending order when profit header is clicked', async () => {
    render(<Leaderboard />);
    
    // Click on profit header to sort
    const profitHeader = screen.getByText(/profit/i);
    fireEvent.click(profitHeader);
    
    // Wait for re-render
    await waitFor(() => {
      const profitCells = screen.getAllByTestId('profit-cell');
      const profits = profitCells.map(cell => parseInt(cell.textContent || '0'));
      const sortedProfits = [...profits].sort((a, b) => a - b);
      
      expect(profits).toEqual(sortedProfits);
    });
  });

  it('sorts traders by followers when followers header is clicked', async () => {
    render(<Leaderboard />);
    
    // Click on followers header to sort
    const followersHeader = screen.getByText(/followers/i);
    fireEvent.click(followersHeader);
    
    // Wait for re-render
    await waitFor(() => {
      const followerCells = screen.getAllByTestId('followers-cell');
      const followers = followerCells.map(cell => parseInt(cell.textContent || '0'));
      const sortedFollowers = [...followers].sort((a, b) => b - a);
      
      expect(followers).toEqual(sortedFollowers);
    });
  });

  it('sorts traders by success rate when success rate header is clicked', async () => {
    render(<Leaderboard />);
    
    // Click on success rate header to sort
    const successRateHeader = screen.getByText(/success rate/i);
    fireEvent.click(successRateHeader);
    
    // Wait for re-render
    await waitFor(() => {
      const successRateCells = screen.getAllByTestId('success-rate-cell');
      const successRates = successRateCells.map(cell => parseFloat(cell.textContent || '0'));
      const sortedSuccessRates = [...successRates].sort((a, b) => b - a);
      
      expect(successRates).toEqual(sortedSuccessRates);
    });
  });

  it('allows pagination through trader data', async () => {
    render(<Leaderboard />);
    
    // Check if pagination controls are rendered
    expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    
    // Click next page button
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Verify that refetch was called with page 2
    expect(mockLoadedState.refetch).toHaveBeenCalledWith(expect.objectContaining({ page: 2 }));
  });

  it('disables previous button on first page', () => {
    render(<Leaderboard />);
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    // Mock last page response
    const lastPageResponse = {
      ...mockPaginationResponse,
      hasMore: false,
    };
    
    (useTraderData as jest.Mock).mockReturnValue({
      ...mockLoadedState,
      data: lastPageResponse,
    });
    
    render(<Leaderboard />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('allows changing the number of rows per page', async () => {
    render(<Leaderboard />);
    
    // Find and click the rows per page selector
    const rowsPerPageSelector = screen.getByRole('combobox', { name: /rows per page/i });
    fireEvent.change(rowsPerPageSelector, { target: { value: '25' } });
    
    // Verify that refetch was called with limit 25
    expect(mockLoadedState.refetch).toHaveBeenCalledWith(expect.objectContaining({ limit: 25 }));
  });

  it('allows searching for traders by name or address', async () => {
    render(<Leaderboard />);
    
    // Find and use the search input
    const searchInput = screen.getByPlaceholderText(/search traders/i);
    fireEvent.change(searchInput, { target: { value: 'Alpha' } });
    
    // Wait for debounce
    await waitFor(() => {
      expect(mockLoadedState.refetch).toHaveBeenCalledWith(expect.objectContaining({ search: 'Alpha' }));
    }, { timeout: 1000 });
  });

  it('shows a message when no traders match the search', () => {
    (useTraderData as jest.Mock).mockReturnValue({
      ...mockLoadedState,
      data: {
        ...mockPaginationResponse,
        items: [],
        total: 0,
      },
    });
    
    render(<Leaderboard />);
    
    expect(screen.getByText(/no traders found/i)).toBeInTheDocument();
  });
}); 