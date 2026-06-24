import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  // Render free tier can cold-start (~50s) after spin-down; allow time before failing.
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Retry config for transient failures caused by backend cold starts (Render free tier).
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 3000

const isColdStartError = (error) => {
  // No response = network error / timeout (backend waking up).
  if (!error.response) return true
  // Gateway errors returned by Render while the instance spins up.
  return [502, 503, 504].includes(error.response.status)
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      if (!window.location.pathname.endsWith('/login')) {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    // Auto-retry transient cold-start failures with a short backoff.
    const config = error.config
    if (config && isColdStartError(error)) {
      config._retryCount = config._retryCount || 0
      if (config._retryCount < MAX_RETRIES) {
        config._retryCount += 1
        await delay(RETRY_DELAY_MS * config._retryCount)
        return api(config)
      }
    }

    return Promise.reject(error)
  }
)

export default api
