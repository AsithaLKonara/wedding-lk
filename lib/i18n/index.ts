// Internationalization (i18n) System
// Supports Sinhala, Tamil, and English

export type Language = 'en' | 'si' | 'ta';

export interface Translation {
  [key: string]: string | Translation;
}

export const translations: Record<Language, Translation> = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      open: 'Open',
      yes: 'Yes',
      no: 'No',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
    },
    navigation: {
      home: 'Home',
      vendors: 'Vendors',
      venues: 'Venues',
      feed: 'Feed',
      search: 'Search',
      dashboard: 'Dashboard',
      profile: 'Profile',
      settings: 'Settings',
      help: 'Help',
      contact: 'Contact',
    },
    booking: {
      bookNow: 'Book Now',
      selectDate: 'Select Date',
      selectTime: 'Select Time',
      selectService: 'Select Service',
      totalAmount: 'Total Amount',
      confirmBooking: 'Confirm Booking',
      bookingConfirmed: 'Booking Confirmed',
      bookingCancelled: 'Booking Cancelled',
    },
    payment: {
      payNow: 'Pay Now',
      paymentMethod: 'Payment Method',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      paymentSuccessful: 'Payment Successful',
      paymentFailed: 'Payment Failed',
    },
  },
  si: {
    common: {
      save: 'සුරකින්න',
      cancel: 'අවලංගු කරන්න',
      delete: 'මකන්න',
      edit: 'සංස්කරණය',
      view: 'බලන්න',
      search: 'සොයන්න',
      filter: 'පෙරණය',
      loading: 'පූරණය වෙමින්...',
      error: 'දෝෂය',
      success: 'සාර්ථකයි',
      confirm: 'තහවුරු කරන්න',
      back: 'ආපසු',
      next: 'ඊළඟ',
      previous: 'පෙර',
      close: 'වසන්න',
      open: 'විවෘත කරන්න',
      yes: 'ඔව්',
      no: 'නැහැ',
    },
    auth: {
      login: 'පුරන්න',
      register: 'ලියාපදිංචි වන්න',
      logout: 'ඉවත් වන්න',
      email: 'ඊමේල්',
      password: 'මුරපදය',
      confirmPassword: 'මුරපදය තහවුරු කරන්න',
      forgotPassword: 'මුරපදය අමතකද?',
      resetPassword: 'මුරපදය යළි සැකසීම',
      createAccount: 'ගිණුම සාදන්න',
      alreadyHaveAccount: 'දැනටමත් ගිණුමක් තිබේද?',
      dontHaveAccount: 'ගිණුමක් නැද්ද?',
    },
    navigation: {
      home: 'මුල් පිටුව',
      vendors: 'වෙළඳුන්',
      venues: 'ස්ථාන',
      feed: 'පෝස්ට්',
      search: 'සොයන්න',
      dashboard: 'උපකරණ පුවරුව',
      profile: 'පැතිකඩ',
      settings: 'සැකසුම්',
      help: 'උදව්',
      contact: 'සම්බන්ධ වන්න',
    },
    booking: {
      bookNow: 'දැන් වෙන්කරන්න',
      selectDate: 'දිනය තෝරන්න',
      selectTime: 'වේලාව තෝරන්න',
      selectService: 'සේවාව තෝරන්න',
      totalAmount: 'මුළු මුදල',
      confirmBooking: 'වෙන්කිරීම තහවුරු කරන්න',
      bookingConfirmed: 'වෙන්කිරීම තහවුරු විය',
      bookingCancelled: 'වෙන්කිරීම අවලංගු විය',
    },
    payment: {
      payNow: 'දැන් ගෙවන්න',
      paymentMethod: 'ගෙවීමේ ක්‍රමය',
      cardNumber: 'කාඩ් අංකය',
      expiryDate: 'කල් ඉකුත් දිනය',
      cvv: 'CVV',
      paymentSuccessful: 'ගෙවීම සාර්ථකයි',
      paymentFailed: 'ගෙවීම අසාර්ථකයි',
    },
  },
  ta: {
    common: {
      save: 'சேமி',
      cancel: 'ரத்து செய்',
      delete: 'நீக்கு',
      edit: 'திருத்து',
      view: 'பார்',
      search: 'தேடு',
      filter: 'வடிகட்டு',
      loading: 'ஏற்றுகிறது...',
      error: 'பிழை',
      success: 'வெற்றி',
      confirm: 'உறுதிப்படுத்து',
      back: 'பின்',
      next: 'அடுத்து',
      previous: 'முந்தைய',
      close: 'மூடு',
      open: 'திற',
      yes: 'ஆம்',
      no: 'இல்லை',
    },
    auth: {
      login: 'உள்நுழை',
      register: 'பதிவு செய்',
      logout: 'வெளியேறு',
      email: 'மின்னஞ்சல்',
      password: 'கடவுச்சொல்',
      confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்து',
      forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
      resetPassword: 'கடவுச்சொல்லை மீட்டமை',
      createAccount: 'கணக்கு உருவாக்கு',
      alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
      dontHaveAccount: 'கணக்கு இல்லையா?',
    },
    navigation: {
      home: 'முகப்பு',
      vendors: 'விற்பனையாளர்கள்',
      venues: 'இடங்கள்',
      feed: 'பதிவுகள்',
      search: 'தேடு',
      dashboard: 'கட்டுப்பாட்டு பலகை',
      profile: 'சுயவிவரம்',
      settings: 'அமைப்புகள்',
      help: 'உதவி',
      contact: 'தொடர்பு',
    },
    booking: {
      bookNow: 'இப்போது பதிவு செய்',
      selectDate: 'தேதியைத் தேர்ந்தெடுக்கவும்',
      selectTime: 'நேரத்தைத் தேர்ந்தெடுக்கவும்',
      selectService: 'சேவையைத் தேர்ந்தெடுக்கவும்',
      totalAmount: 'மொத்த தொகை',
      confirmBooking: 'பதிவை உறுதிப்படுத்து',
      bookingConfirmed: 'பதிவு உறுதிப்படுத்தப்பட்டது',
      bookingCancelled: 'பதிவு ரத்து செய்யப்பட்டது',
    },
    payment: {
      payNow: 'இப்போது செலுத்து',
      paymentMethod: 'செலுத்தும் முறை',
      cardNumber: 'அட்டை எண்',
      expiryDate: 'காலாவதி தேதி',
      cvv: 'CVV',
      paymentSuccessful: 'செலுத்துதல் வெற்றிகரமானது',
      paymentFailed: 'செலுத்துதல் தோல்வியடைந்தது',
    },
  },
};

export class I18nService {
  private currentLanguage: Language = 'en';

  constructor(initialLanguage?: Language) {
    if (initialLanguage) {
      this.currentLanguage = initialLanguage;
    }
  }

  setLanguage(language: Language) {
    this.currentLanguage = language;
    localStorage.setItem('preferred-language', language);
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let translation: any = translations[this.currentLanguage];

    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // Fallback to English if translation not found
        translation = translations.en;
        for (const fallbackKey of keys) {
          if (translation && typeof translation === 'object' && fallbackKey in translation) {
            translation = translation[fallbackKey];
          } else {
            return key; // Return key if no translation found
          }
        }
        break;
      }
    }

    if (typeof translation !== 'string') {
      return key;
    }

    // Replace parameters in translation
    if (params) {
      return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param]?.toString() || match;
      });
    }

    return translation;
  }

  getAvailableLanguages(): Array<{ code: Language; name: string; nativeName: string }> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    ];
  }

  initializeFromStorage(): Language {
    const stored = localStorage.getItem('preferred-language') as Language;
    if (stored && ['en', 'si', 'ta'].includes(stored)) {
      this.currentLanguage = stored;
    }
    return this.currentLanguage;
  }
}

// Export singleton instance
export const i18n = new I18nService();

// React hook for translations
export function useTranslation() {
  const [language, setLanguage] = useState<Language>(i18n.getLanguage());

  useEffect(() => {
    const storedLanguage = i18n.initializeFromStorage();
    setLanguage(storedLanguage);
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    i18n.setLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    return i18n.t(key, params);
  };

  return {
    t,
    language,
    changeLanguage,
    availableLanguages: i18n.getAvailableLanguages(),
  };
}

// Import React for the hook
import { useState, useEffect } from 'react';


