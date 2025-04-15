import {
  useToast,
  Input,
  Box,
  Grid,
  Img,
  Heading,
  Stack,
  Button,
  InputGroup,
  InputLeftElement,
  Icon,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router, usePage } from "@inertiajs/react";
import { authRegister } from "../../Redux/auth/actions";
import { AUTH_REGISTER_RESET } from "../../Redux/auth/actionTypes";
import DefaultLayout from "../../layouts/default-layout";

interface FormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const initialState: FormData = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

function Signup(): JSX.Element {
  const toast = useToast();
  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const authState = useSelector((state: any) => state.auth.userRegister);
  const { auth } = usePage().props as any;
  const dispatch = useDispatch();

  // Redirect if already logged in
  useEffect(() => {
    if (auth?.user) {
      router.visit("/");
    }
  }, [auth]);

  useEffect(() => {
    if (authState.error) {
      toast({
        title: authState.message || "Registration failed",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      dispatch({ type: AUTH_REGISTER_RESET });
    }

    if (authState.message === "Registration successful") {
      toast({
        title: "Registration successful",
        description: "Redirecting you to login...",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      dispatch({ type: AUTH_REGISTER_RESET });

      setTimeout(() => {
        router.visit("/login");
      }, 2000);
    }
  }, [dispatch, authState, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      dispatch(authRegister(formData));
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <Grid
        w={{ base: "70%", md: "90%" }}
        m="30px auto"
        gap={8}
        templateColumns={{ base: "repeat(1,1fr)", md: "repeat(2,1fr)" }}
      >
        <Box shadow={{ base: "md", md: "none" }} borderRadius="20px" p={4}>
          <Heading textAlign={"center"}>Register to be one of us</Heading>
          <Stack py={8} gap={4} w={{ base: "85%", md: "70%" }} m="auto">
            <FormControl isInvalid={!!errors.name}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaUser} color="gray.600" />}
                />
                <Input
                  type={"text"}
                  onChange={handleChange}
                  name="name"
                  placeholder="Username"
                  value={formData.name}
                />
              </InputGroup>
              {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<EmailIcon color="gray.600" />}
                />
                <Input
                  type="email"
                  onChange={handleChange}
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  required={true}
                />
              </InputGroup>
              {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<LockIcon color="gray.600" />}
                />
                <Input
                  type={"password"}
                  onChange={handleChange}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                />
              </InputGroup>
              {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.password_confirmation}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<LockIcon color="gray.600" />}
                />
                <Input
                  type={"password"}
                  onChange={handleChange}
                  name="password_confirmation"
                  placeholder="Confirm Password"
                  value={formData.password_confirmation}
                />
              </InputGroup>
              {errors.password_confirmation && (
                <FormErrorMessage>{errors.password_confirmation}</FormErrorMessage>
              )}
            </FormControl>

            <Button
              bg={"rgb(88, 88, 88)"}
              onClick={handleSubmit}
              _hover={{ bg: "black" }}
              color={"white"}
              fontSize="18px"
              w={"100%"}
              isLoading={isSubmitting}
            >
              {authState.loading ? "Registering..." : "Register"}
            </Button>
            <Button onClick={() => router.visit("/login")}>
              Already a User ? Login
            </Button>
          </Stack>
        </Box>
        <Box display={{ base: "none", md: "inherit" }}>
          <Img
            w={"100%"}
            h={"100%"}
            objectFit="contain"
            src="https://www.bms.co.in/wp-content/uploads/2015/05/Shopaholic.jpg"
          />
        </Box>
      </Grid>
    </DefaultLayout>
  );
}

export default Signup;
