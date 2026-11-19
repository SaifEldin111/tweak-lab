/**
 * ============================================================================
 * TWEAK LAB — GAMING STORE PRODUCTS & PRICING CATALOG (PSN & STEAM WALLET)
 * ============================================================================
 * عدّل أي سعر (priceEgp / originalPrice / discountPercent) أو أضف/عدّل أي فئة هنا بسهولة،
 * وسيتم تحديث صفحة المتجر (/store) والتحقق من الأسعار في السيرفر تلقائياً.
 */

const STORE_CATEGORIES = [
  { id: 'psn', label: 'PlayStation (PSN)', labelAr: 'بطاقات PlayStation (PSN)', icon: '🎮', status: 'active' },
  { id: 'steam', label: 'Steam Wallet (PC)', labelAr: 'بطاقات Steam Wallet (PC)', icon: '💻', status: 'active' },
  { id: 'topup-soon', label: 'Game Top-Ups', labelAr: 'شحن الألعاب', icon: '🔒', badge: 'Coming Soon', badgeAr: 'قريباً', status: 'coming_soon' }
];

const PSN_REGIONS = [
  { id: 'US', flag: '🇺🇸', nameAr: 'أمريكي', nameEn: 'USA', code: 'US', currency: 'USD', badge: 'حساب أمريكي (USA)' },
  { id: 'SA', flag: '🇸🇦', nameAr: 'سعودي', nameEn: 'Saudi', code: 'SA', currency: 'USD', badge: 'حساب سعودي (KSA)' },
  { id: 'UAE', flag: '🇦🇪', nameAr: 'إماراتي', nameEn: 'UAE', code: 'UAE', currency: 'USD', badge: 'حساب إماراتي (UAE)' },
  { id: 'TR', flag: '🇹🇷', nameAr: 'تركي', nameEn: 'Turkey', code: 'TR', currency: 'TRY', badge: 'حساب تركي (Turkey)' }
];

const STORE_PRODUCTS = [
  // ==========================================================================
  // 1. PLAYSTATION GIFT CARDS (PSN) — أمريكي (US)
  // ==========================================================================
  {
    id: 'psn-us-10',
    category: 'psn',
    region: 'US',
    regionLabel: 'أمريكي (US)',
    flag: '🇺🇸',
    title: 'بطاقة PlayStation PSN $10',
    fullTitle: 'بطاقة PlayStation PSN أمريكي (US) — $10',
    valueLabel: '$10',
    subtitle: 'بطاقة شحن رقمية لستور بلايستيشن — بتوصلك كود رسمي بتدخله في حسابك عشان تشحن المحفظة وتشتري ألعابك أو اشتراك البلس.',
    originalPrice: 640,
    priceEgp: 575,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: ''
  },
  {
    id: 'psn-us-20',
    category: 'psn',
    region: 'US',
    regionLabel: 'أمريكي (US)',
    flag: '🇺🇸',
    title: 'بطاقة PlayStation PSN $20',
    fullTitle: 'بطاقة PlayStation PSN أمريكي (US) — $20',
    valueLabel: '$20',
    subtitle: 'رصيد متجر بلايستيشن الأمريكي • تفعيل فوري على حسابك',
    originalPrice: 1260,
    priceEgp: 1130,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: ''
  },
  {
    id: 'psn-us-50',
    category: 'psn',
    region: 'US',
    regionLabel: 'أمريكي (US)',
    flag: '🇺🇸',
    title: 'بطاقة PlayStation PSN $50',
    fullTitle: 'بطاقة PlayStation PSN أمريكي (US) — $50',
    valueLabel: '$50',
    subtitle: 'مثالية للألعاب الجديدة واشتراك PS Plus الأمريكي',
    originalPrice: 3100,
    priceEgp: 2790,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: '🔥 الأكثر طلباً'
  },
  {
    id: 'psn-us-100',
    category: 'psn',
    region: 'US',
    regionLabel: 'أمريكي (US)',
    flag: '🇺🇸',
    title: 'بطاقة PlayStation PSN $100',
    fullTitle: 'بطاقة PlayStation PSN أمريكي (US) — $100',
    valueLabel: '$100',
    subtitle: 'أفضل قيمة لشحن المحفظة وشراء ألعاب الـ AAA والاشتراكات',
    originalPrice: 6150,
    priceEgp: 5530,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: '💎 أفضل قيمة'
  },

  // ==========================================================================
  // 2. PLAYSTATION GIFT CARDS (PSN) — سعودي (SA)
  // ==========================================================================
  {
    id: 'psn-sa-10',
    category: 'psn',
    region: 'SA',
    regionLabel: 'سعودي (SA)',
    flag: '🇸🇦',
    title: 'بطاقة PlayStation PSN $10',
    fullTitle: 'بطاقة PlayStation PSN سعودي (SA) — $10',
    valueLabel: '$10',
    subtitle: 'رصيد الستور السعودي • كود رقمي رسمي مضمون',
    originalPrice: 660,
    priceEgp: 595,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: ''
  },
  {
    id: 'psn-sa-20',
    category: 'psn',
    region: 'SA',
    regionLabel: 'سعودي (SA)',
    flag: '🇸🇦',
    title: 'بطاقة PlayStation PSN $20',
    fullTitle: 'بطاقة PlayStation PSN سعودي (SA) — $20',
    valueLabel: '$20',
    subtitle: 'رصيد الستور السعودي • مناسب للـ DLC والباتل باس',
    originalPrice: 1300,
    priceEgp: 1170,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: ''
  },
  {
    id: 'psn-sa-50',
    category: 'psn',
    region: 'SA',
    regionLabel: 'سعودي (SA)',
    flag: '🇸🇦',
    title: 'بطاقة PlayStation PSN $50',
    fullTitle: 'بطاقة PlayStation PSN سعودي (SA) — $50',
    valueLabel: '$50',
    subtitle: 'مثالية لشراء الألعاب وتجديد PS Plus السعودي',
    originalPrice: 3180,
    priceEgp: 2860,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: '🔥 الأكثر طلباً'
  },
  {
    id: 'psn-sa-100',
    category: 'psn',
    region: 'SA',
    regionLabel: 'سعودي (SA)',
    flag: '🇸🇦',
    title: 'بطاقة PlayStation PSN $100',
    fullTitle: 'بطاقة PlayStation PSN سعودي (SA) — $100',
    valueLabel: '$100',
    subtitle: 'شحن رصيد كامل للستور السعودي بأعلى أمان وسرعة',
    originalPrice: 6300,
    priceEgp: 5680,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: '💎 أفضل قيمة'
  },

  // ==========================================================================
  // 3. PLAYSTATION GIFT CARDS (PSN) — إماراتي (UAE)
  // ==========================================================================
  {
    id: 'psn-uae-10',
    category: 'psn',
    region: 'UAE',
    regionLabel: 'إماراتي (UAE)',
    flag: '🇦🇪',
    title: 'بطاقة PlayStation PSN $10',
    fullTitle: 'بطاقة PlayStation PSN إماراتي (UAE) — $10',
    valueLabel: '$10',
    subtitle: 'رصيد الستور الإماراتي • كود رقمي رسمي 100%',
    originalPrice: 660,
    priceEgp: 595,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: ''
  },
  {
    id: 'psn-uae-20',
    category: 'psn',
    region: 'UAE',
    regionLabel: 'إماراتي (UAE)',
    flag: '🇦🇪',
    title: 'بطاقة PlayStation PSN $20',
    fullTitle: 'بطاقة PlayStation PSN إماراتي (UAE) — $20',
    valueLabel: '$20',
    subtitle: 'رصيد الستور الإماراتي • تفعيل مباشر وسريع',
    originalPrice: 1300,
    priceEgp: 1170,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: ''
  },
  {
    id: 'psn-uae-50',
    category: 'psn',
    region: 'UAE',
    regionLabel: 'إماراتي (UAE)',
    flag: '🇦🇪',
    title: 'بطاقة PlayStation PSN $50',
    fullTitle: 'بطاقة PlayStation PSN إماراتي (UAE) — $50',
    valueLabel: '$50',
    subtitle: 'مناسبة للألعاب الحصرية واشتراكات PS Plus الإماراتي',
    originalPrice: 3180,
    priceEgp: 2860,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: '🔥 الأكثر طلباً'
  },
  {
    id: 'psn-uae-100',
    category: 'psn',
    region: 'UAE',
    regionLabel: 'إماراتي (UAE)',
    flag: '🇦🇪',
    title: 'بطاقة PlayStation PSN $100',
    fullTitle: 'بطاقة PlayStation PSN إماراتي (UAE) — $100',
    valueLabel: '$100',
    subtitle: 'شحن محفظة الستور الإماراتي بأفضل سعر في مصر',
    originalPrice: 6300,
    priceEgp: 5680,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: '💎 أفضل قيمة'
  },

  // ==========================================================================
  // 4. PLAYSTATION GIFT CARDS (PSN) — تركي (TR)
  // ==========================================================================
  {
    id: 'psn-tr-250',
    category: 'psn',
    region: 'TR',
    regionLabel: 'تركي (TR)',
    flag: '🇹🇷',
    title: 'بطاقة PlayStation PSN 250 TL',
    fullTitle: 'بطاقة PlayStation PSN تركي (TR) — 250 TL',
    valueLabel: '250 TL',
    subtitle: 'رصيد الستور التركي بالليرة • أرخص عروض ألعاب PSN',
    originalPrice: 520,
    priceEgp: 465,
    discountPercent: 11,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: ''
  },
  {
    id: 'psn-tr-500',
    category: 'psn',
    region: 'TR',
    regionLabel: 'تركي (TR)',
    flag: '🇹🇷',
    title: 'بطاقة PlayStation PSN 500 TL',
    fullTitle: 'بطاقة PlayStation PSN تركي (TR) — 500 TL',
    valueLabel: '500 TL',
    subtitle: 'الأكثر مبيعاً لشحن الستور التركي وشراء الألعاب',
    originalPrice: 1010,
    priceEgp: 910,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: '🔥 الأكثر طلباً'
  },
  {
    id: 'psn-tr-1000',
    category: 'psn',
    region: 'TR',
    regionLabel: 'تركي (TR)',
    flag: '🇹🇷',
    title: 'بطاقة PlayStation PSN 1,000 TL',
    fullTitle: 'بطاقة PlayStation PSN تركي (TR) — 1,000 TL',
    valueLabel: '1,000 TL',
    subtitle: 'أفضل توفير للستور التركي واشتراك PS Plus السنوي',
    originalPrice: 1980,
    priceEgp: 1780,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: '💎 أفضل قيمة'
  },

  // ==========================================================================
  // 5. STEAM WALLET (PC) — USD (Global / Egypt & MENA)
  // ==========================================================================
  {
    id: 'steam-usd-5',
    category: 'steam',
    region: 'USD',
    regionLabel: 'USD (Global / Egypt & MENA)',
    flag: '🌐',
    title: 'بطاقة Steam Wallet $5',
    fullTitle: 'بطاقة Steam Wallet (PC) — $5 USD (Global / Egypt & MENA)',
    valueLabel: '$5',
    subtitle: 'شغالة على الحساب المصري والأمريكي • كود رقمي أصلي 100% وتسليم فوري',
    subtitleEn: 'Works on Egypt & US Steam accounts • 100% official code with instant delivery',
    compatibilityBadgeEn: '🇪🇬🇺🇸 Egypt & US Accounts • Instant Code',
    compatibilityBadgeAr: '🇪🇬🇺🇸 شغال على الحساب المصري والأمريكي • تسليم فوري',
    originalPrice: 330,
    priceEgp: 295,
    discountPercent: 11,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: ''
  },
  {
    id: 'steam-usd-10',
    category: 'steam',
    region: 'USD',
    regionLabel: 'USD (Global / Egypt & MENA)',
    flag: '🌐',
    title: 'بطاقة Steam Wallet $10',
    fullTitle: 'بطاقة Steam Wallet (PC) — $10 USD (Global / Egypt & MENA)',
    valueLabel: '$10',
    subtitle: 'شغالة على الحساب المصري والأمريكي • لشراء الألعاب وتخفيضات Steam',
    subtitleEn: 'Works on Egypt & US Steam accounts • Ideal for Steam sales & DLCs',
    compatibilityBadgeEn: '🇪🇬🇺🇸 Egypt & US Accounts • Instant Code',
    compatibilityBadgeAr: '🇪🇬🇺🇸 شغال على الحساب المصري والأمريكي • تسليم فوري',
    originalPrice: 640,
    priceEgp: 575,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: ''
  },
  {
    id: 'steam-usd-20',
    category: 'steam',
    region: 'USD',
    regionLabel: 'USD (Global / Egypt & MENA)',
    flag: '🌐',
    title: 'بطاقة Steam Wallet $20',
    fullTitle: 'بطاقة Steam Wallet (PC) — $20 USD (Global / Egypt & MENA)',
    valueLabel: '$20',
    subtitle: 'شغالة على الحساب المصري والأمريكي • مثالية لألعاب الأونلاين والـ Battle Pass',
    subtitleEn: 'Works on Egypt & US Steam accounts • Great for competitive PC games & passes',
    compatibilityBadgeEn: '🇪🇬🇺🇸 Egypt & US Accounts • Instant Code',
    compatibilityBadgeAr: '🇪🇬🇺🇸 شغال على الحساب المصري والأمريكي • تسليم فوري',
    originalPrice: 1260,
    priceEgp: 1130,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: '🔥 الأكثر طلباً'
  },
  {
    id: 'steam-usd-50',
    category: 'steam',
    region: 'USD',
    regionLabel: 'USD (Global / Egypt & MENA)',
    flag: '🌐',
    title: 'بطاقة Steam Wallet $50',
    fullTitle: 'بطاقة Steam Wallet (PC) — $50 USD (Global / Egypt & MENA)',
    valueLabel: '$50',
    subtitle: 'شغالة على الحساب المصري والأمريكي • مثالية لألعاب الـ AAA الجديدة',
    subtitleEn: 'Works on Egypt & US Steam accounts • Perfect for new AAA releases on PC',
    compatibilityBadgeEn: '🇪🇬🇺🇸 Egypt & US Accounts • Instant Code',
    compatibilityBadgeAr: '🇪🇬🇺🇸 شغال على الحساب المصري والأمريكي • تسليم فوري',
    originalPrice: 3100,
    priceEgp: 2790,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: '🔥 الأكثر طلباً'
  },
  {
    id: 'steam-usd-100',
    category: 'steam',
    region: 'USD',
    regionLabel: 'USD (Global / Egypt & MENA)',
    flag: '🌐',
    title: 'بطاقة Steam Wallet $100',
    fullTitle: 'بطاقة Steam Wallet (PC) — $100 USD (Global / Egypt & MENA)',
    valueLabel: '$100',
    subtitle: 'شغالة على الحساب المصري والأمريكي • أعلى توفير لشحن محفظة Steam بالكامل',
    subtitleEn: 'Works on Egypt & US Steam accounts • Maximum savings for full Steam Wallet top-up',
    compatibilityBadgeEn: '🇪🇬🇺🇸 Egypt & US Accounts • Instant Code',
    compatibilityBadgeAr: '🇪🇬🇺🇸 شغال على الحساب المصري والأمريكي • تسليم فوري',
    originalPrice: 6150,
    priceEgp: 5530,
    discountPercent: 10,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم فوري',
    requiresAccount: false,
    tag: '💎 أفضل قيمة'
  },

  // ==========================================================================
  // 6. GTA VI PS5 OFFICIAL US PSN BUNDLES (FEATURED HERO CAROUSEL BUNDLES)
  // ==========================================================================
  {
    id: 'gta6-psn-us-70',
    category: 'gta6',
    region: 'US',
    regionLabel: 'أمريكي (US)',
    flag: '🇺🇸',
    title: 'باقة GTA VI Standard ($70 PSN US)',
    titleEn: 'GTA VI Standard Pack ($50 + $20 = $70 PSN US)',
    fullTitle: 'باقة GTA VI Standard (PS5) — $70 PSN US ($50 + $20 كودين رسميين)',
    valueLabel: '$70 ($50 + $20)',
    subtitle: 'كودين PSN أمريكي رسميين ($50 + $20 = $70) لشحن حسابك الشخصي وشراء GTA VI فوراً',
    subtitleEn: '2 Official US PSN Codes ($50 + $20 = $70) — safe on your personal PS5 account with instant delivery',
    originalPrice: 4360,
    priceEgp: 3850,
    discountPercent: 12,
    codeCount: 2,
    codeLabels: ['Code 1 - $50', 'Code 2 - $20'],
    deliveryType: 'digital_code',
    deliveryBadge: 'كودين رقميين ($50 + $20) • تسليم فوري',
    requiresAccount: false,
    tag: '🔥 الأكثر طلباً لـ GTA VI'
  },
  {
    id: 'gta6-psn-us-100',
    category: 'gta6',
    region: 'US',
    regionLabel: 'أمريكي (US)',
    flag: '🇺🇸',
    title: 'باقة GTA VI Ultimate ($100 PSN US)',
    titleEn: 'GTA VI Ultimate Pack ($100 PSN US)',
    fullTitle: 'باقة GTA VI Ultimate (PS5) — $100 PSN US (كود رسمي شامل)',
    valueLabel: '$100',
    subtitle: 'كود PSN أمريكي رسمي $100 يغطي اللعبة كاملة + الضرائب أو الإضافات على PS5 بتسليم فوري',
    subtitleEn: '1 Official $100 US PSN Code covering Full Game + US Store Tax or Deluxe content on PS5',
    originalPrice: 6150,
    priceEgp: 5450,
    discountPercent: 11,
    codeCount: 1,
    codeLabels: ['Code - $100'],
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي رسمي ($100) • تسليم فوري',
    requiresAccount: false,
    tag: '💎 أفضل قيمة لـ GTA VI'
  }
];

function findProductById(id) {
  const cleanId = String(id || '').trim();
  return STORE_PRODUCTS.find((p) => p.id === cleanId) || null;
}

module.exports = {
  categories: STORE_CATEGORIES,
  psnRegions: PSN_REGIONS,
  products: STORE_PRODUCTS,
  findProductById
};
