export interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  image_url: string;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  sizes?: MenuItemSize[];
  hasAddons?: boolean;
  flavors?: string[];
}

export interface MenuItemSize {
  id: string;
  menu_item_id: string;
  size_name: string;
  price: number;
  is_available: boolean;
  display_order: number;
  created_at: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedSize?: MenuItemSize;
  specialInstructions?: string;
}

export interface Customer {
  id?: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
}

export interface Order {
  id?: string;
  customer_id?: string | null;
  order_number?: string;
  status?: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  total_amount: number;
  delivery_address: string;
  customer_notes?: string;
  payment_status?: 'pending' | 'paid' | 'failed';
  payment_method?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  special_instructions?: string;
}
