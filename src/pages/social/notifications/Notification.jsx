import { useState, useEffect, use, useCallback } from "react";
import Avatar from "@components/avatar/Avatar";
import "@pages/social/notifications/Notification.scss";
import { FaCircle, FaRegCircle, FaRegTrashAlt } from "react-icons/fa";
import { Utils } from "@services/utils/utils.service";
import { useDispatch, useSelector } from "react-redux";
import { notificationService } from "@services/api/notifications/notification.service";
import useEffectOnce from "@hooks/useEffectOnce";
import { NotificationUtils } from "@services/utils/notification-utils.service";
import NotificationPreview from "@components/dialog/NotificationPreview";
import { timeAgo } from "@services/utils/timeago.utils";
import ConfirmModal from "@/components/confirm-modal/ConfirmModal";
const Notification = () => {
    const dispatch = useDispatch();
    const { profile } = useSelector((state) => state.user);
    const [notifications, setNotifications] = useState([]);
    const [displayNotification, setDisplayNotification] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notificationDialogContent, setNotificationDialogContent] = useState({
        post: "",
        imgUrl: "",
        comment: "",
        reaction: "",
        senderName: "",
    });
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [chosenNotification, setChosenNotification] = useState(null);
    const [isChosenFilter, setIsChosenFilter] = useState("All");

    const getUserNotifications = async () => {
        try {
            const response = await notificationService.getUserNotifications();
            setNotifications(response.data.notifications);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    const markAsRead = async (notification) => {
        try {
            NotificationUtils.markMessageAsRead(
                notification?._id,
                notification,
                setNotificationDialogContent
            );
            notification.read = true; // Đánh dấu thông báo là đã đọc
            setNotifications([...notifications]); // Cập nhật state
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    const deleteNotification = async (event, messageId) => {
        event.stopPropagation();
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

    const filterNotifications = useCallback(() => {
        if (isChosenFilter === "All") {
            return notifications;
        } else if (isChosenFilter === "Unread") {
            return notifications.filter((notification) => !notification.read);
        }
    }, [notifications, isChosenFilter]);

    useEffect(() => {
        setDisplayNotification(filterNotifications());
    }, [notifications, filterNotifications]);

    useEffectOnce(() => {
        getUserNotifications();
    });

    useEffect(() => {
        NotificationUtils.socketIONotification(
            profile,
            notifications,
            setNotifications,
            "notificationPage"
        );
    }, [profile, notifications]);

    return (
        <>
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
            <div className="notifications-container col-span-10 px-4">
                <div className="w-full flex justify-center items-center">
                    <div className="w-1/2 h-[0.1px] bg-primary-black/20 mt-2"></div>
                </div>
                <div className="flex items-center justify-between py-4">
                    <span className="text-2xl font-bold">Notifications</span>

                    {/* filters */}
                    <div className="flex items-center justify-center gap-1">
                        <span
                            onClick={() => {
                                setIsChosenFilter("All");
                            }}
                            className={`text-xs text-primary-white px-3 py-1 rounded-xl ${
                                isChosenFilter === "All"
                                    ? "bg-primary/80"
                                    : "bg-primary/30"
                            }`}
                        >
                            All
                        </span>
                        <span
                            onClick={() => {
                                setIsChosenFilter("Unread");
                            }}
                            className={`text-xs text-primary-white px-3 py-1 rounded-xl ${
                                isChosenFilter === "Unread"
                                    ? "bg-primary/80"
                                    : "bg-primary/30"
                            }`}
                        >
                            Unread
                        </span>
                    </div>
                </div>

                {displayNotification.length > 0 && (
                    <div className="notifications-box flex-1 max-h-[80vh] overflow-y-scroll flex flex-col justify-start items-start gap-2">
                        {displayNotification.map((notification) => (
                            <div
                                // className={`notification-box ${
                                //     notification?.read ? "read" : ""
                                // }`}
                                className={`flex w-full items-center justify-start gap-3 bg-background-blur/50 rounded-[20px] px-4 py-2
                                    ${
                                        notification?.read
                                            ? "font-light"
                                            : "font-bold"
                                    }`}
                                key={notification?._id}
                                onClick={() => markAsRead(notification)}
                            >
                                {/* avatar */}
                                <div className="notification-box-sub-card-media-image-icon w-max">
                                    <Avatar
                                        name={notification?.userFrom?.username}
                                        bgColor={
                                            notification?.userFrom?.avatarColor
                                        }
                                        textColor="#ffffff"
                                        size={40}
                                        avatarSrc={
                                            notification?.userFrom
                                                ?.profilePicture
                                        }
                                    />
                                </div>
                                {/* content */}
                                <div className="notification-box-sub-card-media-body flex-1 flex items-center justify-between">
                                    <span className="title text-sm text-primary-black flex flex-col">
                                        <span className="text-sm text-primary-black">
                                            {notification?.message}
                                        </span>
                                        {/* time */}
                                        <span className="subtext text-xs text-primary-black/80">
                                            {timeAgo.transform(
                                                notification?.createdAt
                                            )}
                                        </span>
                                    </span>
                                    {/* trash can and active dot */}
                                    <div className="flex justify-center items-center gap-4">
                                        {!notification?.read && (
                                            <FaCircle className="text-xs text-primary/50" />
                                        )}
                                        <div
                                            data-testid="subtitle"
                                            className="subtitle"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setChosenNotification(
                                                    notification
                                                );
                                                setShowConfirmModal(true);
                                            }}
                                        >
                                            <FaRegTrashAlt className="trash text-primary-black/50 hover:text-red-500" />
                                        </div>

                                        {showConfirmModal && (
                                            <ConfirmModal
                                                handleConfirm={(event) => {
                                                    deleteNotification(
                                                        event,
                                                        chosenNotification?._id
                                                    );
                                                    setShowConfirmModal(false);
                                                }}
                                                handleCancel={(event) => {
                                                    event.stopPropagation();
                                                    setShowConfirmModal(false);
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {loading && !displayNotification.length && (
                    <div className="notifications-box"></div>
                )}
                {!loading && !displayNotification.length && (
                    <h4 className="empty-page" data-testid="empty-page">
                        You have no notification
                    </h4>
                )}
            </div>
        </>
    );
};

export default Notification;
