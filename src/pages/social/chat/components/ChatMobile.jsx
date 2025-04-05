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
        <div className="size-full col-span-5 bg-background p-4 rounded-t-[30px] rounded-b-[30px]">
            {!isSelectedChatUser ? (
                <div className="size-full">
                    <ChatList />
                </div>
            ) : (
                <div className="size-full">
                    <ChatWindow />
                </div>
            )}
        </div>
    );
};
export default ChatMobile;
