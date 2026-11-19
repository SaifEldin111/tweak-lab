/**
 * ============================================================================
 * TWEAK LAB — GAMING STORE PRODUCTS & PRICING CATALOG
 * ============================================================================
 * عدّل أي سعر (priceEgp) أو أضف/عدّل أي باقة هنا بسهولة،
 * وسيتم تحديث صفحة المتجر (/store) والتحقق من الأسعار في السيرفر تلقائياً.
 */

const STORE_CATEGORIES = [
  { id: 'all', label: 'الكل', icon: '✨' },
  { id: 'psn', label: 'بطاقات PlayStation (PSN)', icon: '🎮' },
  { id: 'fortnite', label: 'Fortnite V-Bucks', icon: '⚡' },
  { id: 'valorant', label: 'Valorant Points', icon: '🎯' }
];

const PSN_REGIONS = [
  { id: 'US', flag: '🇺🇸', nameAr: 'أمريكي', code: 'US', currency: 'USD', badge: 'حساب أمريكي (USA)' },
  { id: 'SA', flag: '🇸🇦', nameAr: 'سعودي', code: 'SA', currency: 'USD', badge: 'حساب سعودي (KSA)' },
  { id: 'UAE', flag: '🇦🇪', nameAr: 'إماراتي', code: 'UAE', currency: 'USD', badge: 'حساب إماراتي (UAE)' },
  { id: 'TR', flag: '🇹🇷', nameAr: 'تركي', code: 'TR', currency: 'TRY', badge: 'حساب تركي (Turkey)' }
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
    subtitle: 'رصيد متجر بلايستيشن الأمريكي • كود رقمي أصلي 100%',
    priceEgp: 575,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
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
    priceEgp: 1130,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
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
    priceEgp: 2790,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
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
    priceEgp: 5530,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
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
    priceEgp: 595,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
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
    priceEgp: 1170,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
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
    priceEgp: 2860,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
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
    priceEgp: 5680,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
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
    priceEgp: 595,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
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
    priceEgp: 1170,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
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
    priceEgp: 2860,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
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
    priceEgp: 5680,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
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
    priceEgp: 465,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
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
    priceEgp: 910,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
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
    priceEgp: 1780,
    deliveryType: 'digital_code',
    deliveryBadge: 'كود رقمي • تسليم سريع',
    requiresAccount: false,
    tag: '💎 أفضل قيمة'
  },

  // ==========================================================================
  // 5. FORTNITE V-BUCKS & CREW (شحن يدوي آمن)
  // ==========================================================================
  {
    id: 'fn-1000',
    category: 'fortnite',
    region: '',
    regionLabel: 'Fortnite',
    flag: '⚡',
    title: '1,000 V-Bucks',
    fullTitle: 'شحن Fortnite — 1,000 V-Bucks',
    valueLabel: '1,000 V-Bucks',
    subtitle: 'كافية للباتل باس أو سكن مميز • شحن رسمي وآمن 100%',
    priceEgp: 440,
    deliveryType: 'manual_topup',
    deliveryBadge: 'شحن يدوي آمن • خلال 5-15 دقيقة',
    requiresAccount: true,
    accountLabel: 'بيانات حساب فورتنايت (Epic Games / Xbox)',
    accountPlaceholder: 'اكتب إيميل Epic Games / حساب Xbox',
    tag: ''
  },
  {
    id: 'fn-2800',
    category: 'fortnite',
    region: '',
    regionLabel: 'Fortnite',
    flag: '⚡',
    title: '2,800 V-Bucks',
    fullTitle: 'شحن Fortnite — 2,800 V-Bucks',
    valueLabel: '2,800 V-Bucks',
    subtitle: 'الباقة الأكثر طلباً لشراء الباندلات والباتل باس',
    priceEgp: 1090,
    deliveryType: 'manual_topup',
    deliveryBadge: 'شحن يدوي آمن • خلال 5-15 دقيقة',
    requiresAccount: true,
    accountLabel: 'بيانات حساب فورتنايت (Epic Games / Xbox)',
    accountPlaceholder: 'اكتب إيميل Epic Games / حساب Xbox',
    tag: '🔥 الأكثر طلباً'
  },
  {
    id: 'fn-5000',
    category: 'fortnite',
    region: '',
    regionLabel: 'Fortnite',
    flag: '⚡',
    title: '5,000 V-Bucks',
    fullTitle: 'شحن Fortnite — 5,000 V-Bucks',
    valueLabel: '5,000 V-Bucks',
    subtitle: 'كمية كبيرة للسكنات النادرة والهدايا لأصحابك',
    priceEgp: 1750,
    deliveryType: 'manual_topup',
    deliveryBadge: 'شحن يدوي آمن • خلال 5-15 دقيقة',
    requiresAccount: true,
    accountLabel: 'بيانات حساب فورتنايت (Epic Games / Xbox)',
    accountPlaceholder: 'اكتب إيميل Epic Games / حساب Xbox',
    tag: ''
  },
  {
    id: 'fn-13500',
    category: 'fortnite',
    region: '',
    regionLabel: 'Fortnite',
    flag: '⚡',
    title: '13,500 V-Bucks',
    fullTitle: 'شحن Fortnite — 13,500 V-Bucks',
    valueLabel: '13,500 V-Bucks',
    subtitle: 'أكبر باقة V-Bucks بأعلى نسبة توفير على الإطلاق',
    priceEgp: 4250,
    deliveryType: 'manual_topup',
    deliveryBadge: 'شحن يدوي آمن • خلال 5-15 دقيقة',
    requiresAccount: true,
    accountLabel: 'بيانات حساب فورتنايت (Epic Games / Xbox)',
    accountPlaceholder: 'اكتب إيميل Epic Games / حساب Xbox',
    tag: '💎 أقصى توفير'
  },
  {
    id: 'fn-crew',
    category: 'fortnite',
    region: '',
    regionLabel: 'Fortnite Crew',
    flag: '👑',
    title: 'باقة Fortnite Crew',
    fullTitle: 'شحن Fortnite — باقة Fortnite Crew الشهرية',
    valueLabel: 'Fortnite Crew',
    subtitle: 'تشمل Battle Pass + سكن حصري + 1,000 V-Bucks شهرياً',
    priceEgp: 590,
    deliveryType: 'manual_topup',
    deliveryBadge: 'شحن يدوي آمن • خلال 5-15 دقيقة',
    requiresAccount: true,
    accountLabel: 'بيانات حساب فورتنايت (Epic Games / Xbox)',
    accountPlaceholder: 'اكتب إيميل Epic Games / حساب Xbox',
    tag: '👑 باقة شاملة'
  },

  // ==========================================================================
  // 6. VALORANT POINTS — VP (شحن يدوي آمن)
  // ==========================================================================
  {
    id: 'val-475',
    category: 'valorant',
    region: '',
    regionLabel: 'Valorant',
    flag: '🎯',
    title: '475 Valorant Points',
    fullTitle: 'شحن Valorant — 475 VP',
    valueLabel: '475 VP',
    subtitle: 'شحن مباشر وآمن بالـ Riot ID بدون الحاجة للباسورد',
    priceEgp: 260,
    deliveryType: 'manual_topup',
    deliveryBadge: 'شحن يدوي آمن • خلال 5-15 دقيقة',
    requiresAccount: true,
    accountLabel: 'معرف حساب Riot (Riot ID)',
    accountPlaceholder: 'اكتب Riot ID مثال: Player#EGY',
    tag: ''
  },
  {
    id: 'val-1000',
    category: 'valorant',
    region: '',
    regionLabel: 'Valorant',
    flag: '🎯',
    title: '1,000 Valorant Points',
    fullTitle: 'شحن Valorant — 1,000 VP',
    valueLabel: '1,000 VP',
    subtitle: 'مثالية لتفعيل الـ Battle Pass في فالورانت فوراً',
    priceEgp: 520,
    deliveryType: 'manual_topup',
    deliveryBadge: 'شحن يدوي آمن • خلال 5-15 دقيقة',
    requiresAccount: true,
    accountLabel: 'معرف حساب Riot (Riot ID)',
    accountPlaceholder: 'اكتب Riot ID مثال: Player#EGY',
    tag: ''
  },
  {
    id: 'val-2050',
    category: 'valorant',
    region: '',
    regionLabel: 'Valorant',
    flag: '🎯',
    title: '2,050 Valorant Points',
    fullTitle: 'شحن Valorant — 2,050 VP',
    valueLabel: '2,050 VP',
    subtitle: 'تكفي لشراء سكن Vandal أو Phantom بريميوم من الـ Store',
    priceEgp: 1040,
    deliveryType: 'manual_topup',
    deliveryBadge: 'شحن يدوي آمن • خلال 5-15 دقيقة',
    requiresAccount: true,
    accountLabel: 'معرف حساب Riot (Riot ID)',
    accountPlaceholder: 'اكتب Riot ID مثال: Player#EGY',
    tag: '🔥 الأكثر طلباً'
  },
  {
    id: 'val-3650',
    category: 'valorant',
    region: '',
    regionLabel: 'Valorant',
    flag: '🎯',
    title: '3,650 Valorant Points',
    fullTitle: 'شحن Valorant — 3,650 VP',
    valueLabel: '3,650 VP',
    subtitle: 'لشراء سكنات الـ Night Market أو السكاكين (Melee)',
    priceEgp: 1820,
    deliveryType: 'manual_topup',
    deliveryBadge: 'شحن يدوي آمن • خلال 5-15 دقيقة',
    requiresAccount: true,
    accountLabel: 'معرف حساب Riot (Riot ID)',
    accountPlaceholder: 'اكتب Riot ID مثال: Player#EGY',
    tag: ''
  },
  {
    id: 'val-5350',
    category: 'valorant',
    region: '',
    regionLabel: 'Valorant',
    flag: '🎯',
    title: '5,350 Valorant Points',
    fullTitle: 'شحن Valorant — 5,350 VP',
    valueLabel: '5,350 VP',
    subtitle: 'أفضل باقة لشراء باندلات كاملة بأعلى نقاط بونص',
    priceEgp: 2620,
    deliveryType: 'manual_topup',
    deliveryBadge: 'شحن يدوي آمن • خلال 5-15 دقيقة',
    requiresAccount: true,
    accountLabel: 'معرف حساب Riot (Riot ID)',
    accountPlaceholder: 'اكتب Riot ID مثال: Player#EGY',
    tag: '💎 أفضل قيمة'
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
