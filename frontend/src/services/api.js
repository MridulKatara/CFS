const API_BASE_URL = 'https://cfs-djzu.onrender.com';
// const API_BASE_URL = 'http://localhost:7001';

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
      
      // Check if it's a network error (server unreachable)
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        return {
          success: false,
          message: 'Unable to connect to server. Please check your internet connection or try again later.',
          isNetworkError: true
        };
      }
      
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
      body: JSON.stringify({ personalEmail: email }),
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

  // Admin User management
  async getAllUsers() {
    return this.request('/admin/users');
  }

  // Admin Program management
  async getAdminPrograms() {
    return this.request('/admin/programs');
  }

  async getAdminProgramById(id) {
    return this.request(`/admin/programs/${id}`);
  }

  async createProgram(programData) {
    return this.request('/admin/programs', {
      method: 'POST',
      body: JSON.stringify(programData),
    });
  }

  async updateProgram(id, programData) {
    return this.request(`/admin/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(programData),
    });
  }

  async deleteProgram(id) {
    return this.request(`/admin/programs/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin Toolkit management
  async addToolToProgram(programId, toolData) {
    return this.request(`/admin/programs/${programId}/toolkit`, {
      method: 'POST',
      body: JSON.stringify(toolData),
    });
  }

  async removeToolFromProgram(programId, toolId) {
    return this.request(`/admin/programs/${programId}/toolkit/${toolId}`, {
      method: 'DELETE',
    });
  }

  // Admin Facts management
  async addFactToProgram(programId, factData) {
    return this.request(`/admin/programs/${programId}/facts`, {
      method: 'POST',
      body: JSON.stringify(factData),
    });
  }

  async removeFactFromProgram(programId, factId) {
    return this.request(`/admin/programs/${programId}/facts/${factId}`, {
      method: 'DELETE',
    });
  }

  // Notification endpoints
  async saveNotificationToken(token) {
    return this.request('/notifications/token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async getUserNotifications(page = 1, limit = 10) {
    try {
      const response = await this.request(`/notifications?page=${page}&limit=${limit}`);
      
      // Ensure notifications array exists
      if (response.success && !response.notifications) {
        response.notifications = [];
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to fetch notifications',
        notifications: [] 
      };
    }
  }

  async getRecentNotifications(page = 1, limit = 10) {
    try {
      const response = await this.request(`/notifications/recent?page=${page}&limit=${limit}`);
      
      // Ensure notifications array exists
      if (response.success && !response.notifications) {
        response.notifications = [];
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching recent notifications:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to fetch notifications',
        notifications: [] 
      };
    }
  }

  async markNotificationAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async getUnreadNotificationCount() {
    return this.request('/notifications/unread/count');
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/mark-all-read', {
      method: 'PUT',
    });
  }

  // University endpoints
  async getUniversities() {
    return this.request('/api/universities');
  }

  async addUniversity(universityData) {
    return this.request('/api/universities', {
      method: 'POST',
      body: JSON.stringify(universityData),
    });
  }

  async updateUniversity(id, universityData) {
    return this.request(`/api/universities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(universityData),
    });
  }

  async deleteUniversity(id) {
    return this.request(`/api/universities/${id}`, {
      method: 'DELETE',
    });
  }

  async sendNotification(notificationData) {
    return this.request('/notifications/send', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }
}

export default new ApiService(); 