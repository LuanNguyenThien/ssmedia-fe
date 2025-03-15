import React, { useState } from 'react';
import { Box, Flex, VStack, Text, useBreakpointValue } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import DashboardTable from './DashboardTable';
import Billing from './Billing';
import Profile from './Profile';
import Header from './header'; // Import Header component
import Charts from './Chart'; // Import Chart component

const AdminLayout = () => {
  const [activeComponent, setActiveComponent] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Manage sidebar toggle

  // Determine the visibility of the sidebar based on screen size
  const sidebarVariant = useBreakpointValue({ base: false, md: true });

  const renderContent = () => {
    switch (activeComponent) {
      case 'Dashboard':
        return <DashboardTable />;
      case 'Billing':
        return <Billing />;
      case 'Profile':
        return <Profile />;
      case 'Chart':
        return <Charts />;
      // Add more cases for other sidebar options
      default:
        return <DashboardTable />;
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Flex bg="gray.100" direction="column" minHeight="100vh">
      <Header onSidebarToggle={handleSidebarToggle} /> {/* Include Header */}
      <Flex>
        {/* Show sidebar only on medium screens and larger */}
        {(sidebarVariant || isSidebarOpen) && <Sidebar setActiveComponent={setActiveComponent} />}
        <Box flex="1" p={6}>
          {renderContent()}
        </Box>
      </Flex>
    </Flex>
  );
};

export default AdminLayout;
