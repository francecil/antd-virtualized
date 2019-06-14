const eslintrc = {
  extends: ['airbnb', 'prettier', 'plugin:jest/recommended'],
  env: {
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
    es6: true,
  },
  parser: 'typescript-eslint-parser',
  plugins: ['markdown', 'react', 'typescript', 'jest'],
  rules: {
    // 'no-console': 0,
    // 函数表达式 无需命名
    'func-names': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-indent': 0,
    'react/jsx-wrap-multilines': ['error', { declaration: false, assignment: false }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'site/**',
          'tests/**',
          'scripts/**',
          '**/*.test.js',
          '**/__tests__/*',
          '*.config.js',
          '**/*.md',
          '**/*.mdx',
        ],
      },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx', '.md'] }],
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-has-content': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'comma-dangle': ['error', 'always-multiline'],
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};

module.exports = eslintrc;
