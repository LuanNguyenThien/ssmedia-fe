import { createRoot } from "react-dom/client";
import Avatar from "@components/avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import "@components/chat/window/ChatWindow.scss";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
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
import LoadingSpinner from "@/components/state/LoadingSpinner";
import VideoCallWindow from "@pages/callwindow/VideoCallWindow";
import FirstChatScreen from "./FirstChatScreen/FirstChatScreen";
import LoadingMessage from "@/components/state/loading-message/LoadingMessage";
import InformationGroup from "./info-group/InfomationGroup";

import { IoIosVideocam } from "react-icons/io";
import { PiPhoneFill } from "react-icons/pi";
import { icons } from "@/assets/assets";
import { DynamicSVG } from "@/components/sidebar/components/SidebarItems";
import useHandleOutsideClick from "@/hooks/useHandleOutsideClick";
import GroupChatUtils from "@/services/utils/group-chat-utils.service";
import { socketService } from "@services/socket/socket.service";

const ChatWindow = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isMobile = Utils.isMobileDevice();
    const { profile } = useSelector((state) => state.user);

    const [receiver, setReceiver] = useState();
    const [conversationId, setConversationId] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [searchParams] = useSearchParams();
    const [rendered, setRendered] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(true);
    const [isShowInfoGroup, setIsShowInfoGroup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [membershipCheckComplete, setMembershipCheckComplete] =
        useState(false);
    const [showNonMemberWarning, setShowNonMemberWarning] = useState(false);

    const groupInfoRef = useRef(null);
    useHandleOutsideClick(groupInfoRef, setIsShowInfoGroup, {
        eventType: "click",
    });

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
            receiverName: receiver?.username || receiver?.name,
        };

        // Kiểm tra xem cửa sổ popup đã được mở hay chưa
        if (ChatUtils.callWindow && !ChatUtils.callWindow.closed) {
            ChatUtils.callWindow.postMessage({ type: "FORCE_CLOSE" }, "*");
            ChatUtils.callWindow.close();
        }

        ChatUtils.callWindow = window.open(
            "",
            "_blank",
            "width=800,height=600,top=100,left=100,scrollbars=no"
        );

        ChatUtils.callWindow.document.title = `${
            callType === "video" ? "Video" : "Voice"
        } Call`;
        ChatUtils.callWindow.document.body.style.margin = "0";
        ChatUtils.callWindow.document.body.overflow = "hidden";
        ChatUtils.callWindow.document.body.innerHTML =
            '<div id="call-root"></div>';

        try {
            const stream =
                await ChatUtils.callWindow.navigator.mediaDevices.getUserMedia({
                    video: callType === "video",
                    audio: true,
                });

            const root = createRoot(
                ChatUtils.callWindow.document.getElementById("call-root")
            );
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
            setIsLoading(true);
            setIsMessagesLoading(true);
            try {
                const response = await chatService.getChatMessages(
                    receiverId,
                    isGroup
                );
                ChatUtils.privateChatMessages = [...response.data.messages];
                if (isGroup) {
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
                console.log("Error fetching chat messages:", error);
                Utils.dispatchNotification(
                    error.response.data.message,
                    "error",
                    dispatch
                );
            } finally {
                setIsLoading(false);
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
            navigate("/app/social/chat/messages");
            window.location.reload();
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

                // Create temporary message object for immediate UI update
                const tempMessageId = new ObjectId().toString();
                const tempMessage = {
                    _id: tempMessageId,
                    conversationId: conversationId || new ObjectId().toString(),
                    receiverId: searchParamsId,
                    receiverUsername: receiver?.username || receiver?.name,
                    receiverAvatarColor: receiver?.avatarColor || "",
                    receiverProfilePicture: receiver?.profilePicture || "",
                    senderUsername: profile?.username,
                    senderId: profile?.userId,
                    senderAvatarColor: profile?.avatarColor,
                    senderProfilePicture: profile?.profilePicture,
                    body: message,
                    isRead: false,
                    gifUrl: gifUrl || "",
                    selectedImage: selectedImage || "",
                    reaction: [],
                    createdAt: new Date().toISOString(),
                    deleteForMe: false,
                    deleteForEveryone: false,
                };

                // Update local state immediately for better UX
                setChatMessages((prevMessages) => [
                    ...prevMessages,
                    tempMessage,
                ]);

                // Then proceed with sending to server
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

    // Socket events for message receiving - modified for more reliable updates
    useEffect(() => {
        if (rendered) {
            // Clear existing socket listeners to prevent duplicates
            ChatUtils.removeSocketListeners();

            // Set up message receiver with better error handling
            ChatUtils.socketIOMessageReceived(
                chatMessages,
                searchParamsUsername,
                setConversationId,
                (messages) => {
                    if (Array.isArray(messages)) {
                        setChatMessages(messages);
                        // Automatically scroll to bottom when new messages arrive
                        setTimeout(() => {
                            const chatContainer =
                                document.querySelector(".message-page");
                            if (chatContainer) {
                                chatContainer.scrollTop =
                                    chatContainer.scrollHeight;
                            }
                        }, 100);
                    }
                }
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
    }, [searchParamsUsername, rendered]);

    // Socket events for message reactions with improved handling
    useEffect(() => {
        ChatUtils.socketIOMessageReaction(
            chatMessages,
            searchParamsUsername,
            setConversationId,
            setChatMessages
        );

        return () => {
            // Clean up reaction listeners specifically
            const socket = ChatUtils.socketIOClient;
            if (socket) {
                socket.off("message reaction");
            }
        };
    }, [chatMessages, searchParamsUsername]);

    // Listen for group updates with better handling
    useEffect(() => {
        if (isGroup && rendered && receiver) {
            const handleGroupUpdate = (data) => {
                if (
                    data.groupId === searchParamsId ||
                    data._id === searchParamsId
                ) {
                    // Force refresh group info
                    getUserProfileByUserId();
                }
            };
            const handleGroupDeleted = (groupId) => {
                if (groupId === searchParamsId) {
                    navigate("/app/social/chat/messages");
                    Utils.dispatchNotification(
                        "This group has been deleted",
                        "info",
                        dispatch
                    );
                }
            };
            const handleMemberRemoved = (data) => {
                if (
                    data.groupId === searchParamsId &&
                    data.userId === profile._id
                ) {
                    navigate("/app/social/chat/messages");
                    Utils.dispatchNotification(
                        "You were removed from the group",
                        "info",
                        dispatch
                    );
                } else if (data.groupId === searchParamsId) {
                    getUserProfileByUserId();
                }
            };

            // Add socket listeners with specific handlers
            socketService.socket?.on("group action", (action) => {
                if (
                    action?.data.groupId === receiver?._id ||
                    action?.data._id === receiver?._id
                ) {
                    switch (action.type) {
                        case "promote":
                        case "update":
                        case "leave":
                        case "accept":
                            handleGroupUpdate(action.data);
                            break;
                        case "remove":
                            handleMemberRemoved(action.data);
                            break;
                        case "delete":
                            handleGroupDeleted(action.data.groupId);
                            break;
                        default:
                            break;
                    }
                }
            });

            return () => {
                socketService.socket?.off("group action");
            };
        }
    }, [
        isGroup,
        rendered,
        receiver,
        searchParamsId,
        profile._id,
        navigate,
        dispatch,
        getUserProfileByUserId,
    ]);

    // Clean up all socket listeners
    useEffect(() => {
        return () => {
            ChatUtils.removeSocketListeners();
            GroupChatUtils.removeGroupSocketListeners();
        };
    }, []);

    // Function to go back for mobile
    const handleBackClick = useCallback(() => {
        navigate("/app/social/chat/messages");
    }, [navigate]);

    const isGroupMember = useMemo(
        () =>
            isGroup &&
            !GroupChatUtils.userIsGroupMember(receiver?.members, profile._id),
        [isGroup, receiver, profile]
    );

    // Modify the membership check effect
    useEffect(() => {
        setShowNonMemberWarning(false);

        if (isGroup && receiver) {
            setMembershipCheckComplete(true);
            if (
                !GroupChatUtils.userIsGroupMember(
                    receiver?.members,
                    profile._id
                )
            ) {
                // Use a short timeout to prevent showing the warning prematurely
                const timer = setTimeout(() => {
                    setShowNonMemberWarning(true);
                }, 400);

                return () => clearTimeout(timer);
            }
        } else if (!isGroup) {
            setMembershipCheckComplete(true);
        }
    }, [isGroup, receiver, profile._id]);

    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        if (!isGroup) return;
        if (!isLoading && searchParamsId) {
            const timer = setTimeout(() => {
                setContentVisible(true);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setContentVisible(false);
        }
    }, [isLoading, searchParamsId, isGroupMember]);

    return (
        <div
            className="chat-window-container gap-2 sm:px-4 sm:py-2 relative"
            data-testid="chat WindowContainer"
        >
            {/* Replace the previous warning with this improved version */}
            {showNonMemberWarning && (
                <div className="absolute inset-0 flex justify-center items-center z-[1000] bg-white/20 transition-all duration-300 ease-in-out animate-fadeIn">
                    {Utils.isMobileDevice() && (
                        <div
                            className="fixed gap-2 top-5 left-5 text-xl text-primary-black cursor-pointer pr-2 flex items-center"
                            onClick={handleBackClick}
                        >
                            <IoIosArrowBack />{" "}
                            <span className="text-sm">Back to your chats</span>
                        </div>
                    )}
                    <span
                        className={`font-semibold text-xl ${
                            isGroupMember || !contentVisible
                                ? "opacity-100"
                                : "opacity-0"
                        }`}
                    >
                        You are not a member of this group
                    </span>
                </div>
            )}
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
                            className={`chatWindow max-h-full relative transition-all duration-300 ${
                                isGroup && (isGroupMember || !contentVisible)
                                    ? "blur-md opacity-90"
                                    : "blur-none opacity-100"
                            }`}
                            style={{
                                transitionProperty: "filter, opacity",
                                willChange: "filter, opacity",
                            }}
                        >
                            {/* header */}
                            <div
                                className="chat-title h-15 min-h-15 w-[100vw] sm:w-full sm:rounded-[30px] py-2 px-2 flex items-center"
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
                                    <PiPhoneFill
                                        className="size-6 text-primary/80 hover:text-primary/60"
                                        onClick={() => initiateCall("voice")}
                                    />
                                    <IoIosVideocam
                                        className="size-6 text-primary/80 hover:text-primary/70"
                                        onClick={() => initiateCall("video")}
                                    />
                                </div>
                                {/* Add info button for group chats */}
                                {isGroup && (
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsShowInfoGroup(
                                                !isShowInfoGroup
                                            );
                                        }}
                                        className="ml-2 cursor-pointer text-primary-black/60 hover:text-primary-black"
                                    >
                                        <DynamicSVG
                                            svgData={icons.info}
                                            className="size-6"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* chat window */}
                            <div className="flex-1 max-h-full pb-16 overflow-y-scroll pt-2 px-4 sm:px-0 scrollbar-hide">
                                {isMessagesLoading ? (
                                    <div className="flex items-center justify-center size-full max-h-full">
                                        <div className="size-auto">
                                            <LoadingMessage />
                                        </div>
                                    </div>
                                ) : Array.isArray(chatMessages) &&
                                  chatMessages.length > 0 ? (
                                    <MessageDisplay
                                        chatMessages={chatMessages}
                                        profile={profile}
                                        updateMessageReaction={
                                            updateMessageReaction
                                        }
                                        deleteChatMessage={deleteChatMessage}
                                        isGroup={isGroup}
                                    />
                                ) : (
                                    <FirstChatScreen />
                                )}
                            </div>
                            <div className="absolute left-0 bottom-0 h-16 w-full px-4 sm:px-0 flex items-center justify-center z-10 ">
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
                    {isGroup && isShowInfoGroup && (
                        <InformationGroup
                            ref={groupInfoRef}
                            info={receiver}
                            onClose={() => setIsShowInfoGroup(false)}
                            currentUser={profile}
                            onSuccess={() => {
                                getUserProfileByUserId();
                                getNewUserMessages();
                                setIsShowInfoGroup(false);
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ChatWindow;
