import React from 'react';
import { Box, Flex, Text, IconButton, InputGroup, Input, Avatar } from '@chakra-ui/react';
import { FaBars, FaBell } from 'react-icons/fa';

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

        {/* Title */}

        {/* Right Section: Search, Avatar, Notifications */}
        <Flex align="center" gap={4}>
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
            borderRadius="50%"
            _hover={{ bg: 'teal.600' }} // Bo tròn khi hover
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
