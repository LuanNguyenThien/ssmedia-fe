import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Utils } from '@services/utils/utils.service';
import { authService } from '@services/api/auth/auth.service';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '@hooks/useLocalStorage';
import useSessionStorage from '@hooks/useSessionStorage';
import { useDispatch } from 'react-redux';
export default function Register({ onSwitchToLogin }) {
  
   const [username, setUsername] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');
   const [alertType, setAlertType] = useState('');
   const [hasError, setHasError] = useState(false);
   const [user, setUser] = useState();
   const [showPassword, setShowPassword] = useState(false);
   const [setStoredUsername] = useLocalStorage('username', 'set');
   const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
   const [pageReload] = useSessionStorage('pageReload', 'set');
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const registerUser = async (event) => {
     setLoading(true);
     event.preventDefault();
     try {
       const avatarColor = Utils.avatarColor();
       const avatarImage = Utils.generateAvatar(username.charAt(0).toUpperCase(), avatarColor);
       const result = await authService.signUp({
         username,
         email,
         password,
         avatarColor,
         avatarImage
       });
       setLoggedIn(true);
       setStoredUsername(username);
       setAlertType('alert-success');
       Utils.dispatchUser(result, pageReload, dispatch, setUser);
     } catch (error) {
       setLoading(false);
       setHasError(true);
       setAlertType('alert-error');
       setErrorMessage(error?.response?.data?.message);
     }
   };

   useEffect(() => {
     if (loading && !user) return;
     if (user) navigate('/app/social/streams');
   }, [loading, user, navigate]);

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Create your account</h1>
        <p className="text-gray-500 mb-8">Let&apos;s get started with your 30 days free trial</p>

        <button className="w-full border border-gray-300 rounded-full py-3 px-4 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" className="mr-2">
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
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
        <form onSubmit={registerUser}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-800 mb-1">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-800 mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-800 mb-1">
              Password<span className="text-red-500">*</span>
            </label>
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

          {/* <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <span className="text-sm text-gray-700">I agree to all Terms, Privacy Policy and Fees</span>
            </label>
          </div> */}

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-full hover:bg-gray-800 transition duration-200"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-green-600 hover:underline">
            Log in
          </button>
        </p>
      </div>
    </>
  );
}

// Định nghĩa prop-types
Register.propTypes = {
  onSwitchToLogin: PropTypes.func.isRequired
};
