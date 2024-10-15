'use server'
import MercadoPagoConfig, { Preference } from "mercadopago";
import { redirect } from "next/navigation";



export async function realizarPago(totalPrice: number, id: string): Promise<void> {
    const mercadopago = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });
    console.log(totalPrice)
    
    // try {
    const preference = await new Preference(mercadopago).create({
        body: {
            items: [
                {
                    id: "payment",
                    title: "titulo básco",
                    quantity: 1,
                    unit_price: totalPrice
                }
            ],
            external_reference: id,
            back_urls: {
                success: process.env.BIRKA_URL! + "/confirmation",
                pending: process.env.BIRKA_URL! + "/confirmation",
                failure: process.env.BIRKA_URL! + "/confirmation"
            }
        }
    })
    if (preference.init_point) {
        redirect(preference.init_point)
    } else {
        console.log(preference.sandbox_init_point!)
        console.error("No se pudo obtener el punto de inicio de la preferencia.");
    }
    
}
