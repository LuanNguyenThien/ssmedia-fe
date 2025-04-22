import ChatListSkeleton from '@components/chat/list/ChatListSkeleton';
import Spinner from '@components/spinner/Spinner';
import '@pages/social/chat/Chat.scss';
import { useEffect, useState } from "react"

const ChatSkeleton = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [hasUsernameParam, setHasUsernameParam] = useState(false)

  useEffect(() => {
    // Check if mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check if username param exists in URL
    const checkUsernameParam = () => {
      const params = new URLSearchParams(window.location.search)
      setHasUsernameParam(params.has("username"))
    }

    // Initial checks
    checkIfMobile()
    checkUsernameParam()

    // Add event listener for resize
    window.addEventListener("resize", checkIfMobile)

    // Add event listener for URL changes
    window.addEventListener("popstate", checkUsernameParam)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile)
      window.removeEventListener("popstate", checkUsernameParam)
    }
  }, [])

  return (
    <div className="size-full col-span-full bg-background-blur min-h-[84svh] max-h-[84svh] overflow-hidden rounded-b-[30px] rounded-t-[30px] p-4">
      {isMobile ? (
        // Mobile layout
        <div className="size-full col-span-5 bg-background p-4 rounded-t-[30px] rounded-b-[30px]">
          {!hasUsernameParam ? (
            // Show ChatListSkeleton when no username param
            <div className="size-full">
              <ChatListSkeleton />
            </div>
          ) : (
            // Show Spinner when username param exists
            <div className="size-full flex items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
      ) : (
        // Desktop layout
        <div className="size-full bg-background-blur rounded-t-[10px]">
          <div className="size-full grid grid-cols-5 lg:grid-cols-4 gap-4">
            <div className="col-span-2 lg:col-span-1 bg-primary-white h-full max-h-full overflow-y-hidden px-6 py-2 rounded-[30px]">
              <ChatListSkeleton />
            </div>
            <div className="relative col-span-3 lg:col-span-3 bg-primary-white h-full max-h-full overflow-y-hidden rounded-[30px]">
              <div className="no-chat size-full flex items-center justify-center">
                <Spinner />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatSkeleton;
