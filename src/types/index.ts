export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  brand: string;
  stock: number;
  images: string[];
  category: Category;
  categoryId: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  items: OrderItem[];
  createdAt: string;
  shippingAddress: string;
  city: string;
  postalCode?: string;
  phone: string;
  paymentMethod: 'CREDIT_CARD' | 'PAYPAL' | 'MOBILE_MONEY' | 'CASH_ON_DELIVERY';
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  userRole: 'USER' | 'ADMIN' | null;
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}