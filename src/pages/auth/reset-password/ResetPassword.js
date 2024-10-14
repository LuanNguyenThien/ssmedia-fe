import '@pages/auth/reset-password/ResetPassword.scss';
import { authService } from '@services/api/auth/auth.service';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';

import {
  Button,
  ChakraProvider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue
} from '@chakra-ui/react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [searchParams] = useSearchParams();

  const resetPassword = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const body = { password, confirmPassword };
      const response = await authService.resetPassword(searchParams.get('token'), body);
      setLoading(false);
      setPassword('');
      setConfirmPassword('');
      setShowAlert(false);
      setAlertType('alert-success');
      setResponseMessage(response?.data?.message);
    } catch (error) {
      setAlertType('alert-error');
      setLoading(false);
      setShowAlert(true);
      setResponseMessage(error?.response?.data?.message);
    }
  };
  return (
    <ChakraProvider>
      {' '}
      <Flex minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Enter new password
          </Heading>
          {responseMessage && (
            <div className={`alerts ${alertType}`} role="alert">
              {responseMessage}
            </div>
          )}
          <form onSubmit={resetPassword}>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                placeholder="New Password"
                style={{ border: `${showAlert ? '1px solid #fa9b8a' : ''}` }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                placeholder="Confirm Password"
                style={{ border: `${showAlert ? '1px solid #fa9b8a' : ''}` }}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={6}>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500'
                }}
                className="auth-button button"
                disabled={!password || !confirmPassword}
              >
                {loading ? 'RESET PASSWORD IN PROGRESS...' : 'RESET PASSWORD'}
              </Button>
            </Stack>
          </form>
          <Link to={'/'}>
            <span className="login">
              <FaArrowLeft className="arrow-left" /> Back to Login
            </span>
          </Link>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
};

export default ResetPassword;
