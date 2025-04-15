import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Flex,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { router, usePage } from '@inertiajs/react';

const initialState = {
  name: "",
  imageUrl: "",
  category: "",
  price: 0,
  brand: "",
  numReviews: 0,
  stars: 0,
  type: "",
};

const Form = () => {
  const [formData, setFormData] = useState(initialState);
  const [processing, setProcessing] = useState(false);
  const { categories } = usePage().props;
  const toast = useToast();

  function handleChange({ target }) {
    let val = target.value;
    if (target.name === "price" || target.name === "stars" || target.name === "numReviews") {
      val = +target.value;
    }
    setFormData({ ...formData, [target.name]: val });
  }

  function submit() {
    setProcessing(true);

    router.post(route('products.store'), formData, {
      onSuccess: () => {
        setFormData(initialState);
        setProcessing(false);
        toast({
          title: "Product created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      },
      onError: (errors) => {
        setProcessing(false);
        Object.keys(errors).forEach((key) => {
          toast({
            title: "Error",
            description: errors[key],
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        });
      }
    });
  }

  return (
    <FormControl margin="auto" width="90%" bg="white" id="form">
      <Box p={8}>
        <Flex
          gap={{ base: 2, md: 10 }}
          direction={{ base: "column", md: "row" }}
        >
          <Box w={{ base: "100%", md: "50%" }}>
            <FormLabel>Product Name</FormLabel>
            <Input
              mb="15px"
              type="text"
              placeholder="Product name"
              name="name"
              onChange={handleChange}
              value={formData.name}
            />
          </Box>
          <Box w={{ base: "100%", md: "50%" }}>
            <FormLabel>Image Url</FormLabel>
            <Input
              mb="15px"
              type="url"
              placeholder="Product image url"
              name="imageUrl"
              onChange={handleChange}
              value={formData.imageUrl}
            />
          </Box>
        </Flex>
        <Flex
          gap={{ base: 2, md: 10 }}
          direction={{ base: "column", md: "row" }}
        >
          <Box w={{ base: "100%", md: "50%" }}>
            <FormLabel>Category</FormLabel>
            <Select
              mb="15px"
              name="category"
              onChange={handleChange}
              value={formData.category}
              placeholder="Select category"
            >
              {categories && categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </Select>
          </Box>
          <Box w={{ base: "100%", md: "50%" }}>
            <FormLabel>Brand</FormLabel>
            <Input
              mb="15px"
              type="text"
              placeholder="enter brand name"
              name="brand"
              onChange={handleChange}
              value={formData.brand}
            />
          </Box>
        </Flex>
        <Flex
          gap={{ base: 2, md: 10 }}
          direction={{ base: "column", md: "row" }}
        >
          <Box w={{ base: "100%", md: "50%" }}>
            <FormLabel>Reviews</FormLabel>
            <Input
              value={formData.numReviews}
              mb="15px"
              type="number"
              placeholder="No. of Reviews"
              name="numReviews"
              onChange={handleChange}
            />
          </Box>
          <Box w={{ base: "100%", md: "50%" }}>
            <FormLabel>Rating</FormLabel>
            <Input
              mb="15px"
              type="number"
              min="0"
              max="5"
              step="0.1"
              placeholder="enter rating (0-5)"
              name="stars"
              onChange={handleChange}
              value={formData.stars}
            />
          </Box>
        </Flex>
        <Flex
          gap={{ base: 2, md: 10 }}
          direction={{ base: "column", md: "row" }}
        >
          <Box w={{ base: "100%", md: "50%" }}>
            <FormLabel>Type</FormLabel>
            <Select
              mb="15px"
              name="type"
              onChange={handleChange}
              value={formData.type}
              placeholder="Select product type"
            >
              <option value="featured">Featured</option>
              <option value="new">New</option>
              <option value="bestseller">Bestseller</option>
              <option value="popular">Popular</option>
              <option value="sale">Sale</option>
            </Select>
          </Box>
          <Box w={{ base: "100%", md: "50%" }}>
            <FormLabel>Price</FormLabel>
            <Input
              mb="15px"
              type="number"
              step="0.01"
              placeholder="Product price in $"
              name="price"
              onChange={handleChange}
              value={formData.price}
            />
          </Box>
        </Flex>

        <br />
        <Flex justifyContent="center" gap={2}>
          <Button
            onClick={submit}
            colorScheme="teal"
            type="submit"
            isLoading={processing}
            loadingText="Submitting"
          >
            Submit
          </Button>

          <Button
            colorScheme="red"
            type="button"
            onClick={() => {
              setFormData(initialState);
            }}
          >
            Reset
          </Button>
        </Flex>
      </Box>
    </FormControl>
  );
};
export default Form;
