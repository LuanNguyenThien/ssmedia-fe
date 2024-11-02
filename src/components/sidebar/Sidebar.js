import { useCallback, useEffect, useState, useRef } from 'react';
import { sideBarItems, fontAwesomeIcons } from '@services/utils/static.data';
import { useLocation, createSearchParams, useNavigate } from 'react-router-dom';
import '@components/sidebar/Sidebar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '@redux/api/posts';
import { Utils } from '@services/utils/utils.service';
import { ChatUtils } from '@services/utils/chat-utils.service';
import { chatService } from '@services/api/chat/chat.service';
import { socketService } from '@services/socket/socket.service';

const Sidebar = () => {
  const { profile } = useSelector((state) => state.user);
  const { chatList } = useSelector((state) => state.chat);
  const [sidebar, setSideBar] = useState([]);
  const [chatPageName, setChatPageName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State để quản lý trạng thái của sidebar
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarRef = useRef(null); // Tham chiếu đến sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Đảo ngược trạng thái mở/đóng của sidebar
  };

  const checkUrl = (name) => {
    return location.pathname.includes(name.toLowerCase());
  };

  const navigateToPage = (name, url) => {
    if (name === 'Profile') {
      url = `${url}/${profile?.username}?${createSearchParams({ id: profile?._id, uId: profile?.uId })}`;
    }

    if (name === 'Streams') {
      dispatch(getPosts());
    }
    if (name === 'Save') {
      url = '/app/social/save';
      dispatch(getPosts());
    }
    if (name === 'Chat') {
      setChatPageName('Chat');
    } else {
      leaveChatPage();
      setChatPageName('');
    }
    socketService?.socket.off('message received');
    navigate(url);
  };

  const createChatUrlParams = useCallback(
    (url) => {
      if (chatList.length) {
        const chatUser = chatList[0];
        const params = ChatUtils.chatUrlParams(chatUser, profile);
        ChatUtils.joinRoomEvent(chatUser, profile);
        return `${url}?${createSearchParams(params)}`;
      } else {
        return url;
      }
    },
    [chatList, profile]
  );

  const markMessagesAsRad = useCallback(
    async (user) => {
      try {
        const receiverId = user?.receiverUsername !== profile?.username ? user?.receiverId : user?.senderId;
        if (user?.receiverUsername === profile?.username && !user.isRead) {
          await chatService.markMessagesAsRead(profile?._id, receiverId);
        }
        const userTwoName =
          user?.receiverUsername !== profile?.username ? user?.receiverUsername : user?.senderUsername;
        await chatService.addChatUsers({ userOne: profile?.username, userTwo: userTwoName });
      } catch (error) {
        Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
      }
    },
    [dispatch, profile]
  );

  const leaveChatPage = async () => {
    try {
      const chatUser = chatList[0];
      const userTwoName =
        chatUser?.receiverUsername !== profile?.username ? chatUser?.receiverUsername : chatUser?.senderUsername;
      ChatUtils.privateChatMessages = [];
      await chatService.removeChatUsers({ userOne: profile?.username, userTwo: userTwoName });
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffect(() => {
    setSideBar(sideBarItems);
  }, []);

  useEffect(() => {
    if (chatPageName === 'Chat') {
      const url = createChatUrlParams('/app/social/chat/messages');
      navigate(url);
      if (chatList.length && !chatList[0].isRead) {
        markMessagesAsRad(chatList[0]);
      }
    }
  }, [chatList, chatPageName, createChatUrlParams, markMessagesAsRad, navigate]);

  useEffect(() => {
    // Đóng sidebar khi màn hình lớn hơn 768px
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hàm xử lý sự kiện click bên ngoài sidebar
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false); // Ẩn sidebar nếu click bên ngoài
    }
  };

  useEffect(() => {
    // Thêm sự kiện click để ẩn sidebar khi click bên ngoài
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Button toggle xuất hiện khi màn hình nhỏ hơn 768px */}
      <button className="toggle-button" onClick={toggleSidebar}>
        ☰
      </button>
      <div ref={sidebarRef} className={`app-side-menu ${isSidebarOpen ? 'open' : ''}`}>
        <div className="side-menu">
          <ul className="list-unstyled">
            {sidebar.map((data) => (
              <li key={data.index} onClick={() => navigateToPage(data.name, data.url)}>
                <div data-testid="sidebar-list" className={`sidebar-link ${checkUrl(data.name) ? 'active' : ''}`}>
                  <div className="menu-icon">{fontAwesomeIcons[data.iconName]}</div>
                  <div className="menu-link">
                    <span>{data.name}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
