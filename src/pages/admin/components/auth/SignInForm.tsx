import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authService } from "@services/api/auth/auth.service";
import useLocalStorage from "@hooks/useLocalStorage";
import { Utils } from "@services/utils/utils.service";
import useSessionStorage from "@hooks/useSessionStorage";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
// import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import {
  FaChevronDown as ChevronDownIcon,
  FaChevronLeft as ChevronLeftIcon,
  FaEye as EyeCloseIcon,
  FaEyeSlash as EyeIcon,
  FaPlug as PlugInIcon,
  FaBars,
  FaUsers,
} from "react-icons/fa";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(true);
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [user, setUser] = useState();
    const state = useSelector((state) => state);
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
          password,
          provider: "local",
        });
        console.log(result, "log");
        // Và thay thế dòng gây lỗi:
        const decodedToken = jwtDecode(result.data.token); 
        console.log(decodedToken, "decode") 
        const role = (decodedToken as any)?.role;
        console.log(role, "role");
        if (role !== "ADMIN") {
          setHasError(true);
          setAlertType("alert-error");
          setErrorMessage("You do not have permission to access this page.");
          setLoading(false);
          return;
        }
        setLoggedIn(keepLoggedIn);
        setStoredUsername(username);

      setHasError(false);
      setAlertType("alert-success");
      Utils.dispatchUser(result, pageReload, dispatch, setUser);
    } catch (error) {
      setLoading(false);
      setHasError(true);
      setAlertType("alert-error");
      setErrorMessage(error?.response?.data.message);
    }
  };

  useEffect(() => {
    if (loading && !user) return;
    if (user) navigate("/admin");
    console.log(state, "token");
  }, [loading, user, navigate]);

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-3xl sm:text-4xl dark:text-white/90">
              Sign In
            </h1>
          </div>
          <div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              {/* <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div> */}
            </div>
            <form onSubmit={loginUser}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {/* <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isChecked}
                      onChange={(value) => {
                        setIsChecked(value);
                        setKeepLoggedIn(value);
                      }}
                    />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div> */}
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-md hover:bg-blue-600"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </div>
              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  to="/admin/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
