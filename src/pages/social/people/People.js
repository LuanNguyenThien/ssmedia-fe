// import Avatar from '@components/avatar/Avatar';
import CardElementButtons from '@components/card-element/CardElementButtons';
import CardElementStats from '@components/card-element/CardElementStats';
import useEffectOnce from '@hooks/useEffectOnce';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import '@pages/social/people/People.scss';
import { followerService } from '@services/api/followers/follower.service';
import { userService } from '@services/api/user/user.service';
import { socketService } from '@services/socket/socket.service';
import { ChatUtils } from '@services/utils/chat-utils.service';
import { FollowersUtils } from '@services/utils/followers-utils.service';
// import { ProfileUtils } from '@services/utils/profile-utils.service';
import { Utils } from '@services/utils/utils.service';
import { uniqBy } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heading, Avatar, Box, Center, Image, Flex, Text, Stack, Button, useColorModeValue } from '@chakra-ui/react';
import { ProfileUtils } from '@services/utils/profile-utils.service';
// import { useEffect, useState } from 'react';

const People = () => {
  const { profile } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useInfiniteScroll(bodyRef, bottomLineRef, fetchData);

  const PAGE_SIZE = 12;

  function fetchData() {
    let pageNum = currentPage;
    if (currentPage <= Math.round(totalUsersCount / PAGE_SIZE)) {
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllUsers();
    }
  }

  const getAllUsers = useCallback(async () => {
    try {
      const response = await userService.getAllUsers(currentPage);
      if (response.data.users.length > 0) {
        setUsers((data) => {
          const result = [...data, ...response.data.users];
          const allUsers = uniqBy(result, '_id');
          return allUsers;
        });
      }
      setTotalUsersCount(response.data.totalUsers);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  }, [currentPage, dispatch]);

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.following);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const followUser = async (user) => {
    try {
      FollowersUtils.followUser(user, dispatch);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const unFollowUser = async (user) => {
    try {
      const userData = user;
      userData.followersCount -= 1;
      socketService?.socket?.emit('unfollow user', userData);
      FollowersUtils.unFollowUser(user, profile, dispatch);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffectOnce(() => {
    getAllUsers();
    getUserFollowing();
  });

  useEffect(() => {
    FollowersUtils.socketIOFollowAndUnfollow(users, following, setFollowing, setUsers);
    ChatUtils.usersOnline(setOnlineUsers);
  }, [following, users]);

  return (
    <div className="card-container" ref={bodyRef}>
      <div className="people">People</div>
      {users.length > 0 && (
        <div className="card-element">
          {users.map((data) => (
            <Center py={6}>
              <Box
                maxW={'270px'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}
              >
                <Image
                  h={'140px'}
                  w={'full'}
                  src={
                    data.bgImageId
                      ? `https://res.cloudinary.com/di6ozapw8/image/upload/v${data.bgImageVersion}/${data.bgImageId}`
                      : 'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
                  }
                  objectFit="cover"
                  alt="#"
                />
                <Flex justify={'center'} mt={-12} position="relative">
                  <Box position="relative">
                    <Avatar
                      size={'xl'}
                      src={data?.profilePicture}
                      css={{
                        border: '2px solid white'
                      }}
                    />
                    {Utils.checkIfUserIsOnline(data?.username, onlineUsers) && (
                      <Box
                        position="absolute"
                        bottom="-6px" // Adjust this to move the icon below the Avatar
                        left="50%"
                        transform="translateX(-50%)"
                        zIndex="10" // Ensure the icon is above other elements
                      >
                        <FaCircle color="green" size={12} />
                      </Box>
                    )}
                  </Box>
                </Flex>

                <Box p={6}>
                  <Stack spacing={0} align={'center'} mb={5}>
                    <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                      {data?.username}
                    </Heading>
                  </Stack>

                  <Stack direction={'row'} justify={'center'} spacing={6}>
                    <Stack spacing={0} align={'center'}>
                      <Text fontWeight={600}>{data?.followersCount}</Text>
                      <Text fontSize={'sm'} color={'gray.500'}>
                        Followers
                      </Text>
                    </Stack>
                    <Stack spacing={0} align={'center'}>
                      <Text fontWeight={600}>{data?.followingCount}</Text>
                      <Text fontSize={'sm'} color={'gray.500'}>
                        Followers
                      </Text>
                    </Stack>
                  </Stack>

                  <Stack direction={'row'} spacing={4} mt={8}>
                    <Button
                      w={'full'}
                      bg={'green.400'}
                      color={'white'}
                      rounded={'md'}
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg'
                      }}
                      onClick={() => ProfileUtils.navigateToProfile(data, navigate)}
                    >
                      Profile
                    </Button>

                    <Button
                      w={'full'}
                      bg={useColorModeValue('#151f21', 'gray.900')}
                      color={'white'}
                      rounded={'md'}
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg'
                      }}
                      onClick={() => {
                        Utils.checkIfUserIsFollowed(following, data?._id) ? unFollowUser(data) : followUser(data);
                      }}
                    >
                      {Utils.checkIfUserIsFollowed(following, data?._id) ? 'Unfollow' : 'Follow'}
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Center>

            // <div className="card-element-item" key={data?._id} data-testid="card-element-item">
            //   {Utils.checkIfUserIsOnline(data?.username, onlineUsers) && (
            //     <div className="card-element-item-indicator">
            //       <FaCircle className="online-indicator" />
            //     </div>
            //   )}
            //   <div className="card-element-header">
            //     <div className="card-element-header-bg"></div>
            //     <Avatar
            //       name={data?.username}
            //       bgColor={data?.avatarColor}
            //       textColor="#ffffff"
            //       size={120}
            //       avatarSrc={data?.profilePicture}
            //     />
            //     <div className="card-element-header-text">
            //       <span className="card-element-header-name">{data?.username}</span>
            //     </div>
            //   </div>
            //   <CardElementStats
            //     postsCount={data?.postsCount}
            //     followersCount={data?.followersCount}
            //     followingCount={data?.followingCount}
            //   />
            //   <CardElementButtons
            //     isChecked={Utils.checkIfUserIsFollowed(following, data?._id)}
            //     btnTextOne="Follow"
            //     btnTextTwo="Unfollow"
            //     onClickBtnOne={() => followUser(data)}
            //     onClickBtnTwo={() => unFollowUser(data)}
            //     onNavigateToProfile={() => ProfileUtils.navigateToProfile(data, navigate)}
            //   />
            // </div>
          ))}
        </div>
      )}

      {loading && !users.length && <div className="card-element" style={{ height: '350px' }}></div>}

      {!loading && !users.length && (
        <div className="empty-page" data-testid="empty-page">
          No user available
        </div>
      )}

      <div ref={bottomLineRef} style={{ marginBottom: '80px', height: '50px' }}></div>
    </div>
  );
};
export default People;
