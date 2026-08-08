export interface LandingPageConfig {
  // Hero Banner Section
  showHeroSection: boolean;
  heroBadgeText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroPrimaryCtaText: string;
  showHeroPrimaryCta: boolean;
  heroSecondaryCtaText: string;
  showHeroSecondaryCta: boolean;

  // Features Section
  showFeaturesSection: boolean;
  featuresTitle: string;
  featuresSubtitle: string;

  // Catalog Section
  showCatalogSection: boolean;
  catalogTitle: string;

  // MakerWorld / Custom Order Banner Section
  showMakerWorldSection: boolean;
  makerWorldTitle: string;
  makerWorldSubtitle: string;
  makerWorldBannerUrl: string;

  // FAQ Section
  showFaqsSection: boolean;
  faqsTitle: string;

  // Reviews Section
  showReviewsSection: boolean;
  reviewsTitle: string;

  // Footer Section
  showFooterSection: boolean;
  footerTagline: string;
}

export interface BusinessConfig {
  storeName: string;
  whatsappNumber: string; // Formato internacional ej: "34600000000"
  welcomeMessage: string;
  announcementBanner?: string;
  showAnnouncementBanner?: boolean;
  isStoreActive: boolean;
  currencySymbol: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  landingPageConfig?: LandingPageConfig;
}
