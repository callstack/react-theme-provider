// Type definitions for @callstack/react-theme-provider 1.0.2
// TypeScript version 3.0.3

declare module "@callstack/react-theme-provider" {
  import * as React from "react";

  type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

  export type ThemingType<Theme> = {
    ThemeProvider: typeof ThemeProvider;
    withTheme: <Props extends { theme: Theme }>(
      Comp: React.ComponentType<Props>
    ) => React.ComponentType<Without<Props, "theme">>;
  };

  export class ThemeProvider<Theme> extends React.Component<{ theme: Theme }> {}

  export const withTheme: <Props extends { theme: {} }>(
    Comp: React.ComponentType<Props>
  ) => React.ComponentType<Without<Props, "theme">>;

  export const createTheming: <T>(defaultTheme: T) => ThemingType<T>;
}
