/** @type {import('prettier').Config} */
/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */

module.exports = {
  arrowParens: 'always',
  endOfLine: 'lf',
  printWidth: 100,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  trailingComma: 'all',
  bracketSameLine: false,

  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    '<BUILTIN_MODULES>',      // Node.js built-in modules
    '^@nestjs/(.*)$',         // NestJs modules
    '<THIRD_PARTY_MODULES>',  // Imports not matched by other special words or groups.
    '',
    '^@libs/(.*)$',
    '',
    '^@api/(.*)$',
    '',
    '^[.]', // relative imports
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
};
