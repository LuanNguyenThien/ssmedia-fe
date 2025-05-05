import { useDispatch, useSelector } from "react-redux";
import { IoIosSettings } from "react-icons/io";
import { PiSignOutBold } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socketService } from "@services/socket/socket.service";
import { userService } from "@services/api/user/user.service";
import useLocalStorage from "@hooks/useLocalStorage";
import useSessionStorage from "@hooks/useSessionStorage";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import useHandleOutsideClick from "@hooks/useHandleOutsideClick";
import Logo from "./components/logo/Logo";
import SearchInputMb from "./components/search-input.jsx/seach-input-mb";
import { Utils } from "@services/utils/utils.service";
const HeaderMb = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
  const [deleteStorageUsername] = useLocalStorage("username", "delete");
  const [searchTerm, setSearchTerm] = useState("");
  const [banReason, setBanReason] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteSessionPageReload] = useSessionStorage("pageReload", "delete");
  //selector
  const { profile } = useSelector((state) => state.user);

  useHandleOutsideClick(containerRef, setIsOpenMenu);

  const handleSearchKeyPress = () => {
    navigate("/app/social/search", { state: { query: searchTerm } });
  };
  const handleOpenMenu = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  const handleCloseBanModal = () => {
    onClose();
    onLogout(); // Đăng xuất sau khi đóng modal
  };

  useEffect(() => {
    const handleBanUser = ({ userId, reason }) => {
      if (profile?._id === userId) {
        setBanReason(reason);
        onOpen(); // Mở modal khi bị ban
      }
    };

    socketService?.socket?.on("ban user", handleBanUser);

    return () => {
      socketService?.socket?.off("ban user", handleBanUser);
    };
  }, [profile]);

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
              navigate("/");
          } catch (error) {
              Utils.dispatchNotification(
                  error.response.data.message,
                  "error",
                  dispatch
              );
          }
      };
  

 return (
   <>
     <div className="h-[8vh] bg-secondary flex items-center justify-between px-4">
       <Logo />
       <div className="flex items-center justify-end gap-4 relative max-w-[80%]">
         <SearchInputMb
           handleSearchKeyPress={handleSearchKeyPress}
           searchTerm={searchTerm}
           setSearchTerm={setSearchTerm}
         />
         <div ref={containerRef} onClick={handleOpenMenu}>
           <RxHamburgerMenu className="text-3xl text-primary-black" />
         </div>
         {isOpenMenu && (
           <div className="absolute z-[50] text-lg top-5 right-0 w-max h-auto bg-background-blur rounded-lg shadow-xl p-4">
             <ul>
               <li className="flex items-center gap-2">
                 <IoIosSettings className="text-3xl" />
                 <span className="size-full flex items-center">Setting</span>
               </li>
               <li className="flex items-center gap-2">
                 <PiSignOutBold className="text-3xl" />
                 <span className="size-full flex items-center">Sign out</span>
               </li>
             </ul>
           </div>
         )}
       </div>
     </div>

     {isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 text-center">
      <h2 className="text-xl font-semibold text-red-600 mb-4">Tài khoản bị khóa</h2>
      <p className="text-gray-700 mb-6">
        {banReason || "Tài khoản của bạn đã bị cấm. Vui lòng liên hệ quản trị viên để biết thêm chi tiết."}
      </p>
      <button
        onClick={handleCloseBanModal}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
      >
        Đăng xuất
      </button>
    </div>
  </div>
)}

   </>
 );}


export default HeaderMb;
