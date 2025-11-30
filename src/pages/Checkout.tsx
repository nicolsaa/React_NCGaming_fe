// Checkout.tsx - página intermedia antes del éxito
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

const Checkout: React.FC = () => {
  const { totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleConfirmPurchase = () => {
    // Aquí procesarías el pago con tu backend
    // Por ahora simulamos éxito
    clearCart();
    navigate('/checkout-success');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Finalizar Compra</h1>
        {/* Formulario de pago, dirección, etc. */}
        <Button onClick={handleConfirmPurchase}>
          Confirmar Pago de ${totalPrice}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;