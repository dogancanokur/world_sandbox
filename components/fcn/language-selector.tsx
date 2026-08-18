"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";

import { useTranslation } from "react-i18next";
import "@/lib/i18n";

//------------------------------

export function LanguageSelector() {
  //
  const { i18n } = useTranslation();

  return (
    <div className="mt-2 flex items-center gap-2 px-2">
      <Button
        variant="outline"
        size="icon"
        aria-label="Türkçe"
        onClick={() => i18n.changeLanguage("tr")}
      >
        <img
          src="/country/turkey.png"
          alt="Türkçe"
          className="relative z-20 w-full"
          width={24}
          height={24}
        />
      </Button>

      <Button
        variant="outline"
        size="icon"
        aria-label="English"
        onClick={() => i18n.changeLanguage("en")}
      >
        <img
          src="/country/united-kingdom.png"
          alt="English"
          className="relative z-20 w-full"
          width={24}
          height={24}
        />
      </Button>
    </div>
  );
}
