// API Configuration
export const API_CONFIG = {
  // External API endpoint (your specified API)
  EXTERNAL_API_URL: "http://localhost:8000/api/auth/login",
  
  // Local API endpoint (fallback)
  LOCAL_API_URL: "/api/auth/login",
  
  // Whether to try external API first (set to false to use local API only)
  USE_EXTERNAL_API: true,
  
  // Timeout for API requests (in milliseconds)
  REQUEST_TIMEOUT: 5000,
}

// Helper function to get the appropriate API URL
export const getApiUrl = () => {
  return API_CONFIG.USE_EXTERNAL_API ? API_CONFIG.EXTERNAL_API_URL : API_CONFIG.LOCAL_API_URL
}
