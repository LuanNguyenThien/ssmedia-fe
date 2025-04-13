import Avatar from "@components/avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import "@components/chat/window/ChatWindow.scss";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Utils } from "@services/utils/utils.service";
import { userService } from "@services/api/user/user.service";
import { ChatUtils } from "@services/utils/chat-utils.service";
import { chatService } from "@services/api/chat/chat.service";
import { some } from "lodash";
import ObjectId from "bson-objectid";
// icons
import { IoIosArrowBack } from "react-icons/io";
import MessageDisplay from "./message-display/MessageDisplay";
import MessageInput from "./message-input/MessageInput";
import LoadingSpinner from "@components/state/loading";
import FirstChatScreen from "./FirstChatScreen/FirstChatScreen";
import LoadingMessage from "@/components/state/loading-message/LoadingMessage";

const ChatWindow = () => {
    const { profile } = useSelector((state) => state.user);
    const { isLoading } = useSelector((state) => state.chat);
    const isMobile = window.innerWidth <= 768;
    const [receiver, setReceiver] = useState();
    const [conversationId, setConversationId] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [searchParams] = useSearchParams();
    const [rendered, setRendered] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Debug counter - consider removing in production
    const count = useRef(0);
    console.log("chatMessages", count.current++);

    //loading state
    const [isSending, setIsSending] = useState(false);

    // Memoized values
    const isGroup = useMemo(
        () => searchParams.get("isGroup") === "true",
        [searchParams]
    );
    const searchParamsId = useMemo(
        () => searchParams.get("id"),
        [searchParams]
    );
    const searchParamsUsername = useMemo(
        () => searchParams.get("username"),
        [searchParams]
    );

    const isReceiverOnline = useMemo(() => {
        return Utils.checkIfUserIsOnline(
            receiver?.username || receiver?.name,
            onlineUsers
        );
    }, [receiver, onlineUsers]);

    const getChatMessages = useCallback(
        async (receiverId, isGroup) => {
            setIsMessagesLoading(true);
            try {
                const response = await chatService.getChatMessages(
                    receiverId,
                    isGroup
                );
                ChatUtils.privateChatMessages = [...response.data.messages];
                if (isGroup === "true") {
                    ChatUtils.conversationId = receiverId;
                } else if (response.data.messages.length > 0) {
                    ChatUtils.conversationId =
                        ChatUtils.privateChatMessages[0]?.conversationId;
                } else {
                    const newConversationId = new ObjectId().toString();
                    setConversationId(newConversationId);
                    ChatUtils.conversationId = newConversationId;
                }
                setChatMessages([...ChatUtils.privateChatMessages]);
            } catch (error) {
                Utils.dispatchNotification(
                    error.response.data.message,
                    "error",
                    dispatch
                );
            } finally {
                setIsMessagesLoading(false);
            }
        },
        [dispatch]
    );

    const getNewUserMessages = useCallback(() => {
        if (searchParamsId && searchParamsUsername) {
            setConversationId("");
            setChatMessages([]);
            getChatMessages(searchParamsId, isGroup);
        }
    }, [getChatMessages, searchParamsId, searchParamsUsername, isGroup]);

    const getUserProfileByUserId = useCallback(async () => {
        try {
            if (searchParamsId && isGroup) {
                const response = await chatService.getGroupChatById(
                    searchParamsId
                );
                setReceiver(response.data.group);
                ChatUtils.joinRoomEvent(response.data.group, profile);
            } else if (searchParamsId) {
                const response = await userService.getUserProfileByUserId(
                    searchParamsId
                );
                setReceiver(response.data.user);
                ChatUtils.joinRoomEvent(response.data.user, profile);
            }
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    }, [dispatch, profile, searchParamsId, isGroup]);

    const sendChatMessage = useCallback(
        async (message, gifUrl, selectedImage) => {
            try {
                setIsSending(true);
                const checkUserOne = some(
                    ChatUtils.chatUsers,
                    (user) =>
                        user?.userOne === profile?.username &&
                        user?.userTwo === receiver?.username
                );
                const checkUserTwo = some(
                    ChatUtils.chatUsers,
                    (user) =>
                        user?.userOne === receiver?.username &&
                        user?.userTwo === profile?.username
                );
                const messageData = ChatUtils.messageData({
                    receiver: isGroup ? undefined : receiver,
                    conversationId,
                    message,
                    searchParamsId,
                    chatMessages,
                    gifUrl,
                    selectedImage,
                    isRead: checkUserOne && checkUserTwo,
                    isGroupChat: isGroup,
                    groupId: isGroup ? searchParamsId : undefined,
                });
                await chatService.saveChatMessage(messageData);
            } catch (error) {
                Utils.dispatchNotification(
                    error.response.data.message,
                    "error",
                    dispatch
                );
            } finally {
                setIsSending(false);
            }
        },
        [
            profile,
            receiver,
            conversationId,
            searchParamsId,
            chatMessages,
            dispatch,
            isGroup,
        ]
    );

    const updateMessageReaction = useCallback(
        async (body) => {
            try {
                await chatService.updateMessageReaction(body);
            } catch (error) {
                Utils.dispatchNotification(
                    error.response.data.message,
                    "error",
                    dispatch
                );
            }
        },
        [dispatch]
    );

    const deleteChatMessage = useCallback(
        async (senderId, receiverId, messageId, type) => {
            try {
                await chatService.markMessageAsDelete(
                    messageId,
                    senderId,
                    receiverId,
                    type
                );
            } catch (error) {
                Utils.dispatchNotification(
                    error.response.data.message,
                    "error",
                    dispatch
                );
            }
        },
        [dispatch]
    );

    // Load user profile and chat messages when search params change
    useEffect(() => {
        if (rendered) {
            getUserProfileByUserId();
            getNewUserMessages();
        }
        if (!rendered) setRendered(true);
    }, [getUserProfileByUserId, getNewUserMessages, rendered]);

    // Socket events for message receiving
    useEffect(() => {
        if (rendered) {
            ChatUtils.socketIOMessageReceived(
                chatMessages,
                searchParamsUsername,
                setConversationId,
                setChatMessages
            );
        }
        if (!rendered) setRendered(true);

        const fetchInitialOnlineUsers = () => {
            ChatUtils.fetchOnlineUsers(setOnlineUsers);
        };
        fetchInitialOnlineUsers();
        ChatUtils.usersOnline(setOnlineUsers);
        ChatUtils.usersOnChatPage();

        // Cleanup function to remove event listeners
        return () => {
            ChatUtils.removeSocketListeners();
        };
    }, [searchParamsUsername, rendered, chatMessages]);

    // Socket events for message reactions
    useEffect(() => {
        ChatUtils.socketIOMessageReaction(
            chatMessages,
            searchParamsUsername,
            setConversationId,
            setChatMessages
        );
    }, [chatMessages, searchParamsUsername]);

    // Function to go back for mobile
    const handleBackClick = useCallback(() => {
        navigate("/app/social/chat/messages");
    }, [navigate]);

    return (
        <div
            className="chat-window-container gap-2 sm:px-4 sm:py-2"
            data-testid="chat  WindowContainer "
        >
            {isLoading ? (
                <div
                    className="message-loading"
                    data-testid="message-loading"
                ></div>
            ) : (
                <>
                    {searchParamsId && searchParamsUsername ? (
                        <div
                            data-testid="chatWindow"
                            className="chatWindow max-h-full relative bg-slate-800"
                        >
                            {/* header */}
                            <div
                                className="chat-title h-15 min-h-15 w-full bg-background-blur rounded-[30px] py-2 px-4"
                                data-testid="chat-title"
                            >
                                {isMobile && (
                                    <div
                                        className="text-2xl text-gray-500 cursor-pointer pr-2"
                                        onClick={handleBackClick}
                                    >
                                        <IoIosArrowBack />
                                    </div>
                                )}

                                {receiver && (
                                    <div className="chat-title-avatar">
                                        <Avatar
                                            name={receiver?.username}
                                            bgColor={receiver.avatarColor}
                                            textColor="#ffffff"
                                            size={40}
                                            avatarSrc={receiver?.profilePicture}
                                        />
                                    </div>
                                )}
                                <div className="chat-title-items">
                                    {/* name */}
                                    <div
                                        className={`chat-name ${
                                            isReceiverOnline
                                                ? ""
                                                : "user-not-online"
                                        }`}
                                    >
                                        {receiver?.username || receiver?.name}
                                    </div>
                                    {/* online dot */}
                                    {isReceiverOnline && (
                                        <div className="chat-active size-full flex items-center gap-1">
                                            <div className="size-2 bg-green-500 rounded-full"></div>
                                            Online
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* chat window */}
                            <div className="flex-1 max-h-full pb-16 overflow-y-scroll">
                                {isMessagesLoading ? (
                                    <div className="flex items-center justify-center size-full max-h-full">
                                        <div className="size-auto">
                                            <LoadingMessage />
                                        </div>
                                    </div>
                                ) : chatMessages.length > 0 ? (
                                    <MessageDisplay
                                        chatMessages={chatMessages}
                                        profile={profile}
                                        updateMessageReaction={
                                            updateMessageReaction
                                        }
                                        deleteChatMessage={deleteChatMessage}
                                    />
                                ) : (
                                    <FirstChatScreen />
                                )}
                            </div>
                            <div className="absolute left-0 bottom-0 h-16 w-full flex items-center justify-center z-50">
                                <MessageInput
                                    setChatMessage={sendChatMessage}
                                />
                            </div>
                            {isSending && (
                                <div className="absolute left-0 bottom-0 h-16 pb-16 w-full flex items-center justify-center z-50">
                                    <div className="size-max bg-primary-white p-4 rounded-full flex justify-between items-center gap-2 shadow-2xl">
                                        <div className="size-6">
                                            <LoadingSpinner />
                                        </div>
                                        <span className="w-max">
                                            Sending your message...
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            className="size-full flex justify-center items-center"
                            data-testid="no-chat"
                        >
                            Select or Search for users to chat with
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ChatWindow;
