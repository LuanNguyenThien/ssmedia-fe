import { createRoot } from "react-dom/client";
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
import LoadingSpinner from "@components/state/loading";
import VideoCallWindow from "@pages/callwindow/VideoCallWindow";

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

    // const initiateCall = async (callType, receiverId) => {
    //     const callData = {
    //         callerId: profile.userId,
    //         receiverId,
    //         callType,
    //         isReceivingCall: false,
    //     };

    //     const cssContent = `
    //         .video-call-container {
    //             display: flex;
    //             flex-direction: column;
    //             height: 100vh;
    //             width: 100%;
    //             background-color: #1e293b;
    //             color: white;
    //             overflow: hidden;
    //             position: relative;
            
    //             .video-wrapper {
    //             flex: 1;
    //             display: flex;
    //             position: relative;
    //             background-color: #0f172a;
    //             border-radius: 8px;
    //             margin: 10px;
    //             overflow: hidden;
            
    //             .remote-video {
    //                 width: 100%;
    //                 height: 100%;
    //                 object-fit: cover;
    //                 background-color: #000;
    //             }
            
    //             .local-video {
    //                 position: absolute;
    //                 bottom: 20px;
    //                 right: 20px;
    //                 width: 25%;
    //                 max-width: 200px;
    //                 height: auto;
    //                 border-radius: 8px;
    //                 z-index: 2;
    //                 border: 2px solid white;
    //                 box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    //                 transition: all 0.3s ease;
            
    //                 &:hover {
    //                 transform: scale(1.05);
    //                 }
    //             }
            
    //             .call-status {
    //                 position: absolute;
    //                 top: 20px;
    //                 left: 20px;
    //                 background-color: rgba(0, 0, 0, 0.5);
    //                 padding: 8px 16px;
    //                 border-radius: 20px;
    //                 font-size: 14px;
    //                 display: flex;
    //                 align-items: center;
    //                 gap: 8px;
            
    //                 .status-dot {
    //                 width: 10px;
    //                 height: 10px;
    //                 border-radius: 50%;
    //                 background-color: #10b981;
            
    //                 &.ringing {
    //                     background-color: #f59e0b;
    //                     animation: pulse 1.5s infinite;
    //                 }
    //                 }
    //             }
    //             }
            
    //             .controls {
    //             display: flex;
    //             justify-content: center;
    //             gap: 20px;
    //             padding: 20px;
    //             background-color: rgba(30, 41, 59, 0.8);
    //             z-index: 10;
            
    //             .control-button {
    //                 display: flex;
    //                 flex-direction: column;
    //                 align-items: center;
    //                 justify-content: center;
    //                 width: 60px;
    //                 height: 60px;
    //                 border-radius: 50%;
    //                 background-color: #334155;
    //                 color: white;
    //                 border: none;
    //                 cursor: pointer;
    //                 transition: all 0.2s ease;
    //                 box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            
    //                 &:hover {
    //                 transform: scale(1.1);
    //                 background-color: #3b82f6;
    //                 }
            
    //                 &.end-call {
    //                 background-color: #ef4444;
            
    //                 &:hover {
    //                     background-color: #dc2626;
    //                     transform: scale(1.1);
    //                 }
    //                 }
            
    //                 svg {
    //                 width: 24px;
    //                 height: 24px;
    //                 }
            
    //                 span {
    //                 margin-top: 4px;
    //                 font-size: 12px;
    //                 }
    //             }
    //             }
            
    //             .caller-info {
    //             position: absolute;
    //             top: 50%;
    //             left: 50%;
    //             transform: translate(-50%, -50%);
    //             text-align: center;
    //             z-index: 1;
            
    //             .caller-name {
    //                 font-size: 24px;
    //                 margin-bottom: 10px;
    //             }
            
    //             .call-type {
    //                 font-size: 16px;
    //                 color: #94a3b8;
    //             }
    //             }
            
    //             @keyframes pulse {
    //             0% {
    //                 opacity: 1;
    //             }
    //             50% {
    //                 opacity: 0.3;
    //             }
    //             100% {
    //                 opacity: 1;
    //             }
    //             }
    //         }
    //     `;
    
    //     const callWindow = window.open(
    //         "",
    //         "_blank",
    //         "width=800,height=600,top=100,left=100"
    //     );
    
    //     callWindow.document.title = callType === "video" ? "Video Call" : "Voice Call";
    //     callWindow.document.head.innerHTML = `<style>${cssContent}</style>`;
    //     callWindow.document.body.innerHTML = "<div id='call-root'></div>";
    
    //     try {
    //         // Gọi getUserMedia trong ngữ cảnh của cửa sổ mới
    //         const stream = await callWindow.navigator.mediaDevices.getUserMedia({
    //             video: callType === "video",
    //             audio: true,
    //         });
    
    //         // Render React component sau khi lấy được stream
    //         const root = createRoot(callWindow.document.getElementById("call-root"));
    //         root.render(
    //             <VideoCallWindow
    //                 callData={callData}
    //                 stream={stream} // Truyền stream vào component
    //                 onClose={() => callWindow.close()}
    //             />
    //         );
    //     } catch (error) {
    //         console.error("Error accessing media devices:", error);
    //         callWindow.close();
    //     }
    // };

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
            try {
                const response = await chatService.getChatMessages(receiverId, isGroup);
                ChatUtils.privateChatMessages = [...response.data.messages];
                if (isGroup === "true") {
                    ChatUtils.conversationId = receiverId;
                }
                else if (response.data.messages.length > 0) {
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
            getChatMessages(searchParams.get("id"), searchParams.get("isGroup"));
        }
    }, [getChatMessages, searchParams]);

    const getUserProfileByUserId = useCallback(async () => {
        try {
            if(searchParams.get("id") && searchParams.get("isGroup") === "true") {
                const response = await chatService.getGroupChatById(
                    searchParams.get("id")
                );
                setReceiver(response.data.group);
                ChatUtils.joinRoomEvent(response.data.group, profile);
            } else {
                const response = await userService.getUserProfileByUserId(
                    searchParams.get("id")
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
                receiver: searchParams.get("isGroup") === "true" ? undefined : receiver,
                conversationId,
                message,
                searchParamsId: searchParams.get("id"),
                chatMessages,
                gifUrl,
                selectedImage,
                isRead: checkUserOne && checkUserTwo,
                isGroupChat: searchParams.get("isGroup") === "true",
                groupId: searchParams.get("isGroup") === "true" ? searchParams.get("id") : undefined,
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
                                            searchParams.delete("isGroup");
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
                                                receiver?.username || receiver?.name,
                                                onlineUsers
                                            )
                                                ? ""
                                                : "user-not-online"
                                        }`}
                                    >
                                        {receiver?.username || receiver?.name}
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
                                {/* Call buttons */}
                                <div className="chat-call-buttons flex items-center gap-3 ml-auto">
                                    <button
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
                                    </button>
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
