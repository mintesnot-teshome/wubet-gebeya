import {
  ADD_TO_CART_FAILURE,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  GET_CART_FAILURE,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  REMOVE_FROM_CART_FAILURE,
  REMOVE_FROM_CART_REQUEST,
  REMOVE_FROM_CART_SUCCESS,
  UPDATE_CART_FAILURE,
  UPDATE_CART_REQUEST,
  UPDATE_CART_SUCCESS,
} from "./actionTypes";
import axios from 'axios';
import { router } from '@inertiajs/react';

// Set axios to use CSRF protection
axios.defaults.withCredentials = true;

export const getCart = () => async (dispatch) => {
  try {
    dispatch({ type: GET_CART_REQUEST });

    const res = await axios.get('/api/cart/count');
    const data = res.data;

    dispatch({ type: GET_CART_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_CART_FAILURE,
    });
  }
};

export const addProductToCart = (id, value) => async (dispatch) => {
  try {
    dispatch({ type: ADD_TO_CART_REQUEST });

    const res = await axios.post('/cart/add', {
      product_id: id,
      quantity: value
    });

    const data = res.data;

    dispatch({
      type: ADD_TO_CART_SUCCESS,
      payload: {
        newCartItem: data.cartItem,
        message: data.message || 'Product added to cart'
      },
    });

    // Refresh cart count
    dispatch(getCart());
  } catch (error) {
    dispatch({
      type: ADD_TO_CART_FAILURE,
      payload: { message: error.response?.data?.message || 'Failed to add to cart' },
    });
  }
};

export const updateProductInCart = (id, quantity) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CART_REQUEST });

    const res = await axios.put(`/cart/update/${id}`, {
      quantity: quantity
    });

    const data = res.data;

    dispatch({
      type: UPDATE_CART_SUCCESS,
      payload: {
        quantity,
        id,
        message: data.message || 'Cart updated successfully'
      },
    });

    // Refresh cart count
    dispatch(getCart());
  } catch (error) {
    dispatch({
      type: UPDATE_CART_FAILURE,
      payload: { message: error.response?.data?.message || 'Failed to update cart' },
    });
  }
};

export const removeProductFromCart = (id) => async (dispatch) => {
  try {
    dispatch({ type: REMOVE_FROM_CART_REQUEST });

    const res = await axios.delete(`/cart/remove/${id}`);
    const data = res.data;

    dispatch({
      type: REMOVE_FROM_CART_SUCCESS,
      payload: {
        id,
        message: data.message || 'Item removed from cart'
      },
    });

    // Refresh cart count
    dispatch(getCart());
  } catch (error) {
    dispatch({
      type: REMOVE_FROM_CART_FAILURE,
      payload: { message: error.response?.data?.message || 'Failed to remove from cart' },
    });
  }
};
