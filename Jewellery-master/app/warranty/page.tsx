"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function WarrantyPage() {
  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-grow container mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-6">Product Warranty</h1>

        <p className="mb-4">
          Slay Sundari jewellery comes with a limited warranty against manufacturing defects.
        </p>

        <ul className="space-y-3 list-disc ml-6">
          <li>Warranty valid for 30 days from purchase.</li>
          <li>Does not cover damage caused by misuse.</li>
          <li>Contact our support team for assistance.</li>
        </ul>

      </main>

      <Footer />

    </div>
  );
}