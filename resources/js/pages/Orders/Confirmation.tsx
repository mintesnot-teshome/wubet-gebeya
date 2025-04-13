import React from 'react';
import {
    Box,
    Button,
    Container,
    Divider,
    Flex,
    Heading,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import DefaultLayout from '@/layouts/default-layout';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Link, usePage } from '@inertiajs/react';

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        brand: string;
        imageUrl: string;
    };
}

interface Order {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    subtotal: number;
    tax: number;
    total: number;
    payment_status: string;
    order_status: string;
    created_at: string;
    order_items: OrderItem[];
}

interface PageProps {
    order: Order;
}

export default function Confirmation() {
    const { order } = usePage<PageProps>().props;
    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <DefaultLayout title="Order Confirmation">
            <Container maxW="container.xl" py={10}>
                <VStack spacing={8} align="start">
                    <Box textAlign="center" w="full">
                        <CheckCircleIcon w={20} h={20} color="green.500" mb={4} />
                        <Heading as="h1" size="xl" mb={3}>
                            Thank You for Your Order!
                        </Heading>
                        <Text fontSize="lg" color="gray.600">
                            Your order has been placed successfully
                        </Text>
                        <Text fontSize="md" mt={1}>
                            Order ID: #{order.id}
                        </Text>
                        <Text fontSize="md" mt={1}>
                            Date: {new Date(order.created_at).toLocaleDateString()}
                        </Text>
                    </Box>

                    <Box w="full" bg={bgColor} p={6} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                        <Heading as="h2" size="lg" mb={6}>
                            Order Details
                        </Heading>

                        <Flex direction={{ base: 'column', md: 'row' }} mb={6}>
                            <Box flex="1" mr={{ base: 0, md: 8 }} mb={{ base: 6, md: 0 }}>
                                <Heading as="h3" size="md" mb={3}>
                                    Shipping Information
                                </Heading>
                                <VStack align="start" spacing={1}>
                                    <Text><strong>Name:</strong> {order.full_name}</Text>
                                    <Text><strong>Email:</strong> {order.email}</Text>
                                    <Text><strong>Phone:</strong> {order.phone_number}</Text>
                                    <Text><strong>Address:</strong> {order.address}</Text>
                                    <Text><strong>City:</strong> {order.city}</Text>
                                    <Text><strong>State/Province:</strong> {order.state}</Text>
                                    <Text><strong>Zip/Postal Code:</strong> {order.zip_code}</Text>
                                </VStack>
                            </Box>

                            <Box flex="1">
                                <Heading as="h3" size="md" mb={3}>
                                    Order Summary
                                </Heading>
                                <VStack align="start" spacing={1}>
                                    <Text><strong>Order Status:</strong> {order.order_status}</Text>
                                    <Text><strong>Payment Status:</strong> {order.payment_status}</Text>
                                    <Text><strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}</Text>
                                    <Text><strong>Tax:</strong> ${order.tax.toFixed(2)}</Text>
                                    <Text fontSize="lg" fontWeight="bold"><strong>Total:</strong> ${order.total.toFixed(2)}</Text>
                                </VStack>
                            </Box>
                        </Flex>

                        <Divider my={6} />

                        <Heading as="h3" size="md" mb={4}>
                            Ordered Items
                        </Heading>

                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Product</Th>
                                        <Th isNumeric>Quantity</Th>
                                        <Th isNumeric>Price</Th>
                                        <Th isNumeric>Total</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {order.order_items.map((item) => (
                                        <Tr key={item.id}>
                                            <Td>
                                                <Flex align="center">
                                                    <Text fontWeight="medium">{item.product.name}</Text>
                                                </Flex>
                                            </Td>
                                            <Td isNumeric>{item.quantity}</Td>
                                            <Td isNumeric>${item.price.toFixed(2)}</Td>
                                            <Td isNumeric>${(item.price * item.quantity).toFixed(2)}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </Box>

                    <Flex justifyContent="space-between" w="full">
                        <Button
                            as={Link}
                            href={route('home')}
                            colorScheme="blue"
                            variant="outline"
                        >
                            Continue Shopping
                        </Button>
                        <Button
                            as={Link}
                            href={route('orders.index')}
                            colorScheme="blue"
                        >
                            View All Orders
                        </Button>
                    </Flex>
                </VStack>
            </Container>
        </DefaultLayout>
    );
}
