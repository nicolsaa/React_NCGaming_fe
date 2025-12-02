// src/services/productService.ts
import type { Product } from '@/types';
import { ImageUtils } from '@/utils/imageUtils';
import { categoryService } from '@/services/categoryService';


const API_BASE_URL = 'http://localhost:8080/api/products';

export interface CreateProductDTO {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryName: string; // Nombre de la categoría para el backend
    category?: string;
    image?: string;
}

export interface UpdateProductDTO {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
    image?: string;
}

async function readJsonSafe<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
        return (await response.json()) as T;
    }
    const text = await response.text();
    throw new Error(text || 'Respuesta no JSON');
}

async function ensureCategoryExists(categoryName: string, token: string): Promise<string> {
    const backendCategoryName = categoryService.mapCategoryForBackend((categoryName ?? '').toLowerCase());
    try {
        const existingCategories = await categoryService.getAllCategories();
        const exists = existingCategories?.some((c) => c.name.toLowerCase() === backendCategoryName.toLowerCase());
        if (!exists) {
            await categoryService.createCategory({ name: backendCategoryName }, token);
        }
    } catch (e) {
        console.error('Error ensuring category exists', e);
    }
    return backendCategoryName;
}

export const productService = {




    // Obtener todos los productos
    async getAllProducts(): Promise<Product[]> {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }

        const products = await readJsonSafe<any[]>(response);

        // Mapear del backend a tu interfaz Product
        return products.map((product: any) => ({
            id: product.id.toString(),
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            category: product.category?.name?.toLowerCase() || 'ropa',
            image: ImageUtils.isValidImageUrl(product.image)
                ? product.image
                : ImageUtils.getDefaultImage(),
            featured: product.featured || false,
            sizes: product.sizes || []
        }));
    },

    // Obtener producto por ID
    async getProductById(id: string): Promise<Product> {
        const response = await fetch(`${API_BASE_URL}/${id}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Producto no encontrado');
            }
            throw new Error('Error al obtener producto');
        }

        const product = await readJsonSafe<any>(response);

        return {
            id: product.id.toString(),
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            category: product.category?.name?.toLowerCase() || 'ropa',
            image: ImageUtils.isValidImageUrl(product.image)
                ? product.image
                : ImageUtils.getDefaultImage(),
            featured: product.featured || false,
            sizes: product.sizes || []
        };
    },

    // Buscar productos
    async searchProducts(query: string): Promise<Product[]> {
        const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error('Error al buscar productos');
        }

        const products = await readJsonSafe<any[]>(response);

        return products.map((product: any) => ({
            id: product.id.toString(),
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            category: product.category?.name?.toLowerCase() || 'ropa',
            image: ImageUtils.isValidImageUrl(product.image)
                ? product.image
                : ImageUtils.getDefaultImage(),
            featured: product.featured || false,
            sizes: product.sizes || []
        }));
    },

    // Obtener productos por categoría
    async getProductsByCategory(categoryId: string): Promise<Product[]> {
        const response = await fetch(`${API_BASE_URL}/category/${categoryId}`);

        if (!response.ok) {
            throw new Error('Error al obtener productos por categoría');
        }

        const products = await readJsonSafe<any[]>(response);

        return products.map((product: any) => ({
            id: product.id.toString(),
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            category: product.category?.name?.toLowerCase() || 'ropa',
            image: ImageUtils.isValidImageUrl(product.image)
                ? product.image
                : ImageUtils.getDefaultImage(),
            featured: product.featured || false,
            sizes: product.sizes || []
        }));
    },

    // Obtener productos destacados
    async getFeaturedProducts(): Promise<Product[]> {
        const response = await fetch(`${API_BASE_URL}/featured`);

        if (!response.ok) {
            throw new Error('Error al obtener productos destacados');
        }

        const products = await readJsonSafe<any[]>(response);

        return products.map((product: any) => ({
            id: product.id.toString(),
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            category: product.category?.name?.toLowerCase() || 'ropa',
            image: ImageUtils.isValidImageUrl(product.image)
                ? product.image
                : ImageUtils.getDefaultImage(),
            featured: true,
            sizes: product.sizes || []
        }));
    },

    // Crear producto (solo admin)
    async createProduct(productData: CreateProductDTO, token: string): Promise<Product> {
        const backendCategoryName = await ensureCategoryExists(productData.categoryName ?? '', token);
        const payload = { ...productData, categoryName: backendCategoryName };


        const response = await fetch(`${API_BASE_URL}`, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        console.log('Respuesta status:', response.status);

        if (!response.ok) {
            let errorMessage = 'Error al crear producto';
            try {
                const errorData = await readJsonSafe<any>(response);
                errorMessage = errorData?.message || errorMessage;
            } catch (e) {
                const errorText = await response.text();
                errorMessage = errorText || errorMessage;
            }
            throw new Error(errorMessage);
        }

        const product = await response.json();
        console.log('Producto creado:', product);

        return {
            id: product.id.toString(),
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            category: product.category?.name?.toLowerCase() ?? (product.categoryName ?? (productData as any).categoryName ?? 'ropa'),
            image: ImageUtils.isValidImageUrl(product.image)
                ? product.image
                : ImageUtils.getDefaultImage(),
            featured: product.featured || false,
            sizes: product.sizes || []
        };
    },

    // Actualizar producto (solo admin)
    async updateProduct(id: string, productData: Partial<CreateProductDTO>, token: string): Promise<Product> {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                let errorMessage = 'Error al actualizar producto';

                if (response.status === 404) {
                    errorMessage = 'Producto no encontrado';
                }

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData || errorMessage;
                } catch (e) {
                    const errorText = await response.text();
                    errorMessage = errorText || errorMessage;
                }

                throw new Error(errorMessage);
            }

            const product = await response.json();

            return {
                id: product.id.toString(),
                name: product.name,
                description: product.description || '',
                price: product.price,
                stock: product.stock,
                category: product.category?.name?.toLowerCase() ?? productData.category?.toLowerCase() ?? 'ropa',
                image: ImageUtils.isValidImageUrl(product.image)
                    ? product.image
                    : ImageUtils.getDefaultImage(),
                featured: product.featured || false,
                sizes: product.sizes || []
            };

        } catch (error) {
            console.error('Error en updateProduct:', error);
            throw error;
        }
    },

    // MÉTODO PARA MAPEAR CATEGORÍAS
    mapCategoryToBackend(category: string): string {
        const categoryMap: { [key: string]: string } = {
            'figuras': 'Figuras',
            'cartas': 'Cartas',
            'ropa': 'Ropa',
            'poleras': 'Ropa',
            'polerones': 'Ropa',
            'videojuegos': 'Videojuegos',
            'juegos': 'Videojuegos',
            'accesorios': 'Accesorios'
        };

        return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
    },

    // Eliminar producto (solo admin)
    async deleteProduct(id: string, token: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Producto no encontrado');
            }
            throw new Error('Error al eliminar producto');
        }
    },


};
