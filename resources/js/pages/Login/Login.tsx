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
  FormErrorMessage,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router, usePage } from '@inertiajs/react';
import { authLogin } from "../../Redux/auth/actions";
import { AUTH_LOGIN_RESET } from "../../Redux/auth/actionTypes";
import { getCart } from "../../Redux/cart/actions";
import DefaultLayout from "../../layouts/default-layout";

interface FormData {
  email: string;
  password: string;
}

const initialState: FormData = {
  email: "",
  password: "",
};

function Login(): JSX.Element {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const authState = useSelector((state: any) => state.auth);
  const { auth } = usePage().props as any;
  const dispatch = useDispatch();

  useEffect(() => {
    onOpen();

    // Handle login success message from authState
    if (authState.userLogin?.message === "Login successful") {
      dispatch(getCart());
      toast({
        title: "Login Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      dispatch({ type: AUTH_LOGIN_RESET });

      // Navigate home after successful login
      setTimeout(() => {
        onClose();
        router.visit('/');
      }, 1500);
    }

    // Handle error messages
    if (authState.userLogin?.error) {
      toast({
        title: authState.userLogin.message || "Login failed",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }, [dispatch, onOpen, authState, toast]);

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (auth?.user) {
      router.visit('/');
    }
  }, [auth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Basic validation
    const newErrors: any = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      dispatch(authLogin(formData));
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="email"
                name="email"
                onChange={handleChange}
              />
              {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
            </FormControl>

            <FormControl mt={4} isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="password"
                name="password"
                onChange={handleChange}
              />
              {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={handleSubmit}
              colorScheme="blue"
              mr={3}
              isLoading={isSubmitting}
            >
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
