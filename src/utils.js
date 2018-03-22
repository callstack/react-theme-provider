// @flow

export const getComponentDisplayName = (Component: Function) =>
  Component.displayName ||
  Component.name ||
  (typeof Component === 'string' && Component.length > 0
    ? Component
    : 'Unknown');

export const isClassComponent = (Component: Function) =>
  Boolean(
    Component &&
      Component.prototype &&
      typeof Component.prototype.render === 'function'
  );
