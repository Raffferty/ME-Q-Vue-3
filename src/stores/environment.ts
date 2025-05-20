import { defineStore } from 'pinia'

/* export const useEnvStore = defineStore('environment', {
  state: () => ({
    env: import.meta.env,
  }),

  getters: {
    ENV_MODE: (state) => state.env.MODE,
    IS_DEV_MODE: (state) => state.env.DEV,
    IS_PROD_MODE: (state) => state.env.PROD,
    APP_API_HOST: (state) => state.env['VITE_APP_API_HOST'],
    getEnv:
      (state) =>
      (env_name: string): string =>
        state.env[env_name] || '',
  },
}) */

export const useEnvStore = defineStore('environment', () => {
  const env = import.meta.env

  const getEnv = (env_name: string): string => env[env_name] || ''

  const ENV_MODE = env.MODE
  const IS_DEV_MODE = env.DEV
  const IS_PROD_MODE = env.PROD
  const APP_API_HOST = getEnv('VITE_APP_API_HOST')

  return {
    env,
    getEnv,
    ENV_MODE,
    IS_DEV_MODE,
    IS_PROD_MODE,
    APP_API_HOST,
  }
})
