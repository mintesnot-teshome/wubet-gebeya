import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  deleteCart,
  getCart,
  updateCart,
} from "../../../Redux/cart/actions";

interface CartCrudProps {
  item: {
    _id: string;
    productId: {
      _id: string;
      name: string;
      brand: string;
      imageUrl: string;
      price: number;
    };
    quantity: number;
  };
}

const CartCrud = ({ item }: CartCrudProps): JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  return (
    <Card
      mt="10px"
      mb="20px"
      borderRadius={"0px"}
      border="1px solid grey"
      h="auto"
      key={item._id}
    >
      <CardBody p="10px 5px">
        <HStack spacing="24px" alignItems="flex-start" gap={2}>
          <Box w={{ lg: "15%", md: "15%", base: "40%" }} h="auto">
            <Image
              src={item.productId.imageUrl}
              alt="Product image"
              borderRadius="lg"
              h="100%"
            />
          </Box>

          <Box w={{ lg: "80%", md: "80%", base: "100%" }}>
            <Box mb="10px">
              <Heading size="xs">
                {item.productId.name}{" "}
                <span style={{ fontSize: "14px", color: "#ff944d" }}>
                  (New!)
                </span>
              </Heading>
              <Text pt="2" fontSize="13px">
                Item: {item.productId.brand}
              </Text>
            </Box>
            <Text pt="2" fontSize="13px">
              Ships within 1 week
            </Text>
            <Text pt="2" fontWeight={"bold"} color="#ff3300" fontSize="12px">
              Only {Math.floor(Math.random() * 10)} left in stock
            </Text>
            <Box>
              <HStack
                mt="10px"
                justifyContent={"space-between"}
                flexDir={{ lg: "row", md: "row", base: "column" }}
                alignItems={{ lg: "center", md: "center", base: "flex-start" }}
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
                      dispatch(
                        updateCart(
                          item.productId._id,
                          Math.min(item.quantity + 1, 10)
                        )
                      );
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
                      dispatch(
                        updateCart(
                          item.productId._id,
                          Math.max(item.quantity - 1, 1)
                        )
                      );
                    }}
                  ></Button>
                </Box>
                <HStack>
                  <Button
                    leftIcon={<FaTrash />}
                    colorScheme="red"
                    variant="outline"
                    onClick={() => {
                      dispatch(deleteCart(item.productId._id));
                    }}
                  >
                    Remove
                  </Button>
                  <Text fontWeight={"bold"}>
                    ₹ {item.productId.price * item.quantity * 82}
                  </Text>
                </HStack>
              </HStack>
            </Box>
          </Box>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default CartCrud;
