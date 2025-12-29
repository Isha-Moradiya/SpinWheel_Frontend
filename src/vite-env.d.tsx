/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_TOKEN_EXPIRY: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENABLE_SOUND: string
  readonly VITE_ENABLE_ANIMATIONS: string
  readonly VITE_MAX_CATEGORIES: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
