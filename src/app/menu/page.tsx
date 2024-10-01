import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import { redirect } from 'next/navigation';



const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });

export default function Menu() {

    async function pay(formData: FormData) {
        'use server'
        const preference = await new Preference(client).create({
            body: {
                items: [
                  {
                    id: "payment",
                    title: formData.get('text') as string,
                    quantity: 1,
                    unit_price: Number(formData.get('amount'))
                  }
                ],
              }
        })
        redirect(preference.sandbox_init_point!)

        // // Convert FormData to an object
        // const formDataObject = Object.fromEntries(formData.entries());
        // console.log('Form Data:', formDataObject);

        // // Access specific form fields
        // const name = formData.get('text');
        // const amount = formData.get('amount');
        // console.log('Name:', name);
        // console.log('Amount:', amount);

        // console.log('MercadoPago integration would go here');
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