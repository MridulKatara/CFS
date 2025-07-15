import React, { useEffect, useRef, useState } from "react";
import masaiLogo from '/src/assets/masai.svg';
import nsdcLogo from '/src/assets/nsdc.svg';
import iitmandiLogo from '/src/assets/iitmandi.svg';
import cceLogo from '/src/assets/cce.svg';
import { validateEmail, validateMobileNumber } from '../../utils/validation';
import apiService from '../../services/api';
import Snackbar from '../../components/Snackbar';

const CreateAccountOtp = ({ form, onChange, onNext, onBack, editField, setEditField }) => {
  const emailRef = useRef();
  const phoneRef = useRef();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    if (editField === "email" && emailRef.current) {
      emailRef.current.focus();
      setEditField(null);
    }
    if (editField === "phone" && phoneRef.current) {
      phoneRef.current.focus();
      setEditField(null);
    }
  }, [editField, setEditField]);

  const validateForm = () => {
    const newErrors = {};

    // Validate email
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else {
      const emailValidation = validateEmail(form.email);
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.error;
      }
    }

    // Validate mobile number
    if (!form.phone) {
      newErrors.phone = 'Mobile number is required';
    } else {
      const mobileValidation = validateMobileNumber(form.phone);
      if (!mobileValidation.isValid) {
        newErrors.phone = mobileValidation.error;
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
      // Prepare user data for registration
      const userData = {
        fullName: form.name,
        personalEmail: form.email,
        mobileNumber: form.phone,
        universityName: form.university,
        password: form.password
      };

      await apiService.initiateRegistration(userData);
      
      setSnackbar({
        message: 'OTPs sent successfully to your email and phone!',
        type: 'success'
      });
      
      onNext();
    } catch (error) {
      setSnackbar({
        message: error.message || 'Failed to send OTPs. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    onChange(field, value);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleMobileChange = (value) => {
    // Only allow digits and limit to 10 characters
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    onChange('phone', numericValue);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: null }));
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
            className="self-stretch flex flex-col items-center justify-start gap-8"
            onSubmit={handleSubmit}
          >
            <div className="self-stretch flex flex-col items-center justify-start gap-3 font-inter">
              <div className="relative leading-[150%] font-semibold">Create Account</div>
              <div className="w-[287px] relative text-xs leading-[140%] text-[#454545] text-center inline-block font-poppins">
                <span>Access your </span>
                <span className="font-medium">CCE, </span>
                <span>IIT Mandi Minor Programs account by verifying both your <b>email</b> and <b>phone number</b>.</span>
              </div>
            </div>
            <div className="self-stretch flex flex-col items-start justify-start gap-4 text-xs text-[#555]">
              <div className="self-stretch flex flex-col items-start justify-start gap-1.5">
                <div className="relative leading-[120%]">Email</div>
                <input
                  ref={emailRef}
                  type="email"
                  value={form.email}
                  onChange={e => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  className={`self-stretch rounded-lg bg-[#fff] border-[#d9d9d9] border-solid border-[1px] box-border py-3 px-4 min-w-[240px] leading-[140%] outline-none ${errors.email ? 'border-red-500' : ''}`}
                  required
                />
                {errors.email && (
                  <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                )}
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-1">
                <div className="relative leading-[120%]">Phone number</div>
                <input
                  ref={phoneRef}
                  type="tel"
                  value={form.phone}
                  onChange={e => handleMobileChange(e.target.value)}
                  placeholder="Enter your phone number"
                  className={`self-stretch rounded-lg bg-[#fff] border-[#d9d9d9] border-solid border-[1px] box-border py-3 px-4 min-w-[240px] leading-[140%] outline-none ${errors.phone ? 'border-red-500' : ''}`}
                  required
                />
                {errors.phone && (
                  <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-2 w-full">
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
                {isLoading ? 'Sending...' : 'Send OTPs to Email & Phone'}
              </button>
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

export default CreateAccountOtp;
