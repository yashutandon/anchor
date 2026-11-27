import type { Metadata } from "next";
import type * as React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anchor Support Desk",
  description:
    "Stability and accessibility layer for adaptive UI specs rendered with @anchor/renderer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
