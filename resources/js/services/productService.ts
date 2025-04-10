import axios from 'axios';

// Base API URL - adjust as needed based on your Laravel setup
const API_URL = '/api/products';

export interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  price: number;
  stars: number;
  numReviews: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductQueryParams {
  category?: string;
  page?: number;
  price?: number[];
  sort?: string;
  orderBy?: string;
}

/**
 * Get all products with optional filtering and pagination
 */
export const fetchProducts = async (params: ProductQueryParams = {}): Promise<ProductsResponse> => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    // Fallback to db.json if backend API is not ready yet
    console.warn('Using fallback data from db.json. Connect to Laravel API for production.');
    const dbData = await import('../pages/Home/db.json');

    let filteredData = [...dbData[0]];

    // Apply basic filtering for category
    if (params.category) {
      filteredData = filteredData.filter(item =>
        item.category.toLowerCase() === params.category.toLowerCase());
    }

    // Apply basic pagination
    const page = params.page || 1;
    const limit = 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      products: filteredData.slice(startIndex, endIndex),
      total: filteredData.length,
      page,
      limit
    };
  }
};

/**
 * Get a single product by ID
 */
export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    // Fallback to db.json if backend API is not ready yet
    console.warn('Using fallback data from db.json. Connect to Laravel API for production.');
    const dbData = await import('../pages/Home/db.json');

    // Search through all arrays in db.json for the product
    for (const array of Object.values(dbData)) {
      if (Array.isArray(array)) {
        const product = array.find(item => item._id === id);
        if (product) return product;
      }
    }

    throw new Error(`Product with ID ${id} not found`);
  }
};
