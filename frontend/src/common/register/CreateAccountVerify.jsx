import React, { useState } from "react";
import masaiLogo from '/src/assets/masai.svg';
import nsdcLogo from '/src/assets/nsdc.svg';
import iitmandiLogo from '/src/assets/iitmandi.svg';
import cceLogo from '/src/assets/cce.svg';
import { validateOtp } from '../../utils/validation';
import apiService from '../../services/api';
import Snackbar from '../../components/Snackbar';

const CreateAccountVerify = ({ form, onChange, onBack, onEdit }) => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    // Validate email OTP
    if (!form.emailOtp) {
      newErrors.emailOtp = 'Email OTP is required';
    } else {
      const emailOtpValidation = validateOtp(form.emailOtp);
      if (!emailOtpValidation.isValid) {
        newErrors.emailOtp = emailOtpValidation.error;
      }
    }

    // Validate phone OTP
    if (!form.phoneOtp) {
      newErrors.phoneOtp = 'Phone OTP is required';
    } else {
      const phoneOtpValidation = validateOtp(form.phoneOtp);
      if (!phoneOtpValidation.isValid) {
        newErrors.phoneOtp = phoneOtpValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const otpData = {
        email: form.email,
        mobileNumber: form.phone,
        otpEmail: form.emailOtp,
        otpMobile: form.phoneOtp
      };

      const result = await apiService.verifyRegistrationOtp(otpData);
      
      if (result.success) {
        setSnackbar({
          message: 'Account created successfully! Redirecting to login...',
          type: 'success'
        });
        
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        // Handle partial verification
        if (result.error === 'otpEmail') {
          setErrors({ emailOtp: 'Invalid email OTP' });
        } else if (result.error === 'otpMobile') {
          setErrors({ phoneOtp: 'Invalid phone OTP' });
        }
      }
    } catch (error) {
      setSnackbar({
        message: error.message || 'Failed to verify OTPs. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (type) => {
    setIsResending(true);
    try {
      const resendData = {
        email: form.email,
        mobileNumber: form.phone,
        type: type // 'email', 'mobile', or 'both'
      };

      await apiService.resendOtp(resendData);
      
      setSnackbar({
        message: `OTP resent successfully to your ${type === 'both' ? 'email and phone' : type}!`,
        type: 'success'
      });
    } catch (error) {
      setSnackbar({
        message: error.message || 'Failed to resend OTP. Please try again.',
        type: 'error'
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleInputChange = (field, value) => {
    // Only allow digits for OTP fields
    if (field === 'emailOtp' || field === 'phoneOtp') {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      onChange(field, numericValue);
    } else {
      onChange(field, value);
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
          <div className="h-[44.8px] flex flex-row items-center justify-center gap-4">
            <img src={cceLogo} alt="CCE" className="w-[53px] h-[44px] object-contain" />
            <img src={iitmandiLogo} alt="IIT Mandi" className="w-[56px] h-[44px] object-contain" />
            <img src={nsdcLogo} alt="NSDC" className="w-[45px] h-[44px] object-contain" />
            <img src={masaiLogo} alt="Masai" className="w-[53px] h-[24px] object-contain" />
          </div>
          <form
            className="self-stretch flex flex-col items-center justify-start gap-5"
            onSubmit={handleSubmit}
          >
            <div className="self-stretch flex flex-col items-center justify-start gap-3 font-inter">
              <div className="relative leading-[150%] font-semibold">Create Account</div>
              <div className="self-stretch relative text-xs leading-[150%] text-center">
                <p className="m-0">
                  <span className="font-poppins text-[#1d1b20]">
                    Enter the OTP's sent to Phone <b className="text-[#222]">+91 {form.phone}</b>
                  </span>
                  <span
                    className="font-medium font-poppins [text-decoration:underline] text-blueviolet cursor-pointer ml-1"
                    onClick={() => onEdit("phone")}
                  >
                    edit
                  </span>
                </p>
                <p className="m-0">
                  <span className="text-[#1d1b20] font-poppins">Email </span>
                  <span className="font-semibold font-poppins text-[#222]">{form.email}</span>
                  <span
                    className="font-medium font-poppins [text-decoration:underline] text-blueviolet cursor-pointer ml-1"
                    onClick={() => onEdit("email")}
                  >
                    edit
                  </span>
                </p>
              </div>
            </div>
            <div className="self-stretch flex flex-col items-start justify-start gap-4 text-xs text-[#555]">
              <div className="self-stretch flex flex-col items-start justify-start gap-1.5">
                <div className="relative leading-[120%]">Email OTP</div>
                <input
                  type="text"
                  value={form.emailOtp}
                  onChange={e => handleInputChange("emailOtp", e.target.value)}
                  placeholder="Enter your email OTP"
                  className={`self-stretch rounded-lg bg-[#fff] border-[#d9d9d9] border-solid border-[1px] box-border py-3 px-4 min-w-[240px] leading-[140%] outline-none ${errors.emailOtp ? 'border-red-500' : ''}`}
                  required
                />
                {errors.emailOtp && (
                  <div className="text-red-500 text-xs mt-1">{errors.emailOtp}</div>
                )}
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-1">
                <div className="relative leading-[120%]">Phone OTP</div>
                <input
                  type="text"
                  value={form.phoneOtp}
                  onChange={e => handleInputChange("phoneOtp", e.target.value)}
                  placeholder="Enter your phone number OTP"
                  className={`self-stretch rounded-lg bg-[#fff] border-[#d9d9d9] border-solid border-[1px] box-border py-3 px-4 min-w-[240px] leading-[140%] outline-none ${errors.phoneOtp ? 'border-red-500' : ''}`}
                  required
                />
                {errors.phoneOtp && (
                  <div className="text-red-500 text-xs mt-1">{errors.phoneOtp}</div>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-2 w-full mt-4">
              <button
                className="flex-1 rounded-lg bg-[linear-gradient(95.11deg,#704ee7,#5f39e4)] text-[#fff] py-2.5 px-5 text-sm font-semibold cursor-pointer"
                onClick={onBack}
                type="button"
              >
                Back
              </button>
              <button
                className="flex-1 rounded-lg bg-[linear-gradient(95.11deg,#704ee7,#5f39e4)] text-[#fff] py-2.5 px-5 text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            <div className="relative text-xs leading-[170%] text-center text-[#555] mt-2">
              <p className="m-0">{`Didn't get the OTP? `}</p>
              <p className="m-0 text-[#603ae4]">
                <span className="font-medium">
                  <span 
                    className="text-[#603ae4] [text-decoration:underline] cursor-pointer hover:text-purple-600"
                    onClick={() => handleResendOtp('email')}
                  >
                    {isResending ? 'Resending...' : 'Resend email OTP'}
                  </span>
                  <span className="text-[#555]">{` | `}</span>
                  <span 
                    className="text-[#603ae4] [text-decoration:underline] cursor-pointer hover:text-purple-600"
                    onClick={() => handleResendOtp('mobile')}
                  >
                    {isResending ? 'Resending...' : 'Resend Phone OTP'}
                  </span>
                </span>
              </p>
            </div>
          </form>
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

export default CreateAccountVerify;
