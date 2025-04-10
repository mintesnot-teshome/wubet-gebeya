import React, { useEffect } from "react";
import { StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProduct } from "../../Redux/products/actions";
import { addProductToCart } from "../../Redux/cart/actions";
import { usePage } from '@inertiajs/react';
import DefaultLayout from '@/layouts/default-layout';

// Define types for the product data
interface Product {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  brand: string;
  category: string;
  numReviews: number;
  stars: number;
  // Add other properties as needed
}

// Define RootState interface for the Redux store
interface RootState {
  products: {
    single_data: Product;
    AllProducts: { loading: boolean; error: boolean };
    Product: { loading: boolean; error: boolean };
    data: Product[];
  };
  auth: {
    data: {
      isAuthenticated: boolean;
      token: string | null;
      user: any;
    };
  };
  carts: {
    carts: any[];
    loading: boolean;
    error: boolean;
    message: string;
  };
}

export default function SingleProduct() {
  const { productId } = usePage().props;
  const dispatch = useDispatch();
  const { single_data } = useSelector((store: RootState) => store.products);

  useEffect(() => {
    dispatch(getSingleProduct(productId));
  }, [dispatch, productId]);

  return (
    <DefaultLayout title={single_data?.name || "Product"}>
      <Container maxW={"7xl"}>
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: 24 }}
        >
          <Flex>
            <Image
              rounded={"md"}
              alt={"product image"}
              src={single_data?.imageUrl}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={{ base: "100%", sm: "400px", lg: "500px" }}
            />
          </Flex>
          <Stack spacing={{ base: 6, md: 10 }}>
            <Box as={"header"}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
              >
                {single_data?.name}
              </Heading>
              <Text
                color={useColorModeValue("gray.900", "gray.400")}
                fontWeight={300}
                fontSize={"2xl"}
              >
                ₹ {single_data?.price ? single_data.price * 81 : ""}
              </Text>
            </Box>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={"column"}
              divider={
                <StackDivider
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                />
              }
            >
              <VStack spacing={{ base: 4, sm: 6 }}>
                <Text
                  color={useColorModeValue("gray.500", "gray.400")}
                  fontSize={"2xl"}
                  fontWeight={"300"}
                >
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore
                </Text>
                <Text fontSize={"lg"}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
                  aliquid amet at delectus doloribus dolorum expedita hic, ipsum
                  maxime modi nam officiis porro, quae, quisquam quos
                  reprehenderit velit? Natus, totam.
                </Text>
              </VStack>
              <Box>
                <Text
                  fontSize={{ base: "16px", lg: "18px" }}
                  color={useColorModeValue("yellow.500", "yellow.300")}
                  fontWeight={"500"}
                  textTransform={"uppercase"}
                  mb={"4"}
                  mt="0"
                >
                  Product Details
                </Text>

                <List spacing={2}>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Brand:
                    </Text>{" "}
                    {single_data?.brand}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Category:
                    </Text>{" "}
                    {single_data?.category}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Reviews:
                    </Text>{" "}
                    {single_data?.numReviews}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Rating:
                    </Text>{" "}
                    <Box display="flex" mt="2" alignItems="center">
                      {single_data?.stars &&
                        Array(5)
                          .fill("")
                          .map((_, i) => (
                            <StarIcon
                              key={i}
                              color={
                                i < single_data.stars ? "teal.500" : "gray.300"
                              }
                            />
                          ))}
                    </Box>
                  </ListItem>
                </List>
              </Box>
            </Stack>

            <Button
              rounded={"none"}
              w={"full"}
              mt={8}
              size={"lg"}
              py={"7"}
              bg={useColorModeValue("gray.900", "gray.50")}
              color={useColorModeValue("white", "gray.900")}
              textTransform={"uppercase"}
              _hover={{
                transform: "translateY(2px)",
                boxShadow: "lg",
              }}
              onClick={() => {
                if (single_data?._id) {
                  dispatch(addProductToCart(single_data._id, 1));
                }
              }}
            >
              Add to cart
            </Button>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"center"}
            >
              <MdLocalShipping />
              <Text>2-3 business days delivery</Text>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </DefaultLayout>
  );
}
