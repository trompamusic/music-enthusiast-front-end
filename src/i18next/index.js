import common_en from "./en.json";
import common_es from "./es.json";
import common_it from "./it.json";
import common_nl from "./nl.json";

const resources = {
  'en': { translation: common_en },
  'es': { translation: common_es },
  'it': { translation: common_it },
  'nl': { translation: common_nl },
};

export const countryCodes = {
  'en': 'GB',
  'es': 'ES',
  'it': 'IT',
  'nl': 'NL',
};

export default {
  detection: { order: ['navigator'] },
  resources,
  fallbackLng: 'en',
  keySeparator: false,
  interpolation: { escapeValue: false }
};