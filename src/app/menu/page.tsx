import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';



const mercadopago = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });
const supabase = createClient(
  process.env.NEXT_SUPABASE_URL!,
  process.env.NEXT_SECRET_SUPABASE_KEY!
);


export default function Menu() {

    async function pay(formData: FormData) {
        'use server'
        const order = {
            id: crypto.randomUUID(),
            amount: Number(formData.get('amount')),
            message: formData.get('text') as string
        }

        const result = await supabase
        .from('orders')
        .insert({ id: order.id, amount: order.amount, message: order.message, state: 'CREATED' })
      
        console.log(result)
        // TODO falta agregar que si no se pudo guardar la orden correctamente en la db tire error y no lo mando a meli

        const preference = await new Preference(mercadopago).create({
            body: {
                items: [
                  {
                    id: "payment",
                    title: order.message,
                    quantity: 1,
                    unit_price: order.amount
                  }
                ],
                external_reference: order.id,
                back_urls: {
                    success: "localhost:3000/confirmation",
                    pending: "www.google.com",
                    failure: "www.google.com"
                }
              }
        })
        redirect(preference.sandbox_init_point!)

    }

    return (
        <form action={pay} className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <div className="mb-4">
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                </Label>
                <Input
                    name='text'
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                </Label>
                <Input
                    name='amount'
                    type="number"
                    id='amount'
                    placeholder="nombre"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
                pay
            </Button>
        </form>
    );
}