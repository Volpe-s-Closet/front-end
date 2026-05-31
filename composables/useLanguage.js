// Bridges the existing language switcher UI (SelectBox in AppHeader and
// MobileSidebar) with the @nuxtjs/i18n module. The component public API stays
// the same — `currentLanguage`, `languages`, `setLanguage` — but the source of
// truth is now vue-i18n / Nuxt i18n.
export const useLanguage = () => {
  const { locale, locales, setLocale } = useI18n()

  // Build the {value, label, flag} options the SelectBox expects from the
  // locales declared in nuxt.config.ts.
  const languages = computed(() =>
    (unref(locales) || []).map((l) => ({
      value: l.code,
      label: l.name || l.code,
      flag: l.flag || ''
    }))
  )

  const currentLanguage = computed(() => locale.value)

  const getCurrentLanguage = computed(() => {
    return (
      languages.value.find((lang) => lang.value === locale.value) ||
      languages.value[0]
    )
  })

  const setLanguage = async (languageCode) => {
    if (!languageCode) return
    await setLocale(languageCode)
  }

  return {
    currentLanguage,
    languages,
    setLanguage,
    getCurrentLanguage
  }
}
