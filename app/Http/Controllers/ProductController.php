<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all()->groupBy('type');

        return Inertia::render('Home/Home', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/AddProduct', [
            'categories' => ['Makeup', 'Hair', 'Skincare', 'Fragrance', 'Bath & Body', 'Tools & Brushes']
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'imageUrl' => 'required|url',
            'price' => 'required|numeric',
            'type' => 'required|string|max:255',
        ]);

        $product = Product::create($validated);

        return redirect()->route('admin.dashboard')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);

        // Get similar products from the same category
        $similarProducts = Product::where('category', $product->category)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return Inertia::render('ProductDetails/ProductDetails', [
            'product' => $product,
            'similarProducts' => $similarProducts
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::findOrFail($id);

        return Inertia::render('Admin/EditProduct', [
            'product' => $product,
            'categories' => ['Makeup', 'Hair', 'Skincare', 'Fragrance', 'Bath & Body', 'Tools & Brushes']
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'imageUrl' => 'required|url',
            'price' => 'required|numeric',
            'type' => 'required|string|max:255',
        ]);

        $product->update($validated);

        return redirect()->route('admin.dashboard')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('admin.dashboard')
            ->with('success', 'Product deleted successfully.');
    }

    /**
     * Display admin dashboard with products.
     */
    public function adminDashboard()
    {
        $products = Product::all();

        return Inertia::render('Admin/Dashboard/Dashboard', [
            'products' => $products
        ]);
    }
}
