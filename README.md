# finapp
# Coinest - Finance Management Dashboard

A modern, feature-rich personal finance management application built with Next.js, Supabase, and Tailwind CSS.

## Features

- 📊 **Interactive Dashboard**: Real-time overview of your financial status
- 💰 **Transaction Management**: Track income and expenses with ease
- 📅 **Fixed Expenses**: Manage recurring monthly payments
- 📈 **Financial Reports**: Detailed analytics and spending insights
- 🌙 **Dark Mode**: Full support for light and dark themes
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🔒 **Secure Authentication**: Email and password authentication via Supabase

## Tech Stack

- **Frontend**: Next.js 13 (App Router)
- **UI Components**: shadcn/ui + Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/coinest.git
cd coinest
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
coinest/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard and feature pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── ui/               # UI components
│   └── providers/        # Context providers
├── lib/                  # Utility functions
├── public/               # Static assets
└── supabase/            # Supabase configurations
```

## Key Features

### Dashboard
- Overview of current financial status
- Income vs. Expenses visualization
- Category-wise expense distribution
- Recent transactions list

### Transactions
- Add, edit, and delete transactions
- Categorize transactions
- Filter and search functionality
- Transaction history

### Fixed Expenses
- Manage recurring monthly expenses
- Category-wise expense tracking
- Monthly expense analysis

### Reports & Analytics
- Monthly financial trends
- Expense category analysis
- Saving suggestions
- Customizable date ranges

## Authentication Flow

1. **Sign Up**
   - Name
   - Email
   - Password
   - Monthly Income

2. **Onboarding**
   - Set up fixed monthly expenses
   - Categorize expenses
   - Complete profile setup

3. **Dashboard Access**
   - Secure route protection
   - Session management
   - User-specific data access

## Database Schema

### Users Table
- id (UUID, PK)
- name (text)
- email (text, unique)
- monthlyIncome (numeric)
- onboardingCompleted (boolean)
- createdAt (timestamp)

### Transactions Table
- id (UUID, PK)
- userId (UUID, FK)
- title (text)
- amount (numeric)
- type (text)
- category (text)
- notes (text)
- createdAt (timestamp)

### Fixed Expenses Table
- id (UUID, PK)
- userId (UUID, FK)
- title (text)
- amount (numeric)
- type (text)
- category (text)
- createdAt (timestamp)

## Security Features

- Row Level Security (RLS) policies
- Secure authentication flow
- Protected API routes
- Input validation and sanitization
- Type-safe database queries

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)