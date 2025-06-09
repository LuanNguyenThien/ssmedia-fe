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
import FilterNotifications from "./components/FilterNotifications";
import NotificationSkeleton from "./NotificationSkeleton";
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
        entityId: "",
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

    const deleteNotification = async (messageId) => {
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
                    entityId={notificationDialogContent?.entityId}
                    secondButtonText="Close"
                    secondBtnHandler={() => {
                        setNotificationDialogContent({
                            post: "",
                            imgUrl: "",
                            comment: "",
                            reaction: "",
                            senderName: "",
                            entityId: "",
                        });
                    }}
                />
            )}
            {!loading && (
                <div className="notifications-container col-span-10 px-4 bg-background-blur rounded-t-[15px]">
                    <div className="flex items-center justify-between py-4">
                        <span className="text-2xl font-bold">
                            Notifications
                        </span>
                        <FilterNotifications
                            isChosenFilter={isChosenFilter}
                            setIsChosenFilter={setIsChosenFilter}
                        />
                    </div>

                    {displayNotification.length > 0 && (
                        <div className="notifications-box flex-1 max-h-[80vh] overflow-y-scroll flex flex-col justify-start items-start gap-2">
                            {displayNotification.map((notification) => (
                                <div
                                    className={`flex w-full items-center justify-start gap-3 bg-primary-white hover:bg-primary/10 rounded-[20px] px-4 py-2
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
                                            name={
                                                notification?.userFrom?.username
                                            }
                                            bgColor={
                                                notification?.userFrom
                                                    ?.avatarColor
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
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {showConfirmModal && (
                                <ConfirmModal
                                    title="Delete notification"
                                    subTitle="Are you sure you want to delete this notification?"
                                    labelButtonCancel="Cancel"
                                    labelButtonConfirm="Delete"
                                    icon="delete"
                                    classNameButtonConfirm={
                                        "bg-red-500 hover:bg-red-300"
                                    }
                                    handleConfirm={() => {
                                        deleteNotification(
                                            chosenNotification?._id
                                        );
                                        setShowConfirmModal(false);
                                    }}
                                    handleCancel={() => {
                                        setShowConfirmModal(false);
                                    }}
                                />
                            )}
                        </div>
                    )}
                    {!loading && !displayNotification.length && (
                        <h4 className="empty-page" data-testid="empty-page">
                            You have no notification
                        </h4>
                    )}
                </div>
            )}
            {/* Loading skeleton */}
            {loading && <NotificationSkeleton />}
        </>
    );
};

export default Notification;
