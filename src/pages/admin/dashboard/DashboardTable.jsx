import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Text,
  Badge,
  IconButton,
  Flex,
  Heading,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Button,
  HStack,
  Icon,
  useBreakpointValue
} from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';
import { EditIcon, DeleteIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { userService } from '@services/api/user/user.service';
import { useDispatch, useSelector } from 'react-redux';
import useEffectOnce from '@hooks/useEffectOnce';
const DashboardTable = () => {
  // // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [total, setTotals] = useState(1);
  const [loading, setLoading] = useState(true);
  const getAllUsers = useCallback(async () => {
    try {
      const response = await userService.getAllUsersAdminRole(currentPage);
      if (response.data.users.length > 0) {
        setTotals(response.data.totalUsers);
        // setUsers((data) => {
        //   const result = [...data, ...response.data.users];
        //   const allUsers = uniqBy(result, '_id');
        //   return allUsers;
        // });
        setUsers(response.data.users);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [currentPage]);
  useEffectOnce(() => {
    getAllUsers();
  });

  const [itemsPerPage] = useState(5);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const totalPages = Math.ceil(total / itemsPerPage);
  return (
    <Box maxHeight="calc(100vh - 80px)" overflowY="auto">
      <Heading size="lg" mb={6}>
        Dashboard Overview
      </Heading>
      {/* Thống kê ngắn */}
      <SimpleGrid columns={[1, 2, 4]} spacing={4} mb={8}>
        {/* Total Users */}
        <Box
          bgGradient="linear(to-r, teal.400, blue.500)"
          color="white"
          p={5}
          borderRadius="lg"
          shadow="md"
          textAlign="center"
        >
          <VStack spacing={3}>
            <Icon as={FaUsers} w={12} h={12} />
            <Text fontSize="xl" fontWeight="bold">
              Total Users
            </Text>
            <Text fontSize="4xl" fontWeight="extrabold">
              {total}
            </Text>
          </VStack>
        </Box>

        {/* Các thống kê khác */}
        <Box p={5} bg="white" shadow="md" borderRadius="lg" textAlign="center">
          <Text fontSize="md" color="gray.500">
            Online Users
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            350
          </Text>
        </Box>
        <Box p={5} bg="white" shadow="md" borderRadius="lg" textAlign="center">
          <Text fontSize="md" color="gray.500">
            New Users
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            120
          </Text>
        </Box>
        <Box p={5} bg="white" shadow="md" borderRadius="lg" textAlign="center">
          <Text fontSize="md" color="gray.500">
            Sales
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            $5,600
          </Text>
        </Box>
      </SimpleGrid>
      {/* Bảng người dùng */}
      <Box mb={8} p={4} bg="white" shadow="md" borderRadius="md" minHeight="436px">
        <Table variant="simple" size={isMobile ? 'sm' : 'md'}>
          <Thead position="sticky" top="0" zIndex="1" bg="white">
            <Tr>
              <Th>UserName</Th>
              <Th>Post</Th>
              <Th>Following</Th>
              <Th>follower</Th>
              <Th colSpan={2} textAlign="center">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user, index) => (
              <Tr key={index}>
                <Td>
                  <Flex align="center">
                    <Avatar size="sm" src={user.profilePicture} mr={3} />
                    <Box>
                      <Text fontWeight="bold">{user.name}</Text>
                    </Box>
                  </Flex>
                </Td>
                <Td>
                  <Text>{user.postsCount}</Text>
                  <Text fontSize="sm" color="gray.500"></Text>
                </Td>
                <Td>{user.followingCount}</Td>
                <Td>{user.followersCount}</Td>
                <Td colSpan={2}>
                  <HStack spacing={2} justify="center">
                    <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" variant="outline" />
                    <IconButton aria-label="Delete" icon={<DeleteIcon />} size="sm" variant="outline" />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {/* Pagination */}
      <Box display="flex" justifyContent="center" mb={8}>
        <HStack spacing={2}>
          <IconButton
            icon={<ChevronLeftIcon />}
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
            aria-label="Previous"
          />
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              colorScheme={currentPage === index + 1 ? 'teal' : 'gray'}
              variant={currentPage === index + 1 ? 'solid' : 'outline'}
            >
              {index + 1}
            </Button>
          ))}
          <IconButton
            icon={<ChevronRightIcon />}
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages}
            aria-label="Next"
          />
        </HStack>
      </Box>
    </Box>
  );
};

export default DashboardTable;
