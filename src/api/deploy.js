import request from './request'

// 部署相关API
export const deployApi = {
  // Nginx远程部署
  nginxDeploy(data) {
    return request({
      url: '/deploy/nginx',
      method: 'post',
      data
    })
  },

  // H5网站构建并部署
  buildH5(data) {
    return request({
      url: '/build/h5',
      method: 'post',
      data
    })
  }
}
