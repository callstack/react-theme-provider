/* @flow */

import * as React from 'react';

const REACT_METHODS = [
  'autobind',
  'childContextTypes',
  'componentDidMount',
  'componentDidUpdate',
  'componentWillMount',
  'componentWillReceiveProps',
  'componentWillUnmount',
  'componentWillUpdate',
  'contextTypes',
  'displayName',
  'getChildContext',
  'getDefaultProps',
  'getDOMNode',
  'getInitialState',
  'mixins',
  'propTypes',
  'render',
  'replaceProps',
  'setProps',
  'shouldComponentUpdate',
  'statics',
  'updateComponent',
];

export function copyRefs<Props>(
  TargetComponent: React.ComponentType<Props>,
  SourceComponent: React.ComponentType<Props>
): React.ComponentType<Props> {
  // $FlowFixMe
  if (!SourceComponent.prototype) {
    return TargetComponent;
  }

  // $FlowFixMe
  Object.getOwnPropertyNames(SourceComponent.prototype)
    .filter(
      prop =>
        !(
          REACT_METHODS.includes(prop) || // React specific methods and properties
          prop in React.Component.prototype || // Properties from React's prototype such as `setState`
          // $FlowFixMe
          prop in TargetComponent.prototype || // Properties from enhanced component's prototype
          // Private methods
          prop.startsWith('_')
        )
    )
    .forEach(prop => {
      // $FlowFixMe
      if (typeof SourceComponent.prototype[prop] === 'function') {
        /* eslint-disable func-names, no-param-reassign */
        // $FlowFixMe
        TargetComponent.prototype[prop] = function(...args) {
          // Make sure the function is called with correct context
          // $FlowFixMe
          return SourceComponent.prototype[prop].apply(
            this.getWrappedInstance(),
            args
          );
        };
      } else {
        // Copy properties as getters and setters
        // This make sure dynamic properties always stay up-to-date
        // $FlowFixMe
        Object.defineProperty(TargetComponent.prototype, prop, {
          get() {
            return this.getWrappedInstance()[prop];
          },
          set(value) {
            this.getWrappedInstance()[prop] = value;
          },
        });
      }
    });

  return TargetComponent;
}
