import axios from 'axios'
import { ElMessage } from 'element-plus'
import { config } from '@/config/env'

// 为Git操作创建专门的axios实例，设置更长的超时时间
const gitRequest = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 120000  // 2分钟超时，适合Git操作
})

// Git请求拦截器
gitRequest.interceptors.request.use(
  config => {
    return config
  },
  error => Promise.reject(error)
)

// Git响应拦截器
gitRequest.interceptors.response.use(
  response => response.data,
  error => {
    ElMessage.error(error.response?.data?.message || error.response?.data?.error || 'Git操作失败')
    return Promise.reject(error)
  }
)

export const gitApi = {
  // 获取Git状态
  getStatus() {
    return gitRequest.get('/git/status')
  },

  // 拉取代码
  pull(data) {
    return gitRequest.post('/git/pull', data)
  },

  // 提交代码
  commit(data) {
    return gitRequest.post('/git/commit', data)
  },

  // 重置到远程分支
  resetToRemote(data) {
    return gitRequest.post('/git/reset-to-remote', data)
  },

  // 从仓库拉取分支
  pullBranch(data) {
    return gitRequest.post('/git/pull-branch', data)
  },

  // 获取Git日志
  getLog(params) {
    return gitRequest.get('/git/log', { params })
  }
} 