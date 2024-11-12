import React from 'react';
import { Box, Flex, IconButton, InputGroup, Input, Avatar } from '@chakra-ui/react';
import { FaBars, FaBell, FaCog } from 'react-icons/fa';

const Header = ({ onSidebarToggle }) => {
  return (
    <Box bg="teal.500" color="white" h="80px" px={4} display="flex" alignItems="center">
      <Flex justify="space-between" align="center" w="100%" h="80px">
        {/* Sidebar Toggle */}
        <IconButton
          icon={<FaBars />}
          onClick={onSidebarToggle}
          aria-label="Toggle Sidebar"
          variant="ghost"
          color="white"
        />

        {/* Right Section: Search, Avatar, Notifications */}
        <Flex align="center" gap={3}>
          {/* Search Box */}
          <InputGroup>
            <Input placeholder="Search..." bg="white" color="gray.700" w="200px" />
          </InputGroup>

          {/* Avatar */}
          <Avatar name="User" src="https://bit.ly/dan-abramov" size="sm" />

          {/* Notifications */}
          <IconButton
            icon={<FaBell />}
            aria-label="Notifications"
            variant="ghost"
            color="white"
            size="lg"
            // borderRadius="50%"
            _hover={{ bg: 'teal.600' }} // Rounded when hovered
          />

          {/* Settings */}
          <IconButton
            icon={<FaCog />}
            aria-label="Settings"
            variant="ghost"
            color="white"
            size="lg"
            // borderRadius="50%"
            _hover={{ bg: 'teal.600' }} // Rounded when hovered
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
