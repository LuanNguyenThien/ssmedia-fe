import { useEffect, useState } from 'react';
import '@pages/auth/auth-tabs/AuthTabs.scss';
import backgroundImage from '@assets/images/background.jpg';
import Login from '@pages/auth/login/Login';
import Register from '@pages/auth/register/Register';
import useLocalStorage from '@hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { Utils } from '@services/utils/utils.service';
import PageLoader from '@components/page-loader/PageLoader';
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Button,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  useBreakpointValue,
  IconProps,
  Icon,
} from '@chakra-ui/react'

const avatars = [
  {
    name: 'Ryan Florence',
    url: 'https://bit.ly/ryan-florence',
  },
  {
    name: 'Segun Adebayo',
    url: 'https://bit.ly/sage-adebayo',
  },
  {
    name: 'Kent Dodds',
    url: 'https://bit.ly/kent-c-dodds',
  },
  {
    name: 'Prosper Otemuyiwa',
    url: 'https://bit.ly/prosper-baba',
  },
  {
    name: 'Christian Nwamba',
    url: 'https://bit.ly/code-beast',
  },
]

const Blur = (props) => {
  return (
    <Icon
      width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: -1 })}
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <circle cx="71" cy="61" r="111" fill="#F56565" />
      <circle cx="244" cy="106" r="139" fill="#ED64A6" />
      <circle cy="291" r="139" fill="#ED64A6" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
    </Icon>
  )
}

const AuthTabs = () => {
  const [type, setType] = useState('Sign In');
  const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
  const [environment, setEnvironment] = useState('');
  const avatarSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const width_height = useBreakpointValue({ base: '44px', md: '60px' });

  const navigate = useNavigate();

  useEffect(() => {
    const env = Utils.appEnvironment();
    setEnvironment(env);
    if (keepLoggedIn) navigate('/app/social/streams');
  }, [keepLoggedIn, navigate]);

  return (
    <>
      {keepLoggedIn ? (
        <PageLoader />
      ) : (
        // <div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
        //   <div className="environment">{environment}</div>
        //   <div className="container-wrapper-auth">
        //     <div className="tabs">
        //       <div className="tabs-auth">
        //         <ul className="tab-group">
        //           <li className={`tab ${type === 'Sign In' ? 'active' : ''}`} onClick={() => setType('Sign In')}>
        //             <button className="login">Sign In</button>
        //           </li>
        //           <li className={`tab ${type === 'Sign Up' ? 'active' : ''}`} onClick={() => setType('Sign Up')}>
        //             <button className="signup">Sign Up</button>
        //           </li>
        //         </ul>
        //         {type === 'Sign In' && (
        //           <div className="tab-item">
        //             <Login />
        //           </div>
        //         )}
        //         {type === 'Sign Up' && (
        //           <div className="tab-item">
        //             <Register />
        //           </div>
        //         )}
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <Box position={'relative'} className="auth-tabs-container">
          <Container
            as={SimpleGrid}
            maxW={'7xl'}
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 10, lg: 32 }}
            py={{ base: 5, sm: 5, lg: '4.5rem' }}>
            <Stack spacing={{ base: 10, md: 20 }}
              py={{ base: 5, sm: 5, lg: '4rem' }}>
              <Heading
                lineHeight={1.1}
                fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
                Cộng đồng trao đổi học tập{' '}
                <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                  &
                </Text>{' '}
                Phát triển tri thức
              </Heading>
              <Stack direction={'row'} spacing={4} align={'center'}>
                <AvatarGroup>
                  {avatars.map((avatar) => (
                    <Avatar
                      key={avatar.name}
                      name={avatar.name}
                      src={avatar.url}
                      // eslint-disable-next-line react-hooks/rules-of-hooks
                      size={avatarSize}
                      position={'relative'}
                      zIndex={2}
                      _before={{
                        content: '""',
                        width: 'full',
                        height: 'full',
                        rounded: 'full',
                        transform: 'scale(1.125)',
                        bgGradient: 'linear(to-bl, red.400,pink.400)',
                        position: 'absolute',
                        zIndex: -1,
                        top: 0,
                        left: 0,
                      }}
                    />
                  ))}
                </AvatarGroup>
                <Text fontFamily={'heading'} fontSize={{ base: '4xl', md: '6xl' }}>
                  +
                </Text>
                <Flex
                  align={'center'}
                  justify={'center'}
                  fontFamily={'heading'}
                  fontSize={{ base: 'sm', md: 'lg' }}
                  bg={'gray.800'}
                  color={'white'}
                  rounded={'full'}
                  minWidth={width_height}
                  minHeight={width_height}
                  position={'relative'}
                  _before={{
                    content: '""',
                    width: 'full',
                    height: 'full',
                    rounded: 'full',
                    transform: 'scale(1.125)',
                    bgGradient: 'linear(to-bl, orange.400,yellow.400)',
                    position: 'absolute',
                    zIndex: -1,
                    top: 0,
                    left: 0,
                  }}>
                  YOU
                </Flex>
              </Stack>
            </Stack>
            <Flex
              // minH={'100vh'}
              align={'center'}
              justify={'center'}
              p={{ base: 4, sm: 6, md: 8 }}
              spacing={{ base: 4 }}
              maxW={{ lg: 'lg' }}
              rounded={'xl'}
              bg="transparent"
              position="relative">
              <Blur position="absolute" top={0} left={0} style={{ filter: 'blur(120px)' }} />
              
              <Stack>
                {/* Tabs cho Sign In và Sign Up */}
                {/* <Box>
                  <Stack direction="row" spacing={4} mb={6}>
                    <Button
                      variant={type === 'Sign In' ? 'solid' : 'outline'}
                      colorScheme="red"
                      onClick={() => setType('Sign In')}
                      w="full"
                      bg={type === 'Sign In' ? 'red.400' : 'transparent'}
                      color={type === 'Sign In' ? 'white' : 'red.400'}
                      _hover={{
                        bg: type === 'Sign In' ? 'red.500' : 'red.100',
                        color: 'white',
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant={type === 'Sign Up' ? 'solid' : 'outline'}
                      colorScheme="red"
                      onClick={() => setType('Sign Up')}
                      w="full"
                      bg={type === 'Sign Up' ? 'red.400' : 'transparent'}
                      color={type === 'Sign Up' ? 'white' : 'red.400'}
                      _hover={{
                        bg: type === 'Sign Up' ? 'red.500' : 'red.100',
                        color: 'white',
                      }}
                    >
                      Sign Up
                    </Button>
                  </Stack>
                </Box> */}
                <Stack spacing={4}
                  
                >
                  <Heading
                    color={'gray.800'}
                    lineHeight={1.1}
                    fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                    Tham gia cùng chúng tôi
                    <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                      !
                    </Text>
                  </Heading>
                </Stack>

                {/* Hiển thị form đăng nhập hoặc đăng ký */}
                {type === 'Sign In' && (
                  <div className="tab-item">
                    <Login />
                    <Text mt={4}>
                      Bạn chưa có tài khoản?{' '}
                      <Button variant="link" onClick={() => setType('Sign Up')} color={'red.400'}>
                        Đăng ký
                      </Button>
                    </Text>
                  </div>
                )}
                {type === 'Sign Up' && (
                  <div className="tab-item">
                    <Register />
                    <Text mt={4}>
                      Đã có tài khoản?{' '}
                      <Button variant="link" onClick={() => setType('Sign In')} color={'red.400'}>
                        Đăng nhập
                      </Button>
                    </Text>
                  </div>
                )}
              </Stack>
            </Flex>
            {/* <Stack
              bg={'gray.50'}
              rounded={'xl'}
              p={{ base: 4, sm: 6, md: 8 }}
              spacing={{ base: 8 }}
              maxW={{ lg: 'lg' }}>
              <Stack spacing={4}>
                <Heading
                  color={'gray.800'}
                  lineHeight={1.1}
                  fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                  Tham gia cùng chúng tôi
                  <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                    !
                  </Text>
                </Heading>
                <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                "Chúng tôi kết nối các bạn trẻ và học sinh đam mê học tập trên khắp cả nước, 
                cùng xây dựng một cộng đồng hỗ trợ nhau vượt qua mọi kỳ thi!"
                </Text>
              </Stack>
              <Box as={'form'} mt={10}>
                <Stack spacing={4}>
                  <Input
                    placeholder="Firstname"
                    bg={'gray.100'}
                    border={0}
                    color={'gray.500'}
                    _placeholder={{
                      color: 'gray.500',
                    }}
                  />
                  <Input
                    placeholder="firstname@lastname.io"
                    bg={'gray.100'}
                    border={0}
                    color={'gray.500'}
                    _placeholder={{
                      color: 'gray.500',
                    }}
                  />
                  <Input
                    placeholder="+1 (___) __-___-___"
                    bg={'gray.100'}
                    border={0}
                    color={'gray.500'}
                    _placeholder={{
                      color: 'gray.500',
                    }}
                  />
                  <Button fontFamily={'heading'} bg={'gray.200'} color={'gray.800'}>
                    Upload CV
                  </Button>
                </Stack>
                <Button
                  fontFamily={'heading'}
                  mt={8}
                  w={'full'}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  color={'white'}
                  _hover={{
                    bgGradient: 'linear(to-r, red.400,pink.400)',
                    boxShadow: 'xl',
                  }}>
                  Submit
                </Button>
              </Box>
              form
            </Stack> */}
          </Container>
          <Blur position={'absolute'} top={-10} left={-10} style={{ filter: 'blur(70px)' }} />
        </Box>
      )}
    </>
  );
};

export default AuthTabs;
