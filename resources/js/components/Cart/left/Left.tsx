import React from "react";
import CreditCard from "../left/CreditCard";
import { Box } from "@chakra-ui/react";
import GetItShipped from "./GetItShipped";

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

interface LeftProps {
  cartItems: CartItem[];
}

const Left = ({ cartItems }: LeftProps): JSX.Element => {
  return (
    <Box
      id="left-container"
      w={{ lg: "65%", md: "65%", base: "100%" }}
      h={{ lg: "auto", md: "auto", base: "auto" }}
    >
      <CreditCard />
      <GetItShipped cartItems={cartItems} />
    </Box>
  );
};

export default Left;
