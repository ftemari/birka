'use client'

import { Button } from "@/components/ui/button";

interface PaymentHandlerProps {
    onPayment: () => void;
}

const PaymentHandler: React.FC<PaymentHandlerProps> = ({ onPayment }) => {
    return (
        <Button onClick={onPayment} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2">
            Pagar
        </Button>
    );
};

export default PaymentHandler;