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
    Badge,
    useColorModeValue,
    Image,
} from '@chakra-ui/react';
import DefaultLayout from '@/layouts/default-layout';
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

export default function OrderDetail() {
    const { order } = usePage<PageProps>().props;
    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    // Function to get status badge color based on status
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'processing':
                return 'yellow';
            case 'shipped':
                return 'blue';
            case 'delivered':
                return 'green';
            case 'cancelled':
                return 'red';
            case 'paid':
                return 'green';
            case 'pending':
                return 'orange';
            default:
                return 'gray';
        }
    };

    return (
        <DefaultLayout title={`Order #${order.id}`}>
            <Container maxW="container.xl" py={10}>
                <VStack spacing={8} align="start">
                    <Flex justify="space-between" width="100%" align="center">
                        <Heading as="h1" size="xl">
                            Order Details
                        </Heading>
                        <Button
                            as={Link}
                            href={route('orders.index')}
                            colorScheme="blue"
                            variant="outline"
                        >
                            Back to Orders
                        </Button>
                    </Flex>

                    <Box
                        w="full"
                        bg={bgColor}
                        p={6}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                    >
                        <Flex
                            direction={{ base: 'column', md: 'row' }}
                            justify="space-between"
                            mb={6}
                        >
                            <Box>
                                <Heading as="h2" size="md" mb={2}>
                                    Order #{order.id}
                                </Heading>
                                <Text color="gray.600">
                                    Placed on {new Date(order.created_at).toLocaleString()}
                                </Text>
                            </Box>
                            <Box>
                                <Flex gap={4} mt={{ base: 4, md: 0 }}>
                                    <Badge
                                        colorScheme={getStatusColor(order.order_status)}
                                        fontSize="md"
                                        px={3}
                                        py={1}
                                    >
                                        {order.order_status}
                                    </Badge>
                                    <Badge
                                        colorScheme={getStatusColor(order.payment_status)}
                                        fontSize="md"
                                        px={3}
                                        py={1}
                                    >
                                        {order.payment_status}
                                    </Badge>
                                </Flex>
                            </Box>
                        </Flex>

                        <Divider my={6} />

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
                                    <Text><strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}</Text>
                                    <Text><strong>Tax:</strong> ${order.tax.toFixed(2)}</Text>
                                    <Text fontSize="lg" fontWeight="bold">
                                        <strong>Total:</strong> ${order.total.toFixed(2)}
                                    </Text>
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
                                                    <Image
                                                        src={item.product.imageUrl}
                                                        alt={item.product.name}
                                                        boxSize="50px"
                                                        objectFit="cover"
                                                        borderRadius="md"
                                                        mr={4}
                                                    />
                                                    <Box>
                                                        <Text fontWeight="medium">
                                                            {item.product.name}
                                                        </Text>
                                                        <Text fontSize="sm" color="gray.500">
                                                            {item.product.brand}
                                                        </Text>
                                                    </Box>
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
                </VStack>
            </Container>
        </DefaultLayout>
    );
}
