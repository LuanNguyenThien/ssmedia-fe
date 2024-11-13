import React, { useState } from 'react';
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
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Button,
  HStack,
  Icon,
  useBreakpointValue
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const DashboardTable = () => {
  // Dữ liệu giả lập cho bảng
  const users = [
    {
      name: 'Esthera Jackson',
      email: 'alexa@simmmple.com',
      function: 'Organization',
      role: 'Manager',
      status: 'Online',
      employed: '14/06/21',
      avatarUrl: 'https://example.com/avatar1.jpg'
    },
    {
      name: 'Alexa Liras',
      email: 'laurent@simmmple.com',
      function: 'Developer',
      role: 'Programmer',
      status: 'Offline',
      employed: '12/05/21',
      avatarUrl: 'https://example.com/avatar2.jpg'
    },
    {
      name: 'Alexa Liras',
      email: 'laurent@simmmple.com',
      function: 'Developer',
      role: 'Programmer',
      status: 'Offline',
      employed: '12/05/21',
      avatarUrl: 'https://example.com/avatar2.jpg'
    },
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      function: 'Marketing',
      role: 'Lead',
      status: 'Offline',
      employed: '01/02/20',
      avatarUrl: 'https://example.com/avatar3.jpg'
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      function: 'HR',
      role: 'Manager',
      status: 'Online',
      employed: '03/03/21',
      avatarUrl: 'https://example.com/avatar4.jpg'
    },
    {
      name: 'George Adams',
      email: 'george.adams@example.com',
      function: 'Support',
      role: 'Specialist',
      status: 'Offline',
      employed: '15/04/22',
      avatarUrl: 'https://example.com/avatar5.jpg'
    },
    {
      name: 'Sarah Connor',
      email: 'sarah.connor@example.com',
      function: 'Engineer',
      role: 'Software Engineer',
      status: 'Online',
      employed: '23/08/19',
      avatarUrl: 'https://example.com/avatar6.jpg'
    }
    // Thêm các người dùng khác tương tự
  ];

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <Box maxHeight="calc(100vh - 80px)" overflowY="auto">
      <Heading size="lg" mb={6}>
        Dashboard Overview
      </Heading>

      {/* Thống kê ngắn */}
      <SimpleGrid columns={[1, 2, 4]} spacing={4} mb={8}>
        <Stat>
          <StatLabel>Total Users</StatLabel>
          <StatNumber>1,250</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Online Users</StatLabel>
          <StatNumber>350</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>New Users</StatLabel>
          <StatNumber>120</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Sales</StatLabel>
          <StatNumber>$5,600</StatNumber>
        </Stat>
      </SimpleGrid>

      {/* Bảng người dùng */}
      <Box mb={8} p={4} bg="white" shadow="md" borderRadius="md" minHeight="436px">
        <Table variant="simple" size={isMobile ? 'sm' : 'md'}>
          <Thead position="sticky" top="0" zIndex="1" bg="white">
            <Tr>
              <Th>Author</Th>
              <Th>Function</Th>
              {!isMobile && <Th>Status</Th>}
              <Th>Employed</Th>
              <Th colSpan={2} textAlign="center">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentUsers.map((user, index) => (
              <Tr key={index}>
                <Td>
                  <Flex align="center">
                    <Avatar size="sm" src={user.avatarUrl} mr={3} />
                    <Box>
                      <Text fontWeight="bold">{user.name}</Text>
                      {!isMobile && (
                        <Text fontSize="sm" color="gray.500">
                          {user.email}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                </Td>
                <Td>
                  <Text>{user.function}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {user.role}
                  </Text>
                </Td>
                {!isMobile && (
                  <Td>
                    <Badge colorScheme={user.status === 'Online' ? 'green' : 'red'}>{user.status}</Badge>
                  </Td>
                )}
                <Td>{user.employed}</Td>
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
