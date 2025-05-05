import Avatar from "@components/avatar/Avatar";
import Reactions from "@components/posts/reactions/Reactions";
import { timeAgo } from "@services/utils/timeago.utils";
import { useState, useRef } from "react";
import { DynamicSVG } from "./../../../../sidebar/components/SidebarItems";
import { icons } from "@assets/assets";
import LeftMessageBubble from "./LeftMessageBubble";
import ReactionsDisplay from "../reactions/ReactionsDisplay";

const LeftMessageDisplay = ({
    chat,
    toggleReaction,
    index,
    activeElementIndex,
    reactionRef,
    setToggleReaction,
    handleReactionClick,
    setActiveElementIndex,
    setShowImageModal,
    setImageUrl,
    showImageModal,
    onShowReactionsTab
    
}) => {
    const optionsRef = useRef(null);
    const [isShowBottom, setIsShowBottom] = useState(false);
    const [isHoverMessage, setIsHoverMessage] = useState(false);

    const handleClickMessage = () => {
        setIsShowBottom(!isShowBottom);
    };

    return (
        <div className="message left-message" data-testid="left-message">
            <div className="left-message-bubble-container relative flex justify-start max-w-[90%]">
                <div className="message-img w-max">
                    <Avatar
                        name={chat.senderUsername}
                        bgColor={chat.senderAvatarColor}
                        textColor="#ffffff"
                        size={40}
                        avatarSrc={chat.senderProfilePicture}
                    />
                </div>
                <div className="message-left-reactions-container absolute left-0 -bottom-2 z-[100] flex">
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
                <div className="message-content-container relative">
                    <div
                        data-testid="message-content"
                        className="message-content relative"
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
                                className="absolute pl-2 cursor-pointer size-max right-0 top-1/2 -translate-y-1/2 translate-x-full z-50 flex items-center justify-between gap-2"
                                onMouseEnter={() => setIsHoverMessage(true)}
                                onMouseLeave={(e) => {
                                    if (
                                        !e.currentTarget.contains(
                                            e.relatedTarget
                                        )
                                    ) {
                                        setIsHoverMessage(false);
                                    }
                                }}
                            >
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
                            </div>
                        )}

                        {chat?.deleteForEveryone && (
                            <div className="message-bubble left-message-bubble">
                                <span className="message-deleted">
                                    message deleted
                                </span>
                            </div>
                        )}
                        {!chat?.deleteForEveryone && (
                            <LeftMessageBubble
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
                            <div
                                className="absolute left-0 -bottom-2 size-4 flex items-start z-0"
                            >
                                <ReactionsDisplay
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onShowReactionsTab();
                                    }}
                                    reactions={chat?.reaction}
                                    direction={false}
                                />
                            </div>
                        )}
                </div>
            </div>

            <div
                className={`message-content-bottom ${
                    chat?.reaction && chat?.reaction.length > 0 ? "mt-2" : ""
                }`}
            >
                {isShowBottom && (
                    <div className="message-time w-max flex items-center text-xs gap-1 animate__animated animate__fadeInDown animate__faster">
                        <span data-testid="chat-time">
                            {timeAgo.timeFormat(chat?.createdAt)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
export default LeftMessageDisplay;
