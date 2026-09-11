"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Light is the default (see globals.css's comment) — `defaultTheme="light"`
 * plus `enableSystem={false}` so a visitor's OS dark-mode preference never
 * silently overrides that product decision. Attribute is `data-theme` to
 * match the design tokens' selector (`:root[data-theme="dark"]`), not the
 * `class` next-themes defaults to.
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="light" enableSystem={false} {...props}>
      {children}
    </NextThemesProvider>
  );
}
