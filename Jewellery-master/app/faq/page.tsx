"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-grow container mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

        <div className="space-y-6">

          <div>
            <h3 className="font-semibold">How long does delivery take?</h3>
            <p className="text-muted-foreground">
              Delivery usually takes 3-5 business days.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Do you offer free shipping?</h3>
            <p className="text-muted-foreground">
              Yes, we offer free shipping on orders above ₹499.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Can I return a product?</h3>
            <p className="text-muted-foreground">
              Yes, returns are accepted within 7 days of delivery.
            </p>
          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}