import { useState, useEffect, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";

import { assets } from "@assets/assets";
import "@components/header/Header.scss";
import Avatar from "@components/avatar/Avatar";
import { Utils } from "@services/utils/utils.service";
import useDetectOutsideClick from "@hooks/useDetectOutsideClick";
import { useDispatch, useSelector } from "react-redux";
import useEffectOnce from "@hooks/useEffectOnce";
import { ProfileUtils } from "@services/utils/profile-utils.service";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import useLocalStorage from "@hooks/useLocalStorage";
import useSessionStorage from "@hooks/useSessionStorage";
import { userService } from "@services/api/user/user.service";
import HeaderSkeleton from "@components/header/HeaderSkeleton";
import { notificationService } from "@services/api/notifications/notification.service";
import { NotificationUtils } from "@services/utils/notification-utils.service";
import { FollowersUtils } from "@services/utils/followers-utils.service";
import NotificationPreview from "@components/dialog/NotificationPreview";
import { socketService } from "@services/socket/socket.service";
import { sumBy, upperCase } from "lodash";
import { ChatUtils } from "@services/utils/chat-utils.service";
import { chatService } from "@services/api/chat/chat.service";
import { getConversationList } from "@redux/api/chat";

// components
import DropdownSetting from "@components/header/components/dropdown/DropdownSetting";
import SearchButtonMb from "@components/header/components/searchButton/SearchButtonMb";
import Logo from "./components/logo/Logo";
import SearchInputDesktop from "./components/search-input.jsx/seach-input-desktop";
import Dropdown from "components/dropdown/Dropdown";
import MessageSidebar from "components/message-sidebar/MessageSidebar";
const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const section = useLocation().pathname.split("/")[3];

    //selector
    const { profile } = useSelector((state) => state.user);
    const { chatList } = useSelector((state) => state.chat);
    const token = useSelector((state) => state.user.token);

    //local storage
    const storedUsername = useLocalStorage("username", "get");
    const [deleteStorageUsername] = useLocalStorage("username", "delete");
    const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
    const [deleteSessionPageReload] = useSessionStorage("pageReload", "delete");

    const [blockedUsers, setBlockedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    //notifications
    const notificationRef = useRef(null);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notificationDialogContent, setNotificationDialogContent] = useState({
        post: "",
        imgUrl: "",
        comment: "",
        reaction: "",
        senderName: "",
    });
    const [isNotificationActive, setIsNotificationActive] =
        useDetectOutsideClick(notificationRef, false);

    //chats
    const [messageCount, setMessageCount] = useState(0);
    const [messageNotifications, setMessageNotifications] = useState([]);
    const messageRef = useRef(null);
    const [isMessageActive, setIsMessageActive] = useDetectOutsideClick(
        messageRef,
        false
    );

    //settings
    const settingsRef = useRef(null);
    const [isSettingsActive, setIsSettingsActive] = useDetectOutsideClick(
        settingsRef,
        false
    );

    useEffectOnce(() => {
        ChatUtils.usersOnlines();
        // Utils.mapSettingsDropdownItems(setSettings);
        getUserNotifications();
    });

    useEffect(() => {
        const count = sumBy(chatList, (notification) => {
            return !notification?.isRead &&
                notification?.receiverUsername === profile?.username
                ? 1
                : 0;
        });
        setMessageCount(count);
        setMessageNotifications(chatList);
    }, [chatList, profile]);

    useEffect(() => {
        NotificationUtils.socketIOAnalyzeNotifications(profile, dispatch);
        NotificationUtils.socketIONotification(
            profile,
            notifications,
            setNotifications,
            "header",
            setNotificationCount
        );
        NotificationUtils.socketIOMessageNotification(
            chatList,
            profile,
            messageNotifications,
            setMessageNotifications,
            setMessageCount,
            dispatch,
            location
        );
    }, [profile, notifications, dispatch, location, messageNotifications]);

    useEffect(() => {
        FollowersUtils.socketIOBlockAndUnblock(
            profile,
            token,
            setBlockedUsers,
            dispatch
        );
    }, [dispatch, profile, token]);

    //notifications
    const getUserNotifications = async () => {
        try {
            const response = await notificationService.getUserNotifications();
            const mappedNotifications =
                NotificationUtils.mapNotificationDropdownItems(
                    response.data.notifications,
                    setNotificationCount
                );
            setNotifications(mappedNotifications);
            socketService?.socket.emit("setup", { userId: storedUsername });
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };
    const onMarkAsRead = async (notification) => {
        try {
            NotificationUtils.markMessageAsRead(
                notification?._id,
                notification,
                setNotificationDialogContent
            );
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };
    const onDeleteNotification = async (messageId) => {
        try {
            const response = await notificationService.deleteNotification(
                messageId
            );
            Utils.dispatchNotification(
                response.data.message,
                "success",
                dispatch
            );
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };
    //chats
    const openChatPage = async (notification) => {
        try {
            const params = ChatUtils.chatUrlParams(notification, profile);
            ChatUtils.joinRoomEvent(notification, profile);
            ChatUtils.privateChatMessages = [];
            const receiverId =
                notification?.receiverUsername !== profile?.username
                    ? notification?.receiverId
                    : notification?.senderId;
            if (
                notification?.receiverUsername === profile?.username &&
                !notification.isRead
            ) {
                await chatService.markMessagesAsRead(profile?._id, receiverId);
            }
            const userTwoName =
                notification?.receiverUsername !== profile?.username
                    ? notification?.receiverUsername
                    : notification?.senderUsername;
            if(!notification.isGroupChat){        
                await chatService.addChatUsers({
                    userOne: profile?.username,
                    userTwo: userTwoName,
                });
            }
            navigate(`/app/social/chat/messages?${createSearchParams(params)}`);
            setIsMessageActive(false);
            dispatch(getConversationList());
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };
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

    const handleSearchKeyPress = () => {
        navigate("/app/social/search", { state: { query: searchTerm } });
    };

    return (
        <>
            {!profile ? (
                <HeaderSkeleton />
            ) : (
                <div
                    className="header-nav-wrapper bg-secondary"
                    data-testid="header-wrapper"
                >
                    {/* popups */}
                    {/* message  */}

                    {/* notifications */}
                    {notificationDialogContent?.senderName && (
                        <NotificationPreview
                            title="Your post"
                            post={notificationDialogContent?.post}
                            imgUrl={notificationDialogContent?.imgUrl}
                            comment={notificationDialogContent?.comment}
                            reaction={notificationDialogContent?.reaction}
                            senderName={notificationDialogContent?.senderName}
                            secondButtonText="Close"
                            secondBtnHandler={() => {
                                setNotificationDialogContent({
                                    post: "",
                                    imgUrl: "",
                                    comment: "",
                                    reaction: "",
                                    senderName: "",
                                });
                            }}
                        />
                    )}

                    <div className="header-navbar grid grid-cols-5">
                        <div className="col-span-1">
                            <Logo />
                        </div>
                        {/* SEARCH */}
                        <div className="col-span-3 flex justify-between items-center mx-10 gap-4">
                            <span className="font-extrabold text-primary-black flex items-center">
                                {upperCase(section)}
                            </span>
                            <SearchInputDesktop
                                onClick={handleSearchKeyPress}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                            />
                        </div>

                        <ul className="header-nav w-full h-6 col-span-1 flex justify-end gap-4">
                            {/* MESSAGE */}
                            <li
                                data-testid="message-list-item"
                                className="header-nav-item active-item"
                                onClick={() => {
                                    setIsMessageActive(
                                        (prevState) => !prevState
                                    );
                                    setIsNotificationActive(false);
                                    setIsSettingsActive(false);
                                }}
                            >
                                <span className="header-list-name relative group ">
                                    <img
                                        src={assets.message}
                                        className="h-7 w-7 group-hover:scale-110 duration-200"
                                    />
                                    {messageCount > 0 && (
                                        <span
                                            className="bg-danger-dots dots group-hover:scale-110 duration-200"
                                            data-testid="messages-dots"
                                        ></span>
                                    )}
                                    {isMessageActive && (
                                        <div
                                            className="absolute top-8 right-0 z-50"
                                            ref={messageRef}
                                        >
                                            <MessageSidebar
                                                profile={profile}
                                                messageCount={messageCount}
                                                messageNotifications={
                                                    messageNotifications
                                                }
                                                openChatPage={openChatPage}
                                            />
                                        </div>
                                    )}
                                </span>
                                &nbsp;
                            </li>
                            {/* NOTIFICATION */}
                            <li
                                data-testid="notification-list-item"
                                className="header-nav-item active-item"
                                onClick={() => {
                                    if (isNotificationActive === true)
                                        setIsNotificationActive(false);
                                    else setIsNotificationActive(true);
                                    setIsMessageActive(false);
                                    setIsSettingsActive(false);
                                }}
                            >
                                <span className="header-list-name group relative">
                                    {notificationCount > 0 && (
                                        <span
                                            className="bg-danger-dots dots group-hover:scale-110 duration-200"
                                            data-testid="notification-dots"
                                        >
                                            {notificationCount}
                                        </span>
                                    )}
                                    <img
                                        src={assets.notification}
                                        className="w-8 h-8 group-hover:scale-110 duration-200"
                                    />
                                    {/* notification dropdown */}
                                    {isNotificationActive && (
                                        <ul
                                            className="absolute top-8 right-0 z-50"
                                            ref={notificationRef}
                                        >
                                            <Dropdown
                                                data={notifications}
                                                notificationCount={
                                                    notificationCount
                                                }
                                                title="Notifications"
                                                onMarkAsRead={onMarkAsRead}
                                                onDeleteNotification={
                                                    onDeleteNotification
                                                }
                                            />
                                        </ul>
                                    )}
                                </span>
                            </li>

                            {/* PROFILE */}
                            <li
                                data-testid="settings-list-item "
                                className="header-nav-item relative"
                                onClick={() => {
                                    setIsSettingsActive(!isSettingsActive);
                                    setIsMessageActive(false);
                                    setIsNotificationActive(false);
                                }}
                            >
                                <div className="flex items-center relative">
                                    <div className="size-[35px]">
                                        <Avatar
                                            name={profile?.username}
                                            bgColor={profile?.avatarColor}
                                            textColor="#ffffff"
                                            size={35}
                                            avatarSrc={profile?.profilePicture}
                                        />
                                        <IoIosArrowBack
                                            className={`absolute bottom-[-5px] right-0 text-white bg-gray-700 bg-opacity-70 rounded-full ${
                                                isSettingsActive
                                                    ? "transition-all -rotate-90 duration-100 ease-linear "
                                                    : ""
                                            } `}
                                        />
                                        {isSettingsActive && (
                                            <ul
                                                className="absolute top-8 right-0 z-50"
                                                ref={settingsRef}
                                            >
                                                <DropdownSetting
                                                    isSettingsActive={
                                                        isSettingsActive
                                                    }
                                                    avatarSrc={
                                                        profile?.profilePicture
                                                    }
                                                    name={profile?.username}
                                                    onLogout={onLogout}
                                                    onNavigate={() =>
                                                        ProfileUtils.navigateToProfile(
                                                            profile,
                                                            navigate
                                                        )
                                                    }
                                                />
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};
export default Header;
