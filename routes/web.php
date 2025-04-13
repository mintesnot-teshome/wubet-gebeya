<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

// Main e-commerce routes
Route::get('/', [ProductController::class, 'index'])->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products'); // Added products route
Route::get('/products/{id}', [ProductController::class, 'show'])->name('product.show');

// Cart routes - protected by auth middleware
Route::middleware(['auth'])->group(function () {
    // Cart routes
    Route::get('/cart', [CartController::class, 'index'])->name('cart');
    Route::post('/cart/add', [CartController::class, 'addToCart'])->name('cart.add');
    Route::put('/cart/update/{id}', [CartController::class, 'updateCartItem'])->name('cart.update');
    Route::delete('/cart/remove/{id}', [CartController::class, 'removeFromCart'])->name('cart.remove');
    Route::delete('/cart/clear', [CartController::class, 'clearCart'])->name('cart.clear');
    Route::get('/cart/count', [CartController::class, 'getCartCount'])->name('cart.count');

    // Order routes
    Route::get('/checkout', function() {
        // Get cart summary for checkout
        $cartItems = Auth::user()->cartItems()->with('product')->get();
        $subtotal = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });
        $tax = $subtotal * 0.10; // 10% tax
        $total = $subtotal + $tax;

        return Inertia::render('Checkout/Checkout', [
            'cartSummary' => [
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'itemCount' => $cartItems->sum('quantity')
            ]
        ]);
    })->name('checkout');

    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('/orders/{order}/confirmation', [OrderController::class, 'confirmation'])->name('orders.confirmation');

    // Admin routes
    Route::middleware(['auth'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [ProductController::class, 'adminDashboard'])->name('admin.dashboard');
        Route::resource('/products', ProductController::class)->except(['index', 'show']);
    });
});

// Public API endpoints
Route::get('/api/cart/count', [CartController::class, 'getCartCount']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
