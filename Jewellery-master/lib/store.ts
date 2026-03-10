import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description?: string;
  category: string;
  rating?: number;
  reviewCount?: number; // ← Yeh add kiya
  inStock?: boolean;
  stockQuantity?: number | null;
}

export interface CartItem extends Product {
  quantity: number;
  cartItemId?: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncFromBackend: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
}

interface WishlistStore {
  items: Product[];
  isLoading: boolean;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  syncFromBackend: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => {
      let isSyncing = false;

      return {
        items: [],
        isLoading: false,
        syncFromBackend: async () => {
          const authStore = useAuthStore.getState();
          if (!authStore.user) return;

          if (isSyncing) return;

          isSyncing = true;
          set({ isLoading: true });
          try {
            const response = await fetch('/api/cart');
            if (response.ok) {
              const data = await response.json();
              if (data.success && data.data) {
                const backendItems: CartItem[] = data.data.items.map((item: any) => ({
                  ...item.product,
                  quantity: item.quantity,
                  cartItemId: item.id,
                }));

                const localItems = get().items;
                const mergedMap = new Map<string, CartItem>();

                localItems.forEach(item => mergedMap.set(item.id, { ...item }));
                backendItems.forEach(item => mergedMap.set(item.id, { ...item }));

                const mergedItems = Array.from(mergedMap.values());
                set({ items: mergedItems });

                const localOnly = localItems.filter(
                  local => !backendItems.some(backend => backend.id === local.id)
                );

                if (localOnly.length > 0) {
                  Promise.all(
                    localOnly.map(item =>
                      fetch('/api/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productId: item.id, quantity: item.quantity }),
                      }).catch(err => console.error(`Failed to sync item ${item.id}:`, err))
                    )
                  );
                }
              }
            }
          } catch (error) {
            console.error('Failed to sync cart from backend:', error);
            toast.error('Failed to sync cart. Some items may not be saved.');
          } finally {
            set({ isLoading: false });
            isSyncing = false;
          }
        },
        addItem: async (product, quantity = 1) => {
          if (product.inStock === false) {
            throw new Error('Product is out of stock');
          }

          if (product.stockQuantity !== undefined && product.stockQuantity !== null) {
            const items = get().items;
            const existingItem = items.find((item) => item.id === product.id);
            const currentCartQuantity = existingItem?.quantity || 0;
            const newTotalQuantity = currentCartQuantity + quantity;

            if (newTotalQuantity > product.stockQuantity) {
              throw new Error(
                `Only ${product.stockQuantity} items available. You already have ${currentCartQuantity} in cart.`
              );
            }
          }

          const items = get().items;
          const existingItem = items.find((item) => item.id === product.id);
          const oldQuantity = existingItem?.quantity || 0;

          if (existingItem) {
            set({
              items: items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            });
          } else {
            set({ items: [...items, { ...product, quantity }] });
          }

          const authStore = useAuthStore.getState();
          if (authStore.user) {
            try {
              const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id, quantity }),
              });
              if (response.ok) {
                const data = await response.json();
                if (data.success && data.data?.id) {
                  set({
                    items: get().items.map((item) =>
                      item.id === product.id
                        ? { ...item, cartItemId: data.data.id }
                        : item
                    ),
                  });
                }
              } else {
                const data = await response.json();
                console.error('Failed to add to cart:', data.error);
                if (existingItem) {
                  set({
                    items: items.map((item) =>
                      item.id === product.id ? { ...item, quantity: oldQuantity } : item
                    ),
                  });
                } else {
                  set({ items });
                }
              }
            } catch (error) {
              console.error('Failed to sync cart to backend:', error);
              toast.warning('Cart updated locally but may not sync to server');
            }
          }
        },
        removeItem: async (productId) => {
          const items = get().items;
          const itemToRemove = items.find((item) => item.id === productId);

          set({ items: items.filter((item) => item.id !== productId) });

          const authStore = useAuthStore.getState();
          if (authStore.user && itemToRemove?.cartItemId) {
            try {
              const response = await fetch(`/api/cart/${itemToRemove.cartItemId}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                set({ items: [...get().items, itemToRemove] });
                const data = await response.json();
                console.error('Failed to remove from cart:', data.error);
              }
            } catch (error) {
              set({ items: [...get().items, itemToRemove] });
              console.error('Failed to sync cart removal to backend:', error);
              toast.error('Failed to remove item. Please try again.');
            }
          }
        },
        updateQuantity: async (productId, quantity) => {
          if (quantity <= 0) {
            await get().removeItem(productId);
            return;
          }

          const items = get().items;
          const existingItem = items.find((item) => item.id === productId);

          if (!existingItem) throw new Error('Item not found in cart');

          if (existingItem.stockQuantity !== undefined && existingItem.stockQuantity !== null) {
            if (quantity > existingItem.stockQuantity) {
              throw new Error(`Only ${existingItem.stockQuantity} items available.`);
            }
          }

          const oldQuantity = existingItem.quantity;

          set({
            items: items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          });

          const authStore = useAuthStore.getState();
          if (authStore.user && existingItem?.cartItemId) {
            try {
              const response = await fetch(`/api/cart/${existingItem.cartItemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity }),
              });
              if (!response.ok) {
                set({
                  items: items.map((item) =>
                    item.id === productId ? { ...item, quantity: oldQuantity } : item
                  ),
                });
                const data = await response.json();
                console.error('Failed to update cart quantity:', data.error);
              }
            } catch (error) {
              set({
                items: items.map((item) =>
                  item.id === productId ? { ...item, quantity: oldQuantity } : item
                ),
              });
              console.error('Failed to sync cart update to backend:', error);
              toast.error('Failed to update quantity. Please try again.');
            }
          }
        },
        clearCart: async () => {
          set({ items: [] });

          const authStore = useAuthStore.getState();
          if (authStore.user) {
            try {
              await fetch('/api/cart', { method: 'DELETE' });
            } catch (error) {
              console.error('Failed to sync cart clear to backend:', error);
              toast.warning('Cart cleared locally but may not sync to server');
            }
          }
        },
        getTotal: () => {
          return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
        },
        getItemCount: () => {
          return get().items.reduce((count, item) => count + item.quantity, 0);
        },
      };
    },
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => {
      let isSyncing = false;

      return {
        items: [],
        isLoading: false,
        syncFromBackend: async () => {
          const authStore = useAuthStore.getState();
          if (!authStore.user) return;

          if (isSyncing) return;

          isSyncing = true;
          set({ isLoading: true });
          try {
            const response = await fetch('/api/wishlist');
            if (response.ok) {
              const data = await response.json();
              if (data.success && data.data) {
                const backendItems: Product[] = data.data.map((item: any) => ({
                  ...item.product,
                }));

                const localItems = get().items;
                const mergedMap = new Map<string, Product>();

                localItems.forEach(item => mergedMap.set(item.id, { ...item }));
                backendItems.forEach(item => mergedMap.set(item.id, { ...item }));

                const mergedItems = Array.from(mergedMap.values());
                set({ items: mergedItems });

                const localOnly = localItems.filter(
                  local => !backendItems.some(backend => backend.id === local.id)
                );

                if (localOnly.length > 0) {
                  Promise.all(
                    localOnly.map(item =>
                      fetch('/api/wishlist', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productId: item.id }),
                      }).catch(err => console.error(`Failed to sync wishlist item ${item.id}:`, err))
                    )
                  );
                }
              }
            }
          } catch (error) {
            console.error('Failed to sync wishlist from backend:', error);
            toast.error('Failed to sync wishlist. Some items may not be saved.');
          } finally {
            set({ isLoading: false });
            isSyncing = false;
          }
        },
        addItem: async (product) => {
          if (get().isInWishlist(product.id)) return;

          set({ items: [...get().items, product] });

          const authStore = useAuthStore.getState();
          if (authStore.user) {
            try {
              const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id }),
              });
              if (!response.ok) {
                set({ items: get().items.filter((item) => item.id !== product.id) });
                const data = await response.json();
                console.error('Failed to add to wishlist:', data.error);
              }
            } catch (error) {
              console.error('Failed to sync wishlist to backend:', error);
              toast.warning('Wishlist updated locally but may not sync to server');
            }
          }
        },
        removeItem: async (productId) => {
          const items = get().items;
          const removedItem = items.find((item) => item.id === productId);

          set({ items: items.filter((item) => item.id !== productId) });

          const authStore = useAuthStore.getState();
          if (authStore.user && removedItem) {
            try {
              const response = await fetch(`/api/wishlist?productId=${productId}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                set({ items: [...get().items, removedItem] });
                const data = await response.json();
                console.error('Failed to remove from wishlist:', data.error);
              }
            } catch (error) {
              set({ items: [...get().items, removedItem] });
              console.error('Failed to sync wishlist removal to backend:', error);
              toast.error('Failed to remove item. Please try again.');
            }
          }
        },
        isInWishlist: (productId) => {
          return get().items.some((item) => item.id === productId);
        },
      };
    },
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useAuthStore = create<AuthStore>()((set, get) => {
  let checkingAuth = false;
  let authPromise: Promise<void> | null = null;

  return {
    user: null,
    setUser: (user) => set({ user }),
    checkAuth: async () => {
      if (checkingAuth && authPromise) return authPromise;

      checkingAuth = true;

      authPromise = (async () => {
        try {
          const response = await fetch('/api/auth/me', { cache: 'no-store' });
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              set({ user: data.data });
            } else {
              set({ user: null });
            }
          } else {
            set({ user: null });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ user: null });
        } finally {
          checkingAuth = false;
          authPromise = null;
        }
      })();

      return authPromise;
    },
    logout: async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (error) {
        console.error('Logout failed:', error);
      }
      set({ user: null });
    },
  };
});