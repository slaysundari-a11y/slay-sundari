"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Heart, ShoppingCart, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "./Navigation";
import { useCartStore, useAuthStore } from "@/lib/store";
import { Product } from "@/lib/store";
import { dedupedFetch } from "@/lib/fetch";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const data = await dedupedFetch<{
            success: boolean;
            data: Product[];
          }>(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`);

          if (data.success) {
            setSearchResults(data.data);
            setShowSearchResults(true);
          }
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      
      {/* Top Bar */}
      <div className="hidden md:block border-b bg-muted/40">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <p className="text-muted-foreground">
              FREE SHIPPING ON ORDERS OVER ₹499
            </p>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-muted-foreground">
                    Welcome, {user.name || user.email}
                  </span>

                  <Link
                    href="/account"
                    className="text-muted-foreground hover:text-primary"
                  >
                    My Account
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-primary"
                  >
                    My Account
                  </Link>

                  <Link
                    href="/register"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/img/logo-new.png"
              alt="Slay Sundari"
              width={180}
              height={70}
              priority
            />

            <div className="text-2xl font-bold text-primary">
            
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div ref={searchContainerRef} className="relative w-full">
              <form onSubmit={handleSearchSubmit}>
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </form>

              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="flex items-center gap-3 p-2 hover:bg-muted cursor-pointer"
                    >
                      <div className="relative w-16 h-16">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <p className="font-medium text-sm">
                          {product.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          ₹{product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">

            <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />

                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href={user ? "/account" : "/login"}>
                <User className="h-5 w-5" />
              </Link>
            </Button>

          </div>
        </div>
      </div>

      <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}