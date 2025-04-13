import { sideBarItems } from "@services/utils/static.data";
import { DynamicSVG } from "./components/SidebarItems";
import { useLocation, createSearchParams, useNavigate } from "react-router-dom";
import "@components/sidebar/Sidebar.scss";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "@redux/api/posts";
import { Utils } from "@services/utils/utils.service";
import { ChatUtils } from "@services/utils/chat-utils.service";
import { chatService } from "@services/api/chat/chat.service";
import { socketService } from "@services/socket/socket.service";

const StickySidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { profile } = useSelector((state) => state.user);
    const { chatList } = useSelector((state) => state.chat);

    const checkUrl = (name) => {
        return location.pathname.includes(name.toLowerCase());
    };

    const navigateToPage = (name, url) => {
        if (name === "Profile") {
            url = `${url}/${profile?.username}?${createSearchParams({
                id: profile?._id,
                uId: profile?.uId,
            })}`;
        }
        if (name === "Save") {
            // url = '/app/social/save';
            // dispatch(getFavPosts());
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
        <div className="fixed h-screen w-12 left-0 top-0  flex flex-col items-center justify-center gap-6">
            {sideBarItems.map((item, index) => {
                return (
                    <div
                        onClick={() => navigateToPage(item.name, item.url)}
                        key={index}
                        className="flex items-center justify-center  cursor-pointer hover:text-primary-black/60 transition-all duration-200 hover:scale-110"
                    >
                        <DynamicSVG
                            svgData={item.iconName}
                            className={"size-6"}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default StickySidebar;
