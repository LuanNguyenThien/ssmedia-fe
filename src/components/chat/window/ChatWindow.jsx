import { createRoot } from "react-dom/client";
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
import VideoCallWindow from "@pages/callwindow/VideoCallWindow";
import FirstChatScreen from "./FirstChatScreen/FirstChatScreen";
import LoadingMessage from "@/components/state/loading-message/LoadingMessage";

import { IoIosVideocam } from "react-icons/io";
import { PiPhoneFill } from "react-icons/pi";


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

    const initiateCall = async (callType, receiverId) => {
        const callData = {
          callerName: profile.username,
          callerId: profile.userId,
          callType,
          isReceivingCall: false,
          receiverId,
          receiverName: receiver?.username || receiver?.name
        };

        // Kiểm tra xem cửa sổ popup đã được mở hay chưa
        if (ChatUtils.callWindow && !ChatUtils.callWindow.closed) {
            ChatUtils.callWindow.postMessage({ type: 'FORCE_CLOSE' }, '*');
            ChatUtils.callWindow.close();
        }
      
        ChatUtils.callWindow = window.open(
          "",
          "_blank",
          "width=800,height=600,top=100,left=100,scrollbars=no"
        );
      
        ChatUtils.callWindow.document.title = `${callType === "video" ? "Video" : "Voice"} Call`;
        ChatUtils.callWindow.document.body.style.margin = '0';
        ChatUtils.callWindow.document.body.style.overflow = 'hidden';
        ChatUtils.callWindow.document.body.innerHTML = '<div id="call-root"></div>';
      
        try {
          const stream = await ChatUtils.callWindow.navigator.mediaDevices.getUserMedia({
            video: callType === "video",
            audio: true,
          });
      
          const root = createRoot(ChatUtils.callWindow.document.getElementById("call-root"));
          root.render(
            <VideoCallWindow
              callData={callData}
              stream={stream}
              onClose={() => ChatUtils.callWindow.close()}
              popupWindowRef={ChatUtils.callWindow} // Truyền tham chiếu cửa sổ popup
            />
          );
        } catch (error) {
          console.error("Error accessing media devices:", error);
          ChatUtils.callWindow.close();
        }
    };

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
                                className="chat-title h-15 min-h-15 w-[100vw]  sm:rounded-[30px] py-2 px-2"
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
                                {/* Call buttons */}
                                <div className="chat-call-buttons flex justify-end items-center gap-4 ml-auto pr-2">
                                    <PiPhoneFill className="size-6 text-primary/80 hover:text-primary/60" onClick={() => initiateCall("voice")}/>  
                                    <IoIosVideocam className="size-6 text-primary/80 hover:text-primary/70" onClick={() => initiateCall("video")}/>
                                    {/* <button
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors duration-200 text-white shadow-md"
                                        onClick={() => initiateCall("voice")}
                                        aria-label="Voice Call"
                                        title="Voice Call"
                                    >
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                    </button>
                                    <button
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors duration-200 text-white shadow-md"
                                        onClick={() => initiateCall("video")}
                                        aria-label="Video Call"
                                        title="Video Call"
                                    >
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        >
                                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                        </svg>
                                    </button> */}
                                </div>
                            </div>

                            {/* chat window */}
                            <div className="flex-1 max-h-full pb-16 overflow-y-scroll pt-2 px-4 scrollbar-hide">
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
                            <div className="absolute left-0 bottom-0 h-16 w-full px-4 sm:px-0 flex items-center justify-center z-50">
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
