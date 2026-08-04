export interface BusinessConfig {
  storeName: string;
  whatsappNumber: string; // Formato internacional ej: "34600000000"
  welcomeMessage: string;
  announcementBanner?: string;
  isStoreActive: boolean;
  currencySymbol: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}
