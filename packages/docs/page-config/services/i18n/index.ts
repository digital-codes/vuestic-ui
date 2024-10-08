import { getI18nConfigDefaults } from "vuestic-ui/src/services/i18n";

const configTranslations = Object
  .entries(getI18nConfigDefaults())
  .sort((a, b) => a[0].localeCompare(b[0]))

export default definePageConfig({
  blocks: [
    block.title("i18n"),
    block.paragraph("We made a separated config for i18n messages, so you can redefine messages we use in components."),

    block.subtitle("Translations"),
    block.table([{ title: "Key", type: 'code'}, "Value"], configTranslations),

    block.subtitle("Change default messages"),
    block.paragraph("Default messages can be set in `GlobalConfig`. Config is fully typed, so you can use autocomplete to find messages you want to change."),
    block.code("setup"),

    block.subtitle("Using with vue-i18n"),
    block.paragraph("Vuestic integrates with vue-i18n and looks for translations under the key `vuestic.{key}` so you can override the default messages directly in vue-i18n translations with config structure like this:"),
    block.code("vue-i18n-config"),
    block.paragraph("If key can't be resolved through vue-i18n we fallback to own config messages."),

    block.subtitle("Changing language in runtime"),
    block.paragraph("Translations can be used without vue-i18n in case if you use custom solution. You can change translations in runtime by using `useI18nConfig` composable."),
    block.code("runtime"),
  ],
});
