// import Input from '@components/input/Input';
// import Button from '@components/button/Button';
import '@pages/auth/register/Register.scss';
import { useState, useEffect } from 'react';
import { Utils } from '@services/utils/utils.service';
import { authService } from '@services/api/auth/auth.service';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '@hooks/useLocalStorage';
import useSessionStorage from '@hooks/useSessionStorage';
import { useDispatch } from 'react-redux';

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link
} from '@chakra-ui/react';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Register = ({ onSetType }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [hasError, setHasError] = useState(false);
  const [user, setUser] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [setStoredUsername] = useLocalStorage('username', 'set');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [pageReload] = useSessionStorage('pageReload', 'set');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerUser = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const avatarColor = Utils.avatarColor();
      const avatarImage = Utils.generateAvatar(username.charAt(0).toUpperCase(), avatarColor);
      const result = await authService.signUp({
        username,
        email,
        password,
        avatarColor,
        avatarImage
      });
      setLoggedIn(true);
      setStoredUsername(username);
      setAlertType('alert-success');
      Utils.dispatchUser(result, pageReload, dispatch, setUser);
    } catch (error) {
      setLoading(false);
      setHasError(true);
      setAlertType('alert-error');
      setErrorMessage(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (loading && !user) return;
    if (user) navigate('/app/social/streams');
  }, [loading, user, navigate]);

  return (
    // <div className="auth-inner">
    //   {hasError && errorMessage && (
    //     <div className={`alerts ${alertType}`} role="alert">
    //       {errorMessage}
    //     </div>
    //   )}
    //   <form className="auth-form" onSubmit={registerUser}>
    //     <div className="form-input-container">
    //       <Input
    //         id="username"
    //         name="username"
    //         type="text"
    //         value={username}
    //         labelText="Username"
    //         placeholder="Enter Username"
    //         style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
    //         handleChange={(event) => setUsername(event.target.value)}
    //       />
    //       <Input
    //         id="email"
    //         name="email"
    //         type="text"
    //         value={email}
    //         labelText="Email"
    //         placeholder="Enter Email"
    //         style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
    //         handleChange={(event) => setEmail(event.target.value)}
    //       />
    //       <Input
    //         id="password"
    //         name="password"
    //         type="password"
    //         value={password}
    //         labelText="Password"
    //         placeholder="Enter Password"
    //         style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
    //         handleChange={(event) => setPassword(event.target.value)}
    //       />
    //     </div>
    //     <Button
    //       label={`${loading ? 'SIGNUP IN PROGRESS...' : 'SIGNUP'}`}
    //       className="auth-button button"
    //       disabled={!username || !email || !password}
    //     />
    //   </form>
    // </div>
    <Flex
    // minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={4} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
          {hasError && errorMessage && (
            <div className={`alerts ${alertType}`} role="alert">
              {errorMessage}
            </div>
          )}
          <form onSubmit={registerUser}>
            <Stack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel>Tài khoản</FormLabel>
                <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Mật khẩu</FormLabel>
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
              <Stack spacing={10} pt={2}>
                <Button
                  type="submit"
                  size="lg"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500'
                  }}
                  disabled={!username || !email || !password}
                >
                  {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
              </Stack>
              <Text mt={4} align={'center'}>
                Đã có tài khoản?{' '}
                <Button variant="link" onClick={() => onSetType('Sign In')} color={'blue.400'}>
                  Đăng nhập
                </Button>
              </Text>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Register;
