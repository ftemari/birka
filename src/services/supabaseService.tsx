'use server'
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
    process.env.NEXT_SUPABASE_URL!,
    process.env.NEXT_SECRET_SUPABASE_KEY!
  );


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

// Método para obtener todos los productos de la tabla 'products'
export async function getAllProducts(): Promise<MenuItem[]> {
    const { data, error } = await supabase
        .from('products') // Asegúrate de que 'products' es el nombre correcto de la tabla
        .select('*'); // Selecciona todos los campos

    if (error) {
        throw new Error(`Error al obtener los productos: ${error.message}`);
    }

    return data as MenuItem[]; // Devuelve los datos como un arreglo de MenuItem
}

export async function CreateOrder(cart: CartItem[], amount: number) {
    const orderId = crypto.randomUUID(); // Generar un ID único para la orden
    const order = {
        id: orderId,
        amount: amount,
        message: '', // Puedes ajustar esto según sea necesario
        state: 'CREATED'
    };

    // Insertar la orden en la tabla 'orders'
    const { error: orderError } = await supabase
        .from('orders')
        .insert([order]);

    if (orderError) {
        throw new Error(`Error al crear la orden: ${orderError.message}`);
    }

    // Crear los detalles de la orden
    const orderDetails = cart.map(item => ({
        id: crypto.randomUUID(), // Generar un ID único para cada detalle
        order_id: orderId, // Usar el mismo ID de la orden
        product_id: item.id, // ID del producto del menú
        quantity: item.quantity, // Cantidad del artículo en el carrito
        unitary_price: item.price // Precio unitario del producto
    }));

    // Insertar los detalles de la orden en la tabla 'orderDetails'
    const { error: detailsError } = await supabase
        .from('orderdetails') // Asegúrate de que 'orderDetails' es el nombre correcto de la tabla
        .insert(orderDetails);

    if (detailsError) {
        throw new Error(`Error al crear los detalles de la orden: ${detailsError.message}`);
    }

    return orderId; // Devolver el ID de la orden creada
}
