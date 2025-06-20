# CFS (Course Management System)

A comprehensive course management system with user authentication, program enrollment, and OTP verification.

## Features Implemented

### Authentication & Registration
- ✅ **User Registration with OTP Verification**
  - Multi-step registration process
  - Email and mobile OTP verification
  - Password validation (min 8 chars, uppercase, lowercase, digit, special char)
  - Mobile number validation (exactly 10 digits)
  - Personal email usage (no college email requirement)
  - Password confirmation validation
  - Resend OTP functionality for both email and mobile separately

- ✅ **User Login**
  - Personal email-based login
  - JWT token authentication
  - Role-based redirection (student, admin, faculty)

- ✅ **Password Reset**
  - Forgot password functionality
  - Email-based reset link
  - Secure password reset with token validation

### UI/UX Improvements
- ✅ **Snackbar Notifications**
  - Success, error, and warning messages
  - Consistent notification system across all components
  - Auto-dismiss functionality

- ✅ **Form Validation**
  - Real-time validation feedback
  - Error highlighting for invalid fields
  - Password strength requirements
  - Mobile number format validation

- ✅ **Enhanced User Experience**
  - Cursor pointer on all clickable elements
  - Loading states for all API calls
  - Complete mobile number display on OTP verification page
  - Responsive design with proper error handling

### Backend Integration
- ✅ **API Service Layer**
  - Centralized API communication
  - Automatic token management
  - Error handling and response processing
  - Base URL configuration

- ✅ **Program Management**
  - Fetch user's enrolled programs
  - Program progress tracking
  - Active vs inactive program filtering
  - Real-time data from backend

## Project Structure

```
CFS/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   └── Snackbar.jsx  # Notification component
│   │   ├── services/         # API services
│   │   │   └── api.js        # Centralized API service
│   │   ├── utils/            # Utility functions
│   │   │   └── validation.js # Form validation utilities
│   │   ├── common/           # Common components
│   │   │   ├── login/        # Login components
│   │   │   ├── register/     # Registration components
│   │   │   └── resetPassword/ # Password reset components
│   │   └── student/          # Student-specific components
│   └── package.json
└── server/                   # Backend API server
    ├── controllers/          # API controllers
    ├── models/              # Database models
    ├── routes/              # API routes
    ├── middleware/          # Authentication middleware
    └── utils/               # Utility functions
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database
- Bun (for backend)

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd CFS/server
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the server directory with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   ```

4. **Start the server:**
   ```bash
   bun run dev
   ```
   The server will run on `http://localhost:7000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd CFS/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register/initiate` - Start registration process
- `POST /auth/register/verify-otp` - Verify OTP and complete registration
- `POST /auth/register/resend-otp` - Resend OTP
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password/:token` - Reset password with token

### User Management
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/programs` - Get user's enrolled programs

### Programs
- `GET /programs` - Get all programs
- `GET /programs/:id` - Get specific program
- `POST /programs/:id/enroll` - Enroll in a program

## Key Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

### Mobile Number Validation
- Exactly 10 digits only
- No alphabets or special characters allowed
- Real-time validation feedback

### OTP System
- 6-digit OTP for both email and mobile
- Separate resend functionality for email and mobile
- OTP expiration handling
- Maximum attempt limits

### Error Handling
- Comprehensive error messages
- User-friendly notifications
- Form validation with real-time feedback
- API error handling with fallback messages

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- OTP verification for registration
- Secure password reset flow
- Input validation and sanitization
- CORS configuration for frontend-backend communication

## Development Notes

- All API calls are centralized in `api.js`
- Form validation is handled by utility functions
- Snackbar component provides consistent notifications
- Global CSS ensures cursor pointer on all clickable elements
- Loading states are implemented for better UX
- Error boundaries and fallback UI components

## Troubleshooting

1. **CORS Issues**: Ensure the backend CORS configuration includes the frontend URL
2. **Database Connection**: Verify MongoDB connection string in environment variables
3. **API Errors**: Check browser console and server logs for detailed error messages
4. **OTP Issues**: Verify AWS SES and SMS configurations for OTP delivery

## Contributing

1. Follow the existing code structure
2. Add proper error handling for new features
3. Include form validation for user inputs
4. Use the Snackbar component for notifications
5. Test API integration thoroughly