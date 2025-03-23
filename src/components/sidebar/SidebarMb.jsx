import { icons } from "assets/assets";
import { DynamicSVG } from "./components/SidebarItems";
import { createSearchParams, useNavigate } from "react-router-dom";
import "@components/sidebar/Sidebar.scss";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "@redux/api/posts";
import { Utils } from "@services/utils/utils.service";
import { ChatUtils } from "@services/utils/chat-utils.service";
import { chatService } from "@services/api/chat/chat.service";
import { socketService } from "@services/socket/socket.service";

const SidebarMb = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { profile } = useSelector((state) => state.user);
    const { chatList } = useSelector((state) => state.chat);

    const navigateToPage = (name, url) => {
        if (name === "Profile") {
            url = `${url}/${profile?.username}?${createSearchParams({
                id: profile?._id,
                uId: profile?.uId,
            })}`;
        }
        if (name === "Streams") {
            dispatch(getPosts());
        }

        if (name === "Chat") {
            // setChatPageName("Chat");
        } else {
            leaveChatPage();
            // setChatPageName("");
        }
        socketService?.socket.off("message received");
        navigate(url);
    };
    const leaveChatPage = async () => {
        try {
            const chatUser = chatList[0];
            const userTwoName =
                chatUser?.receiverUsername !== profile?.username
                    ? chatUser?.receiverUsername
                    : chatUser?.senderUsername;
            ChatUtils.privateChatMessages = [];
            await chatService.removeChatUsers({
                userOne: profile?.username,
                userTwo: userTwoName,
            });
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    return (
        <div className="fixed bottom-0 h-[8vh] w-full grid grid-cols-5 bg-background shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]  z-50">
            <div className="flex justify-center items-center col-span-2  gap-8 px-4 ">
                <div
                    onClick={() =>
                        navigateToPage("Streams", "/app/social/streams")
                    }
                >
                    <DynamicSVG svgData={icons.home} className={"size-8"} />
                </div>
                <div
                    onClick={() =>
                        navigateToPage("Chat", "/app/social/chat/messages")
                    }
                >
                    <DynamicSVG svgData={icons.chats} className={"size-8"} />
                </div>
            </div>
            <div className="flex justify-center items-start col-span-1  relative">
                <div className="absolute bottom-0 bg-white rounded-t-full p-1">
                    <DynamicSVG
                        svgData={icons.add}
                        className={"size-16 text-primary/50"}
                    />
                </div>
            </div>

            <div className="flex justify-center items-center col-span-2  gap-8 px-4 ">
                <div
                    onClick={() =>
                        navigateToPage(
                            "Notifications",
                            "/app/social/notifications"
                        )
                    }
                >
                    <DynamicSVG
                        svgData={icons.notifications}
                        className={"size-8"}
                    />
                </div>
                <div
                    onClick={() =>
                        navigateToPage("Profile", "/app/social/profile")
                    }
                >
                    <DynamicSVG svgData={icons.profile} className={"size-8"} />
                </div>
            </div>
        </div>
    );
};

export default SidebarMb;
