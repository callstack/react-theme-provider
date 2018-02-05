/* @flow */

import React, { Component } from 'react';
import { ThemeProvider } from 'react-theme-provider';
import './App.css';
import Header from './Header';
import ThemeChanger from './ThemeChanger';

type Theme = {
  primaryColor: string,
  accentColor: string,
  backgroundColor: string,
  textColor: string,
  secondaryColor: string,
};

const themes: { [key: string]: Theme } = {
  default: {
    primaryColor: '#FFA72A',
    accentColor: '#458622',
    backgroundColor: '#FFC777',
    textColor: '#504f4d',
    secondaryColor: '#7F5315',
  },
  dark: {
    primaryColor: '#FFA72A',
    accentColor: '#458622',
    backgroundColor: '#504f4d',
    textColor: '#FFC777',
    secondaryColor: '#252525',
  },
};

class App extends Component<*, { theme: Theme }> {
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
