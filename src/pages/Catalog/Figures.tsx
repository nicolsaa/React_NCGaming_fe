import React from 'react';
import { useProducts } from '@/context/ProductsContext';
import ProductGrid from '@/components/products/ProductGrid';

const Figures: React.FC = () => {
    const { getProductsByCategory, loading } = useProducts();
    const figures = getProductsByCategory('figuras');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Figuras de Anime</h1>
                <p className="text-gray-600">
                    Descubre nuestra colección exclusiva de figuras de anime y colección.
                </p>
            </div>

            <ProductGrid products={figures} loading={loading} />
        </div>
    );
};

export default Figures;