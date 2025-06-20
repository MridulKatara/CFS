const API_BASE_URL = 'http://localhost:7001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: options.method || 'GET',
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(config);
    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType}`);
      }
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async initiateRegistration(userData) {
    return this.request('/auth/register/initiate', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyRegistrationOtp(otpData) {
    return this.request('/auth/register/verify-otp', {
      method: 'POST',
      body: JSON.stringify(otpData),
    });
  }

  async resendOtp(resendData) {
    return this.request('/auth/register/resend-otp', {
      method: 'POST',
      body: JSON.stringify(resendData),
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return this.request(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Program endpoints
  async getPrograms() {
    return this.request('/programs');
  }

  async getProgramById(id) {
    return this.request(`/programs/${id}`);
  }

  async enrollInProgram(programId) {
    return this.request(`/programs/${programId}/enroll`, {
      method: 'POST',
    });
  }

  async getMyPrograms() {
    return this.request('/user/programs');
  }

  async getHealth() {
    return this.request('/health');
  }
}

export default new ApiService(); 