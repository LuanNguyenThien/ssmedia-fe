// import { useState } from 'react';
import PropTypes from 'prop-types';

import { useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
// import Input from '@components/input/Input';
// import Button from '@components/button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '@pages/auth/login/Login.scss';
import { authService } from '@services/api/auth/auth.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { Utils } from '@services/utils/utils.service';
import useSessionStorage from '@hooks/useSessionStorage';
const Login = ({ onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [user, setUser] = useState();
  // const [usernameTouched, setUsernameTouched] = useState(false);
  // const [passwordTouched, setPasswordTouched] = useState(false);
  const [setStoredUsername] = useLocalStorage('username', 'set');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [pageReload] = useSessionStorage('pageReload', 'set');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginUser = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const result = await authService.signIn({
        username,
        password
      });
      setLoggedIn(keepLoggedIn);
      setStoredUsername(username);
      setHasError(false);
      setAlertType('alert-success');
      Utils.dispatchUser(result, pageReload, dispatch, setUser);
    } catch (error) {
      setLoading(false);
      setHasError(true);
      setAlertType('alert-error');
      setErrorMessage(error?.response?.data.message);
    }
  };

  useEffect(() => {
    if (loading && !user) return;
    if (user) navigate('/app/social/streams');
  }, [loading, user, navigate]);

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Login to your account</h1>
        <p className="text-gray-500 mb-8">Welcome back! Please enter your details</p>

        <button className="w-full border border-gray-300 rounded-full py-3 px-4 flex items-center justify-center mb-6">
          Login with Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        {hasError && errorMessage && (
          <div className={`alerts ${alertType}`} role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={loginUser}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-800 mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="username"
              id="email"
              name="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-gray-800">
                Password<span className="text-red-500">*</span>
              </label>
              <a href="#" className="text-sm text-green-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                // checked={formData.rememberMe}
                onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-full hover:bg-gray-800 transition duration-200"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don&apos;t have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-green-600 hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </>
  );
};

Login.propTypes = {
  onSwitchToRegister: PropTypes.func.isRequired
};
export default Login;
