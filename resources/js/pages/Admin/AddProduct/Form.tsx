import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Flex,
  useToast,
  Select,
  Switch,
  FormHelperText,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { router, usePage } from '@inertiajs/react';

const initialState = {
  name: "",
  imageUrl: "",
  category: "",
  price: 0,
  original_price: 0,
  discount_percentage: 0,
  is_deal: false,
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
    if (target.name === "price" || target.name === "stars" || target.name === "numReviews" ||
        target.name === "original_price" || target.name === "discount_percentage") {
      val = +target.value;
    }

    if (target.name === "is_deal") {
      val = target.checked;
    }

    setFormData({ ...formData, [target.name]: val });
  }

  // Calculate price when original_price or discount_percentage changes
  useEffect(() => {
    if (formData.is_deal && formData.original_price > 0 && formData.discount_percentage > 0) {
      const discountAmount = formData.original_price * (formData.discount_percentage / 100);
      const calculatedPrice = formData.original_price - discountAmount;
      setFormData(prev => ({ ...prev, price: +calculatedPrice.toFixed(2) }));
    } else if (!formData.is_deal || formData.discount_percentage <= 0) {
      setFormData(prev => ({ ...prev, price: prev.original_price }));
    }
  }, [formData.original_price, formData.discount_percentage, formData.is_deal]);

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
            <FormLabel>Original Price</FormLabel>
            <Input
              mb="15px"
              type="number"
              step="0.01"
              placeholder="Original product price in $"
              name="original_price"
              onChange={handleChange}
              value={formData.original_price}
            />
          </Box>
        </Flex>

        <Flex
          gap={{ base: 2, md: 10 }}
          direction={{ base: "column", md: "row" }}
        >
          <Box w={{ base: "100%", md: "50%" }}>
            <FormLabel htmlFor="is_deal">Is Deal / Has Discount</FormLabel>
            <Switch
              id="is_deal"
              name="is_deal"
              onChange={handleChange}
              isChecked={formData.is_deal}
              mb="15px"
            />
            <FormHelperText>Enable if product has a discount</FormHelperText>
          </Box>
          <Box w={{ base: "100%", md: "50%" }}>
            <FormLabel>Discount Percentage</FormLabel>
            <Input
              mb="15px"
              type="number"
              step="0.1"
              min="0"
              max="100"
              isDisabled={!formData.is_deal}
              placeholder="Discount percentage (0-100)"
              name="discount_percentage"
              onChange={handleChange}
              value={formData.discount_percentage}
            />
          </Box>
        </Flex>

        <Flex
          gap={{ base: 2, md: 10 }}
          direction={{ base: "column", md: "row" }}
        >
          <Box w={{ base: "100%", md: "100%" }}>
            <FormLabel>Final Price</FormLabel>
            <Input
              mb="15px"
              type="number"
              step="0.01"
              placeholder="Final price (automatically calculated)"
              name="price"
              value={formData.price}
              isReadOnly={formData.is_deal}
              onChange={handleChange}
            />
            {formData.is_deal && formData.discount_percentage > 0 && (
              <FormHelperText>
                <Text color="green.500">
                  Price after {formData.discount_percentage}% discount:
                  ${formData.price} (saved ${(formData.original_price - formData.price).toFixed(2)})
                </Text>
              </FormHelperText>
            )}
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
