export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'impresion' | 'envios' | 'personalizaciones' | 'general';
}

export interface Review {
  id: string;
  author: string;
  avatarUrl?: string;
  comment: string;
  rating: number; // 1 a 5
  productName?: string;
  date: string;
  verified: boolean;
}
