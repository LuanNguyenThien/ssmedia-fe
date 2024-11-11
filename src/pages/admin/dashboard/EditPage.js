// EditPage.js
import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, Heading } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router-dom';

const EditPage = () => {
  const { userId } = useParams(); // Lấy userId từ URL nếu cần
  const history = useHistory();

  const [user, setUser] = useState({
    name: '',
    email: '',
    function: '',
    role: '',
    status: '',
    employed: ''
  });

  // Hàm cập nhật người dùng
  const handleSave = () => {
    // Giả lập việc lưu thông tin người dùng mới
    console.log('User Updated:', user);
    // Điều hướng trở lại trang Dashboard sau khi lưu
    history.push('/');
  };

  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>
        Edit User
      </Heading>

      <FormControl mb={4}>
        <FormLabel>Name</FormLabel>
        <Input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Email</FormLabel>
        <Input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Function</FormLabel>
        <Input type="text" value={user.function} onChange={(e) => setUser({ ...user, function: e.target.value })} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Role</FormLabel>
        <Input type="text" value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Status</FormLabel>
        <Input type="text" value={user.status} onChange={(e) => setUser({ ...user, status: e.target.value })} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Employed</FormLabel>
        <Input type="text" value={user.employed} onChange={(e) => setUser({ ...user, employed: e.target.value })} />
      </FormControl>

      <Button colorScheme="teal" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
};

export default EditPage;
