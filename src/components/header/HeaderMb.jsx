import { ChatUtils } from "@services/utils/chat-utils.service";
import useLocalStorage from "@hooks/useLocalStorage";
import NotificationPermissionPrompt from "@components/call-noti/NotificationPermissionPrompt";
import CallNotificationManager from "@components/call/CallNotificationManager";
import { socketService } from "@services/socket/socket.service";
import { IoIosSettings } from "react-icons/io";
import { PiSignOutBold } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import useHandleOutsideClick from "@hooks/useHandleOutsideClick";
import Logo from "./components/logo/Logo";
import SearchInputMb from "./components/search-input.jsx/seach-input-mb";
import useEffectOnce from "@/hooks/useEffectOnce";
import { userService } from "@/services/api/user/user.service";
import { Utils } from "@/services/utils/utils.service";
import { useDispatch } from "react-redux";
import useSessionStorage from "@/hooks/useSessionStorage";
const HeaderMb = () => {
    const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
    const storedUsername = useLocalStorage("username", "get");
    const [deleteSessionPageReload] = useSessionStorage("pageReload", "delete");
    const [deleteStorageUsername] = useLocalStorage("username", "delete");

    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");

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

    return (
        <div className="h-auto min-h-[8vh] bg-secondary flex items-center justify-between px-4 z-[1000]">
            <NotificationPermissionPrompt />
            <CallNotificationManager />
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
                    <div className="absolute z-[500] text-lg top-5 right-0 w-max h-auto bg-background-blur rounded-lg shadow-xl p-4">
                        <ul>
                            <li className="flex items-center gap-2">
                                <IoIosSettings className="text-3xl" />
                                <span className="size-full flex items-center">
                                    Setting
                                </span>
                            </li>
                            <li
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onLogout();
                                }}
                                className="flex items-center gap-2"
                            >
                                <PiSignOutBold className="text-3xl" />
                                <span className="size-full flex items-center">
                                    Sign out
                                </span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeaderMb;
