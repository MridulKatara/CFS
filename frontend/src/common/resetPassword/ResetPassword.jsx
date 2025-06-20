import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import masaiLogo from '/src/assets/masai.svg';
import nsdcLogo from '/src/assets/nsdc.svg';
import iitmandiLogo from '/src/assets/iitmandi.svg';
import cceLogo from '/src/assets/cce.svg';
import { validatePassword, validateConfirmPassword, validateEmail } from '../../utils/validation';
import apiService from '../../services/api';
import Snackbar from '../../components/Snackbar';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(token ? 2 : 1); // 1: email, 2: reset password
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        setErrors({ email: emailValidation.error });
        return;
      }

      await apiService.forgotPassword(email);
      
      setSnackbar({
        message: 'Password reset link sent to your email!',
        type: 'success'
      });
      
      setStep(2);
    } catch (error) {
      setSnackbar({
        message: error.message || 'Failed to send reset email',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setErrors({ password: passwordValidation.errors[0] });
      return;
    }

    // Validate confirm password
    const confirmValidation = validateConfirmPassword(newPassword, confirmPassword);
    if (!confirmValidation.isValid) {
      setErrors({ confirmPassword: confirmValidation.error });
      return;
    }

    setIsLoading(true);

    try {
      await apiService.resetPassword(token, newPassword);
      
      setSnackbar({
        message: 'Password reset successfully! Redirecting to login...',
        type: 'success'
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      setSnackbar({
        message: error.message || 'Failed to reset password',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <>
      <div className="w-full relative bg-[#eee0fe] h-[100vh] overflow-hidden text-left text-sm text-[#1d1b20] font-roboto">
        <div className="absolute top-[calc(50%_-_250px)] left-[calc(50%_-_171.5px)] backdrop-filter-blur-[34px] rounded-3xl bg-[linear-gradient(180deg,#fff_15.87%,rgba(255,255,255,0)_65.87%),rgba(255,255,255,0.2)] border-solid border-[1px] box-border w-[343px] flex flex-col items-center justify-start py-6 px-4 gap-8 text-[28px] text-[#222222] font-poppins border-[rgba(255,255,255,0.8)]">
          
          {/* Logo Section */}
          <div className="h-[44.8px] flex flex-row items-center justify-center gap-4">
            <img src={cceLogo} alt="CCE" />
            <img src={iitmandiLogo} alt="IIT Mandi" />
            <img src={nsdcLogo} alt="NSDC" />
            <img src={masaiLogo} alt="Masai" />  
          </div>

          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="self-stretch flex flex-col items-center justify-start gap-5">
              <div className="self-stretch flex flex-col items-center justify-start gap-3 font-inter">
                <div className="relative leading-[150%] font-semibold">Reset Password</div>
                <div className="w-[287px] relative text-xs leading-[140%] text-[#454545] text-center inline-block font-poppins">
                  Enter your personal email to receive reset instructions
                </div>
              </div>

              <div className="self-stretch flex flex-col items-start justify-start gap-1.5">
                <div className="relative leading-[120%] text-xs text-[#555555]">Personal Email</div>
                <div className="self-stretch rounded-lg bg-[#ffffff] border-[#d9d9d9] border-solid border-[1px] box-border overflow-hidden flex flex-row items-center justify-start py-3 px-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your personal email address"
                    className={`flex-1 relative leading-[140%] bg-transparent border-none outline-none ${errors.email ? 'text-red-500' : 'text-gray-700'}`}
                    required
                  />
                </div>
                {errors.email && (
                  <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="self-stretch rounded-lg [background:linear-gradient(95.11deg,_#704ee7,_#5f39e4)] overflow-hidden flex flex-row items-center justify-center py-2.5 px-5 text-sm text-[#ffffff] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <div className="relative tracking-[0.01em] leading-[150%] font-semibold">
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </div>
              </button>

              <Link to="/login" className="relative text-xs leading-[120%] text-[#454545] hover:text-purple-600 transition-colors">
                Back to Login
              </Link>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="self-stretch flex flex-col items-center justify-start gap-5">
              <div className="self-stretch flex flex-col items-center justify-start gap-3 font-inter">
                <div className="relative leading-[150%] font-semibold">Set New Password</div>
                <div className="w-[287px] relative text-xs leading-[140%] text-[#454545] text-center inline-block font-poppins">
                  Enter your new password
                </div>
              </div>

              <div className="self-stretch flex flex-col items-start justify-start gap-1.5">
                <div className="relative leading-[120%] text-xs text-[#555555]">New Password</div>
                <div className="self-stretch rounded-lg bg-[#ffffff] border-[#d9d9d9] border-solid border-[1px] box-border overflow-hidden flex flex-row items-center justify-start py-3 px-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter new password"
                    className={`flex-1 relative leading-[140%] bg-transparent border-none outline-none ${errors.password ? 'text-red-500' : 'text-gray-700'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="text-red-500 text-xs mt-1">{errors.password}</div>
                )}
              </div>

              <div className="self-stretch flex flex-col items-start justify-start gap-1.5">
                <div className="relative leading-[120%] text-xs text-[#555555]">Confirm Password</div>
                <div className="self-stretch rounded-lg bg-[#ffffff] border-[#d9d9d9] border-solid border-[1px] box-border overflow-hidden flex flex-row items-center justify-start py-3 px-4">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm new password"
                    className={`flex-1 relative leading-[140%] bg-transparent border-none outline-none ${errors.confirmPassword ? 'text-red-500' : 'text-gray-700'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="self-stretch rounded-lg [background:linear-gradient(95.11deg,_#704ee7,_#5f39e4)] overflow-hidden flex flex-row items-center justify-center py-2.5 px-5 text-sm text-[#ffffff] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <div className="relative tracking-[0.01em] leading-[150%] font-semibold">
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </div>
              </button>
            </form>
          )}
        </div>
      </div>
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </>
  );
};

export default ResetPassword;
