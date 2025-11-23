import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ProductsProvider } from '@/context/ProductsContext';
import Navbar from '@/components/layouth/Navbar';
import Footer from '@/components/layouth/Footer';

import Home from '@/pages/Home';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import Profile from '@/pages/Profile';
import Cart from '@/pages/Cart';
import Figures from '@/pages/Catalog/Figures';
import Cards from '@/pages/Catalog/Cards';
import Clothing from '@/pages/Catalog/Clothing';
import Games from '@/pages/Catalog/Games';
import Accessories from '@/pages/Catalog/Accessories';
import Admin from '@/pages/Admin/Admin';
import UserAdmin from '@/pages/Admin/UserAdmin';
import ProductDetail from '@/pages/ProductDetail';

// Componente Layout personalizado
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductsProvider>
          <Router>
            <AppLayout>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Rutas de catálogo */}
                <Route path="/catalogo-figuras" element={<Figures />} />
                <Route path="/catalogo-cartas" element={<Cards />} />
                <Route path="/catalogo-ropa" element={<Clothing />} />
                <Route path="/catalogo-juegos" element={<Games />} />
                <Route path="/catalogo-accesorios" element={<Accessories />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                
                {/* Rutas protegidas - usuario */}
                <Route path="/perfil" element={<Profile />} />
                <Route path="/carrito" element={<Cart />} />
                <Route path="/pedidos" element={<div className="container mx-auto p-8">Página de Pedidos - Próximamente</div>} />
                
                {/* Rutas protegidas - admin */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin-usuarios" element={<UserAdmin />} />
                
                {/* Ruta 404 */}
                <Route path="*" element={
                  <div className="container mx-auto p-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-xl text-gray-600">Página no encontrada</p>
                  </div>
                } />
              </Routes>
            </AppLayout>
          </Router>
        </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
