module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'scope-empty': [2, 'never'],
    'scope-enum': [
      2,
      'always',
      [
        'app',
        'assets',
        'build',
        'ci',
        'components',
        'config',
        'constants',
        'deps',
        'docs',
        'hooks',
        'scripts',
        'test',
        'tooling',
      ],
    ],
  },
};
