"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-grow container mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-6">Returns Policy</h1>

        <p className="mb-4">
          If you are not satisfied with your purchase, you may return it within 7 days.
        </p>

        <ul className="space-y-3 list-disc ml-6">
          <li>Items must be unused and in original packaging.</li>
          <li>Refund will be processed within 5 business days.</li>
          <li>Shipping charges are non-refundable.</li>
        </ul>

      </main>

      <Footer />

    </div>
  );
}