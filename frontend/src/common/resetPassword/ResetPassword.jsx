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
      <div className="w-full min-h-screen flex items-center justify-center bg-[#eee0fe]">
        <div
          className="w-[343px] rounded-3xl bg-white bg-opacity-90 border border-gray-200 shadow-lg flex flex-col items-center py-6 px-4 gap-8"
          style={{
            backdropFilter: "blur(34px)",
            background: "linear-gradient(180deg, #fff 15.87%, rgba(255,255,255,0) 65.87%), rgba(255,255,255,0.2)"
          }}
        >
          {/* Logo Section */}
          <div className="h-[44.8px] flex flex-row items-center justify-center gap-4">
            <img src={cceLogo} alt="CCE" className="w-[53px] h-[44px] object-contain" />
            <img src={iitmandiLogo} alt="IIT Mandi" className="w-[56px] h-[44px] object-contain" />
            <img src={nsdcLogo} alt="NSDC" className="w-[45px] h-[44px] object-contain" />
            <img src={masaiLogo} alt="Masai" className="w-[53px] h-[24px] object-contain" />
          </div>

          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="w-full flex flex-col items-center gap-5">
              <div className="w-full flex flex-col items-center gap-3 font-inter">
                <div className="text-[28px] font-semibold text-[#222] leading-[150%]">Reset Password</div>
                <div className="w-[287px] text-xs leading-[140%] text-[#454545] text-center font-poppins">
                  Enter your personal email to receive reset instructions
                </div>
              </div>

              <div className="w-full flex flex-col items-start gap-1.5">
                <div className="leading-[120%] text-xs text-[#555]">Personal Email</div>
                <div className="w-full rounded-lg bg-white border border-gray-300 overflow-hidden flex flex-row items-center py-3 px-4 placeholder-gray-400">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your personal email address"
                    className={`flex-1 bg-transparent border-none outline-none ${errors.email ? 'text-red-500' : 'text-gray-700'}`}
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
                className="w-full rounded-lg bg-gradient-to-r from-[#704ee7] to-[#5f39e4] flex flex-row items-center justify-center py-2.5 px-5 text-sm text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="tracking-[0.01em] leading-[150%]">
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </span>
              </button>

              <Link to="/login" className="text-xs leading-[120%] text-[#454545] hover:text-purple-600 transition-colors">
                Back to Login
              </Link>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="w-full flex flex-col items-center gap-5">
              <div className="w-full flex flex-col items-center gap-3 font-inter">
                <div className="text-[28px] font-semibold text-[#222] leading-[150%]">Set New Password</div>
                <div className="w-[287px] text-xs leading-[140%] text-[#454545] text-center font-poppins">
                  Enter your new password
                </div>
              </div>

              <div className="w-full flex flex-col items-start gap-1.5">
                <div className="leading-[120%] text-xs text-[#555]">New Password</div>
                <div className="w-full rounded-lg bg-white border border-gray-300 overflow-hidden flex flex-row items-center py-3 px-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter new password"
                    className={`flex-1 bg-transparent border-none outline-none ${errors.password ? 'text-red-500' : 'text-gray-700'}`}
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

              <div className="w-full flex flex-col items-start gap-1.5">
                <div className="leading-[120%] text-xs text-[#555]">Confirm Password</div>
                <div className="w-full rounded-lg bg-white border border-gray-300 overflow-hidden flex flex-row items-center py-3 px-4">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm new password"
                    className={`flex-1 bg-transparent border-none outline-none ${errors.confirmPassword ? 'text-red-500' : 'text-gray-700'}`}
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
                className="w-full rounded-lg bg-gradient-to-r from-[#704ee7] to-[#5f39e4] flex flex-row items-center justify-center py-2.5 px-5 text-sm text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="tracking-[0.01em] leading-[150%]">
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </span>
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
