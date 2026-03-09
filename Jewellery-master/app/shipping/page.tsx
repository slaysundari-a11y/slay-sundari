"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-grow container mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-6">Shipping Information</h1>

        <p className="mb-4">
          We offer fast and reliable shipping across India.
        </p>

        <ul className="space-y-3 list-disc ml-6">
          <li>Orders are processed within 24 hours.</li>
          <li>Delivery usually takes 3-5 business days.</li>
          <li>Free shipping on orders above ₹499.</li>
          <li>Tracking details will be sent via email.</li>
        </ul>

      </main>

      <Footer />

    </div>
  );
}