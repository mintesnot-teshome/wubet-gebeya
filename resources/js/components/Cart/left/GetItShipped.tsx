import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Heading,
  HStack,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import React from "react";
import { router } from '@inertiajs/react';

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

interface GetItShippedProps {
  cartItems: CartItem[];
}

const GetItShipped = ({ cartItems }: GetItShippedProps): JSX.Element => {
  const toast = useToast();

  // Handler to update cart item quantity
  const handleUpdateQuantity = (cartItemId: number, newQuantity: number) => {
    router.put(route('cart.update', cartItemId), {
      quantity: newQuantity
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Cart updated",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      },
    });
  };

  // Handler to remove item from cart
  const handleRemoveItem = (cartItemId: number) => {
    router.delete(route('cart.remove', cartItemId), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Item removed",
          status: "info",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      },
    });
  };

  return (
    <Box
      w={{ lg: "100%", md: "100%", base: "100%" }}
      h={{ lg: "auto", md: "auto", base: "auto" }}
      borderRadius="5px"
      mt="10px"
    >
      <Text
        as="b"
        fontSize="28px"
        fontFamily={
          "Muli,Mulish,Arial,sans-serif,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue"
        }
      >
        Get It Shipped ({cartItems.length})
      </Text>
      <Box
        mt="15px"
        h={{ lg: "auto", md: "auto", base: "auto" }}
        overflowX={"auto"}
      >
        <Text
          fontSize="16px"
          fontFamily={
            "Muli,Mulish,Arial,sans-serif,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue"
          }
        >
          Free shipping on all orders At this time
        </Text>
        {cartItems &&
          cartItems.map((item) => (
            <Card
              mt="10px"
              mb="20px"
              borderRadius={"0px"}
              border="1px solid grey"
              h="auto"
              key={item.id}
            >
              <CardBody p="10px 5px">
                <HStack spacing="24px" alignItems="flex-start" gap={2}>
                  <Box w={{ lg: "15%", md: "15%", base: "40%" }} h="auto">
                    <Image
                      src={item.product.imageUrl}
                      alt="Product image"
                      borderRadius="lg"
                      h="100%"
                    />
                  </Box>

                  <Box w={{ lg: "80%", md: "80%", base: "100%" }}>
                    <Box mb="10px">
                      <Heading size="xs">
                        {item.product.name}{" "}
                        <span style={{ fontSize: "14px", color: "#ff944d" }}>
                          (New!)
                        </span>
                      </Heading>
                      <Text pt="2" fontSize="13px">
                        Item: {item.product.brand}
                      </Text>
                    </Box>
                    <Text pt="2" fontSize="13px">
                      Ships within 1 week
                    </Text>
                    <Text
                      pt="2"
                      fontWeight={"bold"}
                      color="#ff3300"
                      fontSize="12px"
                    >
                      Only {Math.floor(Math.random() * 10)} left in stock
                    </Text>
                    <Box>
                      <HStack
                        mt="10px"
                        justifyContent={"space-between"}
                        flexDir={{ lg: "row", md: "row", base: "column" }}
                        alignItems={{
                          lg: "center",
                          md: "center",
                          base: "flex-start",
                        }}
                      >
                        <Box display={"flex"} alignItems={"center"}>
                          <Button
                            leftIcon={<FaPlus />}
                            background={"#f2f2f2"}
                            p="0px 3px"
                            boxSizing="border-box"
                            borderRadius={"50%"}
                            minW={"20px"}
                            h="20px"
                            onClick={() => {
                              handleUpdateQuantity(item.id, Math.min(item.quantity + 1, 10));
                            }}
                          ></Button>

                          <Text fontWeight={"bold"} m="0px 10px">
                            {item.quantity}
                          </Text>
                          <Button
                            leftIcon={<FaMinus />}
                            background={"#f2f2f2"}
                            p="0px 3px"
                            boxSizing="border-box"
                            borderRadius={"50%"}
                            minW={"20px"}
                            h="20px"
                            onClick={() => {
                              handleUpdateQuantity(item.id, Math.max(item.quantity - 1, 1));
                            }}
                          ></Button>
                        </Box>
                        <HStack>
                          <Button
                            leftIcon={<FaTrash />}
                            colorScheme="red"
                            variant="outline"
                            onClick={() => {
                              handleRemoveItem(item.id);
                            }}
                          >
                            Remove
                          </Button>
                          <Text fontWeight={"bold"}>
                            $ {(item.product.price * item.quantity).toFixed(2)}
                          </Text>
                        </HStack>
                      </HStack>
                    </Box>
                  </Box>
                </HStack>
              </CardBody>
            </Card>
          ))}

        <Divider />
      </Box>
    </Box>
  );
};

export default GetItShipped;
