<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Display the current user's cart
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // In a full implementation, this would retrieve the user's cart items from database
        // For now, we'll retrieve the cart from session
        $cartItems = session()->get('cart', []);

        return response()->json(['cart' => $cartItems]);
    }

    /**
     * Add a product to the cart
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addToCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::findOrFail($request->product_id);
        $cart = session()->get('cart', []);

        // Check if product already exists in cart
        $found = false;
        foreach ($cart as &$item) {
            if ($item['product_id'] == $product->id) {
                $item['quantity'] += $request->quantity;
                $found = true;
                break;
            }
        }

        // If product not found in cart, add it
        if (!$found) {
            $cart[] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $request->quantity,
                'imageUrl' => $product->imageUrl,
            ];
        }

        session()->put('cart', $cart);

        return response()->json(['message' => 'Product added to cart', 'cart' => $cart]);
    }

    /**
     * Update cart item quantity
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateCartItem(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cart = session()->get('cart', []);
        $updated = false;

        foreach ($cart as &$item) {
            if ($item['product_id'] == $id) {
                $item['quantity'] = $request->quantity;
                $updated = true;
                break;
            }
        }

        if (!$updated) {
            return response()->json(['message' => 'Product not found in cart'], 404);
        }

        session()->put('cart', $cart);

        return response()->json(['message' => 'Cart updated', 'cart' => $cart]);
    }

    /**
     * Remove product from cart
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function removeFromCart($id)
    {
        $cart = session()->get('cart', []);
        $newCart = array_filter($cart, function($item) use ($id) {
            return $item['product_id'] != $id;
        });

        session()->put('cart', array_values($newCart));

        return response()->json(['message' => 'Product removed from cart', 'cart' => array_values($newCart)]);
    }
}
