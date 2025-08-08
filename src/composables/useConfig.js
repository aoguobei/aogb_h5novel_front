import { ref } from 'vue'
import { configApi } from '@/api/config'
import { ElMessage } from 'element-plus'

export function useConfig() {
  const configs = ref([])
  const loading = ref(false)

  // 获取配置列表
  const fetchConfigs = async () => {
    loading.value = true
    try {
      const response = await configApi.getClients()
      // 适配新的后端返回结构
      configs.value = response.data.data || response.data
    } catch (error) {
      ElMessage.error('获取配置列表失败')
    } finally {
      loading.value = false
    }
  }

  // 获取配置详情
  const getConfigDetails = async (clientId) => {
    try {
      const response = await configApi.getConfigDetails(clientId)
      // 适配新的后端返回结构
      return response.data.data || response.data
    } catch (error) {
      ElMessage.error('获取配置详情失败')
      return null
    }
  }

  // 格式化日期
  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleString('zh-CN')
  }

  // 获取主机类型显示名称
  const getHostDisplayName = (host) => {
    const hostMap = {
      'h5': 'H5',
      'tth5': '头条H5',
      'ksh5': '快手H5',
      'tt': '头条小程序',
      'ks': '快手小程序'
    }
    return hostMap[host] || host
  }

  // 获取主机类型标签样式
  const getHostTagType = (host) => {
    const typeMap = {
      'h5': 'primary',
      'tth5': 'success',
      'ksh5': 'warning',
      'tt': 'info',
      'ks': 'danger'
    }
    return typeMap[host] || 'default'
  }

  return {
    configs,
    loading,
    fetchConfigs,
    getConfigDetails,
    formatDate,
    getHostDisplayName,
    getHostTagType
  }
} 