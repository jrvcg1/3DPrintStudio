export type OrderStatus =
  | 'pending_approval'           // Pendiente de Aceptación por el Admin
  | 'pending_payment'            // Pendiente de Pago por Bizum (Aceptado por Admin)
  | 'in_production'             // En Fabricación / Pagado
  | 'completed_pending_delivery' // Finalizado / Pendiente de Entrega
  | 'delivered'                  // Entregado (inicia cuenta atrás de 24h)
  | 'received'                   // Recibido por el Cliente
  | 'cancelled';                 // Cancelado

export interface OrderItem {
  productId: string;
  productSku: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  selectedColor?: string;
  customText?: string;
  totalPrice: number;
}

export interface OrderMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'user';
  text: string;
  timestamp: string;
  isReadByClient?: boolean;
  isReadByAdmin?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;          // Ej: #ORD-1042
  userId: string;
  userName: string;
  userEmail: string;
  contactPhone?: string;
  shippingAddress?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  bizumPhone: string;
  createdAt: string;
  acceptedAt?: string;
  paidAt?: string;
  inProductionAt?: string;
  deliveredAt?: string;
  receivedAt?: string;
  userReviewSubmitted?: boolean;
  notes?: string;
  messages?: OrderMessage[];
  unreadClientMessagesCount?: number;
  unreadAdminMessagesCount?: number;
}
