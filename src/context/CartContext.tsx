import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { CartItem, MenuItem, MenuItemSize } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity?: number, selectedSize?: MenuItemSize, specialInstructions?: string) => void;
  removeItem: (menuItemId: string, sizeId?: string) => void;
  updateQuantity: (menuItemId: string, quantity: number, sizeId?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  cartRef: React.RefObject<HTMLButtonElement>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cartRef = useRef<HTMLButtonElement>(null);
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('napoli-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('napoli-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (menuItem: MenuItem, quantity = 1, selectedSize?: MenuItemSize, specialInstructions = '') => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item =>
        item.menuItem.id === menuItem.id &&
        item.selectedSize?.id === selectedSize?.id
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          specialInstructions: specialInstructions || updated[existingIndex].specialInstructions
        };
        return updated;
      }

      return [...prev, { menuItem, quantity, selectedSize, specialInstructions }];
    });
  };

  const removeItem = (menuItemId: string, sizeId?: string) => {
    setItems(prev => prev.filter(item =>
      !(item.menuItem.id === menuItemId && item.selectedSize?.id === sizeId)
    ));
  };

  const updateQuantity = (menuItemId: string, quantity: number, sizeId?: string) => {
    if (quantity <= 0) {
      removeItem(menuItemId, sizeId);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.menuItem.id === menuItemId && item.selectedSize?.id === sizeId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => {
    const price = item.selectedSize?.price || item.menuItem.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
      cartRef
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
