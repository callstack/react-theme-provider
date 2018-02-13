<p align="center">
  <img alt="react-theme-provider" src="./assets/theme-provider-logo.png" width="496">
</p>

---
## About 
`react-theme-provider` is a set of utilities help you create theming system in few easy steps.
## Features
 - works in react and react-native
 - `ThemeProvider` component
 - `withTheme` HOC
 - `createThemeProvider(defaultTheme)` - factory returns ThemeProvider component with default theme injected.

## Getting started
### Instalation
```
npm install --save @callstack/react-theme-provider
```
or using yarn
```
yarn add @callstack/react-theme-provider
```

### Usage
To use, simply wrap your code into `ThemeProvider` component and pass your theme as a `theme` prop.

```js
<ThemeProvider theme={{ primaryColor: 'red', background: 'gray'}}>
  <App />
</ThemeProvider>
```

You could access theme data inside every component by wraping it into `withTheme` HOC. Just like this:

```js
class App extends React.Component {
  render() {
    return (
      <div style={{ color: props.theme.primaryColor }}>
        Hello react-theme-provider
      </div>
    );
  }
}

export default withTheme(App);
```

## `ThemeProvider`
TODO

## `withTheme`
TODO

## `createTheming`
TODO

## Using with `flow`
TODO