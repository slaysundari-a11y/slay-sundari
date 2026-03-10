"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/home/ProductCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
};

function ShopContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = "/api/products";

    if (category) {
      url = "/api/products?category=" + category;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, [category]);

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {category ? category + " Products" : "Shop Products"}
      </h1>

      {products.length === 0 && (
        <p className="text-gray-500">No products found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}