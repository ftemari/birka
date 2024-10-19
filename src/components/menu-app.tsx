'use client'

import { useState, useRef } from 'react'
import { Plus, Minus, ShoppingCart, CreditCard, ShoppingBag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from '@/contexts/CartContext'


interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
}



export const MenuApp: React.FC = () => {
  const { pagar, addToCart, updateQuantity, totalItems, totalPrice, quantities, cart, menuItems } = useCart(); 


  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const scrollAreaRef = useRef<HTMLDivElement>(null)


  const categories = Array.from(new Set(menuItems.map(item => item.category)))

  const scrollToCategory = (category: string) => {
    setSelectedCategory(category)
    const categoryElement = categoryRefs.current[category]
    if (categoryElement && scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current
      const topPos = categoryElement.offsetTop - scrollArea.offsetTop
      scrollArea.scrollTop = topPos
    }
  }

  const groupedMenuItems = categories.reduce((acc, category) => {
    acc[category] = menuItems.filter(item => item.category === category)
    return acc
  }, {} as { [key: string]: MenuItem[] })

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mobile Menu</h1>
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-primary">${totalPrice.toFixed(2)}</span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col h-full">
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                    <p className="text-gray-500">Add some delicious items to your cart and they will appear here.</p>
                  </div>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <p className="font-bold text-lg">Total: ${totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="p-4">
                      <Button onClick={pagar} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2">
                        Pagar
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <div className="bg-white p-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => scrollToCategory(category)}
                className="flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="p-4 space-y-8">
          {categories.map(category => (
            <div key={category} ref={el => { categoryRefs.current[category] = el; return; }}>
              <h2 className="text-xl font-bold mb-4">{category}</h2>
              <div className="space-y-4">
                {groupedMenuItems[category].map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      </div>
                      <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold">{quantities[item.id]}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button onClick={() => addToCart(item)}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="fixed bottom-4 left-0 right-0 flex justify-center">
        <Button
          className="shadow-lg"
          size="lg"
          onClick={pagar}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Pay ${totalPrice.toFixed(2)}
        </Button>
      </div>
    </div>
  )
}