import baseConfig from '@collectr/eslint-config';

export default [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    ignores: ['.next/**', 'out/**', 'node_modules/**'],
  },
];