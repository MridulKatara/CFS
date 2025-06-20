import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../index.css';
import masaiLogo from '/src/assets/masai.svg';
import nsdcLogo from '/src/assets/nsdc.svg';
import iitmandiLogo from '/src/assets/iitmandi.svg'
import cceLogo from '/src/assets/cce.svg'
import apiService from '../../services/api';
import Snackbar from '../../components/Snackbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const credentials = {
        personalEmail: email,
        password: password
      };
      // const health = await apiService.getHealth();
      // console.log(health);
      const response = await apiService.login(credentials);

      if (response.success) {
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        
        setSnackbar({
          message: 'Login successful! Redirecting...',
          type: 'success'
        });

        // Redirect based on role
        setTimeout(() => {
          switch (response.data.user.role) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'faculty':
              navigate('/faculty/dashboard');
              break;
            default:
              navigate('/home');
          }
        }, 1000);
      } else {
        setSnackbar({
          message: response.message || 'Invalid credentials',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setSnackbar({
        message: error.message || 'An error occurred during login',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="w-full relative bg-[#eee0fe] h-[100vh] overflow-hidden text-left text-sm text-[#1d1b20] font-roboto">
        {/* Login Card */}
        <div className="absolute top-[calc(50%_-_250px)] left-[calc(50%_-_171.5px)] backdrop-filter-blur-[34px] rounded-3xl bg-[linear-gradient(180deg,#fff_15.87%,rgba(255,255,255,0)_65.87%),rgba(255,255,255,0.2)] border-solid border-[1px] box-border w-[343px] flex flex-col items-center justify-start py-6 px-4 gap-8 text-[28px] text-[#222222] font-poppins border-[rgba(255,255,255,0.8)]">
          
          {/* Logo Section */}
          <div className="h-[44.8px] flex flex-row items-center justify-center gap-4">
            <img src={cceLogo} alt="CCE" />
            <img src={iitmandiLogo} alt="IIT Mandi" />
            <img src={nsdcLogo} alt="NSDC" />
            <img src={masaiLogo} alt="Masai" />  
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="self-stretch flex flex-col items-center justify-start gap-5">
            <div className="self-stretch flex flex-col items-start justify-start gap-8">
              
              {/* Header */}
              <div className="self-stretch flex flex-col items-center justify-start gap-3 font-inter">
                <div className="relative leading-[150%] font-semibold">Login</div>
                <div className="w-[287px] relative text-xs leading-[140%] text-[#454545] text-center inline-block font-poppins">
                  <span>{`Access your `}</span>
                  <span className="font-medium">{`CCE, `}</span>
                  <span>IIT Mandi Minor Programs</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="self-stretch flex flex-col items-end justify-start gap-4 text-xs text-[#555555]">
                
                {/* Email Field */}
                <div className="self-stretch flex flex-col items-start justify-start gap-1.5">
                  <div className="relative leading-[120%]">Personal Email</div>
                  <div className="self-stretch flex flex-col items-start justify-start text-[#b3b3b3]">
                    <div className="self-stretch rounded-lg bg-[#ffffff] border-[#d9d9d9] border-solid border-[1px] box-border overflow-hidden flex flex-row items-center justify-start py-3 px-4 min-w-[240px]">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your personal email address"
                        className="flex-1 relative leading-[140%] bg-transparent border-none outline-none text-gray-700"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="self-stretch flex flex-col items-start justify-start gap-1">
                  <div className="relative leading-[120%]">Password</div>
                  <div className="self-stretch flex flex-col items-end justify-start text-[#b3b3b3]">
                    <div className="self-stretch flex flex-col items-start justify-start">
                      <div className="self-stretch rounded-lg bg-[#ffffff] border-[#d9d9d9] border-solid border-[1px] box-border overflow-hidden flex flex-row items-center justify-start py-3 px-4 min-w-[240px]">
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
                          className="ml-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        >
                          {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <Link to="/reset-password" className="relative [text-decoration:underline] leading-[120%] font-medium font-inter text-[#6d4ae7] cursor-pointer hover:text-purple-600 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="self-stretch rounded-lg [background:linear-gradient(95.11deg,_#704ee7,_#5f39e4)] overflow-hidden flex flex-row items-center justify-center py-2.5 px-5 text-sm text-[#ffffff] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <div className="relative tracking-[0.01em] leading-[150%] font-semibold">
                  {isLoading ? 'Logging in...' : 'Login'}
                </div>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="relative text-xs leading-[120%] text-[#454545]">
              <span>
                <span>Don't have an account?</span>
                <span className="text-[#ffffff]">{` `}</span>
              </span>
              <Link to="/register" className="[text-decoration:underline] font-medium font-inter text-[#6d4ae7] cursor-pointer hover:text-purple-600 transition-colors">
                Sign Up
              </Link>
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

export default Login;
