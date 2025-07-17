# Polkadot CRM - Web3 Lead Generation Platform

A modern, responsive CRM platform built with Next.js and TypeScript for lead generation focused on Polkadot Web3 wallets and staking data.

## Features

### 🚀 Core Features
- **Dashboard** - Overview of key metrics, charts, and recent activity
- **Lead Management** - Comprehensive lead tracking with filtering and search
- **Analytics** - Deep insights into wallet data and staking patterns
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### 📊 Analytics & Insights
- Lead generation trends and performance metrics
- Wallet analytics and staking distribution
- Status and source distribution charts
- Top performing leads and validators

### 🎯 Lead Management
- Complete lead lifecycle management
- Polkadot wallet address tracking
- Status management (New, Contacted, Qualified, Opportunity, Closed)
- Source tracking (Web3 Scrape, Manual, Referral, Social, Other)
- Value and staking amount analytics

### 🎨 Modern UI/UX
- Dark sidebar with modern navigation
- Clean, professional design with Tailwind CSS
- Interactive charts and visualizations
- Responsive layout across all devices
- Accessible design with proper ARIA labels

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Charts**: Recharts
- **UI Components**: Headless UI
- **Form Handling**: React Hook Form principles

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── dashboard/       # Dashboard page
│   ├── leads/          # Lead management page
│   ├── analytics/      # Analytics page
│   └── layout.tsx      # Root layout
├── components/         # Reusable components
│   ├── charts/         # Chart components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   └── ui/             # UI components
├── lib/                # Utility functions
│   ├── utils.ts        # Common utilities
│   └── mock-data.ts    # Mock data for development
└── types/              # TypeScript type definitions
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Key Components

### Dashboard
- Real-time metrics and KPIs
- Lead generation trends
- Recent activity feed
- Status distribution charts

### Lead Management
- Searchable and filterable lead table
- Inline status updates
- Polkadot wallet address tracking
- Comprehensive lead actions

### Analytics
- Detailed wallet analytics
- Staking distribution insights
- Performance metrics
- Lead value analysis

## Mock Data

The application includes comprehensive mock data for:
- Sample leads with Polkadot wallet information
- Staking data and validator information
- Activity logs and timeline data
- Dashboard metrics and statistics

## Future Enhancements

- **Backend Integration**: Connect to real Polkadot network APIs
- **Wallet Scraping**: Automated wallet discovery and analysis
- **Email Integration**: Send emails directly from the CRM
- **Calendar Integration**: Schedule meetings and follow-ups
- **Advanced Filtering**: Custom filters and saved searches
- **Export Functionality**: Export leads and analytics data
- **User Management**: Multi-user support with roles and permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
