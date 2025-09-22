import { supabase } from "./supabase";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
  };
  token: string;
  refreshToken?: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Login failed");
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.warn("Profile not found, user may need to complete setup");
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || "",
        username: profile?.username || data.user.email?.split("@")[0] || "",
      },
      token: data.session?.access_token || "",
      refreshToken: data.session?.refresh_token,
    };
  }

  static async signup(userData: SignupData): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Signup failed");
    }

    // Create profile entry
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      username: userData.username,
    });

    if (profileError) {
      console.error("Failed to create profile:", profileError);
      // Don't throw here as auth was successful
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || "",
        username: userData.username,
      },
      token: data.session?.access_token || "",
      refreshToken: data.session?.refresh_token,
    };
  }

  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  static async refreshToken(): Promise<AuthResponse | null> {
    // Supabase handles token refresh automatically
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", session.user.id)
      .single();

    return {
      user: {
        id: session.user.id,
        email: session.user.email || "",
        username: profile?.username || session.user.email?.split("@")[0] || "",
      },
      token: session.access_token,
      refreshToken: session.refresh_token,
    };
  }

  static async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "yourapp://reset-password", // Update with your app URL
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async updateProfile(updates: {
    username?: string;
    avatar?: string;
  }): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) {
      throw new Error(error.message);
    }
  }
}
