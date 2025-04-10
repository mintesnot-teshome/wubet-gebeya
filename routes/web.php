<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EcommerceController;

// Main e-commerce routes
Route::get('/', [EcommerceController::class, 'home'])->name('home');
Route::get('/products', [EcommerceController::class, 'products'])->name('products');
Route::get('/products/{id}', [EcommerceController::class, 'product'])->name('product.show');
Route::get('/cart', [EcommerceController::class, 'cart'])->name('cart');
Route::get('/checkout', [EcommerceController::class, 'checkout'])->name('checkout');

// Admin routes (should be protected)
Route::middleware(['auth'])->group(function () {
    Route::get('/admin', [EcommerceController::class, 'admin'])->name('admin');

    Route::get('dashboard', function () {
        return Inertia::render('Admin/Dashboard/Dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';