import axios from 'axios'
import { config } from '@/config/env'

// 数据库API
export const databaseApi = {
  // 导出数据库
  exportDatabase: async (password) => {
    try {
      // 对于文件下载，直接使用axios避免request拦截器的影响
      const response = await axios.post(`${config.API_BASE_URL}/database/export`, {
        password: password
      }, {
        responseType: 'blob', // 重要：设置响应类型为blob
        timeout: 120000, // 2分钟超时，因为导出可能需要较长时间
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response
    } catch (error) {
      console.error('导出数据库失败:', error)
      throw error
    }
  }
}

export default databaseApi
