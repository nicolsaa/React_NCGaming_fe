import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
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
            { id: "dragon-shield", name: "Protectores Dragon Shield Standard Matte: Pink", price: 25000, description: "Protectores Dragon Shield matte tamaño estándar color rosa, ideales para TCG como Pokémon, Magic o One Piece.", image: "/src/assets/images/dragon-shield-pink.png", category: "accesorios", stock: 30, featured: true },
            { id: "playmat-goku", name: "Playmat Ultra Pro DBS (Son Goku UI)", price: 35000, description: "Tapete oficial Ultra Pro de Dragon Ball Super TCG con diseño de Son Goku Ultra Instinto.", image: "/src/assets/images/playmat.png", category: "accesorios", stock: 15, featured: false },
            { id: "deck-box", name: "Deck Box Top Deck Premium 100+ (Negro)", price: 20000, description: "Caja premium Top Deck para 100+ cartas con protectores. Color negro.", image: "/src/assets/images/topdeck.png", category: "accesorios", stock: 40, featured: false },
            { id: "carpeta-pokemon", name: "Carpeta Ultra Pro 4 Pocket Pokémon", price: 5000, description: "Carpeta Ultra Pro con 4 bolsillos por página para almacenar cartas de Pokémon TCG.", image: "/src/assets/images/carpeta.png", category: "accesorios", stock: 50, featured: false },
            { id: "dados-gemidice", name: "Set 12 Dados Oakie Doakie Gemidice 16mm", price: 120000, description: "Set de 12 dados D6 de Oakie Doakie, línea Gemidice de alta calidad para juegos de mesa.", image: "/src/assets/images/dados.png", category: "accesorios", stock: 25, featured: true },
            { id: "pikachu-ex", name: "Pikachu Ex - 057/191", price: 12000, description: "Carta Pokémon Pikachu Ex 057/191.", image: "/src/assets/images/pikachu.png", category: "cartas", stock: 10, featured: false },
            { id: "mew-ex", name: "Mew Ex 193/165", price: 24000, description: "Carta Pokémon Mew Ex 193/165.", image: "/src/assets/images/mew2.png", category: "cartas", stock: 10, featured: false },
            { id: "charizard-ex", name: "Charizard Ex - 234/091", price: 160000, description: "Carta Pokémon Charizard Ex 234/091.", image: "/src/assets/images/charizard.webp", category: "cartas", stock: 5, featured: true },
            { id: "umbreon-ex", name: "Umbreon Ex - 161/131", price: 280000, description: "Carta Pokémon Umbreon Ex 161/131.", image: "/src/assets/images/umbreon.png", category: "cartas", stock: 5, featured: true },
            { id: "sylveon-ex", name: "Sylveon Ex - 156/131", price: 350000, description: "Carta Pokémon Sylveon Ex 156/131.", image: "/src/assets/images/sylveon.png", category: "cartas", stock: 5, featured: false },
            { id: "killua-polo", name: "Polera Killua Zoldyck: Lightning Killer - Hunter X Hunter", price: 15990, description: "Polera temática de Killua Zoldyck con diseño Lightning Killer.", image: "/src/assets/images/killua2.png", category: "poleras", stock: 20, sizes: ["S", "M", "L", "XL"], featured: true },
            { id: "gojo-polo", name: "Satoru Gojo: Infinite Judgment Edición especial - Jujutsu Kaisen", price: 25000, description: "Polera edición especial Infinite Judgment de Satoru Gojo.", image: "/src/assets/images/gojo.png", category: "poleras", stock: 20, sizes: ["S", "M", "L", "XL"], featured: true },
            { id: "shadow-polo", name: "Polera Acid Wash Shadow Monarch - Solo Leveling", price: 8000, description: "Polera estilo Acid Wash inspirada en el Shadow Monarch de Solo Leveling.", image: "/src/assets/images/solo.png", category: "poleras", stock: 20, sizes: ["S", "M", "L", "XL"], featured: false },
            { id: "law-hoodie", name: "Polerón Trafalgar Law Tattoos - One Piece", price: 20000, description: "Polerón inspirado en Trafalgar Law con diseño de tatuajes.", image: "/src/assets/images/one.png", category: "poleras", stock: 15, sizes: ["S", "M", "L", "XL"], featured: false },
            { id: "homunculos-hoodie", name: "Polerón Homúnculos - Full Metal Alchemist Brotherhood", price: 5000, description: "Polerón inspirado en los Homúnculos de Full Metal Alchemist Brotherhood.", image: "/src/assets/images/fullmetal.png", category: "polerones", stock: 15, sizes: ["S", "M", "L", "XL"], featured: true },
            { id: "naruto-figure", name: "Figura Pop Up Parade: Naruto Uzumaki", price: 30000, description: "Figura Pop Up Parade de Naruto Uzumaki.", image: "/src/assets/images/naruto1.png", category: "figuras", stock: 10, featured: true },
            { id: "mew-model", name: "Model Kit Quick!! Bandai Hobby Pokémon: Mew", price: 15000, description: "Model Kit de Mew para ensamblar.", image: "/src/assets/images/mew.png", category: "figuras", stock: 12, featured: true },
            { id: "marin-figure", name: "Figura Luminasta: Marin Kitagawa (First Measurements)", price: 28000, description: "Figura de Marin Kitagawa de alta calidad.", image: "/src/assets/images/marin.png", category: "figuras", stock: 8, featured: false },
            { id: "killua-figure", name: "Figura Pop Up Parade: Killua Zoldyck", price: 40000, description: "Figura Pop Up Parade de Killua Zoldyck.", image: "/src/assets/images/killua.png", category: "figuras", stock: 6, featured: true },
            { id: "anya-figure", name: "Figura Nendoroid: Anya Forger", price: 20000, description: "Figura Nendoroid de Anya Forger.", image: "/src/assets/images/anya.png", category: "figuras", stock: 20, featured: false },
            { id: "zelda-game", name: "The Legend of Zelda: Breath of the Wild - Nintendo Switch", price: 60000, description: "Videojuego The Legend of Zelda: Breath of the Wild para Nintendo Switch.", image: "/src/assets/images/zelda.png", category: "videojuegos", stock: 20, featured: true },
            { id: "mario-kart", name: "Mario Kart 8 Deluxe Edition - Nintendo Switch", price: 55000, description: "Videojuego Mario Kart 8 Deluxe Edition para Nintendo Switch.", image: "/src/assets/images/mario.png", category: "videojuegos", stock: 20, featured: true },
            { id: "donkey-kong", name: "Donkey Kong Bananza - Nintendo Switch 2", price: 50000, description: "Videojuego Donkey Kong Bananza para Nintendo Switch 2.", image: "/src/assets/images/donkey.png", category: "videojuegos", stock: 20, featured: false },
            { id: "resident-evil", name: "Resident Evil 8: Village - PlayStation 5", price: 65000, description: "Videojuego Resident Evil 8: Village para PlayStation 5.", image: "/src/assets/images/resident.png", category: "videojuegos", stock: 20, featured: true },
            { id: "cod-mw2", name: "Call of Duty: Modern Warfare II - PlayStation 5", price: 70000, description: "Videojuego Call of Duty: Modern Warfare II para PlayStation 5.", image: "/src/assets/images/call.png", category: "videojuegos", stock: 20, featured: false },
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
        const handleUpdated = (event: Event) => {
            const detail = (event as CustomEvent<any>).detail;
            // detail could be used for logging or conditional reload
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

    // Nuevo: escucha cambios en localStorage para admin_products desde otras pestañas
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'admin_products') {
                try {
                    const updated = loadFromStorage();
                    setProducts(updated);
                } catch (error) {
                    console.error('Error refreshing products from storage:', error);
                }
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
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
