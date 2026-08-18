import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      // Güvenli null kontrollerine izin verir, diğer gevşek eşitlikleri engeller.
      eqeqeq: ["error", "smart"],

      // Değişmeyen değişkenlerde const kullanılmasını zorlar.
      "prefer-const": "error",

      // Production kodunda unutulan console.log'ları gösterir.
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "coverage/**",
    "node_modules/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
