<template>
  <div class="website-configs">
    <div class="header">
      <h2>网站配置列表</h2>
      <div class="header-actions">
        <el-button @click="$router.push('/')">
          <el-icon><House /></el-icon>
          品牌管理
        </el-button>
        <el-button type="primary" @click="$router.push('/create-website')">
          <el-icon><Plus /></el-icon>
          新建网站
        </el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <el-alert
        :title="error"
        type="error"
        show-icon
        :closable="false"
      />
    </div>

    <div v-else-if="!websites.length" class="empty-container">
      <el-empty description="暂无网站配置" />
    </div>

    <div v-else class="websites-grid">
      <el-card
        v-for="website in websites"
        :key="website.id"
        class="website-card"
        shadow="hover"
      >
        <template #header>
          <div class="card-header">
            <div class="website-info">
              <h3>{{ getWebsiteDisplayName(website) }}</h3>
              <p class="website-details">
                <el-tag :type="getHostTagType(website.client.host)" size="small">
                  {{ getHostDisplayName(website.client.host) }}
                </el-tag>
                <span class="brand-code">{{ website.client.brand.code }}</span>
              </p>
            </div>
            <div class="card-actions">
              <el-button
                size="small"
                @click="toggleDetails(website)"
                :type="website.expanded ? 'info' : 'default'"
              >
                {{ website.expanded ? '收起详情' : '详细信息' }}
              </el-button>
              <el-button
                type="primary"
                size="small"
                @click="viewConfig(website.client.id)"
              >
                查看配置
              </el-button>
            </div>
          </div>
        </template>

        <div class="card-content" v-show="website.expanded">
          <div class="content-row">
            <div class="time-info">
              <span class="time-label">创建时间:</span>
              <span class="time-value">{{ formatDate(website.client.created_at) }}</span>
            </div>
            <div class="time-info">
              <span class="time-label">更新时间:</span>
              <span class="time-value">{{ formatDate(website.client.updated_at) }}</span>
            </div>
          </div>

          <!-- 配置状态指示器 -->
          <div class="config-status">
            <div class="status-grid">
              <div class="status-item">
                <el-icon :color="hasBaseConfig(website) ? '#67C23A' : '#F56C6C'">
                  <Check v-if="hasBaseConfig(website)" />
                  <Close v-else />
                </el-icon>
                <span>基础配置</span>
              </div>
              <div class="status-item">
                <el-icon :color="hasCommonConfig(website) ? '#67C23A' : '#F56C6C'">
                  <Check v-if="hasCommonConfig(website)" />
                  <Close v-else />
                </el-icon>
                <span>通用配置</span>
              </div>
              <div class="status-item">
                <el-icon :color="hasPayConfig(website) ? '#67C23A' : '#F56C6C'">
                  <Check v-if="hasPayConfig(website)" />
                  <Close v-else />
                </el-icon>
                <span>支付配置</span>
              </div>
              <div class="status-item">
                <el-icon :color="hasUIConfig(website) ? '#67C23A' : '#F56C6C'">
                  <Check v-if="hasUIConfig(website)" />
                  <Close v-else />
                </el-icon>
                <span>UI配置</span>
              </div>
            </div>
          </div>

          <!-- 附加小程序配置 -->
          <div v-if="website.client.host === 'ksh5' && hasKsConfig(website)" class="extra-config">
            <div class="extra-config-header">
              <h4>快手小程序配置</h4>
              <el-button
                size="small"
                type="primary"
                @click="viewConfig(website.ks_config.client.id)"
              >
                查看配置
              </el-button>
            </div>
            <div class="extra-config-content">
              <div class="config-info">
                <span class="config-label">应用名称:</span>
                <span class="config-value">{{ website.ks_config.base_config.app_name }}</span>
              </div>
              <div class="config-info">
                <span class="config-label">平台:</span>
                <span class="config-value">{{ website.ks_config.base_config.platform }}</span>
              </div>
              <div class="config-info">
                <span class="config-label">应用代码:</span>
                <span class="config-value">{{ website.ks_config.base_config.app_code }}</span>
              </div>
            </div>
          </div>

          <div v-if="website.client.host === 'tth5' && hasTtConfig(website)" class="extra-config">
            <div class="extra-config-header">
              <h4>抖音小程序配置</h4>
              <el-button
                size="small"
                type="primary"
                @click="viewConfig(website.tt_config.client.id)"
              >
                查看配置
              </el-button>
            </div>
            <div class="extra-config-content">
              <div class="config-info">
                <span class="config-label">应用名称:</span>
                <span class="config-value">{{ website.tt_config.base_config.app_name }}</span>
              </div>
              <div class="config-info">
                <span class="config-label">平台:</span>
                <span class="config-value">{{ website.tt_config.base_config.platform }}</span>
              </div>
              <div class="config-info">
                <span class="config-label">应用代码:</span>
                <span class="config-value">{{ website.tt_config.base_config.app_code }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Check, Close, House, Loading } from '@element-plus/icons-vue'
import axios from 'axios'

const router = useRouter()
const websites = ref([])
const loading = ref(false)
const error = ref('')

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取host显示名称
const getHostDisplayName = (host) => {
  const hostMap = {
    'h5': 'H5',
    'tth5': '抖音H5',
    'ksh5': '快手H5',
    'ks': '快手小程序',
    'tt': '抖音小程序',
  }
  return hostMap[host] || host
}

// 获取host标签类型
const getHostTagType = (host) => {
  const typeMap = {
    'h5': 'primary',
    'tth5': 'success',
    'ksh5': 'warning'
  }
  return typeMap[host] || 'info'
}

// 获取网站显示名称
const getWebsiteDisplayName = (website) => {
  const hostName = getHostDisplayName(website.client.host)
  const appName = hasBaseConfig(website) ? website.base_config.app_name : '未配置'
  return `${hostName}-${appName}`
}

// 检查配置是否真实存在（不是空对象）
const hasBaseConfig = (website) => {
  const config = website.base_config
  return config && config.app_name && config.app_name.trim() !== '' && config.id > 0
}

const hasCommonConfig = (website) => {
  const config = website.common_config
  return config && config.script_base && config.script_base.trim() !== '' && config.id > 0
}

const hasPayConfig = (website) => {
  const config = website.pay_config
  return config && config.id > 0 && (config.normal_pay_enable || config.renew_pay_enable)
}

const hasUIConfig = (website) => {
  const config = website.ui_config
  return config && config.theme_bg_main && config.theme_bg_main.trim() !== '' && config.id > 0
}

// 检查附加小程序配置是否存在
const hasKsConfig = (website) => {
  const config = website.ks_config?.base_config
  return config && config.app_name && config.app_name.trim() !== '' && config.id > 0
}

const hasTtConfig = (website) => {
  const config = website.tt_config?.base_config
  return config && config.app_name && config.app_name.trim() !== '' && config.id > 0
}

// 切换详细信息显示
const toggleDetails = (website) => {
  website.expanded = !website.expanded
}

// 获取所有网站配置
const fetchWebsites = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.get('/api/clients')
    const allClients = response.data.data || []
    
    // 过滤掉ks和tt客户端，只保留h5、ksh5、tth5
    const clients = allClients.filter(client => ['h5', 'ksh5', 'tth5'].includes(client.host))
    
    // 为每个client获取完整的配置信息
    const websitesWithConfigs = await Promise.all(
      clients.map(async (client) => {
        try {
          const configResponse = await axios.get(`/api/website-config/${client.id}`)
          const websiteData = {
            ...configResponse.data.data,
            expanded: false // 默认折叠
          }
          
          // 如果是ksh5，查找对应的ks小程序配置
          if (client.host === 'ksh5') {
            const ksClient = allClients.find(c => c.brand_id === client.brand_id && c.host === 'ks')
            if (ksClient) {
              try {
                const ksConfigResponse = await axios.get(`/api/website-config/${ksClient.id}`)
                websiteData.ks_config = ksConfigResponse.data.data
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
                const ttConfigResponse = await axios.get(`/api/website-config/${ttClient.id}`)
                websiteData.tt_config = ttConfigResponse.data.data
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
  } catch (err) {
    console.error('Error fetching websites:', err)
    error.value = '获取网站配置失败'
    ElMessage.error('获取网站配置失败')
  } finally {
    loading.value = false
  }
}

// 查看配置
const viewConfig = (clientId) => {
  router.push(`/website-config/${clientId}`)
}

onMounted(() => {
  fetchWebsites()
})
</script>

<style scoped>
.website-configs {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.loading-container,
.error-container,
.empty-container {
  text-align: center;
  padding: 40px;
}

.loading-container .el-icon {
  font-size: 32px;
  color: #409eff;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.websites-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.website-card {
  transition: all 0.3s ease;
  font-size: 13px;
}

.website-card:hover {
  transform: translateY(-1px);
}

.website-card :deep(.el-card__header) {
  padding: 8px 12px;
}

.website-card :deep(.el-card__body) {
  padding: 0px 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.website-info h3 {
  margin: 0 0 6px 0;
  color: #303133;
  font-size: 16px;
}

.website-details {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 12px;
}

.brand-code {
  color: #909399;
  font-size: 12px;
}

.card-actions {
  flex-shrink: 0;
}

.card-content {
  padding: 10px 0px;
}



.content-row {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.time-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.time-label {
  color: #909399;
  font-weight: 500;
}

.time-value {
  color: #606266;
}

.config-status {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
}

.status-item .el-icon {
  font-size: 14px;
}

.extra-config {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.extra-config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.extra-config-header h4 {
  margin: 0;
  color: #303133;
  font-size: 15px;
  font-weight: 600;
}

.extra-config-content {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 6px;
}

.extra-config-content .config-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.extra-config-content .config-info:last-child {
  margin-bottom: 0;
}

.extra-config-content .config-label {
  color: #909399;
  font-weight: 500;
}

.extra-config-content .config-value {
  color: #606266;
  font-weight: 400;
}
</style> 