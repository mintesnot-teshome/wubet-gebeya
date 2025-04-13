<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cartItems = Auth::user()->cartItems()->with('product')->get();

        // Calculate cart totals
        $subtotal = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        $tax = $subtotal * 0.10; // 10% tax
        $total = $subtotal + $tax;

        return Inertia::render('Cart/Cart', [
            'cartItems' => $cartItems,
            'cartSummary' => [
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'itemCount' => $cartItems->sum('quantity')
            ]
        ]);
    }

    /**
     * Add a product to the user's cart.
     */
    public function addToCart(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $userId = Auth::id();

        // Check if product already exists in cart
        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($cartItem) {
            // Update quantity if product already in cart
            $cartItem->quantity += $validated['quantity'];
            $cartItem->save();
        } else {
            // Create new cart item
            CartItem::create([
                'user_id' => $userId,
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity']
            ]);
        }

        return redirect()->back()
            ->with('success', 'Product added to cart successfully');
    }

    /**
     * Update the specified cart item.
     */
    public function updateCartItem(Request $request, string $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = CartItem::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $cartItem->quantity = $validated['quantity'];
        $cartItem->save();

        return redirect()->back()
            ->with('success', 'Cart updated successfully');
    }

    /**
     * Remove the specified cart item.
     */
    public function removeFromCart(string $id)
    {
        $cartItem = CartItem::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $cartItem->delete();

        return redirect()->back()
            ->with('success', 'Item removed from cart');
    }

    /**
     * Clear the current user's cart.
     */
    public function clearCart()
    {
        Auth::user()->cartItems()->delete();

        return redirect()->back()
            ->with('success', 'Cart cleared successfully');
    }

    /**
     * Get the current user's cart count for the header display.
     */
    public function getCartCount()
    {
        $count = Auth::check()
            ? Auth::user()->cartItems()->sum('quantity')
            : 0;

        return response()->json([
            'count' => $count
        ]);
    }
}
