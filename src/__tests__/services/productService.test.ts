import { describe, it, expect, beforeEach, vi } from 'vitest';
import { productService } from '@/services/productService';


vi.mock('@/utils/imageUtils', () => ({
  ImageUtils: {
    isValidImageUrl: vi.fn(() => true),
    getDefaultImage: vi.fn(() => 'default.png')
  }
}));

describe('productService - basic tests', () => {
  beforeEach(() => {
    (globalThis as any).fetch = vi.fn();
  });

  it('getAllProducts - should return mapped products', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Test Product',
        description: 'Descripción',
        price: 10,
        stock: 5,
        category: { name: 'Ropa' },
        image: 'https://example.com/product.png',
        featured: false,
        sizes: []
      }
    ];

    (globalThis as any).fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockProducts,
      headers: { get: (_: string) => 'application/json' }
    } as any);

    const products = await productService.getAllProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products[0].id).toBe('1');
  });

  it('getProductById - should return a single mapped product', async () => {
    const mockProduct = {
      id: 2,
      name: 'Product 2',
      description: '',
      price: 5,
      stock: 2,
      category: { name: 'Ropa' },
      image: 'https://example.com/p2.png',
      featured: false,
      sizes: []
    };

    (globalThis as any).fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockProduct,
      headers: { get: (_: string) => 'application/json' }
    } as any);

    const p = await productService.getProductById('2');
    expect(p.id).toBe('2');
  });

  it('getAllProducts - should throw when API fails', async () => {
    (globalThis as any).fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
      headers: { get: (_: string) => 'application/json' }
    } as any);

    await expect(productService.getAllProducts()).rejects.toThrow('Error al obtener productos');
  });
});
