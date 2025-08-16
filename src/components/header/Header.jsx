import { useState, useEffect, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";

import { assets } from "@assets/assets";
import "@components/header/Header.scss";
import Avatar from "@components/avatar/Avatar";
import { Utils } from "@services/utils/utils.service";
import useDetectOutsideClick from "@hooks/useDetectOutsideClick";
import { getPosts, getQuestions } from "@redux/api/posts";
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
import CallNotificationManager from "@components/call/CallNotificationManager";
import NotificationPermissionPrompt from "@components/call-noti/NotificationPermissionPrompt";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Text,
} from "@chakra-ui/react";
import { AlertCircle } from "lucide-react";

// components
import DropdownSetting from "@components/header/components/dropdown/DropdownSetting";
import Logo from "./components/logo/Logo";
import SearchInputDesktop from "./components/search-input.jsx/seach-input-desktop";
import Dropdown from "@components/dropdown/Dropdown";
import MessageSidebar from "@components/message-sidebar/MessageSidebar";
const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const section = useLocation().pathname.split("/")[3];
    const isValidSection =
        section !== "groups" &&
        section !== "chat" &&
        section !== "search" &&
        section !== "notifications";

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [banReason, setBanReason] = useState("");
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

    //search term, image
    const [searchTerm, setSearchTerm] = useState("");
    const [searchImage, setSearchImage] = useState(null);
    const [isSearch, setIsSearch] = useState(false);

    //notifications
    const notificationRef = useRef(null);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notificationDialogContent, setNotificationDialogContent] = useState({
        post: "",
        imgUrl: "",
        comment: "",
        reaction: "",
        post_analysis: "",
        senderName: "",
        entityId: "",
        notificationType: "",
        htmlPost: "",
        answer: "",
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

    useEffectOnce(() => {
        if (location.pathname === "/app/social/streams") dispatch(getPosts());
        else dispatch(getQuestions());
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
            setNotificationCount,
            dispatch
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
    const onMarkAsRead = async ({ notification, isMarkAsReadAll = false }) => {
        try {
            if (isMarkAsReadAll) {
                NotificationUtils.markMessageAsRead(
                    notification?._id,
                    notification
                );
            } else {
                NotificationUtils.markMessageAsRead(
                    notification?._id,
                    notification,
                    setNotificationDialogContent
                );
            }
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
            if (!notification.isGroupChat) {
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
        // Check if we have an image to search with
        if (searchImage) {
            // Navigate to search page with image search info
            navigate("/app/social/search", {
                state: {
                    query: searchTerm,
                    hasImage: isSearch,
                    image: searchImage,
                },
            });
            setSearchTerm("");
            setSearchImage(null);
            // Reset the search state
            setIsSearch(!isSearch);
        } else {
            // Regular text search
            navigate("/app/social/search", { state: { query: searchTerm } });
        }
    };

    const handleSetNotificationDialogContentToNull = () => {
        setNotificationDialogContent({
            post: "",
            imgUrl: "",
            comment: "",
            reaction: "",
            post_analysis: "",
            htmlPost: "",
            senderName: "",
            notificationType: "",
            entityId: "",
            answer: "",
        });
    };

    return (
        <>
            {!profile ? (
                <HeaderSkeleton />
            ) : (
                <>
                    <NotificationPermissionPrompt />
                    <CallNotificationManager />
                    {/* HEADER */}
                    <div
                        className="header-nav-wrapper bg-secondary"
                        data-testid="header-wrapper"
                    >
                        {notificationDialogContent?.senderName && (
                            <NotificationPreview
                                title="Your post"
                                notificationType={
                                    notificationDialogContent?.notificationType
                                }
                                entityId={notificationDialogContent?.entityId}
                                post={notificationDialogContent?.post}
                                htmlPost={notificationDialogContent?.htmlPost}
                                imgUrl={notificationDialogContent?.imgUrl}
                                comment={notificationDialogContent?.comment}
                                reaction={notificationDialogContent?.reaction}
                                post_analysis={
                                    notificationDialogContent?.post_analysis
                                }
                                answer={notificationDialogContent?.answer}
                                senderName={
                                    notificationDialogContent?.senderName
                                }
                                secondButtonText="Close"
                                secondBtnHandler={
                                    handleSetNotificationDialogContentToNull
                                }
                            />
                        )}

                        <div className="header-navbar grid grid-cols-5 header-desktop">
                            <div className="col-span-1">
                                <Logo />
                            </div>
                            {/* SEARCH */}
                            <div className="col-span-3 flex justify-between items-center gap-4">
                                <span className="font-extrabold text-primary-black flex items-center">
                                    {isValidSection && upperCase(section)}
                                </span>
                                <SearchInputDesktop
                                    onClick={handleSearchKeyPress}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    onImageSelect={(file) =>
                                        setSearchImage(file)
                                    }
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
                                    <span
                                        title="Message"
                                        className="header-list-name relative group"
                                    >
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
                                                className="absolute top-8 right-0 z-[1000]"
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
                                    <span
                                        title="Notifications"
                                        className="header-list-name group relative"
                                    >
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
                                            <div
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
                                                    onNavigate={navigate}
                                                    setIsNotificationActive={
                                                        setIsNotificationActive
                                                    }
                                                />
                                            </div>
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
                                                avatarSrc={
                                                    profile?.profilePicture
                                                }
                                            />
                                            <IoIosArrowBack
                                                className={`absolute transition-all duration-100 ease-linear bottom-[-5px] right-0 text-white bg-gray-700 bg-opacity-70 rounded-full ${
                                                    isSettingsActive
                                                        ? " -rotate-90  "
                                                        : "rotate-0"
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
                                                        id={profile?._id}
                                                    />
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
            <Modal isOpen={isOpen} onClose={handleCloseBanModal} isCentered>
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 transition-all duration-300 ease-in-out backdrop-blur-[2px]" />
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-in-out scale-100 animate-in fade-in-0 zoom-in-95">
                        <div className="flex flex-col items-center mb-4">
                            {/* Alert Icon */}
                            <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-red-600"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>

                            <ModalHeader className="text-2xl font-bold text-center text-red-600 mb-2">
                                Bạn đã bị cấm truy cập
                            </ModalHeader>
                        </div>

                        <ModalBody className="text-base text-gray-700 text-center mb-6">
                            <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-2">
                                <Text className="font-medium">
                                    <span className="font-semibold">
                                        Lý do:
                                    </span>{" "}
                                    {banReason}
                                </Text>
                            </div>
                            <Text className="text-sm text-gray-500 mt-3">
                                Nếu bạn cho rằng đây là sự nhầm lẫn, vui lòng
                                liên hệ với quản trị viên.
                            </Text>
                        </ModalBody>

                        <ModalFooter className="flex justify-center mt-2">
                            <Button
                                onClick={handleCloseBanModal}
                                className="px-8 py-2.5 text-white font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Thoát
                            </Button>
                        </ModalFooter>
                    </div>
                </div>
            </Modal>
        </>
    );
};
export default Header;
