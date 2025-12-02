import type { Product } from './product';

export * from './product';

export interface User {
    id: string;
    username: string;
    name?: string;
    fullUsername?: string;
    email: string;
    password?: string; // Solo para creación/actualización
    role: 'USER' | 'ADMIN';
    createdAt?: string;
    updatedAt?: string;
}


export interface UserDTO {
    id: string;
    username: string;
    fullUsername?: string;
    email: string;
    role: 'USER' | 'ADMIN';
    createdAt?: string;
    updatedAt?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}
