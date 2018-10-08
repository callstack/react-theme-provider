// Type definitions for @callstack/react-theme-provider 1.0.2
// TypeScript version 3.0.3

import * as React from "react";

type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

export type ThemeProviderType<Theme> = React.ComponentType<{ theme: Theme }>;

export type ThemingType<Theme, PartialTheme> = {
  ThemeProvider: ThemeProviderType<Theme>;
  withTheme: <Props extends { theme: Theme }>(
    Comp: React.ComponentType<Props>
  ) => React.ComponentType<Without<Props, "theme"> & { theme?: PartialTheme }>;
};

// Library exports
export const ThemeProvider: ThemeProviderType<{}>;

export const withTheme: <Props extends { theme: {} }>(
  Comp: React.ComponentType<Props>
) => React.ComponentType<Without<Props, "theme">>;

export const createTheming: <Theme, PartialTheme>(
  defaultTheme: Theme
) => ThemingType<Theme, PartialTheme>;
