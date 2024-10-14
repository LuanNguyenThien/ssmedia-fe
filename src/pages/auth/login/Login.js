import { useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
// import Input from '@components/input/Input';
// import Button from '@components/button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '@pages/auth/login/Login.scss';
import { authService } from '@services/api/auth/auth.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { Utils } from '@services/utils/utils.service';
import useSessionStorage from '@hooks/useSessionStorage';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Checkbox,
  Stack,
  Button,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  useColorModeValue
} from '@chakra-ui/react';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Login = ({ onSetType }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [user, setUser] = useState();
  const [showPassword, setShowPassword] = useState(false);
  // const [usernameTouched, setUsernameTouched] = useState(false);
  // const [passwordTouched, setPasswordTouched] = useState(false);
  const [setStoredUsername] = useLocalStorage('username', 'set');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [pageReload] = useSessionStorage('pageReload', 'set');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginUser = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const result = await authService.signIn({
        username,
        password
      });
      setLoggedIn(keepLoggedIn);
      setStoredUsername(username);
      setHasError(false);
      setAlertType('alert-success');
      Utils.dispatchUser(result, pageReload, dispatch, setUser);
    } catch (error) {
      setLoading(false);
      setHasError(true);
      setAlertType('alert-error');
      setErrorMessage(error?.response?.data.message);
    }
  };

  useEffect(() => {
    if (loading && !user) return;
    if (user) navigate('/app/social/streams');
  }, [loading, user, navigate]);

  return (
    <Flex
    // minH={'100vh'}
    // align={'center'}
    // justify={'center'}
    >
      <Stack spacing={4} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
          {hasError && errorMessage && (
            <div className={`alerts ${alertType}`} role="alert">
              {errorMessage}
            </div>
          )}
          <form onSubmit={loginUser}>
            <Stack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel>Tài khoản</FormLabel>
                <Input type="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Mật khẩu</FormLabel>
                {/* <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> */}
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement h={'full'}>
                    <Button variant={'ghost'} onClick={() => setShowPassword((showPassword) => !showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10}>
                <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'}>
                  <Checkbox
                    colorScheme="red"
                    // isChecked={keepLoggedIn}
                    onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                  >
                    Ghi nhớ đăng nhập
                  </Checkbox>
                  <Link to={'/forgot-password'}>
                    <Box as="span" color={'red.400'}>
                      Quên mật khẩu?
                    </Box>
                  </Link>
                </Stack>
                <Button
                  type="submit"
                  fontFamily={'heading'}
                  w={'full'}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  color={'white'}
                  _hover={{
                    bgGradient: 'linear(to-r, red.400,pink.400)',
                    boxShadow: 'xl'
                  }}
                  disabled={!username || !password}
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </Stack>
              <Text mt={4} align={'center'}>
                Bạn chưa có tài khoản?{' '}
                <Button variant="link" onClick={() => onSetType('Sign Up')} color={'red.400'}>
                  Đăng ký
                </Button>
              </Text>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
