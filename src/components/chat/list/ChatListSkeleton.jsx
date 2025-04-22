import "@components/input/Input.scss";
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import "@components/chat/list/ChatList.scss";

const ChatListSkeleton = () => {
  return (
    <div data-testid="chatList" className="h-full">
      <div className="conversation-container h-full">
        <div className="flex justify-between items-center py-3">
          <div className="font-extrabold text-xl">
            <Skeleton baseColor="#EFF1F6" height={24} width={120} />
          </div>
        </div>

        <div className="conversation-container-search" data-testid="search-container">
          <div className="search">
            <Skeleton baseColor="#EFF1F6" circle height={16} width={16} />
          </div>
          <Skeleton baseColor="#EFF1F6" height={45} width="100%" borderRadius={30}/>
        </div>

        <div className="conversation-container-body h-4/5 overflow-y-scroll scroll-smooth">
          <div className="conversation size-full flex flex-col gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
              <div key={index} data-testid="conversation-item" className="conversation-item">
                <div className="avatar">
                  <Skeleton baseColor="#EFF1F6" circle height={40} width={40} />
                </div>
                <div className="title-text">
                  <Skeleton baseColor="#EFF1F6" height={16} width={120} />
                </div>
                <div className="created-date">
                  <Skeleton baseColor="#EFF1F6" height={12} width={50} />
                </div>
                <div className="conversation-message">
                  <div className="flex justify-between">
                    <Skeleton baseColor="#EFF1F6" height={12} width={150} />
                    <Skeleton baseColor="#EFF1F6" circle height={10} width={10} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatListSkeleton