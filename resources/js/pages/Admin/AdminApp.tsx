import React from 'react';
import { Box, ChakraProvider } from "@chakra-ui/react";
import { router, usePage } from '@inertiajs/react';
import { useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import SidebarWithHeader from './Dashboard/admin';
import Dashboard from './Dashboard/Dashboard';

export default function AdminApp() {
  const auth = useSelector((store) => store.auth);
  const toast = useToast();

  // Check if user is authenticated and has admin privileges
  if (auth.data.isAuthenticated === false) {
    toast({
      title: "Authentication Error",
      description: "You must be logged in to access the admin panel",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });

    // Use Inertia's router to redirect to login
    router.visit(route('login'));
    return null;
  }

  // When connected to Laravel, you would check user role here
  // For now using a simple check based on Redux state

  return (
    <ChakraProvider>
      <Box minH="100vh">
        <SidebarWithHeader>
          <Dashboard />
        </SidebarWithHeader>
      </Box>
    </ChakraProvider>
  );
}
