import request from './request'

// 部署相关API
export const deployApi = {
  // 生成配置文件
  generateConfigs(data) {
    return request({
      url: '/deploy/generate-configs',
      method: 'post',
      data
    })
  },

  // 测试服务器连接
  testConnection(data) {
    return request({
      url: '/deploy/test-connection',
      method: 'post',
      data
    })
  },

  // 远程部署配置
  remoteDeploy(data) {
    return request({
      url: '/deploy/remote-deploy',
      method: 'post',
      data
    })
  },

  // 获取部署状态
  getStatus() {
    return request({
      url: '/deploy/status',
      method: 'get'
    })
  }
} 