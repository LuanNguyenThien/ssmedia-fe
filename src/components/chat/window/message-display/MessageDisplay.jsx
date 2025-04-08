import "@components/chat/window/message-display/MessageDisplay.scss";
import { timeAgo } from "@services/utils/timeago.utils";
import { Utils } from "@services/utils/utils.service";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import useDetectOutsideClick from "@hooks/useDetectOutsideClick";
import RightMessageDisplay from "./right-message-display/RightMessageDisplay";
import LeftMessageDisplay from "./left-message/LeftMessageDisplay";
import { useSearchParams } from "react-router-dom";
import ImageModal from "@components/image-modal/ImageModal";
import LoadingMessage from "@components/state/loading-message/LoadingMessage";
import Dialog from "@components/dialog/Dialog";

const MessageDisplay = ({
    chatMessages,
    profile,
    updateMessageReaction,
    deleteChatMessage,
}) => {
    const [imageUrl, setImageUrl] = useState("");
    const [searchParams] = useSearchParams();

    const [showReactionIcon, setShowReactionIcon] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        message: null,
        type: "",
    });
    const [selectedReaction, setSelectedReaction] = useState(null);
    const [activeElementIndex, setActiveElementIndex] = useState(null);
    const [isLoadingMessage, setIsLoadingMessage] = useState(false);
    const [messagesToShow, setMessagesToShow] = useState(10);

    const reactionRef = useRef(null);
    const [toggleReaction, setToggleReaction] = useDetectOutsideClick(
        reactionRef,
        false
    );
    const scrollRef = useRef(null);

    const displayedMessages = useMemo(
        () => chatMessages.slice(-messagesToShow),
        [chatMessages, messagesToShow]
    );

    useEffect(() => {
        const username = searchParams.get("username");
        if (username) {
            if (scrollRef.current) {
                setTimeout(() => {
                    scrollRef.current.scrollTop =
                        scrollRef.current.scrollHeight -
                        scrollRef.current.clientHeight;
                }, 1200);
            }
            setMessagesToShow(10);
        }
    }, [searchParams]);

    const handleScroll = useCallback(() => {
        if (!scrollRef.current || isLoadingMessage) return;
        if (
            scrollRef.current.scrollTop === 0 &&
            messagesToShow < chatMessages.length
        ) {
            setIsLoadingMessage(true);
            setTimeout(() => {
                setMessagesToShow((prev) => prev + 10);
                setIsLoadingMessage(false);
            }, 1000);
        }
    }, [messagesToShow, chatMessages.length, isLoadingMessage]);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll]);

    const showReactionIconOnHover = useCallback(
        (show, index) => {
            if (index === activeElementIndex || activeElementIndex === null) {
                setShowReactionIcon(show);
            }
        },
        [activeElementIndex]
    );

    const handleReactionClick = useCallback(
        (body) => {
            updateMessageReaction(body);
            setSelectedReaction(null);
        },
        [updateMessageReaction]
    );

    const deleteMessage = useCallback((message, type) => {
        setDeleteDialog({ open: true, message, type });
    }, []);

    return (
        <>
            {showImageModal && (
                <ImageModal
                    image={imageUrl}
                    onCancel={() => setShowImageModal(false)}
                    showArrow={false}
                />
            )}

            {selectedReaction && (
                <Dialog
                    title="Do you want to remove your reaction?"
                    showButtons
                    firstButtonText="Remove"
                    secondButtonText="Cancel"
                    firstBtnHandler={() =>
                        handleReactionClick(selectedReaction)
                    }
                    secondBtnHandler={() => setSelectedReaction(null)}
                />
            )}

            {deleteDialog.open && (
                <Dialog
                    title="Do you want delete your message?"
                    showButtons
                    firstButtonText={
                        deleteDialog.type === "deleteForMe"
                            ? "delete for me"
                            : "delete for all"
                    }
                    secondButtonText="cancel"
                    firstBtnHandler={() => {
                        const { message, type } = deleteDialog;
                        deleteChatMessage(
                            message.senderId,
                            message.receiverId,
                            message._id,
                            type
                        );

                        setDeleteDialog({
                            open: false,
                            message: null,
                            type: "",
                        });
                    }}
                    secondBtnHandler={() =>
                        setDeleteDialog({
                            open: false,
                            message: null,
                            type: "",
                        })
                    }
                />
            )}

            <div
                className="message-page h-full relative"
                ref={scrollRef}
                data-testid="message-page"
            >
                {isLoadingMessage && (
                    <div className="absolute top-0 left-0 z-[2000] w-full h-max flex items-center justify-center mt-2">
                        <div className="w-max h-max flex flex-col items-center justify-center gap-2 bg-white shadow-md rounded-full p-4">
                            <LoadingMessage />
                        </div>
                    </div>
                )}

                {displayedMessages.length >= 1 &&
                    displayedMessages.map((chat, index) => {
                        return (
                            <div
                                key={chat._id}
                                className="message-chat"
                                data-testid="message-chat"
                            >
                                {(index === 0 ||
                                    timeAgo.dayMonthYear(chat.createdAt) !==
                                        timeAgo.dayMonthYear(
                                            displayedMessages[index - 1]
                                                .createdAt
                                        )) && (
                                    <div className="message-date-group">
                                        <div
                                            className="message-chat-date !text-primary-black/70 font-semibold pt-6"
                                            data-testid="message-chat-date"
                                        >
                                            {timeAgo.chatMessageTransform(
                                                chat.createdAt
                                            )}
                                        </div>
                                    </div>
                                )}

                                {(chat.receiverUsername === profile?.username ||
                                    chat.senderUsername === profile?.username ||
                                    chat.isGroupChat) && (
                                    <>
                                        {chat.senderUsername ===
                                        profile?.username ? (
                                            <RightMessageDisplay
                                                chat={chat}
                                                lastChatMessage={
                                                    displayedMessages[
                                                        displayedMessages.length -
                                                            1
                                                    ]
                                                }
                                                profile={profile}
                                                toggleReaction={toggleReaction}
                                                showReactionIcon={
                                                    showReactionIcon
                                                }
                                                index={index}
                                                lastIndex={
                                                    displayedMessages.length - 1
                                                }
                                                activeElementIndex={
                                                    activeElementIndex
                                                }
                                                reactionRef={reactionRef}
                                                setToggleReaction={
                                                    setToggleReaction
                                                }
                                                handleReactionClick={
                                                    handleReactionClick
                                                }
                                                deleteMessage={deleteMessage}
                                                showReactionIconOnHover={
                                                    showReactionIconOnHover
                                                }
                                                setActiveElementIndex={
                                                    setActiveElementIndex
                                                }
                                                setShowImageModal={
                                                    setShowImageModal
                                                }
                                                setImageUrl={setImageUrl}
                                                showImageModal={showImageModal}
                                                setSelectedReaction={
                                                    setSelectedReaction
                                                }
                                            />
                                        ) : (
                                            <LeftMessageDisplay
                                                chat={chat}
                                                profile={profile}
                                                toggleReaction={toggleReaction}
                                                showReactionIcon={
                                                    showReactionIcon
                                                }
                                                index={index}
                                                activeElementIndex={
                                                    activeElementIndex
                                                }
                                                reactionRef={reactionRef}
                                                setToggleReaction={
                                                    setToggleReaction
                                                }
                                                handleReactionClick={
                                                    handleReactionClick
                                                }
                                                deleteMessage={deleteMessage}
                                                showReactionIconOnHover={
                                                    showReactionIconOnHover
                                                }
                                                setActiveElementIndex={
                                                    setActiveElementIndex
                                                }
                                                setShowImageModal={
                                                    setShowImageModal
                                                }
                                                setImageUrl={setImageUrl}
                                                showImageModal={showImageModal}
                                                setSelectedReaction={
                                                    setSelectedReaction
                                                }
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
            </div>
        </>
    );
};

export default MessageDisplay;
