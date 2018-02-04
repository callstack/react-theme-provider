'use strict';

const target = process.env.BABEL_TARGET;
const modules = target === 'rollup' ? false : 'commonjs';

const options = {
  presets: [
    ['env', { modules }],
    'react',
    'stage-2',
    'flow',
  ],
  plugins: [
    'transform-object-rest-spread',
    'transform-class-properties',
  ],
};

if (target === 'rollup') {
  options.plugins.push('external-helpers');
}

module.exports = options;