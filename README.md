# Block Mentor Platform

<p align="center">
  <img src="./src/assets/logo.png" alt="Block Mentor Platform" width="240" />
</p>

A comprehensive blockchain mentoring and token management platform consisting of two main applications:

## Applications

### 1. Block Mentor Web (Main Application)
A feature-rich web application for blockchain mentoring and token management with the following features:

- **Authentication**: Secure user authentication using Privy.io
- **Token Management**: View and manage various tokens
- **Vesting**: Token vesting management interface
- **Staking**: Token staking functionality
- **AI Chat Integration**: Interactive chat interface for blockchain mentoring
- **Modern UI**: Built with React and Tailwind CSS

### 2. Block Mentor Platform Web (Bridge Application)
A dedicated application for cross-chain token bridging:

<p align="center">
  <img src="./src/assets/arbitrum-base-connection.png" alt="Arbitrum to Base Bridge" width="400" onerror="this.style.display='none'" />
</p>

- **Cross-chain Bridge**: Seamless token transfers between different blockchain networks
- **Network Support**: Currently supports Arbitrum Sepolia and Base Sepolia testnets
- **Real-time Balance Updates**: Live wallet balance tracking across networks
- **Interactive UI**: User-friendly interface with real-time transaction status updates
- **Security**: Enhanced security protocols for cross-chain token transfers

## Technology Stack

### Frontend
- React 19
- TypeScript
- Vite 6
- TailwindCSS 4
- React Router DOM 7
- Shadcn UI Components
- Privy.io Authentication

### Backend & Infrastructure
- REST API for token and user management
- WebSocket for real-time updates
- Cross-chain communication protocols
- Smart contracts for token bridging

### Development Tools
- ESLint
- Prettier
- TypeScript
- Vite

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or bun package manager
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/block-mentor-web.git
cd block-mentor-web
```

2. Install dependencies:

**Using npm:**
```bash
# For Block Mentor Web
cd block-mentor-web
npm install

# For Block Mentor Platform Web
cd ../block-mentor-platfrom-web
npm install
```

**Using yarn:**
```bash
# For Block Mentor Web
cd block-mentor-web
yarn

# For Block Mentor Platform Web
cd ../block-mentor-platfrom-web
yarn
```

**Using bun:**
```bash
# For Block Mentor Web
cd block-mentor-web
bun install

# For Block Mentor Platform Web
cd ../block-mentor-platfrom-web
bun install
```

### Environment Setup

Create `.env` files in both project directories with the following variables:

```
# Required for authentication
VITE_PRIVY_APP_ID=your-privy-app-id

# API configuration
VITE_API_BASE_URL=your-api-base-url
```

### Running the Applications

**Using npm:**
```bash
# For Block Mentor Web
cd block-mentor-web
npm run dev

# For Block Mentor Platform Web
cd ../block-mentor-platfrom-web
npm run dev
```

**Using yarn:**
```bash
# For Block Mentor Web
cd block-mentor-web
yarn dev

# For Block Mentor Platform Web
cd ../block-mentor-platfrom-web
yarn dev
```

**Using bun:**
```bash
# For Block Mentor Web
cd block-mentor-web
bun run dev

# For Block Mentor Platform Web
cd ../block-mentor-platfrom-web
bun run dev
```

## Project Structure

### Block Mentor Web
```
block-mentor-web/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   │   ├── tokens/     # Token management
│   │   ├── vestings/   # Vesting interface
│   │   └── staking/    # Staking functionality
│   ├── config/         # Configuration files
│   ├── hooks/          # Custom React hooks
│   ├── service/        # API service layer
│   ├── types/          # TypeScript type definitions
│   └── assets/         # Static assets
```

### Block Mentor Platform Web
```
block-mentor-platfrom-web/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   │   └── bridge/    # Bridge interface
│   ├── assets/        # Static assets
│   ├── config/        # Configuration files
│   └── router.tsx     # Application routing
```

## Bridge Functionality

The Block Mentor Platform Bridge enables seamless token transfers between different blockchain networks:

1. **Network Selection**: Choose source and destination networks (currently Arbitrum Sepolia and Base Sepolia)
2. **Token Selection**: Select the token you want to bridge
3. **Amount Specification**: Specify the amount to transfer
4. **Fee Calculation**: Automatic calculation of gas fees and bridge fees
5. **Transaction Confirmation**: Review and confirm the transaction details
6. **Real-time Tracking**: Monitor the progress of your bridge transaction
7. **Completion Notification**: Receive confirmation when funds arrive on the destination network

## Development Guidelines

### Code Style
- Use ESLint and Prettier for code formatting
- Follow TypeScript best practices
- Component-based architecture with React hooks

### Testing
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Cypress

### Build & Deployment
```bash
# Build for production
npm run build
# or
yarn build
# or
bun run build

# Preview production build
npm run preview
# or
yarn preview
# or
bun run preview
```

## Contributing

We welcome contributions to the Block Mentor Platform! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows our style guidelines and includes appropriate tests.

## License

This project is licensed under the terms included in the LICENSE file.

## Acknowledgments

- [Privy.io](https://privy.io) for authentication services
- [Arbitrum](https://arbitrum.io) and [Base](https://base.org) for network support
- All contributors who have helped shape this project
