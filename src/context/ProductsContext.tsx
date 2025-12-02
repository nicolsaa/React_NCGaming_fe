// src/context/ProductsContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import type { Product, Category } from '@/types';
import { productService } from '@/services/productService';

interface ProductsContextType {
    products: Product[];
    loading: boolean;
    featuredProducts: Product[];
    getProductsByCategory: (category: Category) => Product[];
    refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Función para cargar productos desde el backend
    const loadFromBackend = async (): Promise<Product[]> => {
        try {
            const backendProducts = await productService.getAllProducts();
            return backendProducts;
        } catch (error) {
            console.error('Error cargando productos del backend:', error);
            
            // Fallback a localStorage si el backend falla
            const adminKey = 'admin_products';
            const adminRaw = typeof window !== 'undefined' ? localStorage.getItem(adminKey) : null;
            const adminProducts: Product[] = adminRaw ? JSON.parse(adminRaw) : [];

            const mockProducts: Product[] = [
                // ... tus productos mock existentes
            ];

            if (adminProducts && adminProducts.length > 0) {
                return adminProducts;
            }

            return mockProducts;
        }
    };

    // Función para refrescar productos
    const refreshProducts = async () => {
        try {
            const updated = await loadFromBackend();
            setProducts(updated);
        } catch (error) {
            console.error('Error refreshing products:', error);
        }
    };

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const initial = await loadFromBackend();
                setProducts(initial);
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const featuredProducts = products.filter(p => (p as any).featured);
    const getProductsByCategory = (category: Category) =>
        products.filter(p => p.category === category);

    return (
        <ProductsContext.Provider value={{ 
            products, 
            loading, 
            featuredProducts, 
            getProductsByCategory,
            refreshProducts 
        }}>
            {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
};
