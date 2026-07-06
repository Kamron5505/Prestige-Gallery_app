import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
  promoCode: null,
  discountPercent: 0,

  addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((item) => item._id === product._id);

        if (existing) {
          set({
            items: items.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                _id: product._id,
                name: product.name,
                price: product.discountPrice || product.price,
                originalPrice: product.price,
                image: product.images?.[0]?.url || '',
                slug: product.slug,
                quantity,
                stock: product.stock,
              },
            ],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item._id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item._id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], promoCode: null, discountPercent: 0 });
      },

      setPromoCode: (code, percent) => {
        set({ promoCode: code, discountPercent: percent });
      },

      clearPromoCode: () => {
        set({ promoCode: null, discountPercent: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const percent = get().discountPercent;
        return subtotal * percent;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        return subtotal - discount;
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'prestige-cart',
    }
  )
);

export default useCartStore;
