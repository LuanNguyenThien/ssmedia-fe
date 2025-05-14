import { ChatUtils } from "@services/utils/chat-utils.service";
import useLocalStorage from "@hooks/useLocalStorage";
import NotificationPermissionPrompt from "@components/call-noti/NotificationPermissionPrompt";
import CallNotificationManager from "@components/call/CallNotificationManager";
import { socketService } from "@services/socket/socket.service";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import useHandleOutsideClick from "@hooks/useHandleOutsideClick";
import Logo from "./components/logo/Logo";
import SearchInputMb from "./components/search-input.jsx/seach-input-mb";
import useEffectOnce from "@/hooks/useEffectOnce";
import DropdownSettingMb from "./components/dropdown/DropdownSettingMb";
import { Utils } from "@/services/utils/utils.service";
import { useDispatch, useSelector } from "react-redux";
import { userService } from "@/services/api/user/user.service";
import useSessionStorage from "@hooks/useSessionStorage";

const HeaderMb = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile } = useSelector((state) => state.user);

    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const containerRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");

    const storedUsername = useLocalStorage("username", "get");
    const [deleteStorageUsername] = useLocalStorage("username", "delete");
    const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
    const [deleteSessionPageReload] = useSessionStorage("pageReload", "delete");

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
        <div className="h-auto min-h-[8vh] bg-secondary flex items-center justify-between px-4 z-[1000] header-mb">
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
                    <DropdownSettingMb
                        id={profile?._id}
                        name={profile?.username}
                        onLogout={onLogout}
                    />
                )}
            </div>
        </div>
    );
};

export default HeaderMb;
