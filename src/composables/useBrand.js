import { ref } from 'vue'
import { brandApi } from '@/api/brand'
import { ElMessage } from 'element-plus'

export function useBrand() {
  const brands = ref([])
  const loading = ref(false)

  // 获取brand列表
  const fetchBrands = async () => {
    loading.value = true
    try {
      const response = await brandApi.getBrands()
      // 统一适配包装结构
      const brandsData = response.data.data?.filter(brand => brand?.type?.code === 'novel') || []

      // 按创建时间倒序排列（从新到旧）
      brandsData.sort((a, b) => {
        const dateA = new Date(a.created_at || 0)
        const dateB = new Date(b.created_at || 0)
        return dateB - dateA
      })

      brands.value = brandsData
    } catch (error) {
      ElMessage.error('获取brand列表失败')
    } finally {
      loading.value = false
    }
  }

  // 创建brand
  const createBrand = async (brandData) => {
    try {
      const response = await brandApi.createBrand(brandData)
      console.log('创建brand响应:', response) // 调试信息
      // 统一适配包装结构
      if (response && response.success) {
        ElMessage.success('brand创建成功')
        await fetchBrands()
        return true
      } else {
        ElMessage.error('brand创建失败')
        return false
      }
    } catch (error) {
      console.error('创建brand错误:', error) // 调试信息
      ElMessage.error('brand创建失败')
      return false
    }
  }

  // 删除brand
  const deleteBrand = async (brand) => {
    try {
      const response = await brandApi.deleteBrand(brand.id)
      // 统一适配包装结构
      if (response && response.success) {
        ElMessage.success('brand删除成功')
        await fetchBrands()
        return true
      } else {
        ElMessage.error('brand删除失败')
        return false
      }
    } catch (error) {
      ElMessage.error('brand删除失败')
      return false
    }
  }

  // 更新brand
  const updateBrand = async (id, brandData) => {
    try {
      const response = await brandApi.updateBrand(id, brandData)
      // 统一适配包装结构
      if (response && response.success) {
        ElMessage.success('brand更新成功')
        await fetchBrands()
        return true
      } else {
        ElMessage.error('brand更新失败')
        return false
      }
    } catch (error) {
      ElMessage.error('brand更新失败')
      return false
    }
  }

  return {
    brands,
    loading,
    fetchBrands,
    createBrand,
    deleteBrand,
    updateBrand
  }
}
