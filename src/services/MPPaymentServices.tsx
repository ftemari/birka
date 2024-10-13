'use server'
import MercadoPagoConfig, { Preference } from "mercadopago";
import { redirect } from "next/navigation";



export async function realizarPago(totalPrice: number): Promise<void> {
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
            external_reference: "order.id",
            back_urls: {
                success: "birka-nu.vercel.app/confirmation",
                pending: "www.google.com",
                failure: "www.google.com"
            }
        }
    })
    if (preference.init_point) {
        redirect(preference.init_point)
        console.log(preference.init_point)
        // return preference.init_point!

    } else {
        console.log(preference.sandbox_init_point!)
        console.error("No se pudo obtener el punto de inicio de la preferencia.");
        // return preference.sandbox_init_point!
    }
    // } catch (error) {
    //     console.error("Error al crear la preferencia de pago:", error);
    // }
    // return "www.google.com"

    // Aquí es donde manejas la lógica de pago.
    // Por ejemplo, puedes hacer una llamada al SDK de pago y luego guardar la información en la base de datos.

    // sdkPago.redirigirAPaginaDePago();
    // await db.guardarInformacionDePago();
}
