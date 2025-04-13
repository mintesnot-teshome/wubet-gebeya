import React from 'react';
import {
    Box,
    Button,
    Container,
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
    subtotal: number;
    tax: number;
    total: number;
    payment_status: string;
    order_status: string;
    created_at: string;
    order_items: OrderItem[];
}

interface PageProps {
    orders: Order[];
}

export default function OrdersIndex() {
    const { orders } = usePage<PageProps>().props;
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
        <DefaultLayout title="My Orders">
            <Container maxW="container.xl" py={10}>
                <VStack spacing={8} align="start">
                    <Heading as="h1" size="xl">
                        My Orders
                    </Heading>

                    {orders.length === 0 ? (
                        <Box p={8} textAlign="center" w="full" bg={bgColor} borderRadius="md">
                            <Heading as="h3" size="md" mb={4}>
                                You haven't placed any orders yet
                            </Heading>
                            <Button as={Link} href={route('home')} colorScheme="blue">
                                Start Shopping
                            </Button>
                        </Box>
                    ) : (
                        <Box w="full" overflowX="auto">
                            <Table variant="simple" bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="md">
                                <Thead>
                                    <Tr>
                                        <Th>Order ID</Th>
                                        <Th>Date</Th>
                                        <Th>Items</Th>
                                        <Th>Total</Th>
                                        <Th>Order Status</Th>
                                        <Th>Payment Status</Th>
                                        <Th>Action</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {orders.map((order) => (
                                        <Tr key={order.id}>
                                            <Td>#{order.id}</Td>
                                            <Td>{new Date(order.created_at).toLocaleDateString()}</Td>
                                            <Td>{order.order_items.length} item(s)</Td>
                                            <Td>${order.total.toFixed(2)}</Td>
                                            <Td>
                                                <Badge colorScheme={getStatusColor(order.order_status)}>
                                                    {order.order_status}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <Badge colorScheme={getStatusColor(order.payment_status)}>
                                                    {order.payment_status}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <Button
                                                    as={Link}
                                                    href={route('orders.show', order.id)}
                                                    size="sm"
                                                    colorScheme="blue"
                                                >
                                                    View Details
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                </VStack>
            </Container>
        </DefaultLayout>
    );
}
