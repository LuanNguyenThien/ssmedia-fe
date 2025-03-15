// Sidebar.js
import React from 'react';
import { Box, VStack, Text, Icon } from '@chakra-ui/react';
import { FaChartBar, FaHome, FaUser, FaCreditCard } from 'react-icons/fa';

const Sidebar = ({ setActiveComponent }) => {
  return (
    <Box
      w="250px"
      bg="gray.800"
      color="white"
      p={5}
      minHeight="100vh"
      boxShadow="lg"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box>
        <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center" color="teal.300">
          Admin Dashboard
        </Text>
        <VStack align="start" spacing={6}>
          <Box
            display="flex"
            alignItems="center"
            w="full"
            p={2}
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: 'gray.700' }}
            onClick={() => setActiveComponent('Dashboard')}
          >
            <Icon as={FaHome} boxSize={5} mr={3} />
            <Text>Dashboard</Text>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            w="full"
            p={2}
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: 'gray.700' }}
            onClick={() => setActiveComponent('Billing')}
          >
            <Icon as={FaCreditCard} boxSize={5} mr={3} />
            <Text>Billing</Text>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            w="full"
            p={2}
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: 'gray.700' }}
            onClick={() => setActiveComponent('Profile')}
          >
            <Icon as={FaUser} boxSize={5} mr={3} />
            <Text>Profile</Text>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            w="full"
            p={2}
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: 'gray.700' }}
            onClick={() => setActiveComponent('Chart')}
          >
            <Icon as={FaChartBar} boxSize={5} mr={3} />
            <Text>Chart</Text>
          </Box>
        </VStack>
      </Box>
      <Text fontSize="sm" textAlign="center" color="gray.500" mt={10}>
        © 2024 Your Company
      </Text>
    </Box>
  );
};

export default Sidebar;
