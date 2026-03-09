export const dynamic = "force-dynamic";
"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {

  const params = useSearchParams();

  const orderId = params.get("orderId");

  return (

    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-grow flex items-center justify-center px-4">

        <div className="text-center max-w-md">

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl mb-6"
          >
            🎉
          </motion.div>

          <h1 className="text-3xl font-bold mb-4">
            Order Placed Successfully
          </h1>

          <p className="text-muted-foreground mb-6">
            Thank you for shopping with Slay Sundari
          </p>

          <div className="bg-muted p-4 rounded-lg mb-6">

            <p className="text-sm text-muted-foreground">
              Your Order ID
            </p>

            <p className="font-bold text-lg">
              {orderId}
            </p>

          </div>

          <Link href="/shop">

            <Button size="lg">
              Continue Shopping
            </Button>

          </Link>

        </div>

      </main>

      <Footer />

    </div>

  );

}