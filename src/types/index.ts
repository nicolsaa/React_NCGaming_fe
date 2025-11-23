import type { Product } from './product';

export * from './product';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
}

export interface CartItem {
    product: Product;
    quantity: number;
}

