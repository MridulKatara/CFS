import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import usersData from '../../../data/users.json';

interface User {
  id: string;
  fullName: string;
  personalEmail: string;
  collegeEmail: string;
  universityName: string;
  enrollmentId: string;
  program: string;
  currentSemester: number;
  branch: string;
  paymentStatus: string;
  role: string;
  password: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = usersData.find(
        (user: User) => user.collegeEmail === email && user.password === password
      );

      if (user) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect based on role
        switch (user.role) {
          case 'student':
            window.location.href = '/student/dashboard';
            break;
          case 'admin':
            window.location.href = '/admin/dashboard';
            break;
          case 'faculty':
            window.location.href = '/faculty/dashboard';
            break;
          default:
            window.location.href = '/dashboard';
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full relative bg-lavender h-[812px] overflow-hidden text-left text-sm text-gray-200 font-roboto">
      {/* Status Bar */}
      <div className="absolute top-[0px] left-[calc(50%_-_187.5px)] w-[375px] h-11 flex flex-row items-center justify-between py-2.5 px-6 box-border gap-0">
        <div className="relative tracking-[0.01em] leading-5 font-medium">9:30</div>
        <img className="w-[46px] relative h-[17px]" alt="" src="right icons.svg" />
      </div>

      {/* Login Card */}
      <div className="absolute top-[calc(50%_-_250px)] left-[calc(50%_-_171.5px)] [backdrop-filter:blur(34px)] rounded-3xl [background:linear-gradient(180deg,_#fff_15.87%,_rgba(255,_255,_255,_0)_65.87%),_rgba(255,_255,_255,_0.2)] border-gray-300 border-solid border-[1px] box-border w-[343px] flex flex-col items-center justify-start py-6 px-4 gap-8 text-[28px] text-gray-100 font-poppins">
        
        {/* Logo Section */}
        <div className="h-[44.8px] flex flex-row items-center justify-center gap-4">
          <img className="w-[53.3px] relative max-h-full object-cover" alt="" src="cce, IIT mandi (1) 1.png" />
          <img className="w-[56.2px] relative max-h-full object-cover" alt="" src="image 161.png" />
          <img className="w-[45.5px] relative h-[44.8px] object-cover" alt="" src="image 54.png" />
          <div className="w-[53.4px] relative h-6">
            <div className="absolute h-full w-[128.09%] top-[0%] right-[-14.61%] bottom-[0%] left-[-13.48%]" />
            <img className="absolute h-[56.67%] w-[92.13%] top-[12.5%] right-[7.54%] bottom-[30.83%] left-[0.32%] max-w-full overflow-hidden max-h-full" alt="" src="Group.svg" />
            <img className="absolute h-[10%] w-[4.49%] top-[57.5%] right-[0.45%] bottom-[32.5%] left-[95.06%] max-w-full overflow-hidden max-h-full" alt="" src="®.svg" />
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="self-stretch flex flex-col items-center justify-start gap-5">
          <div className="self-stretch flex flex-col items-start justify-start gap-8">
            
            {/* Header */}
            <div className="self-stretch flex flex-col items-center justify-start gap-3 font-inter">
              <div className="relative leading-[150%] font-semibold">Login</div>
              <div className="w-[287px] relative text-xs leading-[140%] text-darkslategray text-center inline-block font-poppins">
                <span>{`Access your `}</span>
                <span className="font-medium">{`CCE, `}</span>
                <span>IIT Mandi Minor Programs</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="self-stretch flex flex-col items-end justify-start gap-4 text-xs text-dimgray">
              
              {/* Email Field */}
              <div className="self-stretch flex flex-col items-start justify-start gap-1.5">
                <div className="relative leading-[120%]">Email</div>
                <div className="self-stretch flex flex-col items-start justify-start text-darkgray">
                  <div className="self-stretch rounded-lg bg-white border-gainsboro border-solid border-[1px] box-border overflow-hidden flex flex-row items-center justify-start py-3 px-4 min-w-[240px]">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 relative leading-[140%] bg-transparent border-none outline-none text-gray-700"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="self-stretch flex flex-col items-start justify-start gap-1">
                <div className="relative leading-[120%]">Password</div>
                <div className="self-stretch flex flex-col items-end justify-start text-darkgray">
                  <div className="self-stretch flex flex-col items-start justify-start">
                    <div className="self-stretch rounded-lg bg-white border-gainsboro border-solid border-[1px] box-border overflow-hidden flex flex-row items-center justify-start py-3 px-4 min-w-[240px]">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="flex-1 relative leading-[140%] bg-transparent border-none outline-none text-gray-700"
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="relative [text-decoration:underline] leading-[120%] font-medium font-inter text-blueviolet cursor-pointer hover:text-purple-600 transition-colors">
                Forgot Password?
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="self-stretch text-red-500 text-xs text-center font-medium">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="self-stretch rounded-lg [background:linear-gradient(95.11deg,_#704ee7,_#5f39e4)] overflow-hidden flex flex-row items-center justify-center py-2.5 px-5 text-sm text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative tracking-[0.01em] leading-[150%] font-semibold">
                {isLoading ? 'Logging in...' : 'Login'}
              </div>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="relative text-xs leading-[120%] text-darkslategray">
            <span>
              <span>Don't have an account?</span>
              <span className="text-white">{` `}</span>
            </span>
            <span className="[text-decoration:underline] font-medium font-inter text-blueviolet cursor-pointer hover:text-purple-600 transition-colors">
              Sign Up
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
