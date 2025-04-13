<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders for the authenticated user.
     */
    public function index()
    {
        $orders = Auth::user()->orders()->with('orderItems.product')->latest()->get();

        return inertia('Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Store a newly created order in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phoneNumber' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zipCode' => 'required|string|max:20',
            'cardNumber' => 'required|string|max:255',
            'expiryDate' => 'required|string|max:10',
            'cvv' => 'required|string|max:5',
            'nameOnCard' => 'required|string|max:255',
        ]);

        // Get user's cart
        $cartItems = Auth::user()->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return back()->withErrors(['error' => 'Your cart is empty']);
        }

        // Calculate cart totals
        $subtotal = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        $tax = $subtotal * 0.10; // 10% tax
        $total = $subtotal + $tax;

        // Start a database transaction
        return DB::transaction(function () use ($request, $cartItems, $subtotal, $tax, $total) {
            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'full_name' => $request->fullName,
                'email' => $request->email,
                'phone_number' => $request->phoneNumber,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'zip_code' => $request->zipCode,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'payment_method' => 'credit_card',
                'payment_status' => 'paid', // For demo purposes
                'order_status' => 'processing',
            ]);

            // Create order items
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                ]);
            }

            // Clear the user's cart
            Auth::user()->cartItems()->delete();

            return redirect()->route('orders.confirmation', $order);
        });
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        // Ensure the user can only see their own orders
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $order->load('orderItems.product');

        return inertia('Orders/Show', [
            'order' => $order
        ]);
    }

    /**
     * Display order confirmation page.
     */
    public function confirmation(Order $order)
    {
        // Ensure the user can only see their own orders
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $order->load('orderItems.product');

        return inertia('Orders/Confirmation', [
            'order' => $order
        ]);
    }
}
