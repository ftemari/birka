"use client";

import { realizarPago } from '@/services/MPPaymentServices';
import { CreateOrder, getAllProducts } from '@/services/supabaseService';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
}

interface CartItem extends MenuItem {
    quantity: number;
}


interface CartContextType {
    cart: CartItem[];
    menuItems: MenuItem[];
    totalItems: number;
    totalPrice: number;
    quantities: { [key: string]: number };
    updateQuantity: (id: string, delta: number) => void;
    addToCart: (item: MenuItem) => void;
    pagar: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>(
        Object.fromEntries(menuItems.map(item => [item.id, 1]))
    )

    // Cargar los productos al iniciar el contexto
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await getAllProducts(); // Llamar a getAllProducts
                setMenuItems(products);
                // Inicializar cantidades con 1 para cada producto
                const initialQuantities = Object.fromEntries(products.map(item => [item.id, 1]));
                setQuantities(initialQuantities);
            } catch (error) {
                console.error("Error al cargar los productos:", error);
            }
        };

        loadProducts();
    }, []);

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

    const updateQuantity = (id: string, delta: number) => {
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
            const id = await CreateOrder(cart, totalPrice)
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
