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
    public function index(Request $request)
    {
        // Set up base query
        $baseQuery = Product::query();

        // Special case for home page route ('/')
        if ($request->path() === '/' && !$request->hasAny(['category', 'type', 'max_price', 'sort', 'search'])) {
            // For the home page - group products for carousel displays
            $products = [
                'featured' => (clone $baseQuery)->limit(25)->get(),
                'new' => (clone $baseQuery)->orderBy('id', 'desc')->limit(25)->get(),
                'popular' => (clone $baseQuery)->orderBy('stars', 'desc')->limit(25)->get(),
                'category' => (clone $baseQuery)->where('category', 'makeup')->limit(8)->get(),
                'guide' => (clone $baseQuery)->where('category', 'skincare')->limit(8)->get(),
            ];

            return Inertia::render('Home/Home', [
                'products' => $products
            ]);
        }

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $baseQuery->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('brand', 'like', "%{$searchTerm}%")
                      ->orWhere('category', 'like', "%{$searchTerm}%")
                      ->orWhere('type', 'like', "%{$searchTerm}%");
            });
        }

        // Filter by category if provided (case-insensitive)
        if ($request->has('category')) {
            $category = strtolower($request->category);
            $baseQuery->whereRaw('LOWER(category) LIKE ?', ["%{$category}%"]);
        }

        // Filter by type if provided (case-insensitive)
        if ($request->has('type')) {
            $type = strtolower($request->type);
            $baseQuery->whereRaw('LOWER(type) LIKE ?', ["%{$type}%"]);
        }

        // Filter by price range if provided
        if ($request->has('max_price')) {
            $baseQuery->where('price', '<=', $request->max_price);
        }

        // Sort products if requested
        if ($request->has('sort')) {
            $sortOption = $request->sort;

            if ($sortOption === 'newest') {
                $baseQuery->orderBy('id', 'desc');
            } else if ($sortOption === 'popular') {
                $baseQuery->orderBy('stars', 'desc')->orderBy('numReviews', 'desc');
            } else if ($sortOption === 'price_low') {
                $baseQuery->orderBy('price', 'asc');
            } else if ($sortOption === 'price_high') {
                $baseQuery->orderBy('price', 'desc');
            }
        } else {
            // Default sorting (newest first)
            $baseQuery->orderBy('id', 'desc');
        }

        // Handle any custom sorting from frontend
        if ($request->has('orderBy')) {
            $orderDirection = $request->input('orderBy', 'desc');
            $sortField = $request->input('sort', 'id');
            $baseQuery->orderBy($sortField, $orderDirection);
        }

        // For filtered views, use the AllProduct component
        $filteredProducts = $baseQuery->paginate(24);

        return Inertia::render('Product/AllProduct', [
            'products' => $filteredProducts,
            'filters' => [
                'category' => $request->category ?? null,
                'type' => $request->type ?? null,
                'max_price' => $request->max_price ?? null,
                'sort' => $request->sort ?? null,
                'search' => $request->search ?? null
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/AddProduct/AddProduct', [
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
            ->limit(24)
            ->get();

        return Inertia::render('Product/SingleProduct', [
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

    /**
     * Search for products by term
     */
    public function search(Request $request)
    {
        $searchTerm = $request->query('q');
        
        if (empty($searchTerm)) {
            return redirect()->route('products');
        }
        
        // Redirect to products page with search parameter
        return redirect()->route('products', ['search' => $searchTerm]);
    }

    /**
     * Get search suggestions based on a query term
     */
    public function searchSuggestions(Request $request)
    {
        $query = $request->input('q', '');
        
        if (empty($query) || strlen($query) < 2) {
            return response()->json([
                'suggestions' => []
            ]);
        }

        // Get product name suggestions
        $productSuggestions = Product::where('name', 'like', "%{$query}%")
            ->orWhere('brand', 'like', "%{$query}%")
            ->select('name', 'brand', 'category', 'id', 'imageUrl')
            ->limit(6)
            ->get()
            ->map(function($product) {
                return [
                    'id' => $product->id,
                    'text' => $product->name,
                    'brand' => $product->brand,
                    'category' => $product->category,
                    'image' => $product->imageUrl,
                    'type' => 'product'
                ];
            });

        // Get category suggestions
        $categorySuggestions = Product::whereRaw('LOWER(category) LIKE ?', ['%' . strtolower($query) . '%'])
            ->select('category')
            ->distinct()
            ->limit(3)
            ->get()
            ->map(function($item) {
                return [
                    'text' => $item->category,
                    'type' => 'category'
                ];
            });

        // Get brand suggestions
        $brandSuggestions = Product::whereRaw('LOWER(brand) LIKE ?', ['%' . strtolower($query) . '%'])
            ->select('brand')
            ->distinct()
            ->limit(3)
            ->get()
            ->map(function($item) {
                return [
                    'text' => $item->brand,
                    'type' => 'brand'
                ];
            });

        // Combine all suggestions
        $allSuggestions = $productSuggestions
            ->merge($categorySuggestions)
            ->merge($brandSuggestions)
            ->take(10);

        return response()->json([
            'suggestions' => $allSuggestions
        ]);
    }
}
