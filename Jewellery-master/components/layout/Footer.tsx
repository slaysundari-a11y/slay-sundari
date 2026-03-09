"use client";
import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="container mx-auto px-4 py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* About Section */}

          <div>
            <h3 className="text-xl font-bold mb-4">Slay Sundari</h3>

            <p className="text-slate-400 text-sm mb-4">
              Trendy and stylish jewellery designed to help you slay every look.
              Discover elegant earrings, necklaces, rings and accessories made
              for modern girls.
            </p>

            <div className="space-y-2 text-sm text-slate-400">

              <p>
                <span className="font-medium">Address:</span> Bangalore, India
              </p>

              <p>
                <span className="font-medium">Email:</span>{" "}
                <Link
                  href="mailto:slaysundari@gmail.com"
                  className="hover:text-primary"
                >
                  slaysundari@gmail.com
                </Link>
              </p>

            </div>

            {/* Instagram */}

            <div className="flex gap-4 mt-4">

              <Link
                href="https://www.instagram.com/slaysundari?igsh=YTdrM2cwZ2RjZzN6"
                target="_blank"
                className="hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>

            </div>

          </div>


          {/* Quick Links */}

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>

            <ul className="space-y-2 text-sm text-slate-400">

              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link href="/shop" className="hover:text-primary transition-colors">
                  Shop
                </Link>
              </li>

              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/cart" className="hover:text-primary transition-colors">
                  My Cart
                </Link>
              </li>

              <li>
                <Link href="/wishlist" className="hover:text-primary transition-colors">
                  Wishlist
                </Link>
              </li>

            </ul>
          </div>


          {/* Customer Service */}

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>

            <ul className="space-y-2 text-sm text-slate-400">

              <li>
                <Link href="/shipping" className="hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>

              <li>
                <Link href="/returns" className="hover:text-primary transition-colors">
                  Returns
                </Link>
              </li>

              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>

              <li>
                <Link href="/warranty" className="hover:text-primary transition-colors">
                  Warranty
                </Link>
              </li>

            </ul>
          </div>


          {/* Newsletter */}

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>

            <p className="text-sm text-slate-400 mb-4">
              Sign up for news & special offers!
            </p>

            <form
              className="space-y-2"
              onSubmit={(e) => e.preventDefault()}
            >

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>

            </form>

          </div>

        </div>


        {/* Bottom Section */}

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">

          <p>
            © {new Date().getFullYear()} Slay Sundari. All Rights Reserved.
          </p>

          <div className="mt-4 md:mt-0">

            <img
              src="/img/payment.png"
              alt="Payment Methods"
              className="h-8 opacity-60"
            />

          </div>

        </div>

      </div>
    </footer>
  );
}