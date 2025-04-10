<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of products with optional filtering and pagination.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Filter by category if provided
        if ($request->has('category') && !empty($request->category)) {
            $query->where('category', $request->category);
        }

        // Filter by price range if provided
        if ($request->has('price') && is_array($request->price) && count($request->price) === 2) {
            $query->whereBetween('price', $request->price);
        }

        // Sort options
        $sortField = $request->get('sort', 'created_at');
        $sortOrder = $request->get('orderBy', 'desc');

        $query->orderBy($sortField, $sortOrder);

        // Pagination
        $perPage = $request->get('limit', 20);
        $products = $query->paginate($perPage);

        return response()->json([
            'products' => $products->items(),
            'total' => $products->total(),
            'page' => $products->currentPage(),
            'limit' => $products->perPage(),
        ]);
    }

    /**
     * Store a newly created product in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'imageUrl' => 'required|url',
            'price' => 'required|numeric|min:0',
            'stars' => 'required|numeric|min:0|max:5',
            'numReviews' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::create($request->all());

        return response()->json($product, 201);
    }

    /**
     * Display the specified product.
     *
     * @param  string  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::findOrFail($id);

        return response()->json($product);
    }

    /**
     * Update the specified product in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'brand' => 'sometimes|required|string|max:100',
            'category' => 'sometimes|required|string|max:100',
            'imageUrl' => 'sometimes|required|url',
            'price' => 'sometimes|required|numeric|min:0',
            'stars' => 'sometimes|required|numeric|min:0|max:5',
            'numReviews' => 'sometimes|required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product->update($request->all());

        return response()->json($product);
    }

    /**
     * Remove the specified product from storage.
     *
     * @param  string  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(null, 204);
    }
}
