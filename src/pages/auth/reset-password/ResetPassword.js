import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Button,
  ChakraProvider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useBreakpointValue,
  useColorModeValue
} from '@chakra-ui/react';
import '@pages/auth/reset-password/ResetPassword.scss';
import { authService } from '@services/api/auth/auth.service';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';

const Blur = (props) => {
  return (
    <Icon
      width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: -1 })}
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="71" cy="61" r="111" fill="#F56565" />
      <circle cx="244" cy="106" r="139" fill="#ED64A6" />
      <circle cy="291" r="139" fill="#ED64A6" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
    </Icon>
  );
};
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      <Flex minH={'100vh'} align={'center'} justify={'center'}>
        <Blur position="absolute" bottom={-10} right={-10} style={{ filter: 'blur(120px)' }} />
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
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  placeholder="New Password"
                  style={{ border: `${showAlert ? '1px solid #fa9b8a' : ''}` }}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement h={'full'}>
                  <Button variant={'ghost'} onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  style={{ border: `${showAlert ? '1px solid #fa9b8a' : ''}` }}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowConfirmPassword((showConfirmPassword) => !showConfirmPassword)}
                  >
                    {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
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
        <Blur position={'absolute'} top={-10} left={-10} style={{ filter: 'blur(70px)' }} />
      </Flex>
    </ChakraProvider>
  );
};

export default ResetPassword;
