import React from "react";
import { Box, Heading, SimpleGrid, useToast } from "@chakra-ui/react";
import DefaultLayout from '@/layouts/default-layout';
import { usePage } from '@inertiajs/react';
import Left from "../../components/Cart/left/Left";
import Right from "../../components/Cart/right/Right";

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    brand: string;
    price: number;
    imageUrl: string;
  }
}

interface CartProps {
  cartItems: CartItem[];
  cartSummary: {
    subtotal: number;
    tax: number;
    total: number;
    itemCount: number;
  }
}

export default function Cart({ cartItems, cartSummary }: CartProps) {
  const { auth } = usePage().props;
  const toast = useToast();

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
          <Left cartItems={cartItems} />
          <Right cartSummary={cartSummary} />
        </SimpleGrid>
      </Box>
    </DefaultLayout>
  );
}
