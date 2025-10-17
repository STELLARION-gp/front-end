/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CHATBOT_PROVIDER?: string
    readonly VITE_CHATBOT_API_KEY?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
