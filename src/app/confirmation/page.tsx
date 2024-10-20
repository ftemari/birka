import { OrderConfirmationComponent } from '@/components/order-confirmation';
import React from 'react';

type PageProps = {
    searchParams: { [key: string]: string | string[] | undefined }
  };


export default function Confirmation({ searchParams }: PageProps) {

    const order_id = searchParams.external_id as string;
    return (
        <div>
            <OrderConfirmationComponent order_id={order_id}></OrderConfirmationComponent>
        </div>
    );
    
}
