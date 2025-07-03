const API_BASE_URL = 'https://cfs-djzu.onrender.com';

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
      
      // For 204 No Content responses
      if (response.status === 204) {
        return { success: true };
      }
      
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

  async updatePassword(passwordData) {
    return this.request('/user/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Program endpoints
  async getPrograms() {
    console.log('Fetching all programs');
    return this.request('/allprograms');
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
    return this.request('/user/my-programs');
  }

  async getHealth() {
    return this.request('/health');
  }

  async getProgramDetails(programId) {
    try {
      console.log(`Fetching program details for ID: ${programId}`);
      const response = await this.request(`/programs/${programId}`);
      
      if (!response || !response.success) {
        const errorMsg = response?.message || "Program not found";
        console.error(`API response error: ${errorMsg}`);
        throw new Error(errorMsg);
      }
      
      console.log("Program data received:", response.data);
      return response;
    } catch (error) {
      console.error("Error fetching program:", error);
      throw error;
    }
  }

  async getEnrolledProgramDetails(programId) {
    return this.request(`/user/programs/${programId}`);
  }
}

export default new ApiService(); 