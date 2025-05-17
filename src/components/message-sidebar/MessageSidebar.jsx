import doubleCheckmark from "@assets/images/double-checkmark.png";
import Avatar from "@components/avatar/Avatar";
import PropTypes from "prop-types";
import { FaCheck, FaCircle } from "react-icons/fa";
import "@components/message-sidebar/MessageSidebar.scss";
import { Utils } from "@services/utils/utils.service";

const MessageSidebar = ({
    profile,
    messageCount,
    messageNotifications,
    openChatPage,
}) => {
    return (
        <div
            className="message-dropdown w-[400px] text-primary-black bg-background rounded-b-xl rounded-l-xl  shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] border border-primary/20  z-[10000]"
            data-testid="message-sidebar"
        >
            <div className="message-card">
                <div className="message-card-body">
                    <div className="flex justify-between items-center px-5 py-4 ">
                        <div className="text-xl font-bold text-primary-black">
                            Chats
                        </div>
                        {messageCount > 0 && (
                            <div className="flex items-center justify-center bg-primary text-white text-sm font-medium rounded-full h-6 min-w-[24px] px-1.5">
                            {messageCount > 99 ? "99+" : messageCount}
                            </div>
                        )}
                    </div>

                    <div className="w-full flex justify-center items-center py-1">
                        <div className="w-1/2 h-[0.5px] bg-background-blur"></div>
                    </div>

                    <div className="message-card-body-info">
                        <div
                            data-testid="info-container"
                            className="message-card-body-info-container"
                        >
                            {messageNotifications.map((notification) => (
                                <div
                                    className="message-sub-card flex items-center hover:bg-primary/10 py-2 px-4 rounded-xl"
                                    key={Utils.generateString(10)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openChatPage(notification);
                                    }}
                                >
                                    <div className="content-avatar">
                                        <Avatar
                                            name={
                                                notification.receiverUsername ===
                                                profile?.username
                                                    ? profile?.username
                                                    : notification?.senderUsername
                                            }
                                            bgColor={
                                                notification.receiverUsername ===
                                                profile?.username
                                                    ? notification.receiverAvatarColor
                                                    : notification?.senderAvatarColor
                                            }
                                            textColor="#ffffff"
                                            size={50}
                                            avatarSrc={
                                                notification.isGroupChat
                                                    ? notification?.groupImage
                                                    : notification.receiverUsername !==
                                                      profile?.username
                                                    ? notification.receiverProfilePicture
                                                    : notification?.senderProfilePicture
                                            }
                                        />
                                    </div>
                                    <div
                                        className={`content-body text-primary-black ${
                                            notification?.isRead ||
                                            notification.senderUsername ===
                                                profile?.username
                                                ? ""
                                                : "font-bold"
                                        }`}
                                    >
                                        <h6 className="">
                                            {notification.isGroupChat
                                                ? notification?.groupName
                                                : notification.receiverUsername !==
                                                  profile?.username
                                                ? notification.receiverUsername
                                                : notification.senderUsername}
                                        </h6>
                                        <p className="subtext">
                                            {notification.isGroupChat &&
                                            notification?.senderUsername !==
                                                profile?.username
                                                ? `${notification?.senderUsername}: `
                                                : ""}
                                            {notification.senderUsername ===
                                            profile?.username
                                                ? "You: "
                                                : ""}
                                            {notification?.body
                                                ? notification?.body
                                                : notification?.message}
                                        </p>
                                    </div>
                                    <div className="content-icons">
                                        {!notification?.isRead ? (
                                            <>
                                                {notification.receiverUsername ===
                                                profile?.username ? (
                                                    <FaCircle className="circle" />
                                                ) : (
                                                    <FaCheck className="circle not-read" />
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {notification.senderUsername ===
                                                    profile?.username && (
                                                    <img
                                                        src={doubleCheckmark}
                                                        alt=""
                                                        className="circle read"
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

MessageSidebar.propTypes = {
    profile: PropTypes.object.isRequired,
    messageCount: PropTypes.number.isRequired,
    messageNotifications: PropTypes.array.isRequired,
    openChatPage: PropTypes.func.isRequired,
};
export default MessageSidebar;
