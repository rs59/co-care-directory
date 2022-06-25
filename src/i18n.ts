import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// TODO: consolidate translation imports
import en_pages from "./translations/en/pages.json";
import en_components from "./translations/en/components.json";
import en_common from "./translations/en/common.json";
import es_pages from "./translations/es/pages.json";
import es_components from "./translations/es/components.json";
import es_common from "./translations/es/common.json";

i18n.use(initReactI18next).init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: "en", // language to use
  resources: {
    en: {
      translation: {
        pages: en_pages,
        components: en_components,
        common: en_common,
      },
    },
    es: {
      translation: {
        pages: es_pages,
        components: es_components,
        common: es_common,
      },
    },
  },
});

export default i18n;
