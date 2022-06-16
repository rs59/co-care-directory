import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en_home from './translations/en/home.json';
import es_home from './translations/es/home.json';

i18n
  .use(initReactI18next)
  .init(
    {
      interpolation: { escapeValue: false },  // React already does escaping
      lng: 'en',                              // language to use
      resources: {
          en: {
            translation: {
              home: en_home
            }
          },
          es: {
            translation: {
              home: es_home
            }
          }
      },
    });

export default i18n;