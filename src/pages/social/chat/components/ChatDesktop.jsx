import "@pages/social/chat/Chat.scss";
import useEffectOnce from "@hooks/useEffectOnce";
import { getConversationList } from "@redux/api/chat";
import { useDispatch, useSelector } from "react-redux";
// import { useSearchParams } from 'react-router-dom';
import ChatList from "components/chat/list/ChatList";
import ChatWindow from "components/chat/window/ChatWindow";

const ChatDesktop = () => {
    const { selectedChatUser, chatList } = useSelector((state) => state.chat);
    // const [params] = useSearchParams();
    const dispatch = useDispatch();

    useEffectOnce(() => {
        dispatch(getConversationList());
    });
    return (
        <div className="size-full bg-background-blur rounded-t-[10px]">
            <div className="size-full grid grid-cols-5 lg:grid-cols-4 gap-4">
                <div
                    className={`col-span-2 lg:col-span-1 bg-primary-white h-full max-h-full overflow-y-hidden px-6 py-2 rounded-[30px]`}
                >
                    <ChatList />
                </div>
                <div
                    className={`relative col-span-3 lg:col-span-3  bg-primary-white h-full max-h-full overflow-y-hidden rounded-[30px]`}
                >
                    {(selectedChatUser || chatList.length > 0) && (
                        <ChatWindow />
                    )}
                    {!selectedChatUser && !chatList.length && (
                        <div
                            className="no-chat size-full flex items-center justify-center"
                            data-testid="no-chat"
                        >
                            <div>Select or Search for users to chat with</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ChatDesktop;
