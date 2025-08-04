import baseConfig from '@collectr/eslint-config';

export default [
  ...baseConfig,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      'out/**',
      'apps/**',
      'packages/**',
    ],
  },
];