"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useCartStore, useAuthStore } from "@/lib/store";
import { toast } from "sonner";

export default function CheckoutPage() {

  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });

  // 🔐 LOGIN REQUIRED
  useEffect(() => {

    if (!user) {

      toast.error("Please login to checkout");

      router.push("/login");

    }

  }, [user, router]);

  // 🛒 EMPTY CART REDIRECT
  useEffect(() => {

    if (items.length === 0) {

      router.push("/shop");

    }

  }, [items, router]);

  const subtotal = getTotal();
  const shipping = subtotal > 499 ? 0 : 50;
  const gst = subtotal * 0.18;
  const total = subtotal + shipping + gst;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

  };

  const handlePlaceOrder = async () => {

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.pincode
    ) {

      toast.error("Please fill all required fields");
      return;

    }

    setLoading(true);

    try {

      const orderId = "ORD-" + Math.floor(Math.random() * 1000000);

      clearCart();

      toast.success("Order placed successfully!");

      setTimeout(() => {

        router.push(`/order-success?orderId=${orderId}`);

      }, 800);

    } catch (error: any) {

      toast.error(error.message || "Order failed");

    } finally {

      setLoading(false);

    }

  };

  if (items.length === 0) {

    return (

      <div className="min-h-screen flex flex-col">

        <Header />

        <main className="flex-grow container mx-auto px-4 py-8 text-center">

          <p className="text-xl mb-4">Your cart is empty</p>

          <Button asChild>
            <a href="/shop">Continue Shopping</a>
          </Button>

        </main>

        <Footer />

      </div>

    );

  }

  return (

    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Billing Form */}

          <div>

            <Card>

              <CardHeader>
                <CardTitle>Billing Details</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <Label>First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <div>
                  <Label>Email *</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <Label>City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <div>
                  <Label>Order Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Special instructions for delivery"
                  />
                </div>

              </CardContent>

            </Card>

          </div>

          {/* Order Summary */}

          <div>

            <Card className="sticky top-24">

              <CardHeader>
                <CardTitle>Your Order</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                {items.map((item) => (

                  <div key={item.id} className="flex gap-4">

                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">

                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />

                    </div>

                    <div className="flex-1">

                      <p className="font-medium">
                        {item.name}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <p className="font-medium">
                      ₹{item.price * item.quantity}
                    </p>

                  </div>

                ))}

                <div className="border-t pt-4 space-y-2">

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                </div>

                <Button
                  type="button"
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >

                  {loading ? "Placing Order..." : "Place Order"}

                </Button>

              </CardContent>

            </Card>

          </div>

        </div>

      </main>

      <Footer />

    </div>

  );

}