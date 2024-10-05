import { createClient } from "@supabase/supabase-js";
import {Payment, MercadoPagoConfig }from "mercadopago";
import { NextRequest } from "next/server";

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });
const supabase = createClient(
    process.env.NEXT_SUPABASE_URL!,
    process.env.NEXT_SECRET_SUPABASE_KEY!
  );
  

export async function POST(request: NextRequest) {
    const body = await request.json().then(data => data as {data:{id: string}})
    //TODO  agregar validación del secret que manda mercadopago viene en el headre de la llamada
    const payment = new Payment(client)
    
    
    let paymentResult;
    // TODO acá abría que guardar toda la información del cliente que hizo el pago en una tabla nueva, que también guarde las relaciones entre el cliente y todos los pedidos que hizo. Vamos a utilizar su mail como identificador principal
    try {
        paymentResult = await payment.get({ id: body.data.id });
    } catch (error) {
        console.log('Error fetching payment:', error);
        return Response.json({ success: false, error: 'Failed to fetch payment' }, { status: 500 });
    }

    if (!paymentResult) {
        return Response.json({ success: false, error: 'Payment not found' }, { status: 404 });
    }

    try {
        const data = await supabase
        .from('orders')
        .select('id, amount, state, payment_id')
        .eq('id', paymentResult.external_reference)
        .single()

        if (paymentResult.status == 'approved' && paymentResult.status_detail == 'accredited' && data != null) {
            try {
                const info = await supabase
                    .from('orders')
                    .update({ updated_at: new Date().toISOString(), state: 'APPROVED', payment_id: paymentResult.id })
                    .eq('id', data.data?.id)
                console.log(info.status)
            } catch (error) {
                console.error('Error updating order:', error);
                return Response.json({ success: false, error: 'Failed to update order' }, { status: 500 });
            }
            
        } else {
            console.log("algo salio mal")
        }

    } catch(error) {
        console.log('Error fetching order:', error);
        return Response.json({ success: false, error: 'Failed to fetch payment' }, { status: 500 });
    }



    return Response.json({ success: true })
}