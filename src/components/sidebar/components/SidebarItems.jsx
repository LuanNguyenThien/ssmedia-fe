import { useLocation, createSearchParams, useNavigate } from "react-router-dom";
import "@components/sidebar/Sidebar.scss";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "@redux/api/posts";
import { Utils } from "@services/utils/utils.service";
import { ChatUtils } from "@services/utils/chat-utils.service";
import { chatService } from "@services/api/chat/chat.service";
import { socketService } from "@services/socket/socket.service";
import { sideBarItems } from "@services/utils/static.data";

export function DynamicSVG({ svgData, color = "white", className }) {
    const decodedSVG = decodeURIComponent(svgData.split(",")[1]); // Remove `data:image/svg+xml,`
    return (
        <div
            className={className}
            style={{ fill: color }}
            dangerouslySetInnerHTML={{ __html: decodedSVG }}
        />
    );
}

const SidebarItems = () => {
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
        <ul className="list-unstyled flex flex-col gap-1">
            {sideBarItems.map((data) => {
                const isActive = checkUrl(data.name);

                return (
                    <li
                        key={data.index}
                        onClick={() => navigateToPage(data.name, data.url)}
                        className={`w-full text-primary-black/50 cursor-pointer rounded-md 
                            ${
                                isActive
                                    ? "text-white bg-primary/80"
                                    : "hover:text-white hover:bg-primary/60"
                            }`}
                    >
                        <div
                            data-testid="sidebar-list"
                            className="sidebar-link flex items-center justify-start gap-1 p-2 truncate"
                        >
                            <div>
                                <DynamicSVG
                                    svgData={data.iconName}
                                    className={"size-6"}
                                />
                            </div>

                            <div className="menu-link font-medium size-max flex items-center">
                                <di className="size-full flex items-center ">
                                    {data.name}
                                </di>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default SidebarItems;
