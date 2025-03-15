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
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            {/* Password Input */}
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  placeholder="New Password"
                  style={{ border: `${showAlert ? '1px solid #fa9b8a' : ''}` }}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Toggle password visibility"
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="sm"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* Confirm Password Input */}
            <FormControl id="confirm-password" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  style={{ border: `${showAlert ? '1px solid #fa9b8a' : ''}` }}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Toggle confirm password visibility"
                    icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    variant="ghost"
                    size="sm"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Stack spacing={6}>
              <Button
                type="submit"
                bg={'blue.400'}
                color={'white'}
                _hover={{ bg: 'blue.500' }}
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
