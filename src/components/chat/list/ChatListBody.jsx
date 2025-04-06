// import { Box, Text, Icon } from '@chakra-ui/react';
import PropTypes from "prop-types";
import { FaCircle } from "react-icons/fa";
import { icons } from "@assets/assets";

const ChatListBody = ({ data, profile }) => {
    return (
        <div
            className={`conversation-message flex items-center justify-between  ${
                !data.isRead && data.receiverUsername === profile?.username ? "!font-extrabold text-primary-black" : ""
            }`}
        >
            <span className="max-w-[90%] truncate">{data.body}</span>
            {!data.isRead ? (
                <>
                    {data.receiverUsername === profile?.username ? (
                        <FaCircle className="icon" />
                    ) : (
                        <img
                            src={icons.uncheck}
                            alt=""
                            className="icon read"
                        />
                    )}
                </>
            ) : (
                <>
                    {data.senderUsername === profile?.username && (
                        <img
                            src={icons.check}
                            alt=""
                            className="icon read"
                        />
                    )}
                </>
            )}
        </div>
    );
};

ChatListBody.propTypes = {
    data: PropTypes.object,
    profile: PropTypes.object,
};

export default ChatListBody;
