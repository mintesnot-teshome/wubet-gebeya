import { Box, Button, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { router } from '@inertiajs/react';

interface CartSummary {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

interface RightProps {
  cartSummary: CartSummary;
}

const Right = ({ cartSummary }: RightProps): JSX.Element => {
  const handleCheckout = (): void => {
    router.visit(route('checkout'));
  };

  const shippingCost = 0; // Free shipping as per the GetItShipped component
  const formattedSubtotal = cartSummary.subtotal.toFixed(2);
  const formattedTax = cartSummary.tax.toFixed(2);
  const formattedTotal = cartSummary.total.toFixed(2);
  const installmentAmount = (cartSummary.total / 4).toFixed(2);

  return (
    <Stack
      w={{ lg: "35%", md: "35%", base: "100%" }}
      border="1px solid grey"
      borderRadius={"5px"}
      h="100%"
      p="10px 20px"
      mb="10px"
    >
      <Flex w="100%" justify={"space-between"}>
        <Text>Merchandise Subtotal</Text>
        <Text fontWeight={"bold"}>$ {formattedSubtotal}</Text>
      </Flex>
      <Flex w="100%" justify={"space-between"}>
        <Text>Shipping & Handling</Text>
        <Text fontWeight={"bold"}>$ {shippingCost.toFixed(2)}</Text>
      </Flex>
      <Flex w="100%" justify={"space-between"}>
        <Text>Tax</Text>
        <Text fontWeight={"bold"}>$ {formattedTax}</Text>
      </Flex>
      <Divider />
      <Flex w="100%" justify={"space-between"}>
        <Text>Estimated Total</Text>
        <Text fontWeight={"bold"}>$ {formattedTotal}</Text>
      </Flex>
      <Box w="100%" fontSize="13px">
        <Text>
          or 4 payments of $ {installmentAmount} with <strong>SBI</strong> or{" "}
          <strong>afterpay</strong>
        </Text>
      </Box>
      <Text fontSize={"12px"} color="grey">
        Shipping & taxes calculated during checkout
      </Text>
      <Flex justify={"center"}>
        {cartSummary.itemCount === 0 ? (
          <Button
            w="70%"
            background={"#cf112c"}
            color="white"
            borderRadius={"20px"}
            _hover={{ background: " rgb(226, 3, 15)", color: "white" }}
          >
            Add Products to checkout
          </Button>
        ) : (
          <Button
            w="70%"
            background={"#cf112c"}
            color="white"
            borderRadius={"20px"}
            _hover={{ background: " rgb(226, 3, 15)", color: "white" }}
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        )}
      </Flex>
    </Stack>
  );
};

export default Right;
