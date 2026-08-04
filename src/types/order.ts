export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  colorName: string;
  customNotes?: string;
}

export interface Order {
  id: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pendiente' | 'en_impresion' | 'completado' | 'cancelado';
  createdAt: string;
  notes?: string;
}
