import request from './request'

export const testLinkApi = {
  // 创建测试链接
  createTestLink(data) {
    return request.post('/test-links', data)
  },

  // 批量创建测试链接
  batchCreateTestLinks(data) {
    return request.post('/test-links/batch', data)
  },

  // 更新测试链接
  updateTestLink(id, data) {
    return request.put(`/test-links/${id}`, data)
  },

  // 删除测试链接
  deleteTestLink(id) {
    return request.delete(`/test-links/${id}`)
  }
} 