import {
    Box,
    Flex,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    useToast,
    Button,
} from '@chakra-ui/react';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { AiOutlineStar } from 'react-icons/ai';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { TiTick } from 'react-icons/ti';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import DefaultLayout from "../../layouts/default-layout";
import './SingleProduct.css';

const responsive1 = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 9,
        slidesToSlide: 9,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 6,
        slidesToSlide: 6,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3,
        slidesToSlide: 3,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2,
        slidesToSlide: 2,
    },
};

interface Product {
    id: number;
    name: string;
    brand: string;
    imageUrl: string;
    category: string;
    price: number;
    stars: number;
    numReviews: number;
    type: string;
}

interface PageProps {
    product: Product;
    similarProducts: Product[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

function SingleProduct() {
    const [value, setValue] = useState(1);
    const { product, similarProducts, auth } = usePage<PageProps>().props;

    const handleChange = (value) => setValue(value);
    const toast = useToast();

    const addToCart = () => {
        if (!auth.user) {
            // Not logged in
            toast({
                title: 'Login Required',
                description: 'Please login to add products to your cart',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top',
            });

            setTimeout(() => {
                router.visit('/login');
            }, 1500);
            return;
        }

        router.post(route('cart.add'), {
            product_id: product.id,
            quantity: value
        }, {
            onSuccess: () => {
                toast({
                    title: 'Product Added',
                    description: 'We have added your product to Basket',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top',
                });
            },
            onError: () => {
                toast({
                    title: 'Error',
                    description: 'Could not add product to cart',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top',
                });
            },
            preserveState: true,
        });
    };

    const ratingStar = Array.from({ length: 5 }, (elem, index) => {
        let number = index + 0.5;
        const stars = product?.stars || 0;
        return <span key={index}>
            {stars >= index + 1 ? <FaStar /> : stars >= number ? <FaStarHalfAlt /> : <AiOutlineStar />}
        </span>;
    });

    if (!product) {
        return (
            <DefaultLayout>
                <div className="skeleton">
                    <div>
                        <Skeleton h="full">
                            <div>contents wrapped</div>
                            <div>won't be visible</div>
                        </Skeleton>
                    </div>
                    <div>
                        <Box padding="6" boxShadow="lg" bg="white">
                            <SkeletonCircle size="10" />
                            <SkeletonText mt="4" noOfLines={4} spacing="4" />
                        </Box>
                        <Box padding="6" boxShadow="lg" bg="white">
                            <SkeletonCircle size="10" />
                            <SkeletonText mt="4" noOfLines={4} spacing="4" />
                        </Box>
                        <Box padding="6" boxShadow="lg" bg="white">
                            <SkeletonCircle size="10" />
                            <SkeletonText mt="4" noOfLines={4} spacing="4" />
                        </Box>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <>
            <DefaultLayout>
                <div className="singleProduct">
                    <div className="singleImage">
                        <img src={product.imageUrl} alt="productImage" />
                    </div>
                    <div>
                        <div className="proNames">
                            <h1>{product.brand}</h1>
                            <p>{product.name}</p>
                        </div>
                        <div className="proRatings">
                            {ratingStar}
                            {product.stars || 0}
                        </div>
                        <span className="proreviews">( {product.numReviews || 0} Customer reviews )</span>
                        <div className="proPrices">
                            <p>
                                Original Price : <span className="proOld">$ {((product.price || 0) + (product.price || 0) / 10).toFixed(2)}</span>
                            </p>
                            <p>
                                Sale Price : <span>$ {product.price.toFixed(2)} (10% off)</span>
                            </p>
                        </div>
                        <div className="proDetails">
                            <h1>About The Product :</h1>
                            <ul>
                                <li>
                                    <span className="proTick">
                                        <TiTick />
                                    </span>
                                    Color : <span>All colors available</span>
                                </li>
                                <li>
                                    <span className="proTick">
                                        <TiTick />
                                    </span>
                                    Available : <span>In Stock</span>
                                </li>
                                <li>
                                    <span className="proTick">
                                        <TiTick />
                                    </span>
                                    Category : <span>{product.category}</span>
                                </li>
                                <li>
                                    <span className="proTick">
                                        <TiTick />
                                    </span>
                                    Shipping Area : <span>All over the world</span>
                                </li>
                                <li>
                                    <span className="proTick">
                                        <TiTick />
                                    </span>
                                    Shipping fee : <span>Free shipping</span>
                                </li>
                            </ul>
                        </div>
                        <div className="proQuantity">
                            <p>Quantity :</p>
                            <Flex className="proSlider">
                                <NumberInput
                                    maxW="100px"
                                    mr="2rem"
                                    value={value}
                                    onChange={handleChange}
                                    zIndex="0"
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <Slider
                                    flex="1"
                                    focusThumbOnChange={true}
                                    value={value}
                                    onChange={handleChange}
                                    zIndex="0"
                                >
                                    <SliderTrack>
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb fontSize="sm" boxSize="32px" children={value} />
                                </Slider>
                            </Flex>
                            <div className="selector">
                                <Select placeholder="Select Size" width="xs" zIndex="0">
                                    <option value="option1">Small</option>
                                    <option value="option2">Medium</option>
                                    <option value="option3">Large</option>
                                </Select>
                            </div>
                        </div>
                        <div className="proAdd">
                            {auth.user ? (
                                <button onClick={addToCart}>
                                    Add to Basket
                                </button>
                            ) : (
                                <Link href={route('login')}>
                                    <button>Login to add to Basket</button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="proContainer">
                    <h1 className="homeHead">You may also like</h1>
                    <div className="hc1">
                        <Carousel responsive={responsive1} customTransition="1s" transitionDuration={1000}>
                            {similarProducts.map((product) => (
                                <div key={product.id} className="proCon">
                                    <Link href={route('product.show', {id: product.id})}>
                                        <div>
                                            <img src={product.imageUrl} alt="proImg" />
                                            <span className="homeLook">Quicklook</span>
                                        </div>
                                        <div>
                                            <h1>{product.brand}</h1>
                                            <p>{product.name}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </DefaultLayout>
        </>
    );
}

export default SingleProduct;
