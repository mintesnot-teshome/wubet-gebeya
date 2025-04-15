import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Portal, useToast, Box, Badge } from '@chakra-ui/react';
import { Link as InertiaLink, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { BsBag } from 'react-icons/bs';
import { FaBars } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { RiAdminFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../../Redux/cart/actions';
import { authLogout } from '../../Redux/auth/actions';
import Logo from './Logo.png';
import logo2 from './logo2.png';
import './Navbar.css';
import SearchBar from './SearchBar';

interface AuthState {
  data: {
    isAuthenticated: boolean;
    user: {
      id: number;
      name: string;
      email: string;
    } | null;
  };
}

interface RootState {
  auth: AuthState;
}

const Navbar = (): JSX.Element => {
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    const toast = useToast();
    const [cartItemCount, setCartItemCount] = useState(0);

    // Get Inertia auth state directly
    const { auth: inertiaAuth } = usePage().props as any;
    const isAuthenticated = inertiaAuth?.user || auth?.data?.isAuthenticated;

    useEffect(() => {
        if (isAuthenticated) {
            // Legacy Redux call - kept for compatibility
            dispatch(getCart());

            // Fetch cart count from Laravel backend
            fetchCartCount();

            // Add event listener for cart updates
            const handleCartUpdate = (event: CustomEvent) => {
                setCartItemCount(event.detail.count);
            };

            // Add event listener for the custom cart-updated event
            window.addEventListener('cart-updated', handleCartUpdate as EventListener);

            // Clean up the event listener when component unmounts
            return () => {
                window.removeEventListener('cart-updated', handleCartUpdate as EventListener);
            };
        } else {
            setCartItemCount(0);
        }
    }, [dispatch, isAuthenticated]);

    const fetchCartCount = async () => {
        try {
            const response = await fetch(route('cart.count'));
            const data = await response.json();
            setCartItemCount(data.count);
        } catch (error) {
            console.error('Failed to fetch cart count:', error);
        }
    };

    const navigateTo = (path: string): void => {
        router.visit(path);
    };

    return (
        <div>
            <nav className="nav1">
                <InertiaLink href={route('register')}>
                    <p className="navDis">
                        Get FREE shipping on all orders when you join Beauty Insider. Exclusions/terms apply.<b>† LEARN MORE</b>▸
                    </p>
                </InertiaLink>
            </nav>
            <nav className="nav2">
                <div>
                    <div className="navLogo">
                        <InertiaLink href={route('home')}>
                            <img src={Logo} alt="logo" className="navLogo1" />
                            <img src={logo2} alt="logo" className="navLogo2" />
                        </InertiaLink>
                    </div>
                    <div>
                        <SearchBar />
                    </div>
                    <div className="navIcons">
                        <div>
                            {isAuthenticated ? (
                                <RiAdminFill fontSize="20px" onClick={() => navigateTo(route('admin.dashboard'))} />
                            ) : (
                                <RiAdminFill fontSize="20px" onClick={() => {
                                    toast({
                                        title: 'Login Required',
                                        description: 'Please login to access admin panel',
                                        status: 'warning',
                                        duration: 3000,
                                        isClosable: true,
                                        position: 'top',
                                    });
                                    router.visit(route('login'));
                                }} />
                            )}
                        </div>
                        |
                        <div style={{ position: 'relative' }}>
                            {isAuthenticated ? (
                                <Box position="relative" display="inline-block">
                                    <BsBag fontSize="20px" onClick={() => navigateTo(route('cart'))} cursor="pointer" />
                                    {cartItemCount > 0 && (
                                        <Badge
                                            colorScheme="red"
                                            borderRadius="full"
                                            position="absolute"
                                            top="-8px"
                                            right="-8px"
                                            fontSize="0.7em"
                                        >
                                            {cartItemCount}
                                        </Badge>
                                    )}
                                </Box>
                            ) : (
                                <BsBag fontSize="20px" onClick={() => {
                                    toast({
                                        title: 'Login Required',
                                        description: 'Please login to view your cart',
                                        status: 'warning',
                                        duration: 3000,
                                        isClosable: true,
                                        position: 'top',
                                    });
                                    router.visit(route('login'));
                                }} />
                            )}
                        </div>
                        |
                        <div>
                            <p>
                                <InertiaLink href={route('register')}>
                                    <AiOutlineUser fontSize="20px" />
                                </InertiaLink>
                                {isAuthenticated ? (
                                    <Button
                                        h="30px"
                                        w="60px"
                                        className="navLogout"
                                        onClick={() => {
                                            dispatch(authLogout());
                                            toast({
                                                title: 'Logged out successfully',
                                                status: 'success',
                                                duration: 3000,
                                                isClosable: true,
                                                position: 'top',
                                            });
                                        }}
                                    >
                                        Logout
                                    </Button>
                                ) : (
                                    <span className="navLogin">
                                        <Popover>
                                            <PopoverTrigger>
                                                <Button>Get Started</Button>
                                            </PopoverTrigger>
                                            <Portal className="xxx">
                                                <PopoverContent>
                                                    <PopoverArrow />
                                                    <PopoverCloseButton />
                                                    <PopoverBody>
                                                        <InertiaLink href={route('login')} className="xxx">
                                                            <Button colorScheme="blue">Login</Button>
                                                        </InertiaLink>
                                                        <br></br>
                                                        <br></br>
                                                        <InertiaLink href={route('register')}>
                                                            <Button colorScheme="blue">Sign Up</Button>
                                                        </InertiaLink>
                                                    </PopoverBody>
                                                </PopoverContent>
                                            </Portal>
                                        </Popover>
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </nav>
            <nav className="nav3">
                <div className="navWrapper">
                    <input type="radio" name="slide" id="menuBtn" />
                    <input type="radio" name="slide" id="cancelBtn" />

                    <ul className="navLink">
                        <label htmlFor="cancelBtn" className="btn navCancel">
                            <MdOutlineCancel />
                        </label>
                        <li>
                            <InertiaLink href={route('products', { sort: 'newest' })} className="desktopItem">
                                New
                            </InertiaLink>
                            <input type="checkbox" id="showMega" />
                            <InertiaLink href={route('products', { sort: 'newest' })}>
                                <label htmlFor="showMega" className="mobileItem">
                                    New
                                </label>
                            </InertiaLink>
                            <div className="megaBox">
                                <div className="contentBox">
                                    <div className="rowBox">
                                        <header className="navHeader">All New</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { sort: 'newest' })}>Just Dropped</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', sort: 'newest' })}>New Makeup</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', sort: 'newest' })}>New Skincare</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', sort: 'newest' })}>New Haircare</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'fragrance', sort: 'newest' })}>New Fragrance</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'bath', sort: 'newest' })}>New Bath & Body</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'tools', sort: 'newest' })}>Tools & Brushes</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <header className="navHeader">All Products</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href="">The Next Big Thing</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href="">Bestsellers</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href="">Quizzes & Buying Guides</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href="">Clean Beauty Guide</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href="">Clean+ Planet</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <img
                                            src="https://www.sephora.com/contentimages/2022-holiday-launch-general-site-desktop-global-navigation-button-holiday-hub-us-can-release.jpg?imwidth=590"
                                            alt=""
                                        />
                                    </div>
                                    <div className="rowBox">
                                        <img
                                            src="https://www.sephora.com/contentimages/meganav/large/2022-6-9-haus-lady-gaga-bundle-b-site-desktop-global-navigation-button-en-us-can.jpg?imwidth=294"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <InertiaLink href={route('products', { category: 'makeup' })} className="desktopItem">
                                Make Up
                            </InertiaLink>
                            <div className="megaBox">
                                <div className="contentBox">
                                    <div className="rowBox">
                                        <header className="navHeader">All Makeup</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'face' })}>Face Foundation</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'face' })}>BB & CC Creams</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'face' })}>Tinted Moisturizer</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'face' })}>Concealer</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'face' })}>Face Primer</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'face' })}>Contour Color</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'face' })}>Correct Face Sets</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <header className="navHeader">Eye</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'eye' })}>Eye Palettes</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'eye' })}>Mascara</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'eye' })}>Eyeliner</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'eye' })}>Eyebrow</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'eye' })}>Eyelash Serums</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'eye' })}>Eye Primer</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'eye' })}>Eye Sets</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <header className="navHeader">Lip</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'lip' })}>Lipstick</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'lip' })}>Lip Gloss</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'lip' })}>Lip Balm & Treatment</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'lip' })}>Liquid Lipstick</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'lip' })}>Lip Stain</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'lip' })}>Lip Liner</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'lip' })}>Lip Plumper</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <header className="navHeader">Cheek</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'cheek' })}>Blush</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'cheek' })}>Bronzer</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'cheek' })}>Highlighter</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'cheek' })}>Contour</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'cheek' })}>Accessories</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'cheek' })}>Makeup Palettes</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', type: 'cheek' })}>Cheek Palettes</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <header className="navHeader">New</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href="">Bestsellers</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href="">Clean Makeup</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href="">Vegan Makeup</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href="">Mini Size</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href="">Value Size</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href=""> Sephora Collection</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <InertiaLink href={route('products', { category: 'skincare' })} className="desktopItem">
                                Skincare
                            </InertiaLink>
                            <div className="megaBox">
                                <div className="contentBox">
                                    <div className="rowBox">
                                        <header className="navHeader">All Skincare</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'moisturizers' })}>Moisturizers</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'moisturizers' })}>Night Creams</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'moisturizers' })}>Face Oils</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'moisturizers' })}>Mists & Essences</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'moisturizers' })}>BB & CC</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'cleansers' })}>Creams Cleansers</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'cleansers' })}>Exfoliators</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <header className="navHeader">Treatments</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'treatments' })}>Face Serums</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'treatments' })}>Blemish & Acne</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'treatments' })}>Facial Peels</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'masks' })}>Face Masks</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'masks' })}>Sheet Masks</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'masks' })}>Masks</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'masks' })}>Eye Masks</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <header className="navHeader">Eye Care</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'eye' })}>Eye Creams</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'eye-mask' })}>Eye Masks</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'sunscreen' })}>Sunscreen</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'lip' })}>Lip Balms</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'wellness' })}>Wellness</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'tech' })}>High Tech Tools</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'body-sun' })}>Body Sunscreen</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <header className="navHeader">Shop by Concern</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'acne' })}>Acne & Blemishes</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'anti-aging' })}>Anti-Aging</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'dark-spots' })}>Dark Spots</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'pores' })}>Pores</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'dry' })}>Dryness</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'wrinkles' })}>Fine Lines & Wrinkles</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', type: 'dull' })}>Dullness</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <img
                                            src="https://www.sephora.com/contentimages/meganav/large/2020-12-23-site-dt-botnav-seph-coll-US.jpg?imwidth=294"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <InertiaLink href={route('products', { category: 'hair' })} className="desktopItem">
                                Hair
                            </InertiaLink>
                            <div className="megaBox">
                                <div className="contentBox">
                                    <div className="rowBox">
                                        <header className="navHeader">All Hair</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', type: 'shampoo' })}>Shampoo</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', type: 'conditioner' })}>Conditioner</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', type: 'scalp' })}>Scalp Scrub</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', type: 'oil' })}>Hair oil</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <header className="navHeader">Treatments</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', type: 'mask' })}>Hair Masks</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', type: 'leave-in' })}>Leave-in Conditioners</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', type: 'oil' })}>Hair Oil</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', type: 'serum' })}>Hair Serums</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', type: 'scalp' })}>Scalp Treatments</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', type: 'supplement' })}>Hair Supplements</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', type: 'thinning' })}>Thinning & Hair Loss</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <header className="navHeader">Popular Categories</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', sort: 'newest' })}>New Arrivals</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', sort: 'popular' })}>Bestsellers</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', type: 'clean' })}>Clean Hair</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', type: 'luxury' })}>Luxury Hair</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <img
                                            src="https://www.sephora.com/productimages/sku/s2266765-main-zoom.jpg?pb=2020-03-sephora-clean-2019&imwidth=230"
                                            alt=""
                                        />
                                    </div>
                                    <div className="rowBox">
                                        <img
                                            src="https://www.sephora.com/contentimages/meganav/large/slotting-sale-generic-site-desktop-global-navigation-button_copy-only.jpg?imwidth=294"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <InertiaLink href={route('products', { category: 'fragrance' })} className="desktopItem">
                                Fragrance
                            </InertiaLink>
                            <div className="megaBox">
                                <div className="contentBox">
                                    <div className="rowBox">
                                        <header className="navHeader">All Fragrances</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'fragrance', sort: 'newest' })}>Just Dropped</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'fragrance', type: 'perfume' })}>Perfume</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'fragrance', type: 'cologne' })}>Cologne</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'fragrance', type: 'mist' })}>Body Mists</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'fragrance', type: 'set' })}>Fragrance Sets</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'fragrance', type: 'travel' })}>Travel Size</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'fragrance', type: 'candle' })}>Candles & Home</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <header className="navHeader">Shop By</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'fragrance', sort: 'popular' })}>Bestsellers</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'fragrance', type: 'clean' })}>Clean Fragrance</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'fragrance', type: 'vegan' })}>Vegan</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'fragrance', type: 'mini' })}>Mini Size</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'fragrance', type: 'luxury' })}>Luxury</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <img src="https://www.sephora.com/productimages/sku/s1377159-main-zoom.jpg?imwidth=230" alt="" />
                                    </div>
                                    <div className="rowBox">
                                        <img src="https://www.sephora.com/productimages/sku/s513168-main-zoom.jpg?imwidth=230" alt="" />
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <InertiaLink href={route('products', { category: 'tools' })} className="desktopItem">
                                Tools & Brushes
                            </InertiaLink>
                            <div className="megaBox">
                                <div className="contentBox">
                                    <div className="rowBox">
                                        <header className="navHeader">Tools & Brushes</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'tools', sort: 'newest' })}>Just Dropped</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'tools', type: 'brush' })}>Makeup Brushes</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'tools', type: 'applicator' })}>Makeup Applicators</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'tools', type: 'hair' })}>Hair Tools</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'tools', type: 'skincare' })}>Skincare Tools</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'tools', type: 'tech' })}>Beauty Tech</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'tools', type: 'accessories' })}>Accessories</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <header className="navHeader">Popular Categories</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'tools', sort: 'popular' })}>Bestsellers</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'tools', type: 'face' })}>Face Tools</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'tools', type: 'eye' })}>Eye Brushes</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'tools', type: 'blush' })}>Blush Brushes</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'tools', type: 'sets' })}>Brush Sets</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <img
                                            src="https://www.sephora.com/contentimages/2022-holiday-launch-general-site-desktop-global-navigation-button-holiday-hub-us-can-release.jpg?imwidth=590"
                                            alt=""
                                        />
                                    </div>
                                    <div className="rowBox">
                                        <img
                                            src="https://www.sephora.com/contentimages/meganav/large/2022-6-9-haus-lady-gaga-bundle-b-site-desktop-global-navigation-button-en-us-can.jpg?imwidth=294"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <InertiaLink href={route('products', { category: 'bath' })} className="desktopItem">
                                Bath & Body
                            </InertiaLink>
                            <div className="megaBox">
                                <div className="contentBox">
                                    <div className="rowBox">
                                        <header className="navHeader">Bath & Body</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'bath', sort: 'newest' })}>Just Dropped</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'bath', type: 'lotion' })}>Body Lotions</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'bath', type: 'wash' })}>Body Wash</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'bath', type: 'scrub' })}>Body Scrubs</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'bath', type: 'oil' })}>Body Oils</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'bath', type: 'butter' })}>Body Butter</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'bath', type: 'mist' })}>Body Mists</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <header className="navHeader">Popular Categories</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'bath', sort: 'popular' })}>Bestsellers</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'bath', type: 'clean' })}>Clean Bath & Body</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'bath', type: 'sets' })}>Bath & Body Sets</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'bath', type: 'travel' })}>Travel Size</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'bath', type: 'hand' })}>Hand Sanitizers</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <img
                                            src="https://www.sephora.com/contentimages/2022-holiday-launch-general-site-desktop-global-navigation-button-holiday-hub-us-can-release.jpg?imwidth=590"
                                            alt=""
                                        />
                                    </div>
                                    <div className="rowBox">
                                        <img
                                            src="https://www.sephora.com/contentimages/meganav/large/2022-6-9-haus-lady-gaga-bundle-b-site-desktop-global-navigation-button-en-us-can.jpg?imwidth=294"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <InertiaLink href={route('products', { max_price: 20 })} className="desktopItem">
                                Beauty Under 200 Birr
                            </InertiaLink>
                            <div className="megaBox">
                                <div className="contentBox">
                                    <div className="rowBox">
                                        <header className="navHeader">Beauty Under $20</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { category: 'makeup', max_price: 20 })}>Makeup Under $20</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'skincare', max_price: 20 })}>Skincare Under $20</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'hair', max_price: 20 })}>Hair Under $20</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'fragrance', max_price: 20 })}>Fragrance Under $20</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'bath', max_price: 20 })}>Bath & Body Under $20</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { category: 'tools', max_price: 20 })}>Tools Under $20</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <header className="navHeader">Popular Under $20</header>
                                        <ul className="linkBox">
                                            <li>
                                                <InertiaLink href={route('products', { max_price: 10 })}>Under $10</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { max_price: 15 })}>Under $15</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { sort: 'popular', max_price: 20 })}>Bestsellers Under $20</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { sort: 'newest', max_price: 20 })}>New Arrivals Under $20</InertiaLink>
                                            </li>
                                            <li>
                                                <InertiaLink href={route('products', { max_price: 20 })}>All Under $20</InertiaLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rowBox">
                                        <img
                                            src="https://www.sephora.com/contentimages/2022-holiday-launch-general-site-desktop-global-navigation-button-holiday-hub-us-can-release.jpg?imwidth=590"
                                            alt=""
                                        />
                                    </div>
                                    <div className="rowBox">
                                        <img
                                            src="https://www.sephora.com/contentimages/meganav/large/2022-6-9-haus-lady-gaga-bundle-b-site-desktop-global-navigation-button-en-us-can.jpg?imwidth=294"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <label htmlFor="menuBtn" className="btn navMenu">
                        <FaBars />
                    </label>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
