import { useDispatch, useSelector } from "react-redux";
import { ChatUtils } from "@services/utils/chat-utils.service";
import NotificationPermissionPrompt from "@components/call-noti/NotificationPermissionPrompt";
import CallNotificationManager from "@components/call/CallNotificationManager";
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
import useEffectOnce from "@/hooks/useEffectOnce";
import DropdownSettingMb from "./components/dropdown/DropdownSettingMb";
import { Utils } from "@/services/utils/utils.service";

const HeaderMb = () => {
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
    const storedUsername = useLocalStorage("username", "get");
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

    //logout
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

    useEffectOnce(() => {
        ChatUtils.usersOnlines();
        socketService?.socket.emit("setup", { userId: storedUsername });
    }, []);

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

    return (
        <>
            <div className="h-[8vh] bg-secondary flex items-center justify-between px-4 z-[1000] header-mb">
                <NotificationPermissionPrompt />
                <CallNotificationManager />
                <Logo />
                <div className="flex items-center justify-end gap-4 relative max-w-[80%]">
                    <SearchInputMb
                        handleSearchKeyPress={handleSearchKeyPress}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    <div onClick={handleOpenMenu}>
                        <RxHamburgerMenu className="text-3xl text-primary-black" />
                    </div>
                    {isOpenMenu && (
                        <DropdownSettingMb
                            ref={containerRef}
                            id={profile?._id}
                            name={profile?.username}
                            onLogout={onLogout}
                        />
                    )}
                </div>
            </div>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 text-center">
                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                            Tài khoản bị khóa
                        </h2>
                        <p className="text-gray-700 mb-6">
                            {banReason ||
                                "Tài khoản của bạn đã bị cấm. Vui lòng liên hệ quản trị viên để biết thêm chi tiết."}
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
    );
};

export default HeaderMb;
