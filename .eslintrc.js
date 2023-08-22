module.exports = {
    root: true,
    env: {
        node: true,
        jest: true,
    },
    parserOptions: {
        "ecmaVersion": 12
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'prettier/prettier': [
            'error',
            { endOfLine: 'auto'}
        ]
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
};
