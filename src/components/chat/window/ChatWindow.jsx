import Avatar from "@components/avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import "@components/chat/window/ChatWindow.scss";
import { useCallback, useEffect, useState } from "react";
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
import LoadingSpinner from "components/state/loading";

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
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //loading state
    const [isSending, setIsSending] = useState(false);

    const getChatMessages = useCallback(
        async (receiverId) => {
            try {
                const response = await chatService.getChatMessages(receiverId);
                ChatUtils.privateChatMessages = [...response.data.messages];
                if (response.data.messages.length > 0) {
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
            }
        },
        [dispatch]
    );

    const getNewUserMessages = useCallback(() => {
        if (searchParams.get("id") && searchParams.get("username")) {
            setConversationId("");
            setChatMessages([]);
            getChatMessages(searchParams.get("id"));
        }
    }, [getChatMessages, searchParams]);

    const getUserProfileByUserId = useCallback(async () => {
        try {
            const response = await userService.getUserProfileByUserId(
                searchParams.get("id")
            );
            setReceiver(response.data.user);
            ChatUtils.joinRoomEvent(response.data.user, profile);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    }, [dispatch, profile, searchParams]);

    const sendChatMessage = async (message, gifUrl, selectedImage) => {
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
                receiver,
                conversationId,
                message,
                searchParamsId: searchParams.get("id"),
                chatMessages,
                gifUrl,
                selectedImage,
                isRead: checkUserOne && checkUserTwo,
            });
            await chatService.saveChatMessage(messageData);
            setIsSending(false);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
            setIsSending(false);
        }
    };

    const updateMessageReaction = async (body) => {
        try {
            await chatService.updateMessageReaction(body);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    const deleteChatMessage = async (senderId, receiverId, messageId, type) => {
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
    };

    useEffect(() => {
        if (rendered) {
            getUserProfileByUserId();
            getNewUserMessages();
        }
        if (!rendered) setRendered(true);
    }, [getUserProfileByUserId, getNewUserMessages, searchParams, rendered]);

    useEffect(() => {
        const username = searchParams.get("username");

        if (rendered) {
            ChatUtils.socketIOMessageReceived(
                chatMessages,
                username,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, rendered]);

    useEffect(() => {
        ChatUtils.socketIOMessageReaction(
            chatMessages,
            searchParams.get("username"),
            setConversationId,
            setChatMessages
        );
    }, [chatMessages, searchParams]);

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
                    {searchParams.get("id") && searchParams.get("username") ? (
                        <div
                            data-testid="chatWindow"
                            className="chatWindow max-h-full relative bg-slate-800"
                        >
                            {/* header */}
                            <div
                                className="chat-title  h-15 min-h-15 w-full bg-background-blur  rounded-[30px] py-2 px-4"
                                data-testid="chat-title"
                            >
                                {isMobile && (
                                    <div
                                        className="text-2xl text-gray-500 cursor-pointer pr-2"
                                        onClick={() => {
                                            searchParams.delete("username");
                                            searchParams.delete("id");
                                            navigate(searchParams.toString());
                                        }}
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
                                            Utils.checkIfUserIsOnline(
                                                receiver?.username,
                                                onlineUsers
                                            )
                                                ? ""
                                                : "user-not-online"
                                        }`}
                                    >
                                        {receiver?.username}
                                    </div>
                                    {/* online dot */}
                                    {Utils.checkIfUserIsOnline(
                                        receiver?.username,
                                        onlineUsers
                                    ) && (
                                        <div className="chat-active size-full flex items-center gap-1">
                                            <div className="size-2 bg-green-500 rounded-full"></div>
                                            Online
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* chat window */}
                            <div className="flex-1 max-h-full pb-16 overflow-y-scroll">
                                <MessageDisplay
                                    chatMessages={chatMessages}
                                    profile={profile}
                                    updateMessageReaction={
                                        updateMessageReaction
                                    }
                                    deleteChatMessage={deleteChatMessage}
                                />
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
