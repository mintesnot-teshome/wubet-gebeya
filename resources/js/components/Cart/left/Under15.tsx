import {
  Box,
  Divider,
  HStack,
  Image,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import React from "react";

const Under15 = (): JSX.Element => {
  return (
    <Box mt={"20px"}>
      <Text fontSize="20px">Picks Under ₹15</Text>
      <SimpleGrid
        templateColumns={{ lg: "repeat(5,1fr)", md: "repeat(3,1fr)" }}
        gap={3}
        mt="10px"
      >
        <Box
          h="110px"
          boxShadow="rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
          display={"flex"}
          justifyContent="center"
          alignItems={"center"}
          p="10px"
        >
          <Image
            h="100%"
            src="https://www.sephora.com/productimages/sku/s2518959-main-zoom.jpg?imwidth=166"
          />
        </Box>

        <Box
          h="110px"
          boxShadow="rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
          display={"flex"}
          justifyContent="center"
          alignItems={"center"}
          p="10px"
        >
          <Image
            h="100%"
            src="https://www.sephora.com/productimages/sku/s2499663-main-zoom.jpg?imwidth=166"
          />
        </Box>

        <Box
          h="110px"
          boxShadow="rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
          display={"flex"}
          justifyContent="center"
          alignItems={"center"}
          p="10px"
        >
          <Image
            h="100%"
            src="https://www.sephora.com/productimages/sku/s2544153-main-zoom.jpg?imwidth=166"
          />
        </Box>

        <Box
          h="110px"
          boxShadow="rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
          display={"flex"}
          justifyContent="center"
          alignItems={"center"}
          p="10px"
        >
          <Image
            h="100%"
            src="https://www.sephora.com/productimages/sku/s2123180-main-zoom.jpg?imwidth=166"
          />
        </Box>

        <Box
          h="110px"
          boxShadow="rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
          display={"flex"}
          justifyContent="center"
          alignItems={"center"}
          p="10px"
        >
          <Image
            h="100%"
            src="https://www.sephora.com/productimages/sku/s2247492-main-zoom.jpg?imwidth=166"
          />
        </Box>
      </SimpleGrid>

      <Divider mt="20px" mb="20px" />
      <HStack alignItems={"flex-start"}>
        <Image src="https://community.sephora.com/t5/image/serverpage/image-id/1223858i2FEBBE24696EB8C3/image-size/large/is-moderation-mode/true?v=v2&px=999" />
      </HStack>
    </Box>
  );
};

export default Under15;
