// API Configuration
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? "http://localhost:3000/api" // Development
    : "https://your-api-domain.com/api", // Production

  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: "/auth/login",
      SIGNUP: "/auth/signup",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh",
    },

    // Reports
    REPORTS: {
      PERSONAL: "/reports/personal",
      COMMUNITY: "/reports/community",
      CREATE: "/reports",
      UPDATE: "/reports/:id",
      DELETE: "/reports/:id",
      UPVOTE: "/reports/:id/upvote",
    },

    // Upload
    UPLOAD: {
      IMAGE: "/upload/image",
    },

    // Location
    LOCATION: {
      AREAS: "/location/areas",
      REVERSE_GEOCODE: "/location/reverse-geocode",
    },
  },

  TIMEOUT: 10000, // 10 seconds
};
