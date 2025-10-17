import request from './request'

export const testWebsiteApi = {
  // 获取所有测试网站
  getTestWebsites() {
    return request({
      url: '/test-websites',
      method: 'get'
    })
  },

  // 根据ID获取测试网站
  getTestWebsiteById(id) {
    return request({
      url: `/test-websites/${id}`,
      method: 'get'
    })
  },

  // 创建测试网站
  createTestWebsite(data) {
    return request({
      url: '/test-websites',
      method: 'post',
      data
    })
  },

  // 更新测试网站
  updateTestWebsite(id, data) {
    return request({
      url: `/test-websites/${id}`,
      method: 'put',
      data
    })
  },

  // 删除测试网站
  deleteTestWebsite(id) {
    return request({
      url: `/test-websites/${id}`,
      method: 'delete'
    })
  },

  // 根据测试网站ID获取测试链接
  getTestLinksByWebsiteId(websiteId) {
    return request({
      url: `/test-websites/${websiteId}/test-links`,
      method: 'get'
    })
  }
} 