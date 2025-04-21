import "@pages/social/chat/Chat.scss";
import useEffectOnce from "@hooks/useEffectOnce";
import { getConversationList } from "@redux/api/chat";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ChatList from "@components/chat/list/ChatList";
import ChatWindow from "@components/chat/window/ChatWindow";

const ChatMobile = () => {
    const [params] = useSearchParams();
    const isSelectedChatUser = params.get("username") || null;
    const dispatch = useDispatch();

    useEffectOnce(() => {
        dispatch(getConversationList());
    });

    return (
        <div className="size-full col-span-5 bg-background px-4 rounded-t-[30px] rounded-b-[30px] relative">
            {/* Chat List */}
            <div
                className={`size-full transition-opacity duration-300 ${
                    isSelectedChatUser ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
            >
                <ChatList />
            </div>

            {/* Chat Window */}
            <div
                className={`h-[100dvh] w-screen fixed top-0 left-0 bg-primary-white py-2 z-[100] transition-transform duration-300 ${
                    isSelectedChatUser ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <ChatWindow />
            </div>
        </div>
    );
};

export default ChatMobile;
