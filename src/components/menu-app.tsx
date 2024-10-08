'use client'

import { useState, useRef } from 'react'
import { Plus, Minus, ShoppingCart, CreditCard, ShoppingBag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
}

interface CartItem extends MenuItem {
  quantity: number
}


const menuItems: MenuItem[] = [
  { id: 1, name: "Classic Burger", description: "Juicy beef patty with lettuce, tomato, and cheese", price: 9.99, category: "Burgers" },
  { id: 2, name: "Veggie Pizza", description: "Assorted vegetables on a crispy crust", price: 11.99, category: "Pizza" },
  { id: 3, name: "Caesar Salad", description: "Crisp romaine lettuce with Caesar dressing and croutons", price: 7.99, category: "Salads" },
  { id: 4, name: "Grilled Chicken Sandwich", description: "Tender grilled chicken breast with avocado and bacon", price: 10.99, category: "Sandwiches" },
  { id: 5, name: "Spaghetti Bolognese", description: "Al dente spaghetti with rich meat sauce", price: 12.99, category: "Pasta" },
  { id: 6, name: "Margherita Pizza", description: "Classic pizza with tomato, mozzarella, and basil", price: 10.99, category: "Pizza" },
  { id: 7, name: "Greek Salad", description: "Fresh vegetables, feta cheese, and olives", price: 8.99, category: "Salads" },
  { id: 8, name: "Cheeseburger", description: "Beef patty with melted cheese and pickles", price: 8.99, category: "Burgers" },
  { id: 9, name: "Chicken Wings", description: "Crispy wings with your choice of sauce", price: 10.99, category: "Appetizers" },
  { id: 10, name: "Fish and Chips", description: "Crispy battered fish with golden fries", price: 13.99, category: "Seafood" },
]

export function MenuApp() { // Accept the prop here
  const [cart, setCart] = useState<CartItem[]>([])
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    Object.fromEntries(menuItems.map(item => [item.id, 1]))
  )
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const addToCart = (item: MenuItem) => {
    const quantity = quantities[item.id]
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id)
      if (existingItemIndex !== -1) {
        // Item already in cart, update quantity
        return prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      } else {
        // Item not in cart, add new item
        return [...prevCart, { ...item, quantity }]
      }
    })

    // Reset quantity to 1 after adding to cart
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [item.id]: 1
    }))
  }

  const updateQuantity = (id: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, prev[id] + delta)
    }))
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
                      <Button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2">
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
          onClick={() => {
            // Add payment logic here
            console.log("Processing payment for", totalItems, "items. Total: $", totalPrice.toFixed(2))
          }}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Pay ${totalPrice.toFixed(2)}
        </Button>
      </div>
    </div>
  )
}