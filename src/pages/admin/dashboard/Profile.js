// src/components/Profile.js
import React from 'react';
import { Box, Avatar, Text, VStack, HStack, Stack, Switch, IconButton, Button, Divider } from '@chakra-ui/react';
import { FaUserFriends, FaFolderOpen } from 'react-icons/fa';

function Profile() {
  return (
    <Box p="4">
      {/* Banner */}
      <Box
        bg="teal.400"
        h="150px"
        borderRadius="lg"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px="6"
        color="white"
      >
        <Text fontSize="lg">Pages / Profile</Text>
        <Box display="flex" alignItems="center" gap="2">
          <Avatar size="lg" src="https://bit.ly/dan-abramov" />
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              Esthera Jackson
            </Text>
            <Text fontSize="sm">esthera@simmmp1e.com</Text>
          </Box>
        </Box>
        <HStack spacing="4">
          <Button leftIcon={<FaUserFriends />} colorScheme="teal" variant="outline">
            Overview
          </Button>
          <Button leftIcon={<FaUserFriends />} colorScheme="teal" variant="outline">
            Teams
          </Button>
          <Button leftIcon={<FaFolderOpen />} colorScheme="teal" variant="outline">
            Projects
          </Button>
        </HStack>
      </Box>

      {/* Main Content */}
      <Stack direction={{ base: 'column', lg: 'row' }} mt="6" spacing="6">
        {/* Platform Settings */}
        <Box flex="1" bg="white" borderRadius="lg" p="4" shadow="md">
          <Text fontSize="xl" fontWeight="bold" mb="4">
            Platform Settings
          </Text>
          <Text fontSize="sm" fontWeight="bold" mt="4">
            ACCOUNT
          </Text>
          <VStack align="start" spacing="3" mt="2">
            <HStack>
              <Switch colorScheme="teal" />
              <Text>Email me when someone follows me</Text>
            </HStack>
            <HStack>
              <Switch colorScheme="teal" />
              <Text>Email me when someone answers on my post</Text>
            </HStack>
            <HStack>
              <Switch colorScheme="teal" />
              <Text>Email me when someone mentions me</Text>
            </HStack>
          </VStack>
          <Divider my="4" />
          <Text fontSize="sm" fontWeight="bold" mt="4">
            APPLICATION
          </Text>
          <VStack align="start" spacing="3" mt="2">
            <HStack>
              <Switch colorScheme="teal" />
              <Text>New launches and projects</Text>
            </HStack>
            <HStack>
              <Switch colorScheme="teal" />
              <Text>Monthly product updates</Text>
            </HStack>
            <HStack>
              <Switch colorScheme="teal" />
              <Text>Subscribe to newsletter</Text>
            </HStack>
          </VStack>
        </Box>

        {/* Profile Information */}
        <Box flex="1" bg="white" borderRadius="lg" p="4" shadow="md">
          <Text fontSize="xl" fontWeight="bold" mb="4">
            Profile Information
          </Text>
          <Text fontSize="sm" mb="2">
            Hi, I’m Esthera Jackson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths,
            choose the one more painful in the short term (pain avoidance is creating an illusion of equality).
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            Full Name: Esthera Jackson
          </Text>
          <Text fontSize="sm">Mobile: (44) 123 1234 123</Text>
          <Text fontSize="sm">Email: esthera@simmmp1e.com</Text>
        </Box>

        {/* Conversations */}
        <Box flex="1" bg="white" borderRadius="lg" p="4" shadow="md">
          <Text fontSize="xl" fontWeight="bold" mb="4">
            Conversations
          </Text>
          <VStack align="start" spacing="3">
            {['Sophie B.', 'Daniel T.', 'Alexa L.'].map((name, index) => (
              <HStack key={index} justify="space-between" w="100%">
                <HStack>
                  <Avatar size="sm" name={name} src={`https://bit.ly/${name.toLowerCase().replace(' ', '-')}`} />
                  <Text fontSize="sm" fontWeight="bold">
                    {name}
                  </Text>
                </HStack>
                <Button size="xs" colorScheme="teal" variant="ghost">
                  REPLY
                </Button>
              </HStack>
            ))}
          </VStack>
        </Box>
      </Stack>
    </Box>
  );
}

export default Profile;
