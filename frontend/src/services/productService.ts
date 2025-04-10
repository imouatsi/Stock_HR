import apiService from './api.service';
import { Product, ProductInput, ProductFilters } from '../types/product';

class ProductService {
  private static instance: ProductService;

  private constructor() {}

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  async getAllProducts(filters: ProductFilters = {}): Promise<{
    products: Product[];
    pagination: {
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  }> {
    try {
      const response = await apiService.get('/v2/products', { params: filters });
      return {
        products: response.data.data.products,
        pagination: {
          totalDocs: response.data.totalDocs,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
          limit: response.data.limit
        }
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiService.get(`/v2/products/${id}`);
      return response.data.data.product;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }

  async createProduct(productData: ProductInput): Promise<Product> {
    try {
      const response = await apiService.post('/v2/products', productData);
      return response.data.data.product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<ProductInput>): Promise<Product> {
    try {
      const response = await apiService.patch(`/v2/products/${id}`, productData);
      return response.data.data.product;
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiService.delete(`/v2/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      const response = await apiService.get(`/v2/products/category/${categoryId}`);
      return response.data.data.products;
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  }

  async getProductsBySupplier(supplierId: string): Promise<Product[]> {
    try {
      const response = await apiService.get(`/v2/products/supplier/${supplierId}`);
      return response.data.data.products;
    } catch (error) {
      console.error(`Error fetching products for supplier ${supplierId}:`, error);
      throw error;
    }
  }
}

export const productService = ProductService.getInstance();
