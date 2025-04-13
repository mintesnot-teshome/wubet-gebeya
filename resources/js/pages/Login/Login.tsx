import {
  Button,
  FormControl,
  FormLabel,
  Img,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router } from '@inertiajs/react';
import { authLogin } from "../../Redux/auth/actions";
import { AUTH_LOGIN_RESET } from "../../Redux/auth/actionTypes";
import { getCart } from "../../Redux/cart/actions";
import DefaultLayout from "../../layouts/default-layout";

interface FormData {
  email: string;
  password: string;
}

interface AuthState {
  userLogin: {
    loading: boolean;
    error: boolean;
    message: string;
  };
  userRegister: {
    loading: boolean;
    error: boolean;
    message: string;
  };
  userLogout: {
    message: string;
  };
  data: {
    isAuthenticated: boolean;
    token: string | null;
    user: any | null;
  };
}

const initialState: FormData = {
  email: "",
  password: "",
};

function Login(): JSX.Element {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState<FormData>(initialState);
  const authState = useSelector((state: any) => state.auth) as AuthState;
  const dispatch = useDispatch();

  useEffect(() => {
    onOpen();
    if (authState.userLogin.message === "User does not exist") {
      toast({
        title: authState.userLogin.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    if (authState.userLogin.message === "Password is incorrect") {
      toast({
        title: authState.userLogin.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    if (authState.userLogin.message === "Login successful") {
      dispatch(getCart());
      toast({
        title: "Login Successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      dispatch({ type: AUTH_LOGIN_RESET });
      setTimeout(() => {
        router.visit('/');
      }, 2000);
    }
  }, [dispatch, onOpen, authState, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    dispatch(authLogin(formData));
  };

  if(authState.data.isAuthenticated) {
    router.visit('/');
    return null;
  }

  return (
    <DefaultLayout>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "lg" }}>
        <ModalOverlay
          onClick={() => {
            router.visit("/");
          }}
        />
        <ModalContent>
          <ModalHeader>Login / Start Shopping</ModalHeader>
          <Img src="https://shopyourwardrobe.com/wp-content/uploads/2013/01/cost-of-being-a-shopaholic.jpg" />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="email"
                name="email"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="password"
                name="password"
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue" mr={3}>
              Login
            </Button>
            <Button
              onClick={() => {
                onClose();
                router.visit("/");
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}

export default Login;
