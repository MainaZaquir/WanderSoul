/*
  # Add M-Pesa Transactions Table

  1. New Tables
    - `mpesa_transactions`
      - `id` (uuid, primary key)
      - `checkout_request_id` (text, unique)
      - `merchant_request_id` (text)
      - `phone_number` (text)
      - `amount` (numeric)
      - `booking_id` (uuid, foreign key)
      - `order_id` (uuid, foreign key)
      - `status` (text)
      - `mpesa_receipt_number` (text)
      - `transaction_date` (text)
      - `result_desc` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `mpesa_transactions` table
    - Add policies for admin access only
*/

CREATE TABLE IF NOT EXISTS mpesa_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checkout_request_id text UNIQUE NOT NULL,
  merchant_request_id text NOT NULL,
  phone_number text NOT NULL,
  amount numeric(10,2) NOT NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  mpesa_receipt_number text,
  transaction_date text,
  result_desc text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mpesa_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage M-Pesa transactions"
  ON mpesa_transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Add error logging table
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  error_type text NOT NULL,
  error_message text NOT NULL,
  stack_trace text,
  url text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read error logs"
  ON error_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );