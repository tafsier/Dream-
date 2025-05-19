
    import { Package, ShieldCheck, Star, Zap, Gift } from 'lucide-react';
    
    export const DREAM_STATUS = {
      PENDING: 'pending',
      INTERPRETED: 'interpreted',
      REJECTED: 'rejected',
      UNKNOWN: 'unknown',
    };
    
    export const DREAM_STATUS_PENDING = DREAM_STATUS.PENDING;
    export const DREAM_STATUS_INTERPRETED = DREAM_STATUS.INTERPRETED;
    export const DREAM_STATUS_REJECTED = DREAM_STATUS.REJECTED;
    export const DREAM_STATUS_UNKNOWN = DREAM_STATUS.UNKNOWN;
    
    export const DEFAULT_DREAM_TITLE_PREFIX_AR = 'رؤيا عن';
    export const DEFAULT_DREAM_TITLE_PREFIX_EN = 'Dream about';
    export const UNTITLED_DREAM_AR = 'رؤيا بدون عنوان';
    export const UNTITLED_DREAM_EN = 'Untitled Dream';
    
    export const NOTIFICATION_TYPES = {
      DREAM_INTERPRETED: 'dream_interpreted',
      SUBSCRIPTION_UPDATE: 'subscription_update',
      NEW_FEATURE: 'new_feature',
      GENERAL_ANNOUNCEMENT: 'general_announcement',
    };
    
    export const FREE_PACKAGE_ID = 'free_package_id';
    export const DEFAULT_FREE_CHAR_LIMIT = 500;
    export const DEFAULT_FREE_INTERPRETATIONS = 1;
    
    export const PACKAGE_NAMES_AR = {
      [FREE_PACKAGE_ID]: "الباقة المجانية",
      "basic_monthly": "الباقة الأساسية الشهرية",
      "premium_monthly": "الباقة المميزة الشهرية",
      "enterprise_custom": "باقة الشركات المخصصة"
    };
    
    export const PACKAGE_NAMES_EN = {
      [FREE_PACKAGE_ID]: "Free Plan",
      "basic_monthly": "Basic Monthly Plan",
      "premium_monthly": "Premium Monthly Plan",
      "enterprise_custom": "Enterprise Custom Plan"
    };
    
    export const STRIPE_PUBLISHABLE_KEY_PLACEHOLDER = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY';
    export const STRIPE_PRICE_ID_PLACEHOLDER = 'price_YOUR_STRIPE_PRICE_ID';
    
    export const CHARACTER_LIMIT_PER_DREAM_DEFAULT = 1000;
    export const INTERPRETATIONS_LIMIT_DEFAULT = 5;
    
    export const MAX_AVATAR_SIZE_MB = 1;
    export const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
    
    export const REALTIME_DREAM_UPDATE_CHANNEL = 'dream_updates';
    export const REALTIME_DREAM_UPDATE_EVENT = 'dream_interpretation_updated';
    
    export const REALTIME_PROFILE_UPDATE_CHANNEL = 'profile_updates';
    export const REALTIME_PROFILE_UPDATE_EVENT = 'profile_updated';
    
    export const REALTIME_NOTIFICATION_CHANNEL = 'notifications';
    export const REALTIME_NOTIFICATION_EVENT_NEW = 'new_notification';
    export const REALTIME_NOTIFICATION_EVENT_UPDATE = 'notification_updated';
    
    export const PAGINATION_ITEMS_PER_PAGE = {
      DREAMS: 6,
      NOTIFICATIONS: 10,
    };
    
    export const TOAST_DURATION = 5000;
    
    export const MIN_AGE_FOR_SUBMISSION = 1;
    
    export const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/nkgv4gxjf5s94wc22txci6f6m965i4ls';
    
    export const SUBSCRIPTION_TYPES = {
      FREE: FREE_PACKAGE_ID,
      BASIC: 'basic_monthly', 
      PREMIUM: 'premium_monthly',
      GOLDEN: 'golden_package_id', 
    };
    
    export const PACKAGE_ICONS = {
      [SUBSCRIPTION_TYPES.FREE]: Gift,
      [SUBSCRIPTION_TYPES.BASIC]: Package,
      [SUBSCRIPTION_TYPES.PREMIUM]: ShieldCheck,
      [SUBSCRIPTION_TYPES.GOLDEN]: Star,
      default: Zap,
    };
  