import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { getCurrentConfig } from "../config/supabase";

// Get configuration from environment settings
const config = getCurrentConfig();

export const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Important for React Native
    },
  }
);

// Helper function to get current user
export const getCurrentUser = () => {
  return supabase.auth.getUser();
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
};
