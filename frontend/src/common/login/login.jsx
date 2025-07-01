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
      <div className="w-full min-h-screen flex items-center justify-center bg-[#eee0fe]">
        {/* Login Card */}
        <div className="w-[343px] rounded-3xl bg-white bg-opacity-90 border border-gray-200 shadow-lg flex flex-col items-center py-6 px-4 gap-8"
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

          {/* Login Form */}
          <form onSubmit={handleLogin} className="w-full flex flex-col items-center gap-5">
            <div className="w-full flex flex-col items-start gap-8">
              {/* Header */}
              <div className="w-full flex flex-col items-center gap-3 font-inter">
                <div className="text-[28px] font-semibold text-[#222] leading-[150%]">Login</div>
                <div className="w-[287px] text-xs leading-[140%] text-[#454545] text-center font-poppins">
                  <span>Access your </span>
                  <span className="font-medium">CCE, </span>
                  <span>IIT Mandi Minor Programs</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="w-full flex flex-col items-end gap-4 text-xs text-[#555]">
                {/* Email Field */}
                <div className="w-full flex flex-col items-start gap-1.5">
                  <div className="leading-[120%] text-[#222]">Email</div>
                  <div className="w-full flex flex-col items-start text-[#b3b3b3]">
                    <div className="w-full rounded-lg bg-white border border-gray-300 overflow-hidden flex flex-row items-center py-3 px-4 min-w-[240px]">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="w-full flex flex-col items-start gap-1">
                  <div className="leading-[120%] text-[#222]">Password</div>
                  <div className="w-full flex flex-col items-end text-[#b3b3b3]">
                    <div className="w-full flex flex-col items-start">
                      <div className="w-full rounded-lg bg-white border border-gray-300 overflow-hidden flex flex-row items-center py-3 px-4 min-w-[240px]">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="ml-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                          tabIndex={-1}
                        >
                          {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <Link
                  to="/reset-password"
                  className="self-end underline leading-[120%] font-medium font-inter text-[#6d4ae7] hover:text-purple-600 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-[#704ee7] to-[#5f39e4] flex flex-row items-center justify-center py-2.5 px-5 text-sm text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="tracking-[0.01em] leading-[150%]">
                  {isLoading ? 'Logging in...' : 'Login'}
                </span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-xs leading-[120%] text-[#454545]">
              <span>Don't have an account? </span>
              <Link
                to="/register"
                className="underline font-medium font-inter text-[#6d4ae7] hover:text-purple-600 transition-colors"
              >
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
