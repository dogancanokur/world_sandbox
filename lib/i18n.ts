"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import tr from "./locales/tr.json";

//------------------------------

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    lng: "en",
    debug: true,
    resources: {
      en: {
        translation: en,
      },
      tr: {
        translation: tr,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });
}

const t = i18next.t;
