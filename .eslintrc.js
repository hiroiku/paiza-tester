module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'import/order': ['error'],
    'import/no-unresolved': 'off',
    'max-len': [2, 120, 2, { ignoreStrings: true }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
