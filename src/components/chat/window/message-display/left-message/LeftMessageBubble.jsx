import PropTypes from "prop-types";

const LeftMessageBubble = ({
    chat,
    showImageModal,
    setImageUrl,
    setShowImageModal,
}) => {
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
                            setShowImageModal(true);
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
                            setShowImageModal(true);
                        }}
                        alt=""
                    />
                </div>
            )}
        </>
    );
};
export default LeftMessageBubble;
