/* @flow */

import * as React from 'react';
// import { createTheming } from 'react-theme-provider';
import './App.css';
import Header from './Header';
import ThemeChanger from './ThemeChanger';

import { ThemeProvider, themes } from './theming';
import type { Theme } from './theming';

// import type { ThemingType } from 'react-theme-provider'

// type Theme = {
//   primaryColor: string,
//   accentColor: string,
//   backgroundColor: string,
//   textColor: string,
//   secondaryColor: string,
// };

// const themes: { [key: string]: Theme } = {
//   default: {
//     primaryColor: '#FFA72A',
//     accentColor: '#458622',
//     backgroundColor: '#FFC777',
//     textColor: '#504f4d',
//     secondaryColor: '#7F5315',
//   },
//   dark: {
//     primaryColor: '#FFA72A',
//     accentColor: '#458622',
//     backgroundColor: '#504f4d',
//     textColor: '#FFC777',
//     secondaryColor: '#252525',
//   },
// };

// const { ThemeProvider, withTheme }: ThemingType<Theme> = createTheming(themes.default);

class App extends React.Component<*, { theme: Theme }> {
  state = {
    theme: themes.default,
  };

  handleThemeChange = (themeName: string) => {
    this.setState({ theme: themes[themeName] });
  };

  render() {
    return (
      <ThemeProvider
        theme={{
          primaryColor: '#FFA72A',
          accentColor: '#458622',
          backgroundColor: '#504f4d',
          textColor: '#FFC777',
          secondaryColor: '#252525',
        }}
      >
        <div>
          <Header />
          <ThemeChanger
            onChangeTheme={this.handleThemeChange}
            themes={Object.keys(themes)}
          />
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
