/* eslint-disable no-useless-escape */
// Password validation: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const errors = [];
  if (!minLength) errors.push('Password must be at least 8 characters long');
  if (!hasUpperCase) errors.push('Password must contain at least one uppercase letter');
  if (!hasLowerCase) errors.push('Password must contain at least one lowercase letter');
  if (!hasDigit) errors.push('Password must contain at least one digit');
  if (!hasSpecialChar) errors.push('Password must contain at least one special character');

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Mobile number validation: exactly 10 digits
export const validateMobileNumber = (mobile) => {
  const mobileRegex = /^\d{10}$/;
  return {
    isValid: mobileRegex.test(mobile),
    error: mobileRegex.test(mobile) ? null : 'Mobile number must be exactly 10 digits'
  };
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    error: emailRegex.test(email) ? null : 'Please enter a valid email address'
  };
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  return {
    isValid: password === confirmPassword,
    error: password === confirmPassword ? null : 'Passwords do not match'
  };
};

// OTP validation: exactly 6 digits
export const validateOtp = (otp) => {
  const otpRegex = /^\d{6}$/;
  return {
    isValid: otpRegex.test(otp),
    error: otpRegex.test(otp) ? null : 'OTP must be exactly 6 digits'
  };
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  return {
    isValid: value && value.trim().length > 0,
    error: value && value.trim().length > 0 ? null : `${fieldName} is required`
  };
};

// Format mobile number for display (show last 4 digits)
export const formatMobileForDisplay = (mobile) => {
  if (!mobile || mobile.length < 4) return '';
  return `+91 XXXXX${mobile.slice(-4)}`;
}; 