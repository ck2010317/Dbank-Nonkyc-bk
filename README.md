# DBank - Non-KYC Virtual Cards

A decentralized banking platform offering non-KYC virtual cards for secure, private online transactions.

🌐 **Live Website:** [https://dbank.finance/](https://dbank.finance/)

## About

DBank provides instant virtual cards without identity verification requirements. Users can create and manage virtual cards, top up with cryptocurrency, and make online purchases while maintaining their privacy.

## Features

- 🎴 **Non-KYC Virtual Cards** - Create cards instantly without identity verification
- 💳 **Multiple Card Management** - Create and manage multiple virtual cards
- 💰 **Crypto Top-Up** - Fund cards using cryptocurrency payments
- 🔒 **Card Security** - Freeze/unfreeze cards, view sensitive details securely
- 📊 **Transaction History** - Track all card transactions in real-time
- 🛒 **Preload Cards** - Purchase pre-loaded cards for instant use
- 💵 **Credit System** - Buy credits at $35 per credit to create and manage cards
- 🌙 **Dark Mode** - Modern dark-themed interface

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Card Provider:** ZeroID API
- **Payments:** Cryptocurrency integration
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- ZeroID API credentials

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/Dbank-Nonkyc-bk.git
cd Dbank-Nonkyc-bk
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Create a `.env.local` file with the following variables:

\`\`\`env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database
POSTGRES_URL=your_postgres_connection_url

# Add other required environment variables
\`\`\`

4. Run database migrations:

Execute the SQL scripts in the `/scripts` folder to set up your database tables.

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard and card management
│   ├── buy-credits/       # Credit purchase page
│   └── preload-cards/     # Preload cards marketplace
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utility functions and configurations
├── scripts/               # Database SQL scripts
└── public/               # Static assets
\`\`\`

## Key Features Explained

### Card Creation
Users purchase credits ($35 per credit) and use them to create virtual cards through the ZeroID API integration.

### Preload Cards
Pre-funded cards available for purchase, offering instant access to card details after payment verification.

### Credit System
- 1 credit = $35
- Credits are used to create cards and perform card operations
- Users can top up credits via cryptocurrency payments

### Security
- Non-KYC: No identity verification required
- Secure card details storage
- Freeze/unfreeze functionality
- Transaction monitoring

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Support

For support, please contact us through [https://dbank.finance/](https://dbank.finance/)

## Social Links

- Telegram: [https://t.me/dbank_insiders](https://t.me/dbank_insiders)
- X (Twitter): [@official_dbank](https://x.com/official_dbank)
