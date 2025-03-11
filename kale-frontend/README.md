# Kale Frontend

## Overview

Kale Frontend is a React-based UI for the KaleFi Social Trading DEX/SocialFi platform running on the Dymension RollApp `kale-test-1`. This application provides a user interface for swapping tokens, following traders, viewing leaderboards, and claiming staking rewards.

Built with React, TypeScript, and shadcn/ui, this frontend connects to RollApp smart contracts via CosmJS and integrates with Keplr wallet for blockchain interactions.

## Features

- **Token Swapping**: Swap tokens via AMM contracts
- **Social Trading**: Follow top traders and view their performance
- **Leaderboards**: Track the best performing traders
- **Staking Rewards**: Stake tokens and claim rewards
- **Wallet Integration**: Seamless Keplr wallet connection

## Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Keplr wallet browser extension

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/kale-frontend.git
   cd kale-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Blockchain Connection

This frontend connects to the Kale RollApp core at `tcp://localhost:26657` with chain ID `kale-test-1`. Make sure your local blockchain node is running before using the application.

## Smart Contracts

The application interacts with the following contracts:
- `kale-amm`: For token swaps and liquidity
- `kale-social`: For social trading features
- `kale-rewards`: For staking and rewards

## Docker

A Dockerfile is included for containerization. Build and run with:

```bash
docker build -t kale-frontend .
docker run -p 80:80 kale-frontend
```

## Development

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run lint`: Lint code

## License

[MIT](LICENSE)
