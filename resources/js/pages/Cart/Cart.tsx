import React from "react";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import DefaultLayout from '@/layouts/default-layout';
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { router, usePage } from '@inertiajs/react';
import { useToast } from "@chakra-ui/react";
import Left from "../../components/Cart/left/Left";
import Right from "../../components/Cart/right/Right";

export default function Cart() {
  const auth = useSelector((store) => store.auth);
  const toast = useToast();

  // If user is not authenticated, redirect to login
  if (auth.data.isAuthenticated === false) {
    toast({
      title: "Login Error",
      description: "Please login first to access cart",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });

    toast({
      title: "Redirecting",
      description: "Redirecting to signup page",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });

    // Use Inertia's router to redirect
    router.visit(route('register'));
    return null;
  }

  return (
    <DefaultLayout title="Cart">
      <Box
        w={{ lg: "90%", md: "100%", base: "100%" }}
        h="auto"
        m="auto"
        mt="20px"
        mb="20px"
        p="10px"
      >
        <Heading
          as="h2"
          size="lg"
          fontWeight="normal"
          textAlign="center"
          pt="30px"
          mb="50px"
        >
          My Shopping Bag
        </Heading>

        <SimpleGrid
          columns={{ lg: 2, md: 1, base: 1 }}
          w="95%"
          m="auto"
          spacing="30px"
        >
          <Left />
          <Right />
        </SimpleGrid>
      </Box>
    </DefaultLayout>
  );
}
