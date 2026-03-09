"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

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

export default function FeaturedProducts() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data.slice(0,6));
        }
      });
  }, []);

  return (

    <section className="py-16">

      <div className="container mx-auto px-4">

        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

          {products.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

        </div>

      </div>

    </section>

  );
}