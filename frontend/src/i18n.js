import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
//i18next-browser-languagedetector插件 
//这是一个 i18next 语言检测插件，用于检测浏览器中的用户语言，
//详情请访问：https://github.com/i18next/i18next-browser-languageDetector
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en-US.json'
import zh from './locales/zh-CN.json'
/*
import zht from './locales/zh-CNT.json'
import fr from './locales/fr-FR.json'
import de from './locales/de-DE.json'
import es from './locales/es-ES.json'
import ko from './locales/ko-KR.json'
import ja from './locales/ja-JP.json'
import it from './locales/it-IT.json'
*/

i18n
.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    lng:'en',
   // fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    // language resources
    resources: {
      en: {
        translation: en
      },
      zh: {
        translation: zh
      },
      /*
      zht: {
        translation: zht
      },
      fr: {
        translation: fr
      },
      de: {
        translation: de
      },
      es: {
        translation: es
      },
      ko: {
        translation: ko
      },
      ja: {
        translation: ja
      },
      it: {
        translation: it
      },
      */
    }
  });

export default i18n;