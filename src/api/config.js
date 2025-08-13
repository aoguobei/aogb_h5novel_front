import request from './request'

export const configApi = {
  // 获取客户端列表
  getClients() {
    return request.get('/clients')
  },
  
  // 获取配置详情
  getConfigDetails(clientId) {
    return request.get(`/configs/${clientId}`)
  },

  // 获取基础配置列表
  getBaseConfigs() {
    return request.get('/base-configs')
  },

  // 获取单个基础配置
  getBaseConfig(id) {
    return request.get(`/base-configs/${id}`)
  },

  // 创建基础配置
  createBaseConfig(data) {
    return request.post('/base-configs', data)
  },

  // 更新基础配置
  updateBaseConfig(id, data) {
    return request.put(`/base-configs/${id}`, data)
  },

  // 根据client_id更新基础配置
  updateBaseConfigByClientId(clientId, data) {
    return request.put(`/base-configs/${clientId}`, data)
  },

  // 删除基础配置
  deleteBaseConfig(id) {
    return request.delete(`/base-configs/${id}`)
  },

  // 获取通用配置列表
  getCommonConfigs() {
    return request.get('/common-configs')
  },

  // 获取单个通用配置
  getCommonConfig(id) {
    return request.get(`/common-configs/${id}`)
  },

  // 创建通用配置
  createCommonConfig(data) {
    return request.post('/common-configs', data)
  },

  // 更新通用配置
  updateCommonConfig(id, data) {
    return request.put(`/common-configs/${id}`, data)
  },

  // 根据client_id更新通用配置
  updateCommonConfigByClientId(clientId, data) {
    return request.put(`/common-configs/${clientId}`, data)
  },

  // 删除通用配置
  deleteCommonConfig(id) {
    return request.delete(`/common-configs/${id}`)
  },

  // 获取支付配置列表
  getPayConfigs() {
    return request.get('/pay-configs')
  },

  // 获取单个支付配置
  getPayConfig(id) {
    return request.get(`/pay-configs/${id}`)
  },

  // 创建支付配置
  createPayConfig(data) {
    return request.post('/pay-configs', data)
  },

  // 更新支付配置
  updatePayConfig(id, data) {
    return request.put(`/pay-configs/${id}`, data)
  },

  // 根据client_id更新支付配置
  updatePayConfigByClientId(clientId, data) {
    return request.put(`/pay-configs/${clientId}`, data)
  },

  // 删除支付配置
  deletePayConfig(id) {
    return request.delete(`/pay-configs/${id}`)
  },

  // 获取UI配置列表
  getUIConfigs() {
    return request.get('/ui-configs')
  },

  // 获取单个UI配置
  getUIConfig(id) {
    return request.get(`/ui-configs/${id}`)
  },

  // 创建UI配置
  createUIConfig(data) {
    return request.post('/ui-configs', data)
  },

  // 更新UI配置
  updateUIConfig(id, data) {
    return request.put(`/ui-configs/${id}`, data)
  },

  // 根据client_id更新UI配置
  updateUIConfigByClientId(clientId, data) {
    return request.put(`/ui-configs/${clientId}`, data)
  },

  // 删除UI配置
  deleteUIConfig(id) {
    return request.delete(`/ui-configs/${id}`)
  },

  // 获取小说配置列表
  getNovelConfigs() {
    return request.get('/novel-configs')
  },

  // 获取单个小说配置
  getNovelConfig(id) {
    return request.get(`/novel-configs/${id}`)
  },

  // 创建小说配置
  createNovelConfig(data) {
    return request.post('/novel-configs', data)
  },

  // 更新小说配置
  updateNovelConfig(id, data) {
    return request.put(`/novel-configs/${id}`, data)
  },

  // 根据client_id更新小说配置
  updateNovelConfigByClientId(clientId, data) {
    return request.put(`/novel-configs/${clientId}`, data)
  },

  // 删除小说配置
  deleteNovelConfig(id) {
    return request.delete(`/novel-configs/${id}`)
  }
} 