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

type ProductSectionProps = {
  title: string;
};

export default function ProductSection({ title }: ProductSectionProps) {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data.slice(0, 12));
        }
      });

  }, []);

  return (

    <section className="py-16">

      <div className="container mx-auto px-4">

        <h2 className="text-3xl font-bold text-center mb-10">
          {title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

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