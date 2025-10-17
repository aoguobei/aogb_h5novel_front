import request from './request'

export const typeApi = {
  // 获取类型列表
  getTypes() {
    return request.get('/types')
  },
  
  // 创建类型
  createType(data) {
    return request.post('/types', data)
  },
  
  // 删除类型
  deleteType(id) {
    return request.delete(`/types/${id}`)
  },
  
  // 更新类型
  updateType(id, data) {
    return request.put(`/types/${id}`, data)
  }
}