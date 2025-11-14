import restaurantData from '../data/restaurant-data.json';
import type { Category, MenuItem, MenuItemSize, Order, OrderItem } from '../types';

interface RestaurantData {
  exportDate: string;
  categories: Category[];
  menuItems: MenuItem[];
  menuItemSizes: MenuItemSize[];
}

class LocalDataService {
  private data: RestaurantData;
  private orders: Order[] = [];
  private orderItems: OrderItem[] = [];

  constructor() {
    this.data = restaurantData as RestaurantData;
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const savedOrders = localStorage.getItem('orders');
      const savedOrderItems = localStorage.getItem('orderItems');

      if (savedOrders) {
        this.orders = JSON.parse(savedOrders);
      }
      if (savedOrderItems) {
        this.orderItems = JSON.parse(savedOrderItems);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('orders', JSON.stringify(this.orders));
      localStorage.setItem('orderItems', JSON.stringify(this.orderItems));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getCategories(filters?: { is_active?: boolean }): Category[] {
    let filteredCategories = [...this.data.categories];

    if (filters?.is_active !== undefined) {
      filteredCategories = filteredCategories.filter(
        cat => cat.is_active === filters.is_active
      );
    }

    return filteredCategories.sort((a, b) => a.display_order - b.display_order);
  }

  getMenuItems(filters?: { category_id?: string; is_available?: boolean }): MenuItem[] {
    let filteredItems = [...this.data.menuItems];

    if (filters?.category_id) {
      filteredItems = filteredItems.filter(
        item => item.category_id === filters.category_id
      );
    }

    if (filters?.is_available !== undefined) {
      filteredItems = filteredItems.filter(
        item => item.is_available === filters.is_available
      );
    }

    // Attach sizes to menu items
    const itemsWithSizes = filteredItems.map(item => {
      const sizes = this.data.menuItemSizes.filter(
        size => size.menu_item_id === item.id && size.is_available
      ).sort((a, b) => a.display_order - b.display_order);

      return {
        ...item,
        sizes
      };
    });

    return itemsWithSizes.sort((a, b) => a.display_order - b.display_order);
  }

  getMenuItemById(id: string): MenuItem | undefined {
    return this.data.menuItems.find(item => item.id === id);
  }

  addMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): MenuItem {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.menuItems.push(newItem);
    this.saveDataToLocalStorage();
    return newItem;
  }

  updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const index = this.data.menuItems.findIndex(item => item.id === id);
    if (index !== -1) {
      this.data.menuItems[index] = {
        ...this.data.menuItems[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      this.saveDataToLocalStorage();
      return this.data.menuItems[index];
    }
    return null;
  }

  deleteMenuItem(id: string): boolean {
    this.data.menuItems = this.data.menuItems.filter(item => item.id !== id);
    this.saveDataToLocalStorage();
    return true;
  }

  createOrder(
    order: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>,
    items: Omit<OrderItem, 'id' | 'order_id'>[]
  ): { order: Order; items: OrderItem[] } {
    const orderNumber = `ORD-${Date.now()}`;
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      order_number: orderNumber,
      status: 'pending',
      payment_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.orders.push(newOrder);

    const newOrderItems = items.map(item => ({
      ...item,
      id: `order-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order_id: newOrder.id!
    }));

    this.orderItems.push(...newOrderItems);
    this.saveToLocalStorage();

    return { order: newOrder, items: newOrderItems };
  }

  private saveDataToLocalStorage() {
    try {
      localStorage.setItem('menuItems', JSON.stringify(this.data.menuItems));
      localStorage.setItem('categories', JSON.stringify(this.data.categories));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }
}

export const localDataService = new LocalDataService();
