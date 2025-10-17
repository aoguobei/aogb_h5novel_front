import { ref, computed } from 'vue'
import { configApi } from '@/api/config'
import { websiteApi } from '@/api/website'
import { ElMessage } from 'element-plus'

// 先定义平台信息相关的 composable
export function usePlatformInfo() {
  // 平台配置映射
  const platformConfig = {
    'h5': {
      label: '通用H5',
      displayName: 'H5',
      tagType: 'primary',
      description: '通用H5应用',
      icon: 'VideoPlay',
      iconClass: 'h5-icon'
    },
    'tth5': {
      label: '抖音H5',
      displayName: '抖音H5',
      tagType: 'warning',
      description: '抖音平台H5应用',
      icon: 'VideoCamera',
      iconClass: 'dy-icon'
    },
    'ksh5': {
      label: '快手H5',
      displayName: '快手H5',
      tagType: 'success',
      description: '快手平台H5应用',
      icon: 'VideoPlay',
      iconClass: 'ks-icon'
    },
    'tt': {
      label: '抖音小程序',
      displayName: '抖音小程序',
      tagType: 'info',
      description: '抖音小程序',
      icon: 'VideoCamera',
      iconClass: 'tt-icon'
    },
    'ks': {
      label: '快手小程序',
      displayName: '快手小程序',
      tagType: 'danger',
      description: '快手小程序',
      icon: 'VideoPlay',
      iconClass: 'ks-mp-icon'
    }
  }

  // 获取平台标签
  const getPlatformLabel = (host) => {
    return platformConfig[host]?.label || host
  }

  // 获取平台显示名称
  const getPlatformDisplayName = (host) => {
    return platformConfig[host]?.displayName || host
  }

  // 获取平台标签类型
  const getPlatformTagType = (host) => {
    return platformConfig[host]?.tagType || 'info'
  }

  // 获取平台描述
  const getPlatformDescription = (host) => {
    return platformConfig[host]?.description || host
  }

  // 获取平台图标
  const getPlatformIcon = (host) => {
    return platformConfig[host]?.icon || 'VideoPlay'
  }

  // 获取平台图标类名
  const getPlatformIconClass = (host) => {
    return platformConfig[host]?.iconClass || 'default-icon'
  }

  // 获取完整平台信息
  const getPlatformInfo = (host) => {
    return platformConfig[host] || {
      label: host,
      displayName: host,
      tagType: 'info',
      description: host,
      icon: 'VideoPlay',
      iconClass: 'default-icon'
    }
  }

  // 获取所有支持的平台列表
  const getAllPlatforms = () => {
    return Object.keys(platformConfig).map(host => ({
      value: host,
      ...platformConfig[host]
    }))
  }

  // 获取H5平台列表（排除小程序）
  const getH5Platforms = () => {
    return ['h5', 'tth5', 'ksh5'].map(host => ({
      value: host,
      ...platformConfig[host]
    }))
  }

  return {
    platformConfig,
    getPlatformLabel,
    getPlatformDisplayName,
    getPlatformTagType,
    getPlatformDescription,
    getPlatformIcon,
    getPlatformIconClass,
    getPlatformInfo,
    getAllPlatforms,
    getH5Platforms
  }
}

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

  // 使用平台信息 composable
  const { getPlatformDisplayName, getPlatformTagType } = usePlatformInfo()

  // 获取主机类型显示名称（保持向后兼容）
  const getHostDisplayName = getPlatformDisplayName

  // 获取主机类型标签样式（保持向后兼容）
  const getHostTagType = getPlatformTagType

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



// 小说选择器相关的 composable
export function useNovelSelector() {
  const novelsLoading = ref(false)
  const allNovelData = ref([])
  const selectedNovel = ref(null)
  const selectedCascaderValue = ref(null)

  // 使用平台信息 composable
  const { getPlatformLabel, getPlatformTagType } = usePlatformInfo()

  // 获取小说配置数据
  const fetchNovelOptions = async () => {
    novelsLoading.value = true
    try {
      const response = await websiteApi.getAllClients()
      const allClients = response.data.data || response.data || []

      // 筛选host为tth5、ksh5、h5的客户端
      const filteredClients = allClients.filter(client =>
        ['tth5', 'ksh5', 'h5'].includes(client.host) && client.brand?.type?.code === 'novel'
      )

      // 转换为统一格式并保存完整数据
      allNovelData.value = filteredClients.map(client => {
        // 获取应用名称，优先使用base_config中的app_name
        const appName = client.base_configs?.[0]?.app_name ||
          client.brand?.code ||
          `${client.host}-${client.id}`
        const script_base = client.common_configs?.[0]?.script_base || ''
        const tt_login_callback_domain = client.novel_configs?.[0]?.tt_login_callback_domain || ''

        return {
          clientId: client.id,
          appName: appName,
          host: client.host,
          brandCode: client.brand?.code || `brand_${client.brand_id}`,
          brandId: client.brand_id,
          script_base,
          tt_login_callback_domain
        }
      })
    } catch (error) {
      console.error('❌ 获取小说配置失败:', error)
      ElMessage.error('获取小说配置失败: ' + (error.message || '未知错误'))
      allNovelData.value = []
    } finally {
      novelsLoading.value = false
    }
  }



  // 构建级联选择器选项
  const cascaderOptions = computed(() => {
    const groups = new Map()

    // 按品牌分组
    allNovelData.value.forEach(novel => {
      if (!groups.has(novel.brandCode)) {
        groups.set(novel.brandCode, {
          value: novel.brandCode,
          label: novel.brandCode,
          children: []
        })
      }

      const novelOption = {
        value: `${novel.clientId}-${novel.host}`,
        label: novel.appName,
        platformTag: getPlatformLabel(novel.host),
        platformType: getPlatformTagType(novel.host),
        data: novel // 保存完整数据
      }

      groups.get(novel.brandCode).children.push(novelOption)
    })

    // 转换为数组并排序
    const result = Array.from(groups.values())
      .sort((a, b) => a.label.localeCompare(b.label))

    // 对每个品牌下的小说也排序
    result.forEach(brand => {
      brand.children.sort((a, b) => a.label.localeCompare(b.label))
    })

    return result
  })

  // 根据值查找小说数据
  const findNovelByValue = (value) => {
    for (const brand of cascaderOptions.value) {
      for (const child of brand.children) {
        if (child.value === value) {
          return child.data
        }
      }
    }
    return null
  }

  // 选择小说
  const selectNovel = (novel, configForm) => {
    selectedNovel.value = novel

    // 自动填充路径配置
    if (configForm) {
      configForm.rootPath = `/opt/website/${novel.host}-${novel.brandCode}/dist`
      // 确保locationPath以/开头，优先使用script_base，如果为空则使用brandCode
      const pathBase = novel.script_base || novel.brandCode
      const base = pathBase.startsWith('/') ? pathBase : `/${pathBase}`
      configForm.locationPath = base.endsWith('/') ? base.slice(0,-1) : base
    }
  }

  // 清除选择
  const clearSelection = (configForm) => {
    selectedNovel.value = null
    selectedCascaderValue.value = null
    if (configForm) {
      configForm.rootPath = ''
      configForm.locationPath = '/'
    }
  }

  // 级联选择器变化事件
  const onCascaderChange = (value, configForm) => {
    if (!value) {
      clearSelection(configForm)
      return
    }

    // 查找选中的小说数据
    const novel = findNovelByValue(value)
    if (novel) {
      selectNovel(novel, configForm)
    }
  }

  return {
    novelsLoading,
    allNovelData,
    selectedNovel,
    selectedCascaderValue,
    cascaderOptions,
    fetchNovelOptions,
    getPlatformLabel,
    getPlatformTagType,
    findNovelByValue,
    selectNovel,
    clearSelection,
    onCascaderChange
  }
}
