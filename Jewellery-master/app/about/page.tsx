"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Gem, Truck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-grow">

        {/* HERO */}

        <section className="bg-gradient-to-r from-pink-100 to-purple-100 py-20">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Slay Sundari
            </h1>

            <p className="text-lg text-muted-foreground">
              Trendy jewellery designed for modern girls who love to shine.
              Discover elegant pieces that elevate every look.
            </p>
          </div>
        </section>

        {/* BRAND STORY */}

        <section className="py-16 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">

            <h2 className="text-3xl font-bold mb-6">
              Our Story
            </h2>

            <p className="text-muted-foreground mb-6">
              Slay Sundari was created with a simple vision — to bring stylish,
              elegant and affordable jewellery to every girl who loves to
              express her personality through fashion.
            </p>

            <p className="text-muted-foreground">
              Our collections include bracelets, earrings, necklaces, rings
              and accessories designed to make you feel confident and stylish
              every day.
            </p>

          </div>
        </section>

        {/* WHY CHOOSE US */}

        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">

            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Slay Sundari
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

              <Card>
                <CardContent className="pt-6 text-center">
                  <Sparkles className="mx-auto h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Trendy Designs</h3>
                  <p className="text-sm text-muted-foreground">
                    Our jewellery follows the latest fashion trends loved by
                    modern girls.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Gem className="mx-auto h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Premium Look</h3>
                  <p className="text-sm text-muted-foreground">
                    Elegant pieces designed to give a luxury feel without the
                    luxury price.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Truck className="mx-auto h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Quick shipping so you can enjoy your favourite jewellery
                    without waiting long.
                  </p>
                </CardContent>
              </Card>

            </div>

          </div>
        </section>

        {/* STATS */}

        <section className="py-16 container mx-auto px-4">

          <div className="grid md:grid-cols-3 gap-8 text-center">

            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">50+</h3>
              <p className="text-muted-foreground">Jewellery Designs</p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">1000+</h3>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">4.5⭐</h3>
              <p className="text-muted-foreground">Customer Rating</p>
            </div>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}