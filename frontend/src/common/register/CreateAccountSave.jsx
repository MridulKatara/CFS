import React, { useState, useEffect } from "react";
import masaiLogo from '/src/assets/masai.svg';
import nsdcLogo from '/src/assets/nsdc.svg';
import iitmandiLogo from '/src/assets/iitmandi.svg';
import cceLogo from '/src/assets/cce.svg';
import { validatePassword, validateConfirmPassword, validateRequired } from '../../utils/validation';
import ApiService from "../../services/api";

const CreateAccountSave = ({ form, onChange, onNext }) => {
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch universities on component mount
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getUniversities();
        setUniversities(data || []);
      } catch (error) {
        console.error("Failed to fetch universities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    const requiredFields = [
      { field: 'name', label: 'Name' },
      { field: 'university', label: 'University Name' },
      { field: 'password', label: 'Password' },
      { field: 'confirmPassword', label: 'Confirm Password' }
    ];

    requiredFields.forEach(({ field, label }) => {
      const validation = validateRequired(form[field], label);
      if (!validation.isValid) {
        newErrors[field] = validation.error;
      }
    });

    // Validate password
    if (form.password) {
      const passwordValidation = validatePassword(form.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0]; // Show first error
      }
    }

    // Validate confirm password
    if (form.confirmPassword) {
      const confirmValidation = validateConfirmPassword(form.password, form.confirmPassword);
      if (!confirmValidation.isValid) {
        newErrors.confirmPassword = confirmValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field, value) => {
    onChange(field, value);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
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
        <div className="self-stretch flex flex-col items-center justify-start">
          <form
            className="self-stretch flex flex-col items-start justify-start gap-4"
            onSubmit={handleSubmit}
          >
            <div className="self-stretch flex flex-col items-center justify-start font-inter">
              <div className="relative leading-[150%] font-semibold">Create Account</div>
            </div>
            <div className="self-stretch flex flex-col items-start justify-start gap-4 text-xs text-[#555]">
              {/* Name Field */}
              <div className="self-stretch flex flex-col items-start justify-start gap-1.5">
                <div className="relative leading-[120%]">Name</div>
                  <div className="self-stretch flex flex-col items-start justify-start text-[#b3b3b3]">
                    <input
                      type="text"
                    value={form.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder="Enter your name"
                    className={`self-stretch rounded-lg bg-[#fff] border-[#d9d9d9] border-solid border-[1px] box-border py-3 px-4 min-w-[240px] leading-[140%] outline-none ${errors.name ? 'border-red-500' : ''}`}
                      required
                    />
                  {errors.name && (
                    <div className="text-red-500 text-xs mt-1">{errors.name}</div>
                    )}
                  </div>
              </div>

              {/* University Dropdown */}
              <div className="self-stretch flex flex-col items-start justify-start gap-1.5">
                <div className="relative leading-[120%]">University Name</div>
                <div className="self-stretch flex flex-col items-start justify-start text-[#b3b3b3]">
                  <select
                    value={form.university}
                    onChange={e => handleInputChange('university', e.target.value)}
                    className={`self-stretch rounded-lg bg-[#fff] border-[#d9d9d9] border-solid border-[1px] box-border py-3 px-4 min-w-[240px] leading-[140%] outline-none ${errors.university ? 'border-red-500' : ''}`}
                    required
                    disabled={loading}
                  >
                    <option value="">Select your university</option>
                    {universities.map(university => (
                      <option key={university._id} value={university.name}>
                        {university.name}
                      </option>
                    ))}
                  </select>
                  {errors.university && (
                    <div className="text-red-500 text-xs mt-1">{errors.university}</div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="self-stretch flex flex-col items-start justify-start gap-1.5">
                <div className="relative leading-[120%]">Create Password</div>
                <div className="self-stretch flex flex-col items-start justify-start text-[#b3b3b3]">
                  <div className="self-stretch rounded-lg bg-[#fff] border-[#d9d9d9] border-solid border-[1px] box-border overflow-hidden flex flex-row items-center justify-start py-3 px-4 min-w-[240px]">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={e => handleInputChange("password", e.target.value)}
                      placeholder="Create your password"
                      className={`flex-1 relative leading-[140%] bg-transparent border-none outline-none ${errors.password ? 'text-red-500' : 'text-gray-700'}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="ml-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="text-red-500 text-xs mt-1">{errors.password}</div>
                  )}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="self-stretch flex flex-col items-start justify-start gap-1.5">
                <div className="relative leading-[120%]">Confirm Password</div>
                <div className="self-stretch flex flex-col items-start justify-start text-[#b3b3b3]">
                  <div className="self-stretch rounded-lg bg-[#fff] border-[#d9d9d9] border-solid border-[1px] box-border overflow-hidden flex flex-row items-center justify-start py-3 px-4 min-w-[240px]">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={e => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="Confirm your password"
                      className={`flex-1 relative leading-[140%] bg-transparent border-none outline-none ${errors.confirmPassword ? 'text-red-500' : 'text-gray-700'}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="ml-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>
                  )}
                </div>
              </div>
            </div>
            <button
              className="self-stretch rounded-lg bg-[linear-gradient(95.11deg,#704ee7,#5f39e4)] overflow-hidden flex flex-row items-center justify-center py-2.5 px-5 text-sm text-[#fff] font-semibold mt-2 cursor-pointer"
              type="submit"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountSave;
