import "@components/chat/window/message-display/MessageDisplay.scss";
import { timeAgo } from "@services/utils/timeago.utils";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import useDetectOutsideClick from "@hooks/useDetectOutsideClick";
import RightMessageDisplay from "./right-message-display/RightMessageDisplay";
import LeftMessageDisplay from "./left-message/LeftMessageDisplay";
import { useSearchParams } from "react-router-dom";
import ImageModal from "@components/image-modal/ImageModal";
import LoadingMessage from "@components/state/loading-message/LoadingMessage";
import Dialog from "@components/dialog/Dialog";
import { groupChatService } from "@/services/api/chat/group-chat.service";
import ReactionsTab from "./reactions/ReactionsTab";

const MessageDisplay = ({
    chatMessages,
    profile,
    updateMessageReaction,
    deleteChatMessage,
    isGroup,
}) => {
    const [imageUrl, setImageUrl] = useState("");
    const [searchParams] = useSearchParams();
    const [groupChatData, setGroupChatData] = useState(null);

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
    const [messagesToShow, setMessagesToShow] = useState(15);
    const [chosenMessage, setChosenMessage] = useState(null);

    const reactionRef = useRef(null);
    const scrollRef = useRef(null);
    const hasScrollToBottom = useRef(false);
    const initialRenderComplete = useRef(false);

    const [toggleReaction, setToggleReaction] = useDetectOutsideClick(
        reactionRef,
        false
    );
    const displayedMessages = useMemo(
        () => chatMessages.slice(-messagesToShow),
        [chatMessages, messagesToShow]
    );

    // Initial scroll to bottom - only happens once
    useEffect(() => {
        if (!initialRenderComplete.current) {
            setMessagesToShow(15);

            // Immediate scroll attempt
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
            }
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop =
                        scrollRef.current?.scrollHeight;
                    hasScrollToBottom.current = true;
                }
                initialRenderComplete.current = true;
            }, 300);
        }
    }, []);

    // Handle group data fetching separately
    useEffect(() => {
        const id = searchParams.get("id");

        const fetchGroupChatMembers = async () => {
            try {
                const response = await groupChatService.getGroupChatById(id);
                setGroupChatData(response.data.group.members);
            } catch (error) {
                console.error("Error fetching group members:", error);
            }
        };

        if (id && isGroup) {
            fetchGroupChatMembers();
        }
    }, [searchParams, isGroup]);

    // Improved scroll handler with throttling
    const handleScroll = useCallback(() => {
        if (!scrollRef.current || isLoadingMessage) return;

        if (
            scrollRef.current.scrollTop === 0 &&
            messagesToShow < chatMessages.length
        ) {
            setIsLoadingMessage(true);

            requestAnimationFrame(() => {
                const currentScrollHeight =
                    scrollRef.current?.scrollHeight || 0;

                setTimeout(() => {
                    setMessagesToShow((prev) =>
                        Math.min(prev + 20, chatMessages.length)
                    );
                    setTimeout(() => {
                        if (scrollRef.current) {
                            const newScrollHeight =
                                scrollRef.current.scrollHeight;
                            scrollRef.current.scrollTop =
                                newScrollHeight - currentScrollHeight;
                        }
                        setIsLoadingMessage(false);
                    }, 100);
                }, 500);
            });
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
            {/* Group chat members display */}

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
                    firstBtnHandler={(e) => {
                        e.stopPropagation();
                        handleReactionClick(selectedReaction);
                    }}
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
                className="message-page h-full relative scrollbar-hide"
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
                        const isSystemMessage =
                            chat?.senderUsername === "System";
                        return (
                            <div
                                key={chat._id}
                                className="message-chat"
                                data-testid="message-chat"
                            >
                                {chosenMessage &&
                                    isGroup &&
                                    chat.reaction === chosenMessage && (
                                        <ReactionsTab
                                            reactions={chat?.reaction}
                                            groupChatData={groupChatData}
                                            onRemoveReaction={(e) => {
                                                e.stopPropagation();
                                                const userReact =
                                                    chat?.reaction.find(
                                                        (reaction) =>
                                                            reaction.senderName ===
                                                            profile?.username
                                                    );

                                                if (
                                                    userReact?.senderName ===
                                                    profile?.username
                                                ) {
                                                    const body = {
                                                        conversationId:
                                                            chat?.conversationId ||
                                                            chat?.groupId,
                                                        messageId: chat?._id,
                                                        reaction:
                                                            userReact.type,
                                                        type: "remove",
                                                    };
                                                    setSelectedReaction(body);
                                                }
                                            }}
                                            onCloseReactionTab={() =>
                                                setChosenMessage(null)
                                            }
                                        />
                                    )}
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
                                {isSystemMessage && (
                                    <div className="system-message w-full flex items-center justify-center py-2 px-4">
                                        <span className="system-message-content text-xs font-light">
                                            {chat.body}
                                        </span>
                                    </div>
                                )}

                                {(chat.receiverUsername === profile?.username ||
                                    chat.senderUsername === profile?.username ||
                                    chat.isGroupChat) &&
                                    !isSystemMessage && (
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
                                                    toggleReaction={
                                                        toggleReaction
                                                    }
                                                    showReactionIcon={
                                                        showReactionIcon
                                                    }
                                                    index={index}
                                                    lastIndex={
                                                        displayedMessages.length -
                                                        1
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
                                                    deleteMessage={
                                                        deleteMessage
                                                    }
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
                                                    showImageModal={
                                                        showImageModal
                                                    }
                                                    setSelectedReaction={
                                                        setSelectedReaction
                                                    }
                                                    onShowReactionsTab={() =>
                                                        setChosenMessage(
                                                            chat.reaction
                                                        )
                                                    }
                                                    onCloseReactionTab={() =>
                                                        setChosenMessage(null)
                                                    }
                                                    isGroup={isGroup}
                                                />
                                            ) : (
                                                <LeftMessageDisplay
                                                    chat={chat}
                                                    profile={profile}
                                                    toggleReaction={
                                                        toggleReaction
                                                    }
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
                                                    deleteMessage={
                                                        deleteMessage
                                                    }
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
                                                    showImageModal={
                                                        showImageModal
                                                    }
                                                    setSelectedReaction={
                                                        setSelectedReaction
                                                    }
                                                    groupChatMembers={
                                                        groupChatData
                                                    }
                                                    onShowReactionsTab={() =>
                                                        setChosenMessage(
                                                            chat.reaction
                                                        )
                                                    }
                                                    onCloseReactionTab={() =>
                                                        setChosenMessage(null)
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
