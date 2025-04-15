import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Home.css";
import { Link as InertiaLink } from "@inertiajs/react";
import DefaultLayout from "../../layouts/default-layout";

interface ResponsiveConfig {
    breakpoint: { max: number; min: number };
    items: number;
    slidesToSlide?: number;
}

const responsive: Record<string, ResponsiveConfig> = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 4.5,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
};

const responsivefeatures: Record<string, ResponsiveConfig> = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 8,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 8,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 4,
        slidesToSlide: 4,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2,
        slidesToSlide: 2,
    },
};

const responsive1: Record<string, ResponsiveConfig> = {
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
    brand: string;
    name: string;
    imageUrl: string;
    category: string;
    price: number;
    originalPrice?: number; // Optional field for original price
    discountPercentage?: number; // Optional field for discount percentage
    stars: number;
    type: string;
    numReviews: number;
}

interface HomeProps {
    products: Record<string, Product[]>;
}

const Home: React.FC<HomeProps> = ({ products }) => {
    const groupedProducts = products || {};

    const chosenForYou = groupedProducts['featured'] || [];
    const justDropped = groupedProducts['new'] || [];
    const sellingFast = groupedProducts['popular'] || [];
    const featuredCategories = groupedProducts['category'] || [];
    const guidanceProducts = groupedProducts['guide'] || [];
    const superDeals = groupedProducts['deals'] ||
        Object.values(groupedProducts)
            .flat()
            .filter(product => product.originalPrice && product.discountPercentage)
            .slice(0, 8);

    return (
        <DefaultLayout title="Home - Wubet Gebeya">
            <div>
                <Carousel
                    responsive={responsive}
                    customTransition="1s"
                    transitionDuration={1000}
                >
                    <div className="HomeSlider">
                        <div>
                            <img
                                src="https://www.sephora.com/contentimages/2022-fragrance-q4-site-home-page-rwd-hero-banner-holiday-value-sets-75-under-us-01..jpg?imwidth=545"
                                alt="sliderImg"
                            />
                            <div className="HomeSlider1">
                                <h1>Fragrance Gifts 1000 Birr & Under</h1>
                                <p>Sets for everyone on your list (including you!)</p>
                                <span>SHOP NOW▸</span>
                            </div>
                        </div>
                    </div>
                    <div className="HomeSlider">
                        <div>
                            <img
                                src="https://www.sephora.com/contentimages/2022-11-29-stock-up-on-dior-site-desktop-mweb-home-page-rwd-hero-banner-1000x750-en-us-can.jpg?imwidth=545"
                                alt="sliderImg"
                            />
                            <div className="HomeSlider2">
                                <h1>Best of Dior</h1>
                                <p>Luxe beauty for everyone on your list. </p>
                                <span>SHOP NOW▸</span>
                            </div>
                        </div>
                    </div>
                    <div className="HomeSlider">
                        <div>
                            <img
                                src="https://www.sephora.com/contentimages/2022-holiday-launch-general-site-desktop-home-page-hero-banner-rwd-v1-product-us-release-1000x750.jpg?imwidth=545"
                                alt="sliderImg"
                            />
                            <div className="HomeSlider3">
                                <h1>Value Sets? Obsessed!</h1>
                                <p>Limited edition and packed full of fun</p>
                                <span>SHOP NOW▸</span>
                            </div>
                        </div>
                    </div>
                    <div className="HomeSlider">
                        <div>
                            <img
                                src="https://www.sephora.com/contentimages/2022-10-29-slotting-just-arrived-v2-standard-site-responsive-home-page-hero-banner-4-product-US-CA-handoff_01.jpg?imwidth=545"
                                alt="sliderImg"
                            />
                            <div className="HomeSlider4">
                                <h1>Fragrance Gifts $75 & Under</h1>
                                <p>Sets for everyone on your list (including you!)</p>
                                <span>SHOP NOW▸</span>
                            </div>
                        </div>
                    </div>
                </Carousel>

                <div className="homePro">
                    <h1 className="homeHead">Super Deals</h1>
                    <p className="homeP">Shop our highest discounted items.</p>
                    <div className="hc1">
                        <Carousel
                            responsive={responsivefeatures}
                            customTransition="1s"
                            transitionDuration={1000}
                        >
                            {superDeals.map((product) => (
                                <InertiaLink href={route('product.show', product.id)} key={product.id}>
                                    <div className="homeFeatures">
                                        <div>
                                            <p>{product.name}</p>
                                            {product.discountPercentage && (
                                                <p className="discount">{product.discountPercentage}% OFF</p>
                                            )}
                                            <div className="price-container">
                                                <span className="current-price">₹{product.price}</span>
                                                {product.originalPrice && (
                                                    <span className="original-price">₹{product.originalPrice}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <img src={product.imageUrl} alt="proImg" />
                                        </div>
                                    </div>
                                </InertiaLink>
                            ))}
                        </Carousel>
                    </div>

                    <h1 className="homeHead">Chosen For You</h1>
                    <div className="hc1">
                        <Carousel
                            responsive={responsive1}
                            customTransition="1s"
                            transitionDuration={1000}
                        >
                            {chosenForYou.map((product) => (
                                <InertiaLink href={route('product.show', product.id)} key={product.id}>
                                    <div className="proCon">
                                        <div>
                                            <img src={product.imageUrl} alt="proImg" />
                                            <span className="homeLook">Quicklook</span>
                                        </div>
                                        <div>
                                            <h1>{product.brand}</h1>
                                            <p>{product.name}</p>
                                            <div className="price-container">
                                                <span className="current-price">₹{product.price}</span>
                                                {product.originalPrice && product.discountPercentage && (
                                                    <>
                                                        <span className="original-price">₹{product.originalPrice}</span>
                                                        <span className="discount">{product.discountPercentage}% OFF</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </InertiaLink>
                            ))}
                        </Carousel>
                    </div>

                    <h1 className="homeHead">Just Dropped</h1>
                    <div className="hc1">
                        <Carousel
                            responsive={responsive1}
                            customTransition="1s"
                            transitionDuration={1000}
                        >
                            {justDropped.map((product) => (
                                <InertiaLink href={route('product.show', product.id)} key={product.id}>
                                    <div className="proCon">
                                        <div>
                                            <img src={product.imageUrl} alt="proImg" />
                                            <span className="homeLook">Quicklook</span>
                                        </div>
                                        <div>
                                            <h1>{product.brand}</h1>
                                            <p>{product.name}</p>
                                            <div className="price-container">
                                                <span className="current-price">₹{product.price}</span>
                                                {product.originalPrice && product.discountPercentage && (
                                                    <>
                                                        <span className="original-price">₹{product.originalPrice}</span>
                                                        <span className="discount">{product.discountPercentage}% OFF</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </InertiaLink>
                            ))}
                        </Carousel>
                    </div>

                    <h1 className="homeHead">Selling Fast</h1>
                    <div className="hc1">
                        <Carousel
                            responsive={responsive1}
                            customTransition="1s"
                            transitionDuration={1000}
                        >
                            {sellingFast.map((product) => (
                                <InertiaLink href={route('product.show', product.id)} key={product.id}>
                                    <div className="proCon">
                                        <div>
                                            <img src={product.imageUrl} alt="proImg" />
                                            <span className="homeLook">Quicklook</span>
                                        </div>
                                        <div>
                                            <h1>{product.brand}</h1>
                                            <p>{product.name}</p>
                                            <div className="price-container">
                                                <span className="current-price">₹{product.price}</span>
                                                {product.originalPrice && product.discountPercentage && (
                                                    <>
                                                        <span className="original-price">₹{product.originalPrice}</span>
                                                        <span className="discount">{product.discountPercentage}% OFF</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </InertiaLink>
                            ))}
                        </Carousel>
                    </div>

                    <h1 className="homeHead">Featured Categories</h1>
                    <p className="homeP">Shop what's popular now.</p>
                    <div className="hc1">
                        <Carousel
                            responsive={responsivefeatures}
                            customTransition="1s"
                            transitionDuration={1000}
                        >
                            {featuredCategories.map((product) => (
                                <InertiaLink href={route('products', { category: product.category })} key={product.id}>
                                    <div className="homeFeatures">
                                        <div>
                                            <p>{product.name}</p>
                                        </div>
                                        <div>
                                            <img src={product.imageUrl} alt="proImg" />
                                        </div>
                                    </div>
                                </InertiaLink>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Home;
