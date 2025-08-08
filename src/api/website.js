import request from './request'

export const websiteApi = {
  // 创建网站
  createWebsite(data) {
    return request.post('/create-website', data)
  },
  
  // 获取网站配置
  getWebsiteConfig(clientId) {
    return request.get(`/website-config/${clientId}`)
  },
  
  // 获取所有客户端
  getAllClients() {
    return request.get('/clients')
  }
} 