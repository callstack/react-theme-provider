/* @flow */

import * as React from 'react';

import './App.css';
import Header from './Header';
import ThemeChanger from './ThemeChanger';

import { ThemeProvider, themes } from './theming';
import type { Theme } from './theming';

class App extends React.Component<*, { theme: Theme }> {
  state = {
    theme: themes.default,
  };

  handleThemeChange = (themeName: string) => {
    this.setState({ theme: themes[themeName] });
  };

  render() {
    return (
      <ThemeProvider theme={this.state.theme}>
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
