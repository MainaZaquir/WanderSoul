# Travel With Muchina

A comprehensive travel platform for exploring Kenya and East Africa with radio host and adventure curator Muchina Malomba.

## Features

- **Trip Booking**: Browse and book curated travel experiences
- **Travel Shop**: Purchase travel gear and digital itineraries
- **Community**: Share travel stories and connect with fellow adventurers
- **Payment Integration**: Support for both Stripe and M-Pesa payments
- **Admin Dashboard**: Comprehensive management tools
- **Responsive Design**: Optimized for all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Payments**: Stripe, M-Pesa
- **Deployment**: Netlify/Vercel ready

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (optional)
- M-Pesa developer account (for Kenya market)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd travel-with-muchina
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your environment variables in `.env`.

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# App Configuration
VITE_APP_URL=http://localhost:5173
```

## Supabase Setup

1. Create a new Supabase project
2. Run the database migrations in the `supabase/migrations` folder
3. Set up the following storage buckets:
   - `community-posts`
   - `trip-images`
   - `product-images`
   - `user-avatars`
   - `sponsorship-logos`
4. Deploy the edge functions in `supabase/functions`

## Deployment

### Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Vercel

1. Connect your repository to Vercel
2. Environment variables will be automatically detected
3. Deploy with zero configuration

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── context/            # React context providers
└── types/              # TypeScript type definitions

supabase/
├── functions/          # Edge functions
└── migrations/         # Database migrations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email muchinabrian@gmail.com or join our community discussions.