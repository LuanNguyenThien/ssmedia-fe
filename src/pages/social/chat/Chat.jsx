import ChatList from '@components/chat/list/ChatList';
import ChatWindow from '@components/chat/window/ChatWindow';
import useEffectOnce from '@hooks/useEffectOnce';
import '@pages/social/chat/Chat.scss';
import { getConversationList } from '@redux/api/chat';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
// import { Box, Text, Flex } from '@chakra-ui/react';

const Chat = () => {
  const { selectedChatUser, chatList } = useSelector((state) => state.chat);
  const [params] = useSearchParams();
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(getConversationList());
  });
  return (
    <div className="private-chat-wrapper">
      <div className="private-chat-wrapper-content">
        <div className={`private-chat-wrapper-content-side${params.get('username') ? '-sm' : ''}`}>
          <ChatList />
        </div>
        <div className={`private-chat-wrapper-content-conversation${params.get('username') ? '-sm' : ''}`}>
          {(selectedChatUser || chatList.length > 0) && <ChatWindow />}
          {!selectedChatUser && !chatList.length && (
            <div className="no-chat" data-testid="no-chat">
              Select or Search for users to chat with
            </div>
          )}
        </div>
      </div>
    </div>
    // <Box className="private-chat-wrapper" p={4}>
    //   <Flex className="private-chat-wrapper-content" direction={{ base: 'column', md: 'row' }} height="100%">
    //     <Box className="private-chat-wrapper-content-side" flex="1" borderRight={{ base: 'none', md: '1px solid' }} borderColor="gray.200" pr={{ base: 0, md: 4 }}>
    //       <ChatList />
    //     </Box>
    //     <Box className="private-chat-wrapper-content-conversation" flex="2" pl={{ base: 0, md: 4 }}>
    //       {(selectedChatUser || chatList.length > 0) ? (
    //         <ChatWindow />
    //       ) : (
    //         <Box className="no-chat" data-testid="no-chat" textAlign="center" p={4}>
    //           <Text fontSize="lg" color="gray.500">Select or Search for users to chat with</Text>
    //         </Box>
    //       )}
    //     </Box>
    //   </Flex>
    // </Box>
  );
};
export default Chat;
