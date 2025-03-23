# Block Mentor Platform

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

- **Cross-chain Bridge**: Support for token bridging between different networks
- **Network Support**: Currently supports Arbitrum Sepolia and Base Sepolia
- **Real-time Balance Updates**: Live wallet balance tracking
- **Interactive UI**: User-friendly interface for bridge operations

## Technology Stack

### Frontend
- React 19
- TypeScript
- Vite 6
- TailwindCSS 4
- React Router DOM 7
- Shadcn UI Components
- Privy.io Authentication

### Development Tools
- ESLint
- Prettier
- TypeScript
- Vite

## Getting Started

1. Clone the repository
2. Install dependencies for both applications:

```bash
# For Block Mentor Web
cd block-mentor-web
npm install

# For Block Mentor Platform Web
cd ../block-mentor-platfrom-web
npm install
```

3. Start the development servers:

```bash
# For Block Mentor Web
cd block-mentor-web
npm run dev

# For Block Mentor Platform Web
cd ../block-mentor-platfrom-web
npm run dev
```

## Project Structure

### Block Mentor Web
```
block-mentor-web/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
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
│   ├── assets/        # Static assets
│   └── router.tsx     # Application routing
```

## Features

- **Secure Authentication**: Integration with Privy.io for Web3 authentication
- **Token Management**: Comprehensive token management interface
- **Cross-chain Operations**: Bridge tokens between different networks
- **AI-Powered Mentoring**: Interactive chat interface for blockchain guidance
- **Responsive Design**: Mobile-friendly user interface
- **Real-time Updates**: Live balance and transaction tracking

## Development

- Use `npm run dev` to start the development server
- Use `npm run build` to create production builds
- Use `npm run lint` to run ESLint
- Use `npm run format` to format code with Prettier

## License

This project is licensed under the terms included in the LICENSE file.
