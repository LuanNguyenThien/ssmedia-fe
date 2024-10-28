import { FaArrowLeft } from 'react-icons/fa';
import '@pages/auth/forgot-password/ForgotPassword.scss';
import { authService } from '@services/api/auth/auth.service';
import { useEffect, useState } from 'react';
import useLocalStorage from '@hooks/useLocalStorage';
import {
  Box,
  Flex,
  useBreakpointValue,
  Icon,
  Button,
  FormControl,
  Heading,
  Input,
  FormLabel,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
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

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [responseMessage, setResponseMessage] = useState('');


  const forgotPassword = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await authService.forgotPassword(email);
      setLoading(false);
      setEmail('');
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

  
  const sendLinkEmail = (event) => {
    event.preventDefault();
    forgotPassword();
  };
  return (
    <Box position={'relative'} className="forgot-password-container">
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
        >
          <Blur position="absolute" bottom={-10} right={-10} style={{ filter: 'blur(120px)' }} />
          <form onSubmit={sendLinkEmail}>
          <Stack
            spacing={4}
            w={'full'}
            maxW={'md'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
            my={12}>

            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
              Quên mật khẩu?
            </Heading>

            <Text
              fontSize={{ base: 'sm', sm: 'md' }}
              color={useColorModeValue('gray.800', 'gray.400')}>
              Gửi liên kết để đặt lại mật khẩu qua email
            </Text>

            
            <Stack spacing={6}>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                 placeholder="your-email@example.com"
                 _placeholder={{ color: 'gray.500' }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
            
            <Button
                  type="submit"
                  fontFamily={'heading'}
                  w={'full'}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  color={'white'}
                  _hover={{
                    bgGradient: 'linear(to-r, red.400,pink.400)',
                    boxShadow: 'xl',
                  }}
                  disabled={!email}
                  >
                  {loading ? 'Đang gửi liên kết...' : 'Gửi mã'}
                </Button>

            </Stack>
            
          </Stack>
          </form>
        </Flex>
      <Blur position={'absolute'} top={-10} left={-10} style={{ filter: 'blur(80px)' }} />
    </Box>
  );
};

export default ForgotPassword;
