// Environment configuration for Supabase
// Switch between test and production environments

export const ENVIRONMENTS = {
  test: {
    SUPABASE_URL: "https://jbggyiavkvsyavgvsqxr.supabase.co",
    SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiZ2d5aWF2a3ZzeWF2Z3ZzcXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDE2MjMsImV4cCI6MjA3NDExNzYyM30.y2yHwjigPWP2x9yfofxNbvwgAJa-IUyYVID7fidVZH8",
    description: "Test environment - use for development and testing",
  },
  production: {
    SUPABASE_URL: "https://your-production-project.supabase.co",
    SUPABASE_ANON_KEY: "your-production-anon-key",
    description: "Production environment - use for live app",
  },
};

// Current environment - change this to switch between test and production
export const CURRENT_ENV = "test"; // Change to 'production' when ready

export const getCurrentConfig = () =>
  ENVIRONMENTS[CURRENT_ENV as keyof typeof ENVIRONMENTS];

// Test credentials for development
export const TEST_CREDENTIALS = {
  email: "test@example.com",
  password: "test123456",
  username: "TestUser",
};
