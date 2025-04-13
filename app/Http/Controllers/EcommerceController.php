<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class EcommerceController extends Controller
{
    public function home()
    {
        return Inertia::render('Home/Home');
    }

    public function products(Request $request)
    {
        // Pass any query parameters from request to the component
        return Inertia::render('Product/AllProduct', [
            'query' => $request->all(),
        ]);
    }

    public function product($id)
    {
        return Inertia::render('Product/SingleProduct', [
            'productId' => $id,
        ]);
    }

    public function cart()
    {
        return Inertia::render('Cart/Cart');
    }

    public function checkout()
    {
        return Inertia::render('Checkout/Checkout');
    }

    // This will be protected by admin middleware later
    public function admin()
    {
        return Inertia::render('Admin/Dashboard/Admin');
    }
}
