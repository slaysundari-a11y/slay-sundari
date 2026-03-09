"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AccountPage() {

  const router = useRouter();

  const { user, checkAuth } = useAuthStore();

  const [activeTab, setActiveTab] = useState("profile");

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {

    if (user) {

      const nameParts = user.name?.split(" ") || [];

      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        phone: user.phone || "",
      });

    } else if (user === null) {

      router.push("/login");

    }

  }, [user]);

  // FETCH ORDERS

  useEffect(() => {

    const fetchOrders = async () => {

      if (!user || activeTab !== "orders") return;

      try {

        const res = await fetch("/api/orders");

        const data = await res.json();

        if (data.success) {

          setOrders(data.data);

        }

      } catch (error) {

        console.error("Failed to load orders");

      } finally {

        setLoadingOrders(false);

      }

    };

    fetchOrders();

  }, [activeTab, user]);

  // FETCH ADDRESSES

  useEffect(() => {

    const fetchAddresses = async () => {

      if (!user || activeTab !== "addresses") return;

      try {

        const res = await fetch("/api/addresses");

        const data = await res.json();

        if (data.success) {

          setAddresses(data.data);

        }

      } catch (error) {

        console.error("Failed to load addresses");

      } finally {

        setLoadingAddresses(false);

      }

    };

    fetchAddresses();

  }, [activeTab, user]);

  const handleDeleteAddress = async (addressId: string) => {

    if (!confirm("Delete this address?")) return;

    setDeletingAddressId(addressId);

    try {

      const res = await fetch(`/api/addresses/${addressId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {

        setAddresses(addresses.filter(a => a.id !== addressId));

        toast.success("Address deleted");

      }

    } catch {

      toast.error("Failed to delete address");

    } finally {

      setDeletingAddressId(null);

    }

  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setSaving(true);

    const fullName = `${formData.firstName} ${formData.lastName}`;

    try {

      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (data.success) {

        setMessage({ type: "success", text: "Profile updated successfully" });

        await checkAuth();

      }

    } catch {

      setMessage({ type: "error", text: "Failed to update profile" });

    } finally {

      setSaving(false);

    }

  };

  if (!user) {

    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  }

  return (

    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          <TabsList className="grid w-full grid-cols-5">

            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>

          </TabsList>

          {/* PROFILE */}

          <TabsContent value="profile">

            <Card>

              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your details
                </CardDescription>
              </CardHeader>

              <CardContent>

                <form onSubmit={handleSubmit} className="space-y-4">

                  {message && (
                    <div className={`p-3 rounded-md ${
                      message.type === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {message.text}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <Label>First Name</Label>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={(e)=>setFormData({...formData,firstName:e.target.value})}
                      />
                    </div>

                    <div>
                      <Label>Last Name</Label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e)=>setFormData({...formData,lastName:e.target.value})}
                      />
                    </div>

                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input value={user.email} disabled />
                  </div>

                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e)=>setFormData({...formData,phone:e.target.value})}
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>

                </form>

              </CardContent>

            </Card>

          </TabsContent>

          {/* ORDERS */}

          <TabsContent value="orders">

            <Card>

              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View your orders
                </CardDescription>
              </CardHeader>

              <CardContent>

                {loadingOrders ? (

                  <p>Loading orders...</p>

                ) : orders.length === 0 ? (

                  <p>No orders yet</p>

                ) : (

                  <div className="space-y-4">

                    {orders.map((order) => (

                      <div key={order.id} className="border p-4 rounded-lg">

                        <div className="flex justify-between">

                          <div>

                            <p className="font-semibold">
                              Order #{order.id.slice(-6)}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>

                          </div>

                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                            Placed
                          </span>

                        </div>

                        <p className="font-bold mt-2">
                          ₹{order.total}
                        </p>

                      </div>

                    ))}

                  </div>

                )}

              </CardContent>

            </Card>

          </TabsContent>

          {/* ADDRESSES */}

          <TabsContent value="addresses">

            <Card>

              <CardHeader>
                <CardTitle>Saved Addresses</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                {loadingAddresses ? (

                  <p>Loading addresses...</p>

                ) : addresses.length === 0 ? (

                  <Button onClick={()=>router.push("/checkout")}>
                    Add Address
                  </Button>

                ) : (

                  addresses.map(addr => (

                    <div key={addr.id} className="border p-4 rounded-lg">

                      <p className="font-semibold">{addr.fullName}</p>

                      <p>{addr.addressLine1}</p>

                      <p>{addr.city} {addr.postalCode}</p>

                      <p>{addr.phone}</p>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={()=>handleDeleteAddress(addr.id)}
                        disabled={deletingAddressId===addr.id}
                      >
                        Delete
                      </Button>

                    </div>

                  ))

                )}

              </CardContent>

            </Card>

          </TabsContent>

          {/* PAYMENT */}

          <TabsContent value="payment">

            <Card>

              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>

              <CardContent>

                <p>No saved payment methods</p>

              </CardContent>

            </Card>

          </TabsContent>

          {/* WISHLIST */}

          <TabsContent value="wishlist">

            <Card>

              <CardHeader>
                <CardTitle>Wishlist</CardTitle>
              </CardHeader>

              <CardContent>

                <Button onClick={()=>router.push("/wishlist")}>
                  View Wishlist
                </Button>

              </CardContent>

            </Card>

          </TabsContent>

        </Tabs>

      </main>

      <Footer />

    </div>

  );

}