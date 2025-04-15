import { Box, Flex, Heading, useToast } from "@chakra-ui/react";
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
          fontSize={{ lg: "25px", md: "20px", base: "25px" }}
          pb={{ lg: "20px", md: "20px", base: "10px" }}
        >
          My Basket
        </Heading>
        <Flex
          gap={{ lg: "15px", md: "15px" }}
          h="auto"
          flexDirection={{ lg: "row", md: "row", base: "column-reverse" }}
        >
          <Left cartItems={cartItems} />
          <Right cartSummary={cartSummary} />
        </Flex>
      </Box>
    </DefaultLayout>
  );
}
