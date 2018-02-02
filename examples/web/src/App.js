import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import ThemeChanger from './ThemeChanger';
import { ThemeProvider } from 'react-theme-provider';

const themes = {
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

class App extends Component {
  state = {
    theme: themes.default,
  };

  handleThemeChange = themeName => {
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
