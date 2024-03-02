module.exports = {
  useTabs: false,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 100,

  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ["^@core/(.*)$", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
}