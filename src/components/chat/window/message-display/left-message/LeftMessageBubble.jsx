import PropTypes from "prop-types";
import CallLogBubble from "@components/chat/window/message-display/callLog/CallLogBubble";

const LeftMessageBubble = ({
    chat,
    showImageModal,
    setImageUrl,
    setShowImageModal,
}) => {
    if (chat?.messageType === "call_log") {
        return <CallLogBubble chat={chat} isRight={false} />;
    }
    
    return (
        <>
            {chat?.body !== "Sent a GIF" && chat?.body !== "Sent an Image" && (
                <div className="message-bubble left-message-bubble">
                    {chat?.body}
                </div>
            )}
            {chat?.selectedImage && (
                <div
                    className="message-image"
                    style={{
                        marginTop: `${
                            chat?.body && chat?.body !== "Sent an Image"
                                ? "5px"
                                : ""
                        }`,
                    }}
                >
                    <img
                        src={chat?.selectedImage}
                        onClick={() => {
                            setImageUrl(chat?.selectedImage);
                            setShowImageModal(!showImageModal);
                        }}
                        alt=""
                    />
                </div>
            )}
            {chat?.gifUrl && (
                <div className="message-gif">
                    <img
                        src={chat?.gifUrl}
                        onClick={() => {
                            setImageUrl(chat?.gifUrl);
                            setShowImageModal(!showImageModal);
                        }}
                        alt=""
                    />
                </div>
            )}
        </>
    );
};
export default LeftMessageBubble;
