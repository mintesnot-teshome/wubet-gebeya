import React from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { router } from '@inertiajs/react';
import { useSelector } from 'react-redux';
import DefaultLayout from '@/layouts/default-layout';

export default function Checkout() {
  const auth = useSelector((store) => store.auth);
  const toast = useToast();

  // If user is not authenticated, redirect to login
  if (auth.data.isAuthenticated === false) {
    toast({
      title: "Login Error",
      description: "Please login first to access checkout",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });

    router.visit(route('login'));
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // This would typically send a request to process payment
    // For now, we'll just show a success message

    toast({
      title: "Order submitted",
      description: "Thank you for your purchase!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });

    // Redirect to home page after successful order
    setTimeout(() => {
      router.visit(route('home'));
    }, 2000);
  };

  return (
    <DefaultLayout title="Checkout">
      <Box maxW="1200px" mx="auto" p={8}>
        <Heading as="h1" mb={6} textAlign="center">
          Checkout
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Box>
            <Heading as="h2" size="md" mb={4}>
              Shipping Information
            </Heading>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input placeholder="Full Name" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input type="email" placeholder="Email Address" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input type="tel" placeholder="Phone Number" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Address</FormLabel>
                <Input placeholder="Street Address" />
              </FormControl>

              <SimpleGrid columns={3} spacing={2}>
                <FormControl isRequired>
                  <FormLabel>City</FormLabel>
                  <Input placeholder="City" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>State</FormLabel>
                  <Input placeholder="State" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>ZIP Code</FormLabel>
                  <Input placeholder="ZIP Code" />
                </FormControl>
              </SimpleGrid>
            </Stack>
          </Box>

          <Box>
            <Heading as="h2" size="md" mb={4}>
              Payment Information
            </Heading>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Card Number</FormLabel>
                <Input placeholder="**** **** **** ****" />
              </FormControl>

              <SimpleGrid columns={2} spacing={2}>
                <FormControl isRequired>
                  <FormLabel>Expiry Date</FormLabel>
                  <Input placeholder="MM/YY" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>CVV</FormLabel>
                  <Input placeholder="CVV" />
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>Name on Card</FormLabel>
                <Input placeholder="Name on Card" />
              </FormControl>

              <Button
                mt={6}
                colorScheme="blue"
                size="lg"
                width="full"
                onClick={handleSubmit}
              >
                Place Order
              </Button>
            </Stack>
          </Box>
        </SimpleGrid>
      </Box>
    </DefaultLayout>
  );
}
