import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Flex,
  Grid,
  useToast,
} from "@chakra-ui/react";
import { Box, Image, Text, SimpleGrid, Button } from "@chakra-ui/react";
import { router, usePage } from '@inertiajs/react';

// Define TypeScript interfaces
interface Product {
  id: number;
  name: string;
  imageUrl: string;
  category: string;
  brand: string;
  price: number;
  type: string;
}

interface Props {
  products: Product[];
}

function Dashboard(): JSX.Element {
  const { products } = usePage<Props>().props;
  const [product, setProduct] = useState<Partial<Product>>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const toast = useToast();

  const handleFormData = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    let val: string | number = target.value;
    if (target.name === "price") {
      val = parseFloat(target.value);
    }
    setProduct({ ...product, [target.name]: val });
  };

  const handleSubmit = (): void => {
    if (product.id) {
      router.put(route('products.update', product.id), product as any, {
        onSuccess: () => {
          onClose();
          toast({
            title: "Product updated",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
        },
        onError: (errors) => {
          toast({
            title: "Error updating product",
            description: Object.values(errors).join(', '),
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        },
      });
    }
  };

  const handleDelete = (id: number): void => {
    if (confirm('Are you sure you want to delete this product?')) {
      router.delete(route('products.destroy', id), {
        onSuccess: () => {
          toast({
            title: "Product deleted",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
        },
      });
    }
  };

  return (
    <Box>
      <SimpleGrid
        templateColumns={{
          base: "repeat(2,1fr)",
          md: "repeat(3,1fr)",
          lg: "repeat(4,1fr)",
        }}
        gap={4}
      >
        {products && products.map((item) => (
          <Grid
            border="1px"
            borderColor="lightblue"
            alignItems={"center"}
            justifyContent={"center"}
            key={item.id}
          >
            <Box m={6}>
              <div>
                <Image
                  src={item.imageUrl}
                  alt={`Picture of ${item.name}`}
                  roundedTop="lg"
                />
                <Text as="b" color="black">
                  {item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}
                </Text>
                <br />
                <Text as="b" color="grey">
                  Category: {item.category}
                </Text>
                <Text color="grey">
                  Brand: {item.brand.length > 10 ? `${item.brand.slice(0, 10)}...` : item.brand}
                </Text>
                <Text color="grey">Price: ${item.price}</Text>
                <Flex>
                  <Button
                    marginTop={5}
                    colorScheme="red"
                    variant="outline"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>

                  <Button
                    onClick={() => {
                      setProduct(item);
                      onOpen();
                    }}
                    marginTop={5}
                    marginLeft="5"
                    colorScheme="blue"
                    variant="outline"
                  >
                    Update
                  </Button>
                </Flex>
              </div>
            </Box>
          </Grid>
        ))}

        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input
                  onChange={handleFormData}
                  ref={initialRef}
                  type="url"
                  name="imageUrl"
                  value={product.imageUrl || ''}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  onChange={handleFormData}
                  placeholder="Product Name"
                  name="name"
                  value={product.name || ''}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Category</FormLabel>
                <Input
                  onChange={handleFormData}
                  name="category"
                  placeholder="like: Makeup, Hair..."
                  value={product.category || ''}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Brand</FormLabel>
                <Input
                  onChange={handleFormData}
                  placeholder="Brand Name"
                  name="brand"
                  value={product.brand || ''}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Price</FormLabel>
                <Input
                  onChange={handleFormData}
                  placeholder="In $"
                  value={product.price || ''}
                  name="price"
                  type="number"
                  step="0.01"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Type</FormLabel>
                <Input
                  onChange={handleFormData}
                  placeholder="Product type (featured, new, bestseller, etc.)"
                  value={product.type || ''}
                  name="type"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </SimpleGrid>
    </Box>
  );
}

export default Dashboard;
