import { ref } from 'vue'
import { websiteApi } from '@/api/website'
import { ElMessage } from 'element-plus'

export function useWebsite() {
  const websites = ref([])
  const loading = ref(false)
  const currentWebsite = ref(null)

  // 获取所有网站配置
  const fetchWebsites = async (includeAllHosts = false) => {
    loading.value = true
    try {
      // 直接获取所有客户端（包含完整配置）
      const clientsResponse = await websiteApi.getAllClients()
      const allClients = clientsResponse.data.data || clientsResponse.data || []
      
      // 根据参数决定是否包含所有类型的客户端
      let clients
      if (includeAllHosts) {
        // 包含所有类型的客户端：h5、ksh5、tth5、tt、ks
        clients = allClients.filter(client => ['h5', 'ksh5', 'tth5', 'tt', 'ks'].includes(client.host))
      } else {
        // 只包含h5、ksh5、tth5，过滤掉tt、ks
        clients = allClients.filter(client => ['h5', 'ksh5', 'tth5'].includes(client.host))
      }
      
      // 直接使用clients接口返回的配置数据
      const websitesWithConfigs = clients.map(client => {
        // 适配数据结构，将配置数据转换为前端期望的格式
        const websiteData = {
          client: client,
          base_config: client.base_configs?.[0] || null,
          common_config: client.common_configs?.[0] || null,
          pay_config: client.pay_configs?.[0] || null,
          ui_config: client.ui_configs?.[0] || null,
          novel_config: client.novel_configs?.[0] || null,
          expanded: false // 默认折叠
        }
        
        // 如果是ksh5，查找对应的ks小程序配置
        if (client.host === 'ksh5') {
          const ksClient = allClients.find(c => c.brand_id === client.brand_id && c.host === 'ks')
          if (ksClient) {
            websiteData.ks_config = {
              client: ksClient,
              base_config: ksClient.base_configs?.[0] || null,
              common_config: ksClient.common_configs?.[0] || null,
              pay_config: ksClient.pay_configs?.[0] || null,
              ui_config: ksClient.ui_configs?.[0] || null,
              novel_config: ksClient.novel_configs?.[0] || null
            }
          }
        }
        
        // 如果是tth5，查找对应的tt小程序配置
        if (client.host === 'tth5') {
          const ttClient = allClients.find(c => c.brand_id === client.brand_id && c.host === 'tt')
          if (ttClient) {
            websiteData.tt_config = {
              client: ttClient,
              base_config: ttClient.base_configs?.[0] || null,
              common_config: ttClient.common_configs?.[0] || null,
              pay_config: ttClient.pay_configs?.[0] || null,
              ui_config: ttClient.ui_configs?.[0] || null,
              novel_config: ttClient.novel_configs?.[0] || null
            }
          }
        }
        
        return websiteData
      })
      
      // 按app_name排序
      websitesWithConfigs.sort((a, b) => {
        const appNameA = a.base_config?.app_name || ''
        const appNameB = b.base_config?.app_name || ''
        return appNameA.localeCompare(appNameB, 'zh-CN')
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