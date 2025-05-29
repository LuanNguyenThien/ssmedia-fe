import { useState, useEffect, useRef } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import useLocalStorage from "@hooks/useLocalStorage";
import useSessionStorage from "@hooks/useSessionStorage";
import { userService } from "@services/api/user/user.service";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom"; 
import Avatar from "@components/avatar/Avatar";
import { socketService } from "@services/socket/socket.service";
import { Utils } from "@services/utils/utils.service";
export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const section = useLocation().pathname.split("/")[3];
  const [banReason, setBanReason] = useState("");
  //selector
  const { profile } = useSelector((state: any) => state.user);
  const { chatList } = useSelector((state: any) => state.chat);
  const token = useSelector((state: any) => state.user.token);

  //local storage
  const storedUsername = useLocalStorage("username", "get");
  const [deleteStorageUsername] = useLocalStorage("username", "delete");
  const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
  const [deleteSessionPageReload] = useSessionStorage("pageReload", "delete");
  function toggleDropdown() {
    console.log("toggleDropdown", profile);
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const onLogout = async () => {
    try {
      setLoggedIn(false);
      Utils.clearStore({
        dispatch,
        deleteStorageUsername,
        deleteSessionPageReload,
        setLoggedIn,
      });
      await userService.logoutUser();
      socketService?.socket.disconnect();
      socketService?.removeAllListeners();
      socketService.setupSocketConnection();
      navigate("/admin/signin");
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle "
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Avatar
            name={profile?.username}
            bgColor={profile?.avatarColor}
            textColor="#ffffff"
            size={40}
            avatarSrc={profile?.profilePicture}
            onClick={() => {}}
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {profile?.username}
        </span>
        <svg
          className={`stroke-gray-500  transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg "
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm ">
            {profile?.username}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 ">
            {profile?.email}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 ">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/admin/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700  "
            >
              <svg
                className="fill-gray-500 group-hover:fill-gray-700 "
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"
                  fill=""
                />
              </svg>
              Profile
            </DropdownItem>
          </li>

          {/* <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700  "
            >
              <svg
                className="fill-gray-500 group-hover:fill-gray-700 "
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM11.0991 7.52507C11.0991 8.02213 11.5021 8.42507 11.9991 8.42507H12.0001C12.4972 8.42507 12.9001 8.02213 12.9001 7.52507C12.9001 7.02802 12.4972 6.62507 12.0001 6.62507H11.9991C11.5021 6.62507 11.0991 7.02802 11.0991 7.52507ZM12.0001 17.3714C11.5859 17.3714 11.2501 17.0356 11.2501 16.6214V10.9449C11.2501 10.5307 11.5859 10.1949 12.0001 10.1949C12.4143 10.1949 12.7501 10.5307 12.7501 10.9449V16.6214C12.7501 17.0356 12.4143 17.3714 12.0001 17.3714Z"
                  fill=""
                />
              </svg>
              Support
            </DropdownItem>
          </li> */}
        </ul>
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 ">
          <li>
            <DropdownItem
              onItemClick={() => {
                closeDropdown(); // đóng dropdown trước
                onLogout(); // sau đó xử lý đăng xuất
              }}
              tag="button"
              className="flex items-center gap-3 px-3 py-2 font-medium text-red-600 rounded-lg group text-theme-sm hover:bg-red-100 hover:text-red-700 "
            >
              <svg
                className="fill-red-500 group-hover:fill-red-700"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.707 14.707L14.293 13.293L15.586 12H8V10H15.586L14.293 8.707L15.707 7.293L19.414 11L15.707 14.707ZM5 5H12V3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H12V19H5V5Z"
                  fill="currentColor"
                />
              </svg>
              Đăng xuất
            </DropdownItem>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}
