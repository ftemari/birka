'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle, Clock, DollarSign, QrCode } from "lucide-react"
import Link from "next/link"
import QRCode from "react-qr-code"
import { getOrderById } from '@/services/supabaseService'

interface OrderData {
  orderId: string;
  totalPrice: number;
  qrCodeData: string;
  estimatedWaitTime: string;
}

interface OrderConfirmationProps {
  order_id: string; // Añadir el prop para recibir paymentId
}


export function OrderConfirmationComponent({ order_id }: OrderConfirmationProps) { // Modificar la firma del componente
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Llamar al método getOrderById
    getOrderById(order_id)
      .then((data) => {
        if (data && data.public_id) { // Validar que data y public_id no estén vacíos
          setOrderData({
            orderId: data.public_id,
            totalPrice: data.amount,
            qrCodeData: `https://example.com/order/${data.public_id}`, // Ajusta según sea necesario
            estimatedWaitTime: "15 minutes" // Puedes ajustar esto según tu lógica
          });
        } else {
          setOrderData(null); // Establecer orderData a null si no se encuentra la orden
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [order_id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-10">
            <p className="text-xl font-semibold text-red-500">Order not found</p> {/* Mensaje de orden no encontrada */}
            <Link href="/menu" className="mt-4 inline-block">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Return to Menu
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <CheckCircle className="text-green-500" />
            Order Confirmed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InfoCard
              icon={<QrCode className="h-6 w-6" />}
              title="Order ID"
              value={orderData.orderId}
            />
            <InfoCard
              icon={<DollarSign className="h-6 w-6" />}
              title="Total Price"
              value={`$${orderData.totalPrice.toFixed(2)}`}
            />
            <InfoCard
              icon={<Clock className="h-6 w-6" />}
              title="Est. Wait Time"
              value={orderData.estimatedWaitTime}
            />
          </div>
          
          <Separator />
          
          <div className="flex flex-col items-center space-y-2">
            <h3 className="font-semibold">Show QR Code to Waiter</h3>
            <QRCode value={orderData.qrCodeData} size={150} />
          </div>
          
          <Separator />
          
          {/* Placeholder for future additional information */}
          <div className="space-y-2">
            {/* Example of how to add more information:
            <InfoCard
              icon={<User className="h-6 w-6" />}
              title="Waiter"
              value="John Doe"
            />
            */}
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/menuTemporal" className="w-full"> {/* Cambiar a /menuTemporal */}
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Menu
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function InfoCard({ icon, title, value }: InfoCardProps) {
  return (
    <div className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center">
      {icon}
      <h3 className="text-sm font-medium text-muted-foreground mt-1">{title}</h3>
      <p className="font-semibold">{value}</p>
    </div>
  )
}
