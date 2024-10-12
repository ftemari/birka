import { Button } from "@/components/ui/button";
import Link from 'next/link'; // Importa el componente Link

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
    <h1 className="text-4xl font-bold mb-6 text-center">Birkapp - Menu digital pero hecho con ganas</h1>
    <p className="text-xl mb-8 text-center text-muted-foreground">La aplicación aún no esta lista, solo existen esas dos paginas que por si mismas no funcionan para nada. Si llegaste a esta web, lo siento no hay nada interesante. Te recomiendo que vayas a twitter a leer mas al respecto. </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <Link href="/menu">
        <Button className="w-full sm:w-auto" size="lg">
          Proceso de pago MercadoPago
        </Button>
      </Link>
      <Link href="/menuTemporal"> 
        <Button className="w-full sm:w-auto white" size="lg">
          Menu UI
        </Button>
      </Link>
    </div>
    <div className="mt-8">
      <a href="https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20digital%20menu%20app%20-%20Birkapp" target="_blank" rel="noopener noreferrer" className="text-primary underline">Mas info en Twitter</a>
    </div>
  </div>
  );
}
