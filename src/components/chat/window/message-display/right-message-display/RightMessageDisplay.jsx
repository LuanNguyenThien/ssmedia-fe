import Reactions from "@components/posts/reactions/Reactions";
import { timeAgo } from "@services/utils/timeago.utils";
import RightMessageBubble from "@components/chat/window/message-display/right-message-display/RightMessageBubble";
import { icons } from "@assets/assets";
import { useState } from "react";
import { DynamicSVG } from "./../../../../sidebar/components/SidebarItems";
import { useRef } from "react";
import OptionSelector from "../options-selector/OptionSelector";
import useHandleOutsideClick from "@hooks/useHandleOutsideClick";
import ReactionsDisplay from "../reactions/ReactionsDisplay";

const RightMessageDisplay = ({
    chat,
    lastChatMessage,
    profile,
    toggleReaction,
    index,
    activeElementIndex,
    reactionRef,
    setToggleReaction,
    handleReactionClick,
    deleteMessage,
    setActiveElementIndex,
    setShowImageModal,
    setImageUrl,
    showImageModal,
    lastIndex,
    onShowReactionsTab,
    isGroup,
}) => {
    const optionsRef = useRef(null);
    const showOptionsRef = useRef(null);
    const [isShowOptions, setIsShowOptions] = useState(false);
    useHandleOutsideClick(showOptionsRef, setIsShowOptions);

    const [isShowBottom, setIsShowBottom] = useState(false);
    const [isHoverMessage, setIsHoverMessage] = useState(false);
    const handleClickMessage = () => {
        setIsShowBottom(!isShowBottom);
    };

    const isLastMessage =
        chat?.senderUsername === profile?.username &&
        !chat?.deleteForEveryone &&
        index === lastIndex;
    return (
        <div className="message right-message" data-testid="right-message">
            {/* message item */}
            <div className="message-right-content-container-wrapper relative pl-[25%] ">
                {/* reactions */}
                <div className="message-right-reactions-contain !w-fit absolute right-0 -bottom-2 z-[100] flex">
                    {toggleReaction &&
                        index === activeElementIndex &&
                        !chat?.deleteForEveryone && (
                            <div ref={reactionRef}>
                                <Reactions
                                    showLabel={false}
                                    handleClick={(event) => {
                                        const body = {
                                            conversationId:
                                                chat?.conversationId ||
                                                chat?.groupId,
                                            messageId: chat?._id,
                                            reaction: event,
                                            type: "add",
                                        };
                                        handleReactionClick(body);
                                        setToggleReaction(false);
                                    }}
                                />
                            </div>
                        )}
                </div>

                <div
                    data-testid="message-content"
                    className="message-content relative pb-1"
                    onClick={handleClickMessage}
                    onMouseEnter={() => {
                        if (!chat.deleteForEveryone) {
                            setIsHoverMessage(true);
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (
                            !e.currentTarget.contains(e.relatedTarget) &&
                            !optionsRef.current?.contains(e.relatedTarget)
                        ) {
                            setIsHoverMessage(false);
                        }
                    }}
                >
                    {isHoverMessage && (
                        <div
                            ref={optionsRef}
                            className="absolute pr-2 cursor-pointer size-max -left-0 top-1/2 -translate-y-1/2 -translate-x-full z-50 flex items-center justify-between gap-2"
                            onMouseEnter={() => setIsHoverMessage(true)}
                            onMouseLeave={(e) => {
                                if (
                                    !e.currentTarget.contains(e.relatedTarget)
                                ) {
                                    setIsHoverMessage(false);
                                }
                            }}
                        >
                            {/* reaction toggle */}
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsHoverMessage(false);
                                    setActiveElementIndex(index);
                                    setToggleReaction(true);
                                }}
                                className="text-primary-black/30 size-6"
                            >
                                <DynamicSVG
                                    className={""}
                                    svgData={icons.feeling}
                                />
                            </div>
                            {/* options toggle */}
                            {!isGroup && (
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsHoverMessage(false);
                                        setIsShowOptions(!isShowOptions);
                                    }}
                                    className="text-primary-black/30 size-6 relative"
                                >
                                    <DynamicSVG
                                        className={""}
                                        svgData={icons.options}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    {isShowOptions && (
                        <div
                            ref={showOptionsRef}
                            className="absolute z-[100] right-1/3 sm:right-1/2 -bottom-2 transform translate-y-full animate__animated animate__fadeIn animate__faster"
                        >
                            <OptionSelector
                                chat={chat}
                                deleteMessage={deleteMessage}
                            />
                        </div>
                    )}

                    {/* thu hồi tất cả */}
                    {chat?.deleteForEveryone && chat?.deleteForMe && (
                        <div className="message-bubble right-message-bubble">
                            <span className="message-deleted">
                                message deleted
                            </span>
                        </div>
                    )}
                    {/* thu hồi bản thân */}
                    {!chat?.deleteForEveryone &&
                        chat?.deleteForMe &&
                        chat?.senderUsername === profile?.username && (
                            <div className="message-bubble right-message-bubble">
                                <span className="message-deleted">
                                    message deleted
                                </span>
                            </div>
                        )}

                    {/* không thu hồi */}
                    {!chat?.deleteForEveryone && !chat?.deleteForMe && (
                        <RightMessageBubble
                            chat={chat}
                            showImageModal={showImageModal}
                            setImageUrl={setImageUrl}
                            setShowImageModal={setShowImageModal}
                        />
                    )}
                </div>

                {chat?.reaction &&
                    chat?.reaction.length > 0 &&
                    !chat.deleteForEveryone && (
                        <div className="absolute w-max right-0 -bottom-2 size-4 z-50">
                            <ReactionsDisplay
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onShowReactionsTab();
                                }}
                                reactions={chat?.reaction}
                                direction={true}
                            />
                        </div>
                    )}
            </div>
            <div
                className={`message-content-bottom ${
                    chat?.reaction && chat?.reaction.length > 0 ? "mt-2" : ""
                }`}
            >
                {isShowBottom && (
                    <div className="message-reaction !bg-transparent w-max flex items-center text-xs gap-1 animate__animated animate__fadeInDown animate__faster">
                        <span
                            data-testid="chat-time"
                            className="flex items-center size-full"
                        >
                            {timeAgo.timeFormat(chat?.createdAt)}
                        </span>
                    </div>
                )}
                {index === lastIndex && (
                    <div className="message-time w-full flex items-center text-xs gap-1 animate__animated animate__fadeInDown animate__faster">
                        {isLastMessage && (
                            <>
                                {lastChatMessage?.isRead ? (
                                    <div className="h-3 w-max flex items-center justify-end gap-1">
                                        seen
                                    </div>
                                ) : (
                                    <div className="h-3 w-max flex items-center justify-end gap-1">
                                        delivered
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RightMessageDisplay;
