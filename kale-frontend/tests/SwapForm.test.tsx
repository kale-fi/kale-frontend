import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SwapForm from '../src/components/SwapForm';
import { WalletState } from '../src/types';

// Mock the cosmjs utility functions
jest.mock('../src/utils/cosmjs', () => ({
  executeContract: jest.fn().mockResolvedValue('mock-tx-hash'),
  formatCoin: jest.fn((amount, denom) => `${amount} ${denom}`),
  parseCoins: jest.fn((amount, denom) => `${amount}${denom}`),
}));

// Mock toast notifications
jest.mock('../src/components/ui/toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('SwapForm Component', () => {
  // Mock wallet state
  const mockWallet: WalletState = {
    isConnected: true,
    address: 'kale1abc123def456',
    balances: {
      'ukale': '1000000',
      'uusdc': '500000',
    },
  };

  // Mock available tokens
  const mockTokens = [
    { denom: 'ukale', name: 'Kale', symbol: 'KALE', decimals: 6, logo: '/kale-logo.png' },
    { denom: 'uusdc', name: 'USD Coin', symbol: 'USDC', decimals: 6, logo: '/usdc-logo.png' },
  ];

  it('renders the swap form with inputs and button', () => {
    render(<SwapForm wallet={mockWallet} availableTokens={mockTokens} />);
    
    // Check if token selectors are rendered
    expect(screen.getByText(/From/i)).toBeInTheDocument();
    expect(screen.getByText(/To/i)).toBeInTheDocument();
    
    // Check if input fields are rendered
    const inputFields = screen.getAllByRole('textbox');
    expect(inputFields.length).toBeGreaterThanOrEqual(1);
    
    // Check if swap button is rendered
    expect(screen.getByRole('button', { name: /swap/i })).toBeInTheDocument();
  });

  it('displays user balances', () => {
    render(<SwapForm wallet={mockWallet} availableTokens={mockTokens} />);
    
    // Check if balance is displayed
    expect(screen.getByText(/Balance:/i)).toBeInTheDocument();
  });

  it('allows token selection', async () => {
    render(<SwapForm wallet={mockWallet} availableTokens={mockTokens} />);
    
    // Find and click token selectors
    const tokenSelectors = screen.getAllByRole('combobox');
    fireEvent.click(tokenSelectors[0]);
    
    // Wait for dropdown to appear and select a token
    await waitFor(() => {
      expect(screen.getByText('KALE')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('KALE'));
    
    // Verify selection was made
    expect(screen.getAllByText('KALE')[0]).toBeInTheDocument();
  });

  it('allows input of swap amount', () => {
    render(<SwapForm wallet={mockWallet} availableTokens={mockTokens} />);
    
    // Find input field and enter amount
    const amountInput = screen.getByPlaceholderText(/Enter amount/i);
    fireEvent.change(amountInput, { target: { value: '10' } });
    
    // Verify input value was updated
    expect(amountInput).toHaveValue('10');
  });

  it('shows estimated output amount', async () => {
    render(<SwapForm wallet={mockWallet} availableTokens={mockTokens} />);
    
    // Enter input amount
    const amountInput = screen.getByPlaceholderText(/Enter amount/i);
    fireEvent.change(amountInput, { target: { value: '10' } });
    
    // Wait for estimated output to appear
    await waitFor(() => {
      expect(screen.getByText(/Estimated output:/i)).toBeInTheDocument();
    });
  });

  it('shows fee information', () => {
    render(<SwapForm wallet={mockWallet} availableTokens={mockTokens} />);
    
    // Check if fee information is displayed
    expect(screen.getByText(/Fee:/i)).toBeInTheDocument();
  });

  it('disables swap button when wallet is not connected', () => {
    const disconnectedWallet: WalletState = {
      isConnected: false,
      error: 'Not connected',
    };
    
    render(<SwapForm wallet={disconnectedWallet} availableTokens={mockTokens} />);
    
    // Check if swap button is disabled
    const swapButton = screen.getByRole('button', { name: /swap/i });
    expect(swapButton).toBeDisabled();
  });

  it('disables swap button when amount is invalid', () => {
    render(<SwapForm wallet={mockWallet} availableTokens={mockTokens} />);
    
    // Enter invalid amount (0)
    const amountInput = screen.getByPlaceholderText(/Enter amount/i);
    fireEvent.change(amountInput, { target: { value: '0' } });
    
    // Check if swap button is disabled
    const swapButton = screen.getByRole('button', { name: /swap/i });
    expect(swapButton).toBeDisabled();
  });

  it('executes swap when button is clicked', async () => {
    render(<SwapForm wallet={mockWallet} availableTokens={mockTokens} />);
    
    // Select tokens and enter amount
    const tokenSelectors = screen.getAllByRole('combobox');
    fireEvent.click(tokenSelectors[0]);
    await waitFor(() => {
      expect(screen.getByText('KALE')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('KALE'));
    
    fireEvent.click(tokenSelectors[1]);
    await waitFor(() => {
      expect(screen.getByText('USDC')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('USDC'));
    
    const amountInput = screen.getByPlaceholderText(/Enter amount/i);
    fireEvent.change(amountInput, { target: { value: '10' } });
    
    // Click swap button
    const swapButton = screen.getByRole('button', { name: /swap/i });
    fireEvent.click(swapButton);
    
    // Verify loading state
    await waitFor(() => {
      expect(swapButton).toHaveTextContent(/swapping.../i);
    });
    
    // Verify completion
    await waitFor(() => {
      expect(swapButton).toHaveTextContent(/swap/i);
    }, { timeout: 3000 });
  });

  it('shows error message when swap fails', async () => {
    // Mock the executeContract to reject
    jest.spyOn(require('../src/utils/cosmjs'), 'executeContract').mockRejectedValueOnce(new Error('Swap failed'));
    
    render(<SwapForm wallet={mockWallet} availableTokens={mockTokens} />);
    
    // Select tokens and enter amount
    const amountInput = screen.getByPlaceholderText(/Enter amount/i);
    fireEvent.change(amountInput, { target: { value: '10' } });
    
    // Click swap button
    const swapButton = screen.getByRole('button', { name: /swap/i });
    fireEvent.click(swapButton);
    
    // Verify error state
    await waitFor(() => {
      expect(screen.getByText(/failed to execute swap/i)).toBeInTheDocument();
    });
  });
}); 