export const useLanguage = () => {
  const currentLanguage = ref('en-GB')

  const languages = [
    {
      value: 'en-GB',
      label: 'English',
      flag: '🇬🇧'
    },
    {
      value: 'it-IT',
      label: 'Italiano',
      flag: '🇮🇹'
    },
    {
      value: 'es-ES',
      label: 'Español',
      flag: '🇪🇸'
    }
  ]

  const setLanguage = (languageCode) => {
    currentLanguage.value = languageCode
    // Here you can add logic to persist the language preference
    // localStorage.setItem('language', languageCode)
    // or make an API call to save user preference
  }

  const getCurrentLanguage = computed(() => {
    return languages.find(lang => lang.value === currentLanguage.value) || languages[0]
  })

  // Initialize language from localStorage or browser preference
  onMounted(() => {
    // const savedLanguage = localStorage.getItem('language')
    // if (savedLanguage && languages.some(lang => lang.value === savedLanguage)) {
    //   currentLanguage.value = savedLanguage
    // }
  })

  return {
    currentLanguage: readonly(currentLanguage),
    languages,
    setLanguage,
    getCurrentLanguage
  }
}