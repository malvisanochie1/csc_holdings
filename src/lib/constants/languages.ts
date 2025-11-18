export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  googleCode: string; // Google Translate language code
}

export const LANGUAGES: Language[] = [
  // Popular languages first
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", googleCode: "en" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", googleCode: "es" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", googleCode: "fr" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", googleCode: "de" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", googleCode: "it" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷", googleCode: "pt" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", googleCode: "ru" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", googleCode: "ja" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", googleCode: "ko" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "中文", flag: "🇨🇳", googleCode: "zh" },
  { code: "zh-TW", name: "Chinese (Traditional)", nativeName: "繁體中文", flag: "🇹🇼", googleCode: "zh-TW" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", googleCode: "ar" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", googleCode: "hi" },
  
  // Additional languages alphabetically
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦", googleCode: "af" },
  { code: "sq", name: "Albanian", nativeName: "Shqip", flag: "🇦🇱", googleCode: "sq" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹", googleCode: "am" },
  { code: "hy", name: "Armenian", nativeName: "Հայերեն", flag: "🇦🇲", googleCode: "hy" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan", flag: "🇦🇿", googleCode: "az" },
  { code: "eu", name: "Basque", nativeName: "Euskera", flag: "🇪🇸", googleCode: "eu" },
  { code: "be", name: "Belarusian", nativeName: "Беларуская", flag: "🇧🇾", googleCode: "be" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩", googleCode: "bn" },
  { code: "bs", name: "Bosnian", nativeName: "Bosanski", flag: "🇧🇦", googleCode: "bs" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", flag: "🇧🇬", googleCode: "bg" },
  { code: "ca", name: "Catalan", nativeName: "Català", flag: "🇪🇸", googleCode: "ca" },
  { code: "ny", name: "Chichewa", nativeName: "Chichewa", flag: "🇲🇼", googleCode: "ny" },
  { code: "co", name: "Corsican", nativeName: "Corsu", flag: "🇫🇷", googleCode: "co" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷", googleCode: "hr" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿", googleCode: "cs" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰", googleCode: "da" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", googleCode: "nl" },
  { code: "eo", name: "Esperanto", nativeName: "Esperanto", flag: "🌍", googleCode: "eo" },
  { code: "et", name: "Estonian", nativeName: "Eesti", flag: "🇪🇪", googleCode: "et" },
  { code: "tl", name: "Filipino", nativeName: "Filipino", flag: "🇵🇭", googleCode: "tl" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮", googleCode: "fi" },
  { code: "fy", name: "Frisian", nativeName: "Frysk", flag: "🇳🇱", googleCode: "fy" },
  { code: "gl", name: "Galician", nativeName: "Galego", flag: "🇪🇸", googleCode: "gl" },
  { code: "ka", name: "Georgian", nativeName: "ქართული", flag: "🇬🇪", googleCode: "ka" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷", googleCode: "el" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", googleCode: "gu" },
  { code: "ht", name: "Haitian Creole", nativeName: "Kreyòl ayisyen", flag: "🇭🇹", googleCode: "ht" },
  { code: "ha", name: "Hausa", nativeName: "Harshen Hausa", flag: "🇳🇬", googleCode: "ha" },
  { code: "haw", name: "Hawaiian", nativeName: "ʻŌlelo Hawaiʻi", flag: "🇺🇸", googleCode: "haw" },
  { code: "iw", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱", googleCode: "iw" },
  { code: "hmn", name: "Hmong", nativeName: "Hmong", flag: "🇱🇦", googleCode: "hmn" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺", googleCode: "hu" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska", flag: "🇮🇸", googleCode: "is" },
  { code: "ig", name: "Igbo", nativeName: "Asụsụ Igbo", flag: "🇳🇬", googleCode: "ig" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", googleCode: "id" },
  { code: "ga", name: "Irish", nativeName: "Gaeilge", flag: "🇮🇪", googleCode: "ga" },
  { code: "jw", name: "Javanese", nativeName: "Basa Jawa", flag: "🇮🇩", googleCode: "jw" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳", googleCode: "kn" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақ тілі", flag: "🇰🇿", googleCode: "kk" },
  { code: "km", name: "Khmer", nativeName: "ភាសាខ្មែរ", flag: "🇰🇭", googleCode: "km" },
  { code: "ku", name: "Kurdish", nativeName: "Kurdî", flag: "🇮🇶", googleCode: "ku" },
  { code: "ky", name: "Kyrgyz", nativeName: "Кыргызча", flag: "🇰🇬", googleCode: "ky" },
  { code: "lo", name: "Lao", nativeName: "ລາວ", flag: "🇱🇦", googleCode: "lo" },
  { code: "la", name: "Latin", nativeName: "Latine", flag: "🇻🇦", googleCode: "la" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu", flag: "🇱🇻", googleCode: "lv" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", flag: "🇱🇹", googleCode: "lt" },
  { code: "lb", name: "Luxembourgish", nativeName: "Lëtzebuergesch", flag: "🇱🇺", googleCode: "lb" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски", flag: "🇲🇰", googleCode: "mk" },
  { code: "mg", name: "Malagasy", nativeName: "Malagasy", flag: "🇲🇬", googleCode: "mg" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾", googleCode: "ms" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳", googleCode: "ml" },
  { code: "mt", name: "Maltese", nativeName: "Malti", flag: "🇲🇹", googleCode: "mt" },
  { code: "mi", name: "Maori", nativeName: "Te Reo Māori", flag: "🇳🇿", googleCode: "mi" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", googleCode: "mr" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол", flag: "🇲🇳", googleCode: "mn" },
  { code: "my", name: "Myanmar", nativeName: "ဗမာ", flag: "🇲🇲", googleCode: "my" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", flag: "🇳🇵", googleCode: "ne" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴", googleCode: "no" },
  { code: "ps", name: "Pashto", nativeName: "پښتو", flag: "🇦🇫", googleCode: "ps" },
  { code: "fa", name: "Persian", nativeName: "فارسی", flag: "🇮🇷", googleCode: "fa" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", googleCode: "pl" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳", googleCode: "pa" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴", googleCode: "ro" },
  { code: "sm", name: "Samoan", nativeName: "Gagana Sāmoa", flag: "🇼🇸", googleCode: "sm" },
  { code: "gd", name: "Scottish Gaelic", nativeName: "Gàidhlig", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", googleCode: "gd" },
  { code: "sr", name: "Serbian", nativeName: "Српски", flag: "🇷🇸", googleCode: "sr" },
  { code: "st", name: "Sesotho", nativeName: "Sesotho", flag: "🇱🇸", googleCode: "st" },
  { code: "sn", name: "Shona", nativeName: "Shona", flag: "🇿🇼", googleCode: "sn" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي", flag: "🇵🇰", googleCode: "sd" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", flag: "🇱🇰", googleCode: "si" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", flag: "🇸🇰", googleCode: "sk" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina", flag: "🇸🇮", googleCode: "sl" },
  { code: "so", name: "Somali", nativeName: "Soomaali", flag: "🇸🇴", googleCode: "so" },
  { code: "su", name: "Sundanese", nativeName: "Basa Sunda", flag: "🇮🇩", googleCode: "su" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇹🇿", googleCode: "sw" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪", googleCode: "sv" },
  { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ", flag: "🇹🇯", googleCode: "tg" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", googleCode: "ta" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", googleCode: "te" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭", googleCode: "th" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", googleCode: "tr" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦", googleCode: "uk" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", googleCode: "ur" },
  { code: "uz", name: "Uzbek", nativeName: "O'zbek", flag: "🇺🇿", googleCode: "uz" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", googleCode: "vi" },
  { code: "cy", name: "Welsh", nativeName: "Cymraeg", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", googleCode: "cy" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa", flag: "🇿🇦", googleCode: "xh" },
  { code: "yi", name: "Yiddish", nativeName: "ייִדיש", flag: "🇮🇱", googleCode: "yi" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá", flag: "🇳🇬", googleCode: "yo" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu", flag: "🇿🇦", googleCode: "zu" },
];

// Helper functions
export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find(lang => lang.code === code);
}

export function getLanguageByGoogleCode(googleCode: string): Language | undefined {
  return LANGUAGES.find(lang => lang.googleCode === googleCode);
}

export function getPopularLanguages(): Language[] {
  return LANGUAGES.slice(0, 13); // First 13 are the popular ones
}