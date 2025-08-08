import request from './request'

export const configApi = {
  // 获取客户端列表
  getClients() {
    return request.get('/clients')
  },
  
  // 获取配置详情
  getConfigDetails(clientId) {
    return request.get(`/configs/${clientId}`)
  }
} 