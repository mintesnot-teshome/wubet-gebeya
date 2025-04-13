import React, { useState } from 'react';
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
  Text,
} from '@chakra-ui/react';
import { router, usePage } from '@inertiajs/react';
import DefaultLayout from '@/layouts/default-layout';

interface PageProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    } | null;
  };
  cartSummary?: {
    subtotal: number;
    tax: number;
    total: number;
    itemCount: number;
  };
}

export default function Checkout() {
  const { auth, cartSummary } = usePage<PageProps>().props;
  const toast = useToast();
  const [formData, setFormData] = useState({
    fullName: auth.user?.name || '',
    email: auth.user?.email || '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Submit order to the backend
    router.post(route('orders.store'), formData, {
      onSuccess: () => {
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
      },
      onError: (errors) => {
        toast({
          title: "Error submitting order",
          description: Object.values(errors).join(', '),
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    });
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
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email Address"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Phone Number"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Address</FormLabel>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street Address"
                />
              </FormControl>

              <SimpleGrid columns={3} spacing={2}>
                <FormControl isRequired>
                  <FormLabel>City</FormLabel>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>State</FormLabel>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>ZIP Code</FormLabel>
                  <Input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                  />
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
                <Input
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="**** **** **** ****"
                />
              </FormControl>

              <SimpleGrid columns={2} spacing={2}>
                <FormControl isRequired>
                  <FormLabel>Expiry Date</FormLabel>
                  <Input
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>CVV</FormLabel>
                  <Input
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="CVV"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>Name on Card</FormLabel>
                <Input
                  name="nameOnCard"
                  value={formData.nameOnCard}
                  onChange={handleChange}
                  placeholder="Name on Card"
                />
              </FormControl>

              {cartSummary && (
                <Box mt={4} p={4} borderWidth="1px" borderRadius="lg">
                  <Flex justify="space-between" mb={2}>
                    <Text>Subtotal:</Text>
                    <Text>${cartSummary.subtotal.toFixed(2)}</Text>
                  </Flex>
                  <Flex justify="space-between" mb={2}>
                    <Text>Tax:</Text>
                    <Text>${cartSummary.tax.toFixed(2)}</Text>
                  </Flex>
                  <Flex justify="space-between" fontWeight="bold">
                    <Text>Total:</Text>
                    <Text>${cartSummary.total.toFixed(2)}</Text>
                  </Flex>
                </Box>
              )}

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
