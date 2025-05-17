import "@pages/social/chat/Chat.scss";
import ChatMobile from "./components/ChatMobile";
import ChatDesktop from "./components/ChatDesktop";
import { Utils } from "@/services/utils/utils.service";

const Chat = () => {
    return (
        <div className="size-full col-span-full bg-background-blur min-h-[84dvh] max-h-[84dvh] overflow-hidden rounded-b-[30px] rounded-t-[30px] sm:p-4">
            {Utils.isMobileDevice() ? <ChatMobile /> : <ChatDesktop />}
        </div>
    );
};
export default Chat;
