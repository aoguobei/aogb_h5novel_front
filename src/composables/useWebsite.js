import { ref } from 'vue'
import { websiteApi } from '@/api/website'
import { ElMessage } from 'element-plus'

export function useWebsite() {
  const websites = ref([])
  const loading = ref(false)
  const currentWebsite = ref(null)

  // 获取所有网站配置
  const fetchWebsites = async () => {
    loading.value = true
    try {
      // 先获取所有客户端
      const clientsResponse = await websiteApi.getAllClients()
      // 适配新的后端返回结构
      const allClients = clientsResponse.data.data || clientsResponse.data || []
      
      // 过滤掉ks和tt客户端，只保留h5、ksh5、tth5
      const clients = allClients.filter(client => ['h5', 'ksh5', 'tth5'].includes(client.host))
      
      // 为每个client获取完整的配置信息
      const websitesWithConfigs = await Promise.all(
        clients.map(async (client) => {
          try {
            const configResponse = await websiteApi.getWebsiteConfig(client.id)
            // 适配新的后端返回结构
            const configData = configResponse.data.data || configResponse.data
            const websiteData = {
              ...configData,
              expanded: false // 默认折叠
            }
            
            // 如果是ksh5，查找对应的ks小程序配置
            if (client.host === 'ksh5') {
              const ksClient = allClients.find(c => c.brand_id === client.brand_id && c.host === 'ks')
              if (ksClient) {
                try {
                  const ksConfigResponse = await websiteApi.getWebsiteConfig(ksClient.id)
                  const ksConfigData = ksConfigResponse.data.data || ksConfigResponse.data
                  websiteData.ks_config = ksConfigData
                } catch (err) {
                  websiteData.ks_config = null
                }
              }
            }
            
            // 如果是tth5，查找对应的tt小程序配置
            if (client.host === 'tth5') {
              const ttClient = allClients.find(c => c.brand_id === client.brand_id && c.host === 'tt')
              if (ttClient) {
                try {
                  const ttConfigResponse = await websiteApi.getWebsiteConfig(ttClient.id)
                  const ttConfigData = ttConfigResponse.data.data || ttConfigResponse.data
                  websiteData.tt_config = ttConfigData
                } catch (err) {
                  websiteData.tt_config = null
                }
              }
            }
            
            return websiteData
          } catch (err) {
            // 如果获取配置失败，返回基本的client信息
            return {
              client: {
                ...client,
                brand: { id: client.brand_id, code: 'Unknown' }
              },
              base_config: null,
              common_config: null,
              pay_config: null,
              ui_config: null,
              expanded: false // 默认折叠
            }
          }
        })
      )
      
      // 按品牌名排序
      websitesWithConfigs.sort((a, b) => {
        const brandA = a.client.brand?.code || ''
        const brandB = b.client.brand?.code || ''
        return brandA.localeCompare(brandB)
      })
      
      websites.value = websitesWithConfigs
    } catch (error) {
      ElMessage.error('获取网站配置列表失败')
    } finally {
      loading.value = false
    }
  }

  // 创建网站
  const createWebsite = async (websiteData) => {
    try {
      const response = await websiteApi.createWebsite(websiteData)
      // 检查返回结构
      if (response.data && response.data.success) {
        ElMessage.success('网站创建成功')
        return true
      } else {
        ElMessage.error('网站创建失败')
        return false
      }
    } catch (error) {
      ElMessage.error('网站创建失败')
      return false
    }
  }

  // 获取网站配置详情
  const getWebsiteConfig = async (clientId) => {
    try {
      const response = await websiteApi.getWebsiteConfig(clientId)
      // 适配新的后端返回结构
      const configData = response.data.data || response.data
      currentWebsite.value = configData
      return configData
    } catch (error) {
      ElMessage.error('获取网站配置失败')
      return null
    }
  }

  return {
    websites,
    loading,
    currentWebsite,
    fetchWebsites,
    createWebsite,
    getWebsiteConfig
  }
} 