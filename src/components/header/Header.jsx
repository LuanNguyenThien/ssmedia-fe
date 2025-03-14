import { useState, useEffect, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";

import bell from "@assets/images/bell.svg";
import mess from "@assets/images/mes.svg";
import { icons } from "@assets/assets";
import "@components/header/Header.scss";
import Logo from "@components/logo/logo";
import Avatar from "@components/avatar/Avatar";
import { Utils } from "@services/utils/utils.service";
import useDetectOutsideClick from "@hooks/useDetectOutsideClick";
import MessageSidebar from "@components/message-sidebar/MessageSidebar";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "@components/dropdown/Dropdown";
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
import { sumBy } from "lodash";
import { ChatUtils } from "@services/utils/chat-utils.service";
import { chatService } from "@services/api/chat/chat.service";
import { getConversationList } from "@redux/api/chat";

import {
    setIsOpenSidebar,
    setIsOpenSearchBar,
} from "@redux/reducers/navbar/navState.reducer";

// components
import DropdownSetting from "@components/header/components/dropdown/DropdownSetting";
import SearchButtonMb from "@components/header/components/searchButton/SearchButtonMb";
const Header = () => {
    const { profile } = useSelector((state) => state.user);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const token = useSelector((state) => state.user.token);
    const { chatList } = useSelector((state) => state.chat);

    // const [environment, setEnvironment] = useState('');
    // const [settings, setSettings] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notificationDialogContent, setNotificationDialogContent] = useState({
        post: "",
        imgUrl: "",
        comment: "",
        reaction: "",
        senderName: "",
    });
    const [messageCount, setMessageCount] = useState(0);
    const [messageNotifications, setMessageNotifications] = useState([]);
    const messageRef = useRef(null);
    const notificationRef = useRef(null);
    const settingsRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [isMessageActive, setIsMessageActive] = useDetectOutsideClick(
        messageRef,
        false
    );
    const [isNotificationActive, setIsNotificationActive] =
        useDetectOutsideClick(notificationRef, false);
    const [isSettingsActive, setIsSettingsActive] = useDetectOutsideClick(
        settingsRef,
        false
    );
    const storedUsername = useLocalStorage("username", "get");
    const [deleteStorageUsername] = useLocalStorage("username", "delete");
    const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
    const [deleteSessionPageReload] = useSessionStorage("pageReload", "delete");

    // const backgrounColor = `${
    //   environment === 'DEV' || environment === 'LOCAL' ? '#50b5ff' : environment === 'STG' ? '#e9710f' : ''
    // }`;

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
            await chatService.addChatUsers({
                userOne: profile?.username,
                userTwo: userTwoName,
            });
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

    useEffectOnce(() => {
        ChatUtils.usersOnlines();
        // Utils.mapSettingsDropdownItems(setSettings);
        getUserNotifications();
    });

    useEffect(() => {
        // const env = Utils.appEnvironment();
        // // setEnvironment(env);
        const count = sumBy(chatList, (notification) => {
            return !notification.isRead &&
                notification.receiverUsername === profile?.username
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

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchKeyPress = (event) => {
        if (event.key === "Enter") {
            navigate("/app/social/search", { state: { query: searchTerm } });
        }
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
                    {isMessageActive && (
                        <div ref={messageRef}>
                            <MessageSidebar
                                profile={profile}
                                messageCount={messageCount}
                                messageNotifications={messageNotifications}
                                openChatPage={openChatPage}
                            />
                        </div>
                    )}

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
                    <div className="header-navbar ">
                        <div
                            className="header-image"
                            data-testid="header-image"
                            onClick={() => {
                                navigate("/app/social/streams");
                                window.location.reload();
                            }}
                        >
                            <Logo />
                        </div>

                        {/* SEARCH */}
                        <div className="search-container">
                            <div className="search">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    onKeyPress={handleSearchKeyPress}
                                    name="text"
                                    placeholder="Discover what you need..."
                                    className="input"
                                />
                                {/* <img src={icons.search} alt="" /> */}
                            </div>
                        </div>

                        <ul className="header-nav">
                            {/* SEARCH MOBILE */}
                            <li
                                data-testid="settings-list-item"
                                className="header-nav-item header-nav-item-search-mb"
                            >
                                <span
                                    onClick={() =>
                                        dispatch(setIsOpenSearchBar())
                                    }
                                    className="header-list-name"
                                >
                                    <img
                                        src={icons.search}
                                        className="header-list-icon"
                                    />
                                </span>
                                <SearchButtonMb />
                            </li>
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
                                <span className="header-list-name">
                                    <img
                                        src={mess}
                                        className="header-list-icon"
                                    />
                                    {messageCount > 0 && (
                                        <span
                                            className="bg-danger-dots dots"
                                            data-testid="messages-dots"
                                        ></span>
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
                                <span className="header-list-name">
                                    {notificationCount > 0 && (
                                        <span
                                            className="bg-danger-dots dots"
                                            data-testid="notification-dots"
                                        >
                                            {notificationCount}
                                        </span>
                                    )}
                                    <img
                                        src={bell}
                                        className="header-list-icon"
                                    />
                                </span>
                                {isNotificationActive && (
                                    <ul
                                        className="dropdown-ul"
                                        ref={notificationRef}
                                    >
                                        <li className="dropdown-li">
                                            <Dropdown
                                                height={300}
                                                style={{
                                                    right: "315px",
                                                    top: "30px",
                                                }}
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
                                        </li>
                                    </ul>
                                )}
                                &nbsp;
                            </li>
                            {/* NAV_SIDEBAR_OPEN */}
                            <li
                                id="sidebar-toggler"
                                data-testid="header-nav-list-item"
                                className="header-nav-item header-nav-item-sidebar"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    dispatch(setIsOpenSidebar());
                                }}
                            >
                                <span className="header-list-name">
                                    <img
                                        src={icons.sidebarSelector}
                                        className="header-list-icon"
                                    />
                                </span>
                            </li>
                            {/* PROFILE */}
                            <li
                                data-testid="settings-list-item"
                                className="header-nav-item"
                                onClick={() => {
                                    setIsSettingsActive(!isSettingsActive);
                                    setIsMessageActive(false);
                                    setIsNotificationActive(false);
                                }}
                            >
                                <div className="header-nav-item-profile">
                                    <span className="header-list-name">
                                        {" "}
                                        <Avatar
                                            name={profile?.username}
                                            bgColor={profile?.avatarColor}
                                            textColor="#ffffff"
                                            size={35}
                                            avatarSrc={profile?.profilePicture}
                                        />
                                        <IoIosArrowBack
                                            className={`${
                                                isSettingsActive
                                                    ? "header-nav-item-profile-arrow-down"
                                                    : "header-nav-item-profile-arrow"
                                            } `}
                                        />
                                    </span>
                                </div>
                                {isSettingsActive && (
                                    <ul
                                        className="dropdown-ul"
                                        ref={settingsRef}
                                    >
                                        <li className="dropdown-li ">
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
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};
export default Header;
