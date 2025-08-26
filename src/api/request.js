import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  // baseURL: 'http://172.17.3.118:8080/api',
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可以在这里添加loading状态、token等
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => {
    ElMessage.error(error.response?.data?.message || error.response?.data?.error || '请求失败')
    return Promise.reject(error)
  }
)

export default request
