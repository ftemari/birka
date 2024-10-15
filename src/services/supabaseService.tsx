'use server'
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
    process.env.NEXT_SUPABASE_URL!,
    process.env.NEXT_SECRET_SUPABASE_KEY!
  );

export async function CreateOrder(amount: number) {
    const order = {
        id: crypto.randomUUID(),
        amount: amount,
        message: '', // Puedes ajustar esto según sea necesario
        state: 'CREATED'
    };

    const { error } = await supabase
        .from('orders') // Asegúrate de que 'order' es el nombre correcto de la tabla
        .insert([order]);

    if (error) {
        throw new Error(`Error al crear la orden: ${error.message}`);
    }

    return order.id; // Devolver el ID de la orden creada
}

