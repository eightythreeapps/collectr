module.exports = {
  extends: ['@collectr/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['dist/**', 'node_modules/**'],
};