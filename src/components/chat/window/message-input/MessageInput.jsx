import PropTypes from "prop-types";
import { icons } from "@assets/assets";
import loadable from "@loadable/component";
import "@components/chat/window/message-input/MessageInput.scss";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { ImageUtils } from "@services/utils/image-utils.service";
import Input from "@components/input/Input";
import { DynamicSVG } from "@components/sidebar/components/SidebarItems";
import GiphyContainer from "@components/chat/giphy-container/GiphyContainer";
import useHandleOutsideClick from "@hooks/useHandleOutsideClick";
import ImagePreview from "@components/chat/image-preview/ImagePreview";

const EmojiPickerComponent = loadable(() => import("./EmojiPicker"), {
    fallback: (
        <div
            style={{ width: "352px", height: "447px", background: "white" }}
            className="flex items-center justify-center rounded-[30px]"
            id="loading"
        >
            Loading...
        </div>
    ),
});

const MessageInput = memo(({ setChatMessage }) => {
    const [message, setMessage] = useState("");

    //handle container click outside
    const fileInputRef = useRef();
    const messageInputRef = useRef();
    const emojiRef = useRef(null);
    const gifRef = useRef(null);
    const inputContainerRef = useRef(null);

    const [showEmojiContainer, setShowEmojiContainer] = useState(false);
    const [showGifContainer, setShowGifContainer] = useState(false);
    useHandleOutsideClick(emojiRef, setShowEmojiContainer);
    useHandleOutsideClick(gifRef, setShowGifContainer);
    useHandleOutsideClick(inputContainerRef, () => setHasFocus(false));

    const [showImagePreview, setShowImagePreview] = useState(false);

    //focus on input
    const [hasFocus, setHasFocus] = useState(false);

    //handle image files
    const [file, setFile] = useState();
    const [base64File, setBase64File] = useState("");

    const reset = useCallback(() => {
        setBase64File("");
        setShowImagePreview(false);
        setShowEmojiContainer(false);
        setShowGifContainer(false);
        setFile("");
    }, []);

    const handleClick = useCallback(() => {
        if (message.trim() === "" && base64File === "") {
            return;
        }
        const finalMessage = message || "Sent an Image";
        setChatMessage(finalMessage.replace(/ +(?= )/g, ""), "", base64File);
        setMessage("");
        reset();
    }, [message, base64File, setChatMessage, reset]);

    const handleGiphyClick = useCallback((url) => {
        setChatMessage("Sent a GIF", url, "");
        reset();
    }, [setChatMessage, reset]);

    const addToPreview = useCallback(async (file) => {
        let type;
        if (file.type.startsWith("image/")) {
            type = "image";
        } else if (file.type.startsWith("video/")) {
            type = "video";
        } else {
            window.alert(`File ${file.name} is not a valid image or video.`);
            return;
        }
        ImageUtils.checkFile(file, type);
        setFile(URL.createObjectURL(file));
        const result = await ImageUtils.readAsBase64(file);
        setBase64File(result);
        setShowImagePreview(true);
        setShowEmojiContainer(false);
        setShowGifContainer(false);
    }, []);

    const fileInputClicked = useCallback(() => {
        fileInputRef.current.click();
    }, []);

    useEffect(() => {
        if (file === "" || base64File === "") {
            setShowImagePreview(false);
        } else {
            setShowImagePreview(true);
        }
    }, [file, base64File]);

    useEffect(() => {
        if (messageInputRef?.current) {
            messageInputRef.current.focus();
        }
    }, []);

    const handleAddEmoji = useCallback((emojiObject) => {
        setMessage((text) => text + ` ${emojiObject.emoji}`);
    }, []);

    const handleRemoveImage = useCallback(() => {
        setFile("");
        setBase64File("");
        setShowImagePreview(false);
    }, []);

    return (
        <>
            {showEmojiContainer && (
                <div
                    ref={emojiRef}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute flex justify-end items-end bottom-0 sm:left-5 z-50"
                    style={{ width: "352px", height: "447px" }}
                >
                    <EmojiPickerComponent onEmojiClick={handleAddEmoji} />
                </div>
            )}

            {showGifContainer && (
                <GiphyContainer handleGiphyClick={handleGiphyClick} />
            )}
            <div
                className="chat-inputarea size-full"
                data-testid="chat-inputarea"
                ref={inputContainerRef}
            >
                {showImagePreview && (
                    <ImagePreview
                        image={file}
                        onRemoveImage={handleRemoveImage}
                    />
                )}

                {/* Bottom chat input area */}
                <form
                    onSubmit={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleClick();
                    }}
                    onFocus={() => setHasFocus(true)}
                    onBlur={() => setHasFocus(false)}
                >
                    <div
                        className={`size-full flex rounded-[30px] items-center justify-between py-4 gap-4 ${
                            hasFocus || message.length > 0 || showImagePreview
                                ? "bg-background-blur border-4 border-primary-white transition-all duration-300 px-4 "
                                : ""
                        }`}
                    >
                        <Input
                            ref={messageInputRef}
                            id="message"
                            name="message"
                            type="text"
                            value={message}
                            className="chat-input truncate !pl-6"
                            labelText=""
                            placeholder="Enter your message..."
                            handleChange={(event) =>
                                setMessage(event.target.value)
                            }
                        />
                        <div className="chat-list gap-0 sm:gap-2">
                            <div
                                onMouseDown={(e) => e.preventDefault()}
                                className="chat-list-item"
                                onClick={() => {
                                    fileInputClicked();
                                    setHasFocus(true);
                                    setShowEmojiContainer(false);
                                    setShowGifContainer(false);
                                }}
                            >
                                <Input
                                    ref={fileInputRef}
                                    id="image"
                                    name="image"
                                    type="file"
                                    className="file-input"
                                    placeholder="Select file"
                                    onClick={() => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = null;
                                        }
                                    }}
                                    handleChange={(event) =>
                                        addToPreview(event.target.files[0])
                                    }
                                />
                                <DynamicSVG
                                    svgData={icons.picture}
                                    className="size-6"
                                />
                            </div>
                            <div
                                onMouseDown={(e) => e.preventDefault()}
                                ref={gifRef}
                                className="chat-list-item"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setHasFocus(true);
                                    setShowGifContainer(!showGifContainer);
                                    setShowEmojiContainer(false);
                                    setShowImagePreview(false);
                                }}
                            >
                                <DynamicSVG
                                    svgData={icons.gif}
                                    className="size-6"
                                />
                            </div>
                            <div
                                onMouseDown={(e) => e.preventDefault()}
                                className="chat-list-item"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setHasFocus(true);
                                    setShowEmojiContainer(!showEmojiContainer);
                                    setShowGifContainer(false);
                                    setShowImagePreview(false);
                                }}
                            >
                                <DynamicSVG
                                    svgData={icons.feeling}
                                    className="size-6"
                                />
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClick();
                            }}
                            className="w-8 h-8 z-[1000] px-6 py-2 bg-primary flex items-center justify-center rounded-xl text-primary-white hover:bg-primary/70"
                        >
                            <DynamicSVG
                                svgData={icons.send}
                                className="size-6 pointer-events-none"
                            />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
});

MessageInput.propTypes = {
    setChatMessage: PropTypes.func,
};

MessageInput.displayName = "MessageInput";

export default MessageInput;
