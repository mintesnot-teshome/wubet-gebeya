import React, { useState } from "react";
import "./AllProduct.css";
import { StarIcon } from "@chakra-ui/icons";
import { Link as InertiaLink, router } from '@inertiajs/react';
import {
  Accordion,
  Show,
  Hide,
  Img,
  AccordionItem,
  Box,
  SkeletonText,
  Grid,
  Skeleton,
  Button,
  Select,
} from "@chakra-ui/react";
import PorMenue from "./Pro_component/pro_menue";
import DefaultLayout from '@/layouts/default-layout';

export default function AllProduct({ products, filters }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState(filters?.max_price || null);
  const [sortOption, setSortOption] = useState(filters?.sort || "newest");

  // Function to handle filtering
  const applyFilters = (newFilters) => {
    setIsLoading(true);

    // Prepare filter parameters
    const params = {
      ...filters,
      ...newFilters,
      page: currentPage,
    };

    // Clean up undefined values
    Object.keys(params).forEach(key =>
      params[key] === undefined && delete params[key]
    );

    // Navigate with filters
    router.get(route('products'), params, {
      preserveState: true,
      onSuccess: () => {
        setIsLoading(false);
      }
    });
  };

  // Handle page changes
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    applyFilters({ page: newPage });
  };

  // Handle price filtering
  const handlePriceFilter = (priceRange) => {
    const [min, max] = priceRange.split(':').map(Number);
    setPrice(max);
    applyFilters({ max_price: max, page: 1 });
  };

  // Handle sort changes
  const handleSortChange = (sortType) => {
    setSortOption(sortType);
    applyFilters({ sort: sortType, page: 1 });
  };

  // Get category name for display
  const categoryName = filters?.category ?
    filters.category.charAt(0).toUpperCase() + filters.category.slice(1) :
    'All Products';

  if (isLoading) {
    return (
      <DefaultLayout title="Products">
        <Grid
          w={{
            base: "100%",
            md: "90%",
            lg: "80%",
          }}
          m="auto"
          templateColumns={{
            base: "repeat(2,1fr)",
            md: "repeat(3,1fr)",
            lg: "repeat(4,1fr)",
          }}
          gap="10"
          p="10"
        >
          {new Array(20).fill(0).map((e, i) => (
            <Box w=" 100%" m="auto" boxShadow="lg" bg="white" key={i}>
              <Skeleton size="10" h="180px" />
              <SkeletonText
                w="80%"
                m="auto"
                mb="20px"
                mt="4"
                noOfLines={4}
                spacing="4"
              />
            </Box>
          ))}
        </Grid>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout title={`Products - ${categoryName}`}>
      <div className="product_body">
        <Hide below="1000px">
          <div className="product_el_one ">
            <h1 style={{ fontSize: "1.5rem" }}>Filter</h1>

            <Accordion allowToggle>
              <AccordionItem>
                <Select
                  placeholder="Price Range"
                  onChange={(e) => handlePriceFilter(e.target.value)}
                  textAlign="center"
                  value={price ? `0:${price}` : ""}
                >
                  <option value="0:10">Under $10</option>
                  <option value="0:20">Under $20</option>
                  <option value="0:50">Under $50</option>
                  <option value="0:100">Under $100</option>
                  <option value="0:200">Under $200</option>
                </Select>
              </AccordionItem>
              <AccordionItem>
                <Select
                  placeholder="Sort By"
                  textAlign="center"
                  value={sortOption || ""}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </Select>
              </AccordionItem>
            </Accordion>
            <Img
              src="https://pubsaf.global.ssl.fastly.net/prmt/2b3c4a8bcedc1e3939b716fe3b3dc904"
              m="auto"
              mt="1rem"
              alt="Img"
            />
          </div>
        </Hide>

        <div className="prod_el_main">
          <Img src="https://pubsaf.global.ssl.fastly.net/prmt/b37a3d4788a3a4c3f8a92f194d801148" />
          <Show below="1000px">
            <PorMenue
              setPrice={(priceRange) => {
                if (Array.isArray(priceRange) && priceRange.length > 0) {
                  handlePriceFilter(`0:${priceRange[1] || priceRange[0]}`);
                }
              }}
              setSortOption={handleSortChange}
            />
          </Show>
          <div className="product_el_two">
            {products.data && products.data.length > 0 ? (
              products.data.map((el, i) => (
                <Box
                  maxW="sm"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="md"
                  key={i}
                >
                  <div className="proPageImage">
                    <InertiaLink href={route('product.show', {id: el.id})}>
                      <Img src={el.imageUrl} p="3" />
                    </InertiaLink>
                    <InertiaLink href={route('product.show', {id: el.id})}>
                      <span className="prolook">Quicklook</span>
                    </InertiaLink>
                  </div>

                  <Box p="6">
                    <InertiaLink href={route('product.show', {id: el.id})}>
                      <Box
                        mt="1"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        noOfLines={1}
                      >
                        {el.name}
                      </Box>
                      <Box display="flex" mt="2" alignItems="center">
                        {Array(5)
                          .fill("")
                          .map((_, i) => (
                            <StarIcon
                              key={i}
                              color={i < el.stars ? "teal.500" : "gray.300"}
                            />
                          ))}
                      </Box>
                      <Box mt="2" color="gray.600" fontSize="sm">
                        {el.numReviews} reviews
                      </Box>
                      <Box>
                        ${el.price}
                        <Box as="span" color="gray.600" fontSize="sm"></Box>
                      </Box>
                    </InertiaLink>
                  </Box>
                </Box>
              ))
            ) : (
              <Box textAlign="center" p="10">
                <p>No products found matching your criteria.</p>
              </Box>
            )}
          </div>
          {products.data && products.data.length > 0 && (
            <div className="pagination">
              <Button
                disabled={!products.prev_page_url}
                onClick={() => handlePageChange(products.current_page - 1)}
              >
                Prev
              </Button>
              <Button>{products.current_page}</Button>
              <Button
                disabled={!products.next_page_url}
                onClick={() => handlePageChange(products.current_page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
