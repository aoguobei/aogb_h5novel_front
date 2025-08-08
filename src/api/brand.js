import request from './request'

export const brandApi = {
  // 获取品牌列表
  getBrands() {
    return request.get('/brands')
  },
  
  // 创建品牌
  createBrand(data) {
    return request.post('/brands', data)
  },
  
  // 删除品牌
  deleteBrand(id) {
    return request.delete(`/brands/${id}`)
  },
  
  // 更新品牌
  updateBrand(id, data) {
    return request.put(`/brands/${id}`, data)
  }
} 