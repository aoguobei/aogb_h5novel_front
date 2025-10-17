import { ref } from 'vue'
import { typeApi } from '@/api/type'
import { ElMessage } from 'element-plus'

export function useType() {
  const types = ref([])

  // 获取类型列表
  const fetchTypes = async () => {
    try {
      const response = await typeApi.getTypes()
      // 统一适配包装结构
      const typesData = response.data.data || []
      
      types.value = typesData
    } catch (error) {
      ElMessage.error('获取类型列表失败')
    }
  }

  // 创建类型
  const createType = async (typeData) => {
    try {
      const response = await typeApi.createType(typeData)
      if (response && response.success) {
        ElMessage.success('类型创建成功')
        await fetchTypes()
        return true
      } else {
        ElMessage.error('类型创建失败')
        return false
      }
    } catch (error) {
      ElMessage.error('类型创建失败')
      return false
    }
  }

  // 删除类型
  const deleteType = async (type) => {
    try {
      const response = await typeApi.deleteType(type.id)
      if (response && response.success) {
        ElMessage.success('类型删除成功')
        await fetchTypes()
        return true
      } else {
        ElMessage.error('类型删除失败')
        return false
      }
    } catch (error) {
      ElMessage.error('类型删除失败')
      return false
    }
  }

  // 更新类型
  const updateType = async (id, typeData) => {
    try {
      const response = await typeApi.updateType(id, typeData)
      if (response && response.success) {
        ElMessage.success('类型更新成功')
        await fetchTypes()
        return true
      } else {
        ElMessage.error('类型更新失败')
        return false
      }
    } catch (error) {
      ElMessage.error('类型更新失败')
      return false
    }
  }

  return {
    types,
    fetchTypes,
    createType,
    deleteType,
    updateType
  }
}