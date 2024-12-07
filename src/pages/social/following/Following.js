import '@pages/social/following/Following.scss';

// import Avatar from '@components/avatar/Avatar';
// import CardElementButtons from '@components/card-element/CardElementButtons';
// import CardElementStats from '@components/card-element/CardElementStats';
import useEffectOnce from '@hooks/useEffectOnce';
import { followerService } from '@services/api/followers/follower.service';
import { socketService } from '@services/socket/socket.service';
import { FollowersUtils } from '@services/utils/followers-utils.service';
import { ProfileUtils } from '@services/utils/profile-utils.service';
import { Utils } from '@services/utils/utils.service';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heading, Avatar, Box, Center, Image, Flex, Text, Stack, Button, useColorModeValue } from '@chakra-ui/react';

const Following = () => {
  const { profile } = useSelector((state) => state.user);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      socketService?.socket?.emit('unfollow user', user);
      FollowersUtils.unFollowUser(user, profile, dispatch);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffectOnce(() => {
    getUserFollowing();
  });

  useEffect(() => {
    FollowersUtils.socketIORemoveFollowing(following, setFollowing);
  }, [following]);

  return (
    <div className="card-container">
      <div className="people">Following</div>
      {following.length > 0 && (
        <div className="card-element">
          {following.map((data) => (
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
                        Following
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
            // <div className="card-element-item" key={Utils.generateString(10)} data-testid="card-element-item">
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

      {loading && !following.length && <div className="card-element" style={{ height: '350px' }}></div>}

      {!loading && !following.length && (
        <div className="empty-page" data-testid="empty-page">
          You have no following
        </div>
      )}

      <div style={{ marginBottom: '80px', height: '50px' }}></div>
    </div>
  );
};
export default Following;
