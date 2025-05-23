/*
  # Create initial schema for Coinest Finance App

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `monthlyIncome` (numeric)
      - `onboardingCompleted` (boolean)
      - `createdAt` (timestamptz)
    - `transactions`
      - `id` (uuid, primary key)
      - `userId` (uuid, foreign key to users.id)
      - `title` (text)
      - `amount` (numeric)
      - `type` ("income" or "expense")
      - `category` (text)
      - `notes` (text, optional)
      - `createdAt` (timestamptz)
    - `fixed_expenses`
      - `id` (uuid, primary key)
      - `userId` (uuid, foreign key to users.id)
      - `title` (text)
      - `amount` (numeric)
      - `type` ("expense")
      - `category` (text)
      - `createdAt` (timestamptz)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  monthlyIncome numeric DEFAULT 0,
  onboardingCompleted boolean DEFAULT false,
  createdAt timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  userId uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category text,
  notes text,
  createdAt timestamptz DEFAULT now()
);

-- Create fixed expenses table
CREATE TABLE IF NOT EXISTS fixed_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  userId uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL DEFAULT 'expense',
  category text,
  createdAt timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_expenses ENABLE ROW LEVEL SECURITY;

-- Set up RLS policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Set up RLS policies for transactions table
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = userId);

CREATE POLICY "Users can create own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = userId);

CREATE POLICY "Users can delete own transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = userId);

-- Set up RLS policies for fixed expenses table
CREATE POLICY "Users can read own fixed expenses"
  ON fixed_expenses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = userId);

CREATE POLICY "Users can create own fixed expenses"
  ON fixed_expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update own fixed expenses"
  ON fixed_expenses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = userId);

CREATE POLICY "Users can delete own fixed expenses"
  ON fixed_expenses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = userId);