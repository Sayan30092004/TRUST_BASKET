import { Language } from "./translations";

// Translation API configuration
const TRANSLATION_CONFIG = {
  // LibreTranslate with CORS proxy
  libreTranslate: {
    baseUrl: 'https://libretranslate.de/translate',
    corsProxy: 'https://cors-anywhere.herokuapp.com/',
    // Alternative: 'https://translate.argosopentech.com/translate'
  },
  // Google Translate (requires API key)
  googleTranslate: {
    baseUrl: 'https://translation.googleapis.com/language/translate/v2',
    apiKey: import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || ''
  },
  // MyMemory Translation API (free, no CORS issues)
  myMemory: {
    baseUrl: 'https://api.mymemory.translated.net/get'
  }
};

// Language code mapping for APIs
const LANGUAGE_CODES: Record<Language, string> = {
  en: 'en',
  hi: 'hi',
  bn: 'bn',
  ta: 'ta'
};

// Detect if we have Google Translate API key
const hasGoogleTranslateKey = !!TRANSLATION_CONFIG.googleTranslate.apiKey;

/**
 * Translate text using MyMemory API (free, no CORS issues)
 */
const translateWithMyMemory = async (text: string, targetLanguage: Language): Promise<string> => {
  try {
    const sourceLang = 'en'; // Assume source is English for now
    const url = `${TRANSLATION_CONFIG.myMemory.baseUrl}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${LANGUAGE_CODES[targetLanguage]}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    } else {
      throw new Error(`MyMemory translation error: ${data.responseDetails}`);
    }
  } catch (error) {
    console.error('MyMemory translation failed:', error);
    throw error;
  }
};

/**
 * Translate text using LibreTranslate with CORS proxy
 */
const translateWithLibreTranslate = async (text: string, targetLanguage: Language): Promise<string> => {
  try {
    const response = await fetch(TRANSLATION_CONFIG.libreTranslate.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: LANGUAGE_CODES[targetLanguage],
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`LibreTranslate API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('LibreTranslate translation failed:', error);
    throw error;
  }
};

/**
 * Translate text using Google Translate API
 */
const translateWithGoogleTranslate = async (text: string, targetLanguage: Language): Promise<string> => {
  try {
    const url = `${TRANSLATION_CONFIG.googleTranslate.baseUrl}?key=${TRANSLATION_CONFIG.googleTranslate.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: LANGUAGE_CODES[targetLanguage],
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Google Translate translation failed:', error);
    throw error;
  }
};

/**
 * Main translation function with fallback strategy
 */
export const translatePost = async (text: string, targetLanguage: Language): Promise<string> => {
  // Don't translate if target language is English and text appears to be English
  if (targetLanguage === 'en') {
    // Simple check if text is already in English (basic implementation)
    const englishPattern = /^[a-zA-Z\s.,!?;:'"()]+$/;
    if (englishPattern.test(text.replace(/[0-9]/g, ''))) {
      return text;
    }
  }

  // Don't translate if target language is the same as source (detected)
  if (targetLanguage === 'en') {
    return text;
  }

  try {
    // Try MyMemory first (free, no CORS issues)
    console.log('Attempting translation with MyMemory...');
    const translatedText = await translateWithMyMemory(text, targetLanguage);
    return translatedText;
  } catch (myMemoryError) {
    console.log('MyMemory failed, trying LibreTranslate...');
    
    try {
      // Try LibreTranslate as second option
      const translatedText = await translateWithLibreTranslate(text, targetLanguage);
      return translatedText;
    } catch (libreError) {
      console.log('LibreTranslate failed, trying Google Translate...');
      
      // Fallback to Google Translate if API key is available
      if (hasGoogleTranslateKey) {
        try {
          const translatedText = await translateWithGoogleTranslate(text, targetLanguage);
          return translatedText;
        } catch (googleError) {
          console.error('All translation APIs failed:', { myMemoryError, libreError, googleError });
          throw new Error('Translation service unavailable');
        }
      } else {
        console.error('All free translation services failed and no Google Translate API key available');
        throw new Error('Translation service unavailable');
      }
    }
  }
};

/**
 * Check if translation is available for the given text and language
 */
export const isTranslationAvailable = (text: string, language: Language): boolean => {
  // Translation is available if:
  // 1. Target language is not English (no need to translate English to English)
  // 2. Text is not empty
  // 3. We have either MyMemory available or Google Translate API key
  
  if (language === 'en') {
    // For English, check if text appears to be non-English
    const nonEnglishPattern = /[^\u0020-\u007E]/; // Contains non-ASCII characters
    return nonEnglishPattern.test(text);
  }
  
  return text.trim().length > 0; // MyMemory is always available
};

/**
 * Get language display name
 */
export const getLanguageName = (language: Language): string => {
  const names: Record<Language, string> = {
    en: 'English',
    hi: 'हिंदी',
    bn: 'বাংলা',
    ta: 'தமிழ்'
  };
  return names[language];
};

/**
 * Test translation service connectivity
 */
export const testTranslationService = async (): Promise<boolean> => {
  try {
    const testText = 'Hello world';
    await translateWithMyMemory(testText, 'hi');
    return true;
  } catch (error) {
    console.error('Translation service test failed:', error);
    return false;
  }
};