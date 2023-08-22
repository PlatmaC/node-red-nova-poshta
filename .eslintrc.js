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
        'prettier/prettier': [
            'error',
            { endOfLine: 'auto'}
        ]
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
};
