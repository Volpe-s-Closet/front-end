// Tiny helper for throwing locale-aware errors from Nitro routes.
//
// The server can't run vue-i18n, so we attach a translation key under
// `data.i18nKey` and let the client resolve it at display time. The English
// `statusMessage` is kept for server logs and as a fallback when the client
// doesn't have a matching key (or comes from an older bundle).
export function createI18nError({ statusCode, i18nKey, statusMessage, params }) {
  return createError({
    statusCode,
    statusMessage,
    data: {
      i18nKey,
      // Optional placeholders for keys with interpolation. The client passes
      // these straight to t(key, params).
      ...(params ? { i18nParams: params } : {}),
      // Mirror the English message into data so $fetch surfaces it to clients
      // that don't yet read i18nKey (defensive, costs nothing).
      message: statusMessage
    }
  })
}
