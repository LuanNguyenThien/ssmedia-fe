import '@pages/social/followers/Followers.scss';
import '@pages/social/following/Following.scss';

// import Avatar from '@components/avatar/Avatar';
// import CardElementButtons from '@components/card-element/CardElementButtons';
// import CardElementStats from '@components/card-element/CardElementStats';
import { ProfileUtils } from '@services/utils/profile-utils.service';
import { Utils } from '@services/utils/utils.service';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { followerService } from '@services/api/followers/follower.service';
import { socketService } from '@services/socket/socket.service';
import { FollowersUtils } from '@services/utils/followers-utils.service';
import { Heading, Avatar, Box, Center, Image, Flex, Text, Stack, Button, useColorModeValue } from '@chakra-ui/react';

const Followers = () => {
  const { profile, token } = useSelector((state) => state.user);
  const [followers, setFollowers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserFollowers = useCallback(async () => {
    try {
      if (profile) {
        const response = await followerService.getUserFollowers(profile?._id);
        setFollowers(response.data.followers);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  }, [profile, dispatch]);

  const blockUser = async (user) => {
    try {
      socketService?.socket?.emit('block user', { blockedUser: user._id, blockedBy: profile?._id });
      FollowersUtils.blockUser(user, dispatch);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const unblockUser = async (user) => {
    try {
      socketService?.socket?.emit('unblock user', { blockedUser: user._id, blockedBy: profile?._id });
      FollowersUtils.unblockUser(user, dispatch);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffect(() => {
    getUserFollowers();
    setBlockedUsers(profile?.blocked);
  }, [getUserFollowers, profile]);

  useEffect(() => {
    FollowersUtils.socketIOBlockAndUnblock(profile, token, setBlockedUsers, dispatch);
  }, [dispatch, profile, token]);

  return (
    <div className="card-container">
      <div className="followers">Followers</div>
      {followers.length > 0 && (
        <div className="card-element">
          {followers.map((data) => (
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
                <Flex justify={'center'} mt={-12}>
                  <Avatar
                    size={'xl'}
                    src={data?.profilePicture}
                    css={{
                      border: '2px solid white'
                    }}
                  />
                </Flex>

                <Box p={6}>
                  <Stack spacing={0} align={'center'} mb={5}>
                    <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                      {data?.username}
                    </Heading>
                    <Text color={'gray.500'}>Frontend Developer</Text>
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
                        Utils.checkIfUserIsBlocked(blockedUsers, data?._id) ? unblockUser(data) : blockUser(data);
                      }}
                    >
                      {Utils.checkIfUserIsBlocked(blockedUsers, data?._id) ? 'Unblock' : 'Block'}
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Center>
          ))}
        </div>
      )}

      {loading && !followers.length && <div className="card-element" style={{ height: '350px' }}></div>}

      {!loading && !followers.length && (
        <div className="empty-page" data-testid="empty-page">
          You have no followers
        </div>
      )}

      <div style={{ marginBottom: '80px', height: '50px' }}></div>
    </div>
  );
};
export default Followers;

//     <div className="card-element-item" key={data?._id} data-testid="card-element-item">
//       <div className="card-element-header">
//         <div className="card-element-header-bg"></div>
//         <Avatar
//           name={data?.username}
//           bgColor={data?.avatarColor}
//           textColor="#ffffff"
//           size={120}
//           avatarSrc={data?.profilePicture}
//         />
//         <div className="card-element-header-text">
//           <span className="card-element-header-name">{data?.username}</span>
//         </div>
//       </div>
//       <CardElementStats
//         postsCount={data?.postsCount}
//         followersCount={data?.followersCount}
//         followingCount={data?.followingCount}
//       />
//       <CardElementButtons
//         isChecked={Utils.checkIfUserIsBlocked(blockedUsers, data?._id)}
//         btnTextOne="Block"
//         btnTextTwo="Unblock"
//         onClickBtnOne={() => blockUser(data)}
//         onClickBtnTwo={() => unblockUser(data)}
//         onNavigateToProfile={() => ProfileUtils.navigateToProfile(data, navigate)}
//       />
//     </div>
