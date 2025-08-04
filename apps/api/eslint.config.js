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
    ignores: ['dist/**', 'node_modules/**'],
  },
];