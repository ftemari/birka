'use client'
import { useState, useRef, useEffect } from 'react'
import { Plus, Minus, ShoppingCart, CreditCard, ShoppingBag, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

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

export default function MenuStep() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    Object.fromEntries(menuItems.map(item => [item.id, 1]))
  )
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [tipPercentage, setTipPercentage] = useState<number | 'custom'>(10)
  const [customTip, setCustomTip] = useState('')
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status = params.get('status')
    if (status === 'success') {
      setCurrentStep(3)
      setOrderNumber(Math.random().toString(36).substr(2, 9).toUpperCase())
    }
  }, [])

  const addToCart = (item: MenuItem) => {
    const quantity = quantities[item.id]
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id)
      if (existingItemIndex !== -1) {
        return prevCart.map((cartItem, index) => 
          index === existingItemIndex 
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      } else {
        return [...prevCart, { ...item, quantity }]
      }
    })
    
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

  const updateCartQuantity = (id: number, newQuantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      ).filter(item => item.quantity > 0)
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tipAmount = tipPercentage === 'custom' 
  ? parseFloat(customTip) || 0 
  : (subtotal * tipPercentage) / 100
  const totalPrice = subtotal + tipAmount

  const categories = Array.from(new Set(menuItems.map(item => item.category)))

  const scrollToCategory = (category: string) => {
    setSelectedCategory(category)
    const categoryElement = categoryRefs.current[category]
    if (categoryElement && scrollAreaRef.current) {
    //   const scrollArea = scrollAreaRef.current
      categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const groupedMenuItems = categories.reduce((acc, category) => {
    acc[category] = menuItems.filter(item => item.category === category)
    return acc
  }, {} as { [key: string]: MenuItem[] })

  const handlePayment = () => {
    // In a real application, you would redirect to Mercadopago here
    window.location.href = `https://example.com/mercadopago-payment?amount=${totalPrice.toFixed(2)}`
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
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
              <div className="p-4 space-y-8 pb-24">
                {categories.map(category => (
                  <div key={category} ref={el => { categoryRefs.current[category] = el; }}>
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
                onClick={() => setCurrentStep(2)}
                disabled={cart.length === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Proceed to Checkout (${totalPrice.toFixed(2)})
              </Button>
            </div>
          </>
        )
      case 2:
        return (
          <div className="p-4 space-y-6">
            <h2 className="text-2xl font-bold">Checkout</h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Tip</span>
                <div className="flex items-center space-x-2">
                  {[0, 10, 15, 20, 'custom'].map((percentage, index) => (
                    <Button
                      key={index}
                      variant={tipPercentage === percentage ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setTipPercentage(percentage as number | 'custom')
                        if (percentage !== 'custom') setCustomTip('')
                      }}
                    >
                      {percentage === 'custom' ? 'Other' : `${percentage}%`}
                    </Button>
                  ))}
                </div>
              </div>
              {tipPercentage === 'custom' && (
                <div className="mt-2">
                  <Input
                    type="number"
                    placeholder="Enter custom tip amount"
                    value={customTip}
                    onChange={(e) => setCustomTip(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
              <div className="flex justify-between mt-2">
                <span>Tip amount</span>
                <span>${tipAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-4 text-lg font-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={handlePayment}>
              <CreditCard className="mr-2 h-4 w-4" />
              Proceed to Payment
            </Button>
          </div>
        )
      case 3:
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="flex items-center justify-center w-32 h-32 rounded-full bg-green-100 mb-6">
              <Check className="h-16 w-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="mb-4">Your order has been confirmed.</p>
            <p className="text-lg font-semibold mb-6">Order #: {orderNumber}</p>
            {/* <img
              src="/placeholder.svg?height=200&width=200"
              alt="QR Code"
              className="w-48 h-48 border border-gray-300 rounded-lg mb-6"
            /> */}
            <p>Please show this QR code to the waiter.</p>
            <Button className="mt-6" onClick={() => {
              setCart([])
              setCurrentStep(1)
            }}>
              Place Another Order
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Mobile Menu</h1>
          {currentStep < 3 && (
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
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center  justify-center h-[300px] text-center">
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
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
        <Progress value={currentStep * 33.33} className="w-full" />
        <div className="flex justify-between mt-2 text-sm">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              onClick={() => currentStep >= step && setCurrentStep(step)}
              className={`flex items-center ${currentStep >= step ? "font-bold" : "text-gray-500"} ${currentStep < step ? "cursor-not-allowed" : "cursor-pointer"}`}
              disabled={currentStep < step}
            >
              <span className={`inline-flex items-center justify-center w-6 h-6 mr-2 rounded-full ${currentStep >= step ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-600"}`}>
                {step}
              </span>
              {step === 1 ? "Select" : step === 2 ? "Checkout" : "Confirmation"}
            </button>
          ))}
        </div>
      </header>
      {renderStep()}
    </div>
  )
}
