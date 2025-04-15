import {
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_REGISTER_FAILURE,
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
  AUTH_LOGOUT,
} from "./actionTypes";
import axios from "axios";
import { Dispatch } from "redux";
import { router } from '@inertiajs/react';

// Set axios to use CSRF protection for Laravel
axios.defaults.withCredentials = true;

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface LoginData {
  email: string;
  password: string;
}

// This function synchronizes Redux auth state with Laravel's auth state
export const syncAuthState = (user: any) => ({
  type: AUTH_LOGIN_SUCCESS,
  payload: {
    user,
    isAuthenticated: !!user,
  },
});

export const authRegister = (data: RegisterData) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: AUTH_REGISTER_REQUEST });

    // Get CSRF token first
    await axios.get('/sanctum/csrf-cookie');

    // Use Laravel's registration endpoint
    await router.post('/register', data, {
      onSuccess: () => {
        dispatch({
          type: AUTH_REGISTER_SUCCESS,
          payload: {
            message: 'Registration successful',
          },
        });
      },
      onError: (errors) => {
        dispatch({
          type: AUTH_REGISTER_FAILURE,
          payload: {
            message: 'Registration failed',
            errors,
          },
        });
      }
    });
  } catch (error: any) {
    dispatch({
      type: AUTH_REGISTER_FAILURE,
      payload: {
        message: error.response?.data?.message || 'Registration failed',
      },
    });
  }
};

export const authLogin = (data: LoginData) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: AUTH_LOGIN_REQUEST });

    // Get CSRF token first for Laravel
    await axios.get('/sanctum/csrf-cookie');

    // Use Inertia's router to handle login with Laravel
    await router.post('/login', {
      email: data.email,
      password: data.password,
      remember: true // Set remember me by default
    }, {
      onSuccess: (page) => {
        const user = page.props?.auth?.user;

        dispatch({
          type: AUTH_LOGIN_SUCCESS,
          payload: {
            user,
            isAuthenticated: true,
            message: 'Login successful',
          },
        });
      },
      onError: (errors) => {
        let errorMessage = 'Login failed';

        if (errors.email) {
          errorMessage = errors.email;
        } else if (errors.password) {
          errorMessage = errors.password;
        }

        dispatch({
          type: AUTH_LOGIN_FAILURE,
          payload: {
            message: errorMessage,
          },
        });
      }
    });
  } catch (error: any) {
    dispatch({
      type: AUTH_LOGIN_FAILURE,
      payload: {
        message: error.response?.data?.message || 'Login failed',
      },
    });
  }
};

export const authLogout = () => async (dispatch: Dispatch) => {
  try {
    // Use Laravel's logout endpoint
    await router.post('/logout');

    dispatch({ type: AUTH_LOGOUT });
  } catch (error: any) {
    console.error('Logout failed:', error);
  }
};
