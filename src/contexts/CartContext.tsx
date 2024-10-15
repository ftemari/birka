"use client";

import { realizarPago } from '@/services/MPPaymentServices';
import { CreateOrder } from '@/services/supabaseService';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
}

interface CartItem extends MenuItem {
    quantity: number;
}

const menuItems: MenuItem[] = [
    { id: 1, name: "Classic Burger", description: "Juicy beef patty with lettuce, tomato, and cheese", price: 9.99, category: "Burgers" },
    { id: 2, name: "Veggie Pizza", description: "Assorted vegetables on a crispy crust", price: 11.99, category: "Pizza" },
    { id: 3, name: "Caesar Salad", description: "Crisp romaine lettuce with Caesar dressing and croutons", price: 7.99, category: "Salads" },
    { id: 4, name: "Grilled Chicken Sandwich", description: "Tender grilled chicken breast with avocado and bacon", price: 10.99, category: "Sandwiches" },
    { id: 5, name: "Spaghetti Bolognese", description: "Al dente spaghetti with rich meat sauce", price: 12.99, category: "Pasta" },
    { id: 6, name: "Margherita Pizza", description: "Classic pizza with tomato, mozzarella, and basil", price: 10.99, category: "Pizza" },
    { id: 7, name: "Greek Salad", description: "Fresh vegetables, feta cheese, and olives", price: 8.99, category: "Salads" },
    { id: 8, name: "Cheeseburger", description: "Beef patty with melted cheese and pickles", price: 8.99, category: "Burgers" },
    { id: 9, name: "Chicken Wings", description: "Crispy wings with your choice of sauce", price: 10.99, category: "Appetizers" },
    { id: 10, name: "Fish and Chips", description: "Crispy battered fish with golden fries", price: 13.99, category: "Seafood" },
]

interface CartContextType {
    cart: CartItem[];
    menuItems: MenuItem[];
    totalItems: number;
    totalPrice: number;
    quantities: { [key: number]: number };
    updateQuantity: (id: number, delta: number) => void;
    addToCart: (item: MenuItem) => void;
    pagar: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const [quantities, setQuantities] = useState<{ [key: number]: number }>(
        Object.fromEntries(menuItems.map(item => [item.id, 1]))
    )


    const addToCart = (item: MenuItem) => {
        const quantity = quantities[item.id]
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id)
            if (existingItemIndex !== -1) {
                // Item already in cart, update quantity
                return prevCart.map((cartItem, index) =>
                    index === existingItemIndex
                        ? { ...cartItem, quantity: cartItem.quantity + quantity }
                        : cartItem
                )
            } else {
                // Item not in cart, add new item
                return [...prevCart, { ...item, quantity }]
            }
        })

        // Reset quantity to 1 after adding to cart
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [item.id]: 1
        }))
    }

    const updateQuantity = (id: number, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, prev[id] + delta)
        }))
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    
    const pagar = async () => {


        // Aquí puedes agregar más lógica si es necesario
        // TODO: Falta agregar la logica que guarda la información en supabase, también agregar el ID del pago y eso
        if (cart.length != 0){
            const id = await CreateOrder(totalPrice)
            await realizarPago(totalPrice, id);
        } else {
            // TODO: debo agregar una manera correcta de mostrar errores o que no te deje darle click al boton de pagar si el cart length es cero
            console.log("No se puede pagar cero")
        }
        // redirect(redirectstring)
    };


    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, totalItems, totalPrice, quantities, menuItems, pagar }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};
