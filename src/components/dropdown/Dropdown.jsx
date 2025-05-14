import Avatar from "@components/avatar/Avatar";
import Button from "@components/button/Button";
import PropTypes from "prop-types";
import { FaCircle, FaRegCircle, FaTrashAlt, FaUserAlt } from "react-icons/fa";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

import "@components/dropdown/Dropdown.scss";
import { Utils } from "@services/utils/utils.service";
import { useCallback, useEffect, useState } from "react";
import ConfirmModal from "../confirm-modal/ConfirmModal";
import FilterNotifications from "@/pages/social/notifications/components/FilterNotifications";

const Dropdown = ({
    data,
    title,
    onMarkAsRead,
    onDeleteNotification,
    onLogout,
    onNavigate,
}) => {
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [showDeleteAllConfirmModal, setShowDeleteAllConfirmModal] =
        useState(false);

    const [isChosenFilter, setIsChosenFilter] = useState("All");
    const [displayNotification, setDisplayNotification] = useState([]);

    const [chosenNotification, setChosenNotification] = useState(null);

    const filterNotifications = useCallback(() => {
        if (isChosenFilter === "All") {
            return data;
        } else if (isChosenFilter === "Unread") {
            return data.filter((notification) => !notification.read);
        }
    }, [data, isChosenFilter]);

    const handleMarkAllAsRead = () => {
        data.forEach((notification) => {
            if (!notification.read) {
                onMarkAsRead({
                    notification: notification,
                    isMarkAsReadAll: true,
                });
            }
        });
    };

    useEffect(() => {
        setDisplayNotification(filterNotifications());
    }, [data, filterNotifications]);

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="social-dropdown bg-background shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] border border-primary/20 rounded-l-xl rounded-b-xl z-[10000]"
            data-testid="dropdown"
        >
            <div className="social-card">
                <div className="social-card-body ">
                    {/* top header */}
                    <div className="flex items-center justify-between px-4 pt-4">
                        <div className="social-bg-primary w-max text-center bg-transparent text-xl font-bold">
                            {title}
                        </div>
                        <div
                            onClick={() => {
                                onNavigate("notifications");
                            }}
                            className="flex items-center text-sm font-semibold hover:text-primary/70"
                        >
                            <span>View all</span>
                        </div>
                    </div>
                    <div className="w-full flex justify-center items-center py-1">
                        <div className="w-1/2 h-[0.5px] bg-background-blur"></div>
                    </div>

                    {/* filter and mark read */}
                    <div className="w-full flex items-center justify-between px-4 py-2">
                        <div className="w-max flex justify-center items-center ">
                            <FilterNotifications
                                isChosenFilter={isChosenFilter}
                                setIsChosenFilter={setIsChosenFilter}
                            />
                        </div>
                        <div className="flex flex-1 items-center justify-end gap-1 text-xs font-semibold hover:text-primary/70">
                            <IoCheckmarkDoneOutline className="text-sm" />
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteAllConfirmModal(true);
                                }}
                                className="w-max cursor-pointer "
                            >
                                Mark all as read
                            </span>
                        </div>
                        {showDeleteAllConfirmModal && (
                            <ConfirmModal
                                title="Mark as read all Notifications!"
                                subTitle="Are you sure you want to mark all notifications as read?"
                                labelButtonCancel="Cancel"
                                labelButtonConfirm="Yes, mark all as read"
                                icon="info"
                                classNameButtonConfirm={
                                    "bg-primary/90 hover:bg-primary/70"
                                }
                                handleConfirm={(event) => {
                                    event.stopPropagation();
                                    handleMarkAllAsRead();
                                    setShowDeleteAllConfirmModal(false);
                                }}
                                handleCancel={(event) => {
                                    event.stopPropagation();
                                    setShowDeleteAllConfirmModal(false);
                                }}
                            />
                        )}
                    </div>

                    <div className="social-card-body-info">
                        <div
                            data-testid="info-container"
                            className="social-card-body-info-container"
                        >
                            {displayNotification.length === 0 && (
                                <p className="w-full px-2 py-2 text-center">
                                    You do not have any notification
                                </p>
                            )}
                            {displayNotification &&
                                displayNotification.map((item) => (
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onMarkAsRead({
                                                notification: item,
                                                isMarkAsReadAll: false,
                                            });
                                        }}
                                        className="social-sub-card bg-background-blur/50 hover:bg-primary/10 py-2 px-4 rounded-xl"
                                        key={Utils.generateString(10)}
                                    >
                                        <div className="content-avatar h-full w-auto object-cover">
                                            {title === "Notifications" ? (
                                                <Avatar
                                                    name={item?.username}
                                                    bgColor={item?.avatarColor}
                                                    textColor="#ffffff"
                                                    size={45}
                                                    avatarSrc={
                                                        item?.profilePicture
                                                    }
                                                />
                                            ) : (
                                                <FaUserAlt className="userIcon size-[45px]" />
                                            )}
                                        </div>
                                        <div
                                            className={`content-body flex-1 px-2 ${
                                                item?.read
                                                    ? "font-normal"
                                                    : "font-bold"
                                            }`}
                                        >
                                            <span className="title">
                                                {item?.topText}
                                            </span>
                                            <p className="subtext">
                                                {item?.subText}
                                            </p>
                                        </div>
                                        {title === "Notifications" && (
                                            <div className="content-icons flex items-center justify-center gap-2">
                                                {!item?.read && (
                                                    <FaCircle className="circle text-primary text-xs" />
                                                )}
                                                <FaTrashAlt
                                                    className="trash text-primary-black/30 hover:text-red-500 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setChosenNotification(
                                                            item
                                                        );
                                                        setShowDeleteConfirmModal(
                                                            true
                                                        );
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            {showDeleteConfirmModal && (
                                <ConfirmModal
                                    title="Delete Notification!"
                                    subTitle="Are you sure you want to delete this notification?"
                                    labelButtonCancel="Cancel"
                                    labelButtonConfirm="Delete"
                                    icon="delete"
                                    classNameButtonConfirm={
                                        "bg-red-500 hover:bg-red-300"
                                    }
                                    handleConfirm={(event) => {
                                        event.stopPropagation();
                                        onDeleteNotification(
                                            chosenNotification?._id
                                        );
                                        setShowDeleteConfirmModal(false);
                                    }}
                                    handleCancel={(event) => {
                                        event.stopPropagation();
                                        setShowDeleteConfirmModal(false);
                                    }}
                                />
                            )}
                        </div>

                        {title === "Settings" && (
                            <div className="social-sub-button">
                                <Button
                                    label="Sign out"
                                    className="button signOut"
                                    handleClick={onLogout}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

Dropdown.propTypes = {
    data: PropTypes.array,
    notificationCount: PropTypes.number,
    title: PropTypes.string,
    style: PropTypes.object,
    height: PropTypes.number,
    onMarkAsRead: PropTypes.func,
    onDeleteNotification: PropTypes.func,
    onLogout: PropTypes.func,
    onNavigate: PropTypes.func,
};

export default Dropdown;
