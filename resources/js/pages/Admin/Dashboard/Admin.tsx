import React from "react";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Image,
} from "@chakra-ui/react";
import { Link, usePage } from "@inertiajs/react";
import Logo from "./Logo.jpg";
import {
  FiCompass,
  FiStar,
  FiMenu,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";
import { IconType } from "react-icons";
import Dashboard from "./Dashboard";

// Define interface for auth user data
interface User {
  id: number;
  name: string;
  email: string;
}

interface InertiaPageProps {
  auth: {
    user: User;
  };
  [key: string]: any; // Index signature to satisfy PageProps constraint
}

interface LinkItemProps {
  name: string;
  icon: IconType;
  url: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Dashboard", icon: FiCompass, url: "/admin/dashboard" },
  { name: "Add Product", icon: FiStar, url: "/admin/products/create" },
];

function SidebarWithHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "none", lg: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 0, lg: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  display?: any;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          <Image src={Logo} />
        </Text>
        <CloseButton
          display={{ base: "flex", md: "flex", lg: "none" }}
          onClick={onClose}
        />
      </Flex>
      {LinkItems.map((link, index) => (
        <NavItem url={link.url} key={index} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: string;
  url: string;
}

const NavItem = ({ icon, children, url }: NavItemProps) => {
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
    >
      <Link href={route(url.startsWith('/admin/dashboard') ? 'admin.dashboard' : 'products.create')}>
        {children}
      </Link>
    </Flex>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { auth } = usePage<InertiaPageProps>().props;

  return (
    <Flex
      ml={{ base: 0, md: 0, lg: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {/* <Image
        src='https://i.postimg.cc/hj8VRsGH/5.png'
        /> */}
      </Text>

      <Link href={route('home')} style={{ textDecoration: "none" }}>
        <Flex
          align="center"
          p="2"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "cyan.100",
            color: "black",
          }}
        >
          Home
        </Flex>
      </Link>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm" color="gray.600">
                    {auth.user.name}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>
                <Link href={route('products.create')} style={{ textDecoration: "none" }}>
                  Add Product
                </Link>
              </MenuItem>
              <MenuItem>
                <Link href={route('admin.dashboard')} style={{ textDecoration: "none" }}>
                  Dashboard
                </Link>
              </MenuItem>

              <MenuDivider />
              <MenuItem>
                <Link href={route('logout')} method="post" as="button" style={{ textDecoration: "none", width: "100%", textAlign: "left" }}>
                  Sign Out
                </Link>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

// Main Admin component that uses the SidebarWithHeader and renders Dashboard by default
export default function Admin() {
  return (
    <SidebarWithHeader>
      <Dashboard />
    </SidebarWithHeader>
  );
}
