import React, { createContext, useState, useContext, useEffect } from 'react';
import type { Product } from '@/types';

interface ProductsContextType {
    products: Product[];
    loading: boolean;
    featuredProducts: Product[];
    getProductsByCategory: (category: string) => Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Carga inicial: prioridad a productos agregados desde Admin (localStorage),
    // si no hay ninguno, usamos datos de ejemplo (mock).
    const loadFromStorage = (): Product[] => {
        const adminKey = 'admin_products';
        const adminRaw = typeof window !== 'undefined' ? localStorage.getItem(adminKey) : null;
        const adminProducts: Product[] = adminRaw ? JSON.parse(adminRaw) : [];

        const mockProducts: Product[] = [
            { id: '1', name: 'Figura Goku Super Saiyan', price: 20000, description: 'Figura coleccionable de Goku Super Saiyan escala 1/6', image: '/images/goku.jpg', category: 'figuras', stock: 15, featured: true },
            { id: '2', name: 'Pokémon Booster Pack', price: 50000, description: 'Sobres de cartas Pokémon edición Scarlet & Violet', image: '/images/pokemon-cards.jpg', category: 'cartas', stock: 100, featured: true }
        ];

        if (adminProducts && adminProducts.length > 0) {
            return adminProducts;
        }

        return mockProducts;
    };

    useEffect(() => {
        try {
            const initial = loadFromStorage();
            setProducts(initial);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }

        // Actualiza la lista cuando el Admin guarde productos en localStorage
        const handleUpdated = () => {
            try {
                const updated = loadFromStorage();
                setProducts(updated);
            } catch (error) {
                console.error('Error refreshing products:', error);
            }
        };

        window.addEventListener('Geek_Shop_Products_Updated', handleUpdated);
        return () => window.removeEventListener('Geek_Shop_Products_Updated', handleUpdated);
    }, []);

    const featuredProducts = products.filter(p => (p as any).featured);
    const getProductsByCategory = (category: string) => products.filter(p => p.category === category);

    return (
        <ProductsContext.Provider value={{ products, loading, featuredProducts, getProductsByCategory }}>
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
