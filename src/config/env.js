// 环境配置
const isDev = import.meta.env.DEV

export const config = {
  // API地址
  API_BASE_URL: isDev ? 'http://localhost:8080/api' : 'http://172.17.3.118:8080/api',

  // WebSocket地址
  WS_BASE_URL: isDev ? 'ws://localhost:8080' : 'ws://172.17.3.118:8080',
  WSS_BASE_URL: isDev ? 'wss://localhost:8080' : 'wss://172.17.3.118:8080'
}
