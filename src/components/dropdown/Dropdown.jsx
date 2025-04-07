import Avatar from "@components/avatar/Avatar";
import Button from "@components/button/Button";
import PropTypes from "prop-types";
import { FaCircle, FaRegCircle, FaTrashAlt, FaUserAlt } from "react-icons/fa";

import "@components/dropdown/Dropdown.scss";
import { Utils } from "@services/utils/utils.service";

const Dropdown = ({
    data,
    title,
    onMarkAsRead,
    onDeleteNotification,
    onLogout,
    onNavigate,
}) => {
    return (
        <div>
            <div
                className="social-dropdown bg-background shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] border border-primary/20 rounded-l-xl rounded-b-xl z-[10000]"
                data-testid="dropdown"
            >
                <div className="social-card">
                    <div className="social-card-body ">
                        <div className="social-bg-primary w-full text-center bg-transparent px-4 pt-4 text-xl font-bold">
                            {title}
                        </div>
                        <div className="w-full flex justify-center items-center py-1">
                            <div className="w-1/2 h-[0.5px] bg-background-blur"></div>
                        </div>

                        <div className="social-card-body-info">
                            <div
                                data-testid="info-container"
                                className="social-card-body-info-container"
                            >
                                {data.length === 0 && (
                                    <p className="social-sub-card">
                                        You do not have any notification
                                    </p>
                                )}
                                {data.map((item) => (
                                    <div
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
                                                <FaUserAlt className="userIcon" />
                                            )}
                                        </div>
                                        <div
                                            className={`content-body flex-1 px-2 ${
                                                item?.read ? "" : "font-bold"
                                            }`}
                                            onClick={() => {
                                                if (title === "Notifications") {
                                                    onMarkAsRead(item);
                                                } else {
                                                    onNavigate();
                                                }
                                            }}
                                        >
                                            <span className="title">
                                                {item?.topText}
                                            </span>
                                            <p className="subtext">
                                                {item?.subText}
                                            </p>
                                        </div>
                                        {title === "Notifications" && (
                                            <div className="content-icons">
                                                <FaTrashAlt
                                                    className="trash text-primary-black/30 hover:text-red-500 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteNotification(
                                                            item?._id
                                                        );
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
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
