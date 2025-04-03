import "@pages/social/chat/Chat.scss";
import ChatMobile from "./components/ChatMobile";
import ChatDesktop from "./components/ChatDesktop";

const Chat = () => {
    const isMobile = window.innerWidth < 768;
    return (
        <div className="size-full col-span-full bg-background-blur min-h-[84svh] max-h-[84svh] overflow-hidden rounded-b-[30px] rounded-t-[30px]  p-4">
            {isMobile ? <ChatMobile /> : <ChatDesktop />}
        </div>
    );
};
export default Chat;
