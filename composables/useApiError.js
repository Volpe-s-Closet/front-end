// Resolves a user-facing error message from a Nitro/$fetch error.
//
// Server routes throw with `data.i18nKey` (and optional `i18nParams`) plus an
// English `statusMessage` fallback. Some routes return `{ success: false,
// i18nKey, message }` payloads instead of throwing — this helper handles both
// shapes.
export const useApiError = () => {
  const { t, te } = useI18n()

  const resolveApiError = (errorOrPayload, fallbackKey = 'errors.generic') => {
    if (!errorOrPayload) return t(fallbackKey)

    // Pull i18n metadata from wherever it landed: thrown $fetch errors put it
    // on `error.data`, soft-failure payloads expose it at the top level.
    const data = errorOrPayload.data || errorOrPayload
    const key = data?.i18nKey
    const params = data?.i18nParams

    if (key && te(key)) {
      return t(key, params || {})
    }

    // Fall back to whatever readable message we have, then the generic key.
    return (
      errorOrPayload.statusMessage ||
      data?.message ||
      errorOrPayload.message ||
      t(fallbackKey)
    )
  }

  return { resolveApiError }
}
