/* eslint-disable react/no-multi-comp */
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import createTheming from '../createTheming';

describe('createTheming', () => {
  const node = document.createElement('div');

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(node);
  });

  const darkTheme = {
    primaryColor: '#FFA72A',
    accentColor: '#458622',
    backgroundColor: '#504f4d',
    textColor: '#FFC777',
    secondaryColor: '#252525',
  };

  const lightTheme = {
    primaryColor: '#ffcaaa',
    accentColor: '#45ffaa',
    backgroundColor: '#aaffcf',
    textColor: '#FFa7af',
    secondaryColor: '#ffffff',
  };

  const { withTheme, ThemeProvider } = createTheming(darkTheme);

  it('provides { theme } props', () => {
    const PropsChecker = withTheme(({ theme }) => {
      expect(typeof theme).toBe('object');
      expect(theme).toEqual(darkTheme);
      return null;
    });

    ReactDOM.render(
      <ThemeProvider>
        <PropsChecker />
      </ThemeProvider>,
      node
    );
  });

  it('hoists non-react statics from the wrapped component', () => {
    class Component extends React.Component {
      static foo() {
        return 'bar';
      }

      render() {
        return null;
      }
    }
    Component.hello = 'world';

    const decorated = withTheme(Component);

    expect(decorated.hello).toBe('world');
    expect(typeof decorated.foo).toBe('function');
    expect(decorated.foo()).toBe('bar');
  });

  it('render ThemeProvider multiple times', () => {
    const {
      ThemeProvider: DarkThemeProvider,
      withTheme: withDarkTheme,
    } = createTheming(darkTheme);
    const {
      ThemeProvider: LightThemeProvider,
      withTheme: withLightTheme,
    } = createTheming({});

    const DarkPropsChecker = withDarkTheme(({ theme }) => {
      expect(typeof theme).toBe('object');
      expect(theme).toEqual(darkTheme);
      return null;
    });

    const LightPropsChecker = withLightTheme(({ theme }) => {
      expect(typeof theme).toBe('object');
      expect(theme).toEqual(lightTheme);
      return null;
    });

    ReactDOM.render(
      <DarkThemeProvider>
        <LightThemeProvider theme={lightTheme}>
          <LightPropsChecker />
        </LightThemeProvider>

        <DarkPropsChecker />
      </DarkThemeProvider>,
      node
    );
  });

  it('allows to use ref on wrapped component', () => {
    class Component extends React.Component {
      foo() {
        return 'bar';
      }

      render() {
        return null;
      }
    }
    const WithThemeComponent = withTheme(Component);

    class Wrapper extends React.Component {
      componentDidMount() {
        expect(typeof this.comp).toBe('object');
        expect(typeof this.comp.foo).toEqual('function');
        expect(this.comp.foo()).toEqual('bar');
      }
      render() {
        return (
          <WithThemeComponent
            ref={component => {
              this.comp = component;
            }}
          />
        );
      }
    }

    ReactDOM.render(
      <ThemeProvider>
        <Wrapper />
      </ThemeProvider>,
      node
    );
  });

  it('Should set properly getWrappedInstance method', () => {
    class Component extends React.Component {
      foo() {
        return 'bar';
      }

      getWrappedInstance() {
        return this;
      }

      render() {
        return null;
      }
    }
    class ComponentWithoutGWI extends React.Component {
      foo() {
        return 'bar';
      }

      render() {
        return null;
      }
    }
    const WithThemeComponent = withTheme(Component);
    const WithThemeComponentWithoutGWI = withTheme(ComponentWithoutGWI);

    class Wrapper extends React.Component {
      componentDidMount() {
        expect(typeof this.comp).toBe('object');
        expect(typeof this.comp.getWrappedInstance).toEqual('function');
        expect(this.comp.getWrappedInstance().foo()).toEqual('bar');

        expect(typeof this.compWithoutGWI).toBe('object');
        expect(typeof this.compWithoutGWI.getWrappedInstance).toEqual(
          'function'
        );
        expect(this.compWithoutGWI.getWrappedInstance().foo()).toEqual('bar');
      }
      render() {
        return (
          <Fragment>
            <WithThemeComponent
              ref={component => {
                this.comp = component;
              }}
            />
            <WithThemeComponentWithoutGWI
              ref={component => {
                this.compWithoutGWI = component;
              }}
            />
          </Fragment>
        );
      }
    }

    ReactDOM.render(
      <ThemeProvider>
        <Wrapper />
      </ThemeProvider>,
      node
    );
  });

  it('merge theme from provider and prop', () => {
    const PropsChecker = withTheme(({ theme }) => {
      expect(theme).not.toBe(lightTheme);
      expect(theme).toEqual({
        ...lightTheme,
        secondaryColor: '#252525',
      });
      return null;
    });

    ReactDOM.render(
      <ThemeProvider theme={lightTheme}>
        <PropsChecker
          theme={{
            secondaryColor: '#252525',
          }}
        />
      </ThemeProvider>,
      node
    );
  });

  it('rerender component if theme props changed', () => {
    const render = jest.fn(() => null);
    class Checker extends React.Component {
      render() {
        return render();
      }
    }

    const CheckerWithTheme = withTheme(Checker);

    ReactDOM.render(
      <ThemeProvider theme={lightTheme}>
        <CheckerWithTheme />
      </ThemeProvider>,
      node
    );
    ReactDOM.render(
      <ThemeProvider theme={darkTheme}>
        <CheckerWithTheme />
      </ThemeProvider>,
      node
    );
    expect(render.mock.calls.length).toEqual(2);
  });
});
