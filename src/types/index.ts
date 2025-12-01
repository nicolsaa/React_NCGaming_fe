import type { Product } from './product';

export * from './product';

export interface User {
    id: string;
    username: string;
    email: string;
    password?: string; // Solo para creación/actualización
    firstName?: string;
    lastName?: string;
    role: 'USER' | 'ADMIN';
    createdAt?: string;
    updatedAt?: string;
}

// Para la respuesta del backend (sin password)
export interface UserDTO {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: 'USER' | 'ADMIN';
    createdAt?: string;
    updatedAt?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

