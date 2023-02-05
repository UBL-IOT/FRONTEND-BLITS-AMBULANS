import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// const api = axios.create({ baseURL: 'http://localhost:5050/' })
// const api = axios.create({ baseURL: 'https://ambulance-blits.pptik.id:5134/' })
const api = axios.create({ baseURL: 'http://192.168.1.9:5050' })

export default boot(({ app }) => {
  app.config.globalProperties.$axios = api

  app.config.globalProperties.$api = api
})

export { api }
