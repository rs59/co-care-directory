import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// TODO: consolidate translation imports
import en_home from './translations/en/home.json';
import en_components from './translations/en/components.json';
import es_home from './translations/es/home.json';
import es_components from './translations/es/components.json'

i18n
  .use(initReactI18next)
  .init(
    {
      interpolation: { escapeValue: false },  // React already does escaping
      lng: 'en',                              // language to use
      resources: {
          en: {
            translation: {
              home: en_home,
              components: en_components
            }
          },
          es: {
            translation: {
              home: es_home,
              components: es_components
            }
          }
      },
    });

export default i18n;