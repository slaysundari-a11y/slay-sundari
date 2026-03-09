"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductSection() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    fetch("/api/products")
      .then(res => res.json())
      .then(data => {

        setProducts(data.data.slice(0,12));

      });

  }, []);

  return (

    <section className="py-16">

      <div className="container mx-auto px-4">

        <h2 className="text-3xl font-bold text-center mb-10">
          New Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {products.map(product => (

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