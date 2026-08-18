import type { Metadata, Viewport } from "next";

import React from "react";

import "./globals.css";

// ----------------------------------------------------------------------
export const metadata: Metadata = {
  title: "Worldbox",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// ----------------------------------------------------------------------

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  //
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
