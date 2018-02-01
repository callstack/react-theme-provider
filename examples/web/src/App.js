import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Header';
import { ThemeProvider } from 'react-theme-provider';

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={{ primaryColor: 'green' }}>
        <Header />
      </ThemeProvider>
    );
  }
}

export default App;
