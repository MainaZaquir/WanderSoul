// Application configuration
export const config = {
  app: {
    name: ' Muchina Malomba',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
    description: 'Explore Kenya & East Africa with Muchina Malomba',
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  },
  features: {
    enablePayments: true,
    enableMpesa: true,
    enableStripe: true,
    enableCommunity: true,
    enableReviews: true,
  },
  social: {
    instagram: 'https://instagram.com/muchinaMalomba',
    facebook: 'https://facebook.com/MuchinaMalomba',
  },
};

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !import.meta.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.error(
    'Missing required environment variables:',
    missingEnvVars.join(', ')
  );
}

export default config;