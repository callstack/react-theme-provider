/* @flow */

import * as React from 'react';

import type { Context } from 'create-react-context';

type ThemeProviderProps<T> = {
  children?: any,
  theme: T,
};

export type ThemeProviderType<T> = React.ComponentType<ThemeProviderProps<T>>;

function createThemeProvider<T>(
  defaultTheme: T,
  ThemeContext: Context<T>
): ThemeProviderType<T> {
  return class ThemeProvider extends React.PureComponent<
    ThemeProviderProps<T>
  > {
    static defaultProps = {
      theme: defaultTheme,
    };

    render() {
      return (
        <ThemeContext.Provider value={this.props.theme}>
          {this.props.children}
        </ThemeContext.Provider>
      );
    }
  };
}

export default createThemeProvider;
