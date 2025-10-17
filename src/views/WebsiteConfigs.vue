<template>
  <div class="website-configs box">
    <Header title="网站配置列表" subtitle="管理所有网站的配置信息" />

    <LoadingSpinner v-if="loading" />

    <el-alert
      v-else-if="error"
      :title="error"
      type="error"
      show-icon
      :closable="false"
    />

    <div v-else class="vertical main-content">
      <!-- 上方平台选择区域 -->
      <div class="platform-selector">
        <div class="horizontal j-s-b align_center platform-header">
          <div class="flex1"></div>
          <div class="header-actions">
            <div class="platform-stats-compact">
              <span class="stat-compact">
                <span class="stat-number-compact">{{ filteredWebsites.length }}</span>
                <span class="stat-label-compact">筛选</span>
              </span>
              <span class="stat-compact">
                <span class="stat-number-compact">{{ websites.length }}</span>
                <span class="stat-label-compact">总数</span>
              </span>
            </div>
            <el-button
              link
              size="small"
              @click="clearPlatformSelection"
              :disabled="!hasActivePlatforms"
              class="clear-btn"
            >
              清除选择
            </el-button>
          </div>
        </div>

        <div class="platform-grid">
          <div
            v-for="platform in platforms"
            :key="platform.value"
            class="horizontal platform-card"
            :class="{ active: selectedPlatforms.includes(platform.value) }"
            @click="togglePlatform(platform.value)"
          >
            <div class="platform-icon" :class="platform.iconClass">
              <el-icon><component :is="platform.icon" /></el-icon>
            </div>
            <div style="margin-left: 10px">
              <div class="platform-name">{{ platform.label }}</div>
              <div class="platform-desc">{{ platform.description }}</div>
            </div>
            <div class="platform-count">
              {{ getPlatformCount(platform.value) }}
            </div>
          </div>
        </div>

      </div>

      <!-- 下方网站列表 -->
      <div class="websites-panel box">
        <div class="horizontal j-s-b align_center websites-header">
          <div class="websites-title">网站配置 ({{ filteredWebsites.length }})</div>
          <div class="websites-actions">
            <el-button
              size="small"
              class="brand-manage-btn"
              @click="brandDeleteVisible = true"
            >
              <el-icon><Setting /></el-icon>
              <span class="btn-text">brand管理</span>
            </el-button>
          </div>
        </div>

        <el-empty
          v-if="!filteredWebsites.length"
          description="暂无符合条件的网站配置"
        />

        <div v-else class="websites-table">
          <!-- 表格头部 -->
          <div class="table-header">
            <div class="table-cell name-cell">网站名称</div>
            <div class="table-cell platform-cell">网站平台</div>
            <div class="table-cell brand-cell">brand</div>
            <div class="table-cell actions-cell">操作</div>
          </div>

          <!-- 表格内容 -->
          <div class="table-body">
            <template v-for="website in filteredWebsites" :key="website.id">
              <WebsiteCard
                :website="website"
                :miniClientId="getMiniClientId(website)"
                @toggle="toggleDetails"
                @view="viewConfig"
                @viewExtra="viewExtraConfig"
                @viewMini="viewMiniConfig"
                @delete="handleDelete"
              />
              <!-- 展开的详细信息 -->
              <div v-if="website.expanded" class="expanded-content">
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

                <!-- 基础配置信息 -->
                <div v-if="hasBaseConfig(website)" class="config-info-section">
                  <div class="config-row">
                    <div class="config-item">
                      <span class="config-label">cl:</span>
                      <span class="config-value">{{ website.base_config.cl || '-' }}</span>
                    </div>
                    <div class="config-item">
                      <span class="config-label">customer:</span>
                      <span class="config-value">{{ website.base_config.customer || '-' }}</span>
                    </div>
                    <div class="config-item">
                      <span class="config-label">product:</span>
                      <span class="config-value">{{ website.base_config.product || '-' }}</span>
                    </div>
                    <div class="config-item">
                      <span class="config-label">版本:</span>
                      <span class="config-value">{{ website.base_config.version || '-' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- brand管理对话框 -->
      <el-dialog v-model="brandDeleteVisible" title="brand管理" width="600px" :append-to-body="true">
        <div class="brand-management-content">
          <!-- 标签页 -->
          <el-tabs v-model="activeTab" class="brand-tabs">
            <!-- 新建brand标签页 -->
            <el-tab-pane label="新建brand" name="create">
              <div class="create-brand-tab">
                <el-form :model="newBrand" label-width="100px" class="create-form">
                  <el-form-item label="业务类型" required>
                    <el-select v-model="newBrand.type_id" placeholder="选择业务类型" style="width: 100%;">
                      <el-option
                        v-for="type in types"
                        :key="type.id"
                        :label="type.name"
                        :value="type.id"
                        :disabled="type.code !== 'novel'"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="brand" required>
                    <el-input v-model="newBrand.code" placeholder="输入brand" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="createBrand" :loading="creatingBrand" size="large">
                      <el-icon><Plus /></el-icon>
                      创建brand
                    </el-button>
                    <el-button @click="resetNewBrand" size="large">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>

            <!-- 删除brand标签页 -->
            <el-tab-pane label="删除brand" name="delete">
              <div class="delete-brand-tab">
                <div class="tab-description">
                  删除brand前请确保该brand下没有关联的网站
                </div>
                <div class="brand-list">
                  <div
                    class="brand-row"
                    v-for="brand in brands"
                    :key="brand.id"
                  >
                    <div class="brand-info">
                      <div class="brand-main">
                        <div class="brand-code-section">
                          <div class="brand-code">{{ brand.code }}</div>
                        </div>
                        <div class="brand-stats">
                          <div class="client-count">
                            <span class="count-number">{{ getWebsiteCount(brand.id) }}</span>
                            <span class="count-label">个网站</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="brand-actions">
                      <el-button
                        size="small"
                        type="danger"
                        circle
                        :disabled="getClientCount(brand.id) > 0"
                        @click="confirmDeleteBrand(brand)"
                        class="delete-brand-btn"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="brandDeleteVisible = false">关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWebsite } from '@/composables/useWebsite'
import { usePlatformInfo } from '@/composables/useConfig'
import { useBrand } from '@/composables/useBrand'
import { useType } from '@/composables/useType'
import { brandApi } from '@/api/brand'
import { Setting, Delete, Plus } from '@element-plus/icons-vue'
import WebsiteCard from '@/components/business/WebsiteCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Header from '@/components/common/Header.vue'

const router = useRouter()
const { clientsData, websites, loading, fetchWebsites } = useWebsite()
const { getH5Platforms } = usePlatformInfo()
const { brands, fetchBrands, deleteBrand } = useBrand()
const { types, fetchTypes } = useType()
const error = ref('')

// 平台相关 - 使用 composable 提供的数据
const platforms = getH5Platforms()

const selectedPlatforms = ref([])

// 计算筛选后的网站列表
const filteredWebsites = computed(() => {
  if (!selectedPlatforms.value.length) {
    return websites.value
  }

  return websites.value.filter(website => {
    const host = website.client?.host || 'h5'
    return selectedPlatforms.value.includes(host)
  })
})

// 是否有活跃的平台选择
const hasActivePlatforms = computed(() => selectedPlatforms.value.length > 0)

// 获取平台数量
const getPlatformCount = (platformValue) => {
  return websites.value.filter(website => {
    const host = website.client?.host || 'h5'
    return host === platformValue
  }).length
}

// 切换平台选择
const togglePlatform = (platformValue) => {
  const index = selectedPlatforms.value.indexOf(platformValue)
  if (index > -1) {
    selectedPlatforms.value.splice(index, 1)
  } else {
    selectedPlatforms.value.push(platformValue)
  }
}

// 清除所有平台选择
const clearPlatformSelection = () => {
  selectedPlatforms.value = []
}

// 切换详情显示
const toggleDetails = (website) => {
  website.expanded = !website.expanded
}

// 查看配置
const viewConfig = (clientId) => {
  router.push(`/website-config/${clientId}`)
}

// 查看附加配置
const viewExtraConfig = (clientId) => {
  router.push(`/website-config/${clientId}`)
}

// 查看小程序配置
const viewMiniConfig = (clientId) => {
  router.push(`/website-config/${clientId}`)
}

// 计算对应小程序客户端ID
const getMiniClientId = (website) => {
  if (!website || !website.client) return null
  const host = website.client.host
  if (host === 'h5') return null

  const targetMiniHost = host === 'tth5' ? 'tt' : host === 'ksh5' ? 'ks' : null
  if (!targetMiniHost) return null
  return website[`${targetMiniHost}_config`]?.client?.id || null
}

// 删除：先删小程序，再删网站
import { ElMessageBox, ElMessage } from 'element-plus'
import { websiteApi } from '@/api/website'

const handleDelete = async ({ clientId, miniClientId }) => {
  try {
    await ElMessageBox.confirm('确定删除该网站？若存在对应小程序，会先删除小程序再删除网站。', '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 先删小程序（若有）
    if (miniClientId) {
      await websiteApi.deleteWebsite(miniClientId)
    }

    // 再删网站
    await websiteApi.deleteWebsite(clientId)

    ElMessage.success('删除成功')
    await fetchWebsites()
    await fetchBrands()
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(async () => {
  try {
    await fetchWebsites()
    await fetchBrands()
    await fetchTypes()
  } catch (err) {
    error.value = '获取网站配置失败'
  }
})

// 删除brand弹窗
const brandDeleteVisible = ref(false)

// brand管理标签页
const activeTab = ref('create')

// 新建brand相关
const creatingBrand = ref(false)
const newBrand = ref({
  code: '',
  type_id: null
})
// 轻量：去除搜索与统计

// 统计brand的客户端数量（含小程序）
const getClientCount = (brandId) => {
  return clientsData.value.filter(c => c?.brand_id === brandId).length
}

const getWebsiteCount = (brandId) => {
  return websites.value.filter(c => c?.client?.brand_id === brandId).length
}

// 删除brand（确认）
const confirmDeleteBrand = async (brand) => {
  try {
    await ElMessageBox.confirm(`确定删除brand "${brand.code}" 吗？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const success = await deleteBrand(brand)
    if (success) {
      await Promise.all([fetchBrands(), fetchWebsites()])
    }
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

// 检查是否有基础配置
const hasBaseConfig = (website) => {
  const config = website.base_config
  return config && config.app_name && config.app_name.trim() !== '' && config.id > 0
}

// 重置新建brand表单
const resetNewBrand = () => {
  newBrand.value = { code: '', type_id: null }
}

// 创建brand
const createBrand = async () => {
  if (!newBrand.value.type_id) {
    ElMessage.error('请选择业务类型')
    return
  }

  if (!newBrand.value.code.trim()) {
    ElMessage.error('请输入brand')
    return
  }

  creatingBrand.value = true
  try {
    const response = await brandApi.createBrand({
      code: newBrand.value.code,
      type_id: newBrand.value.type_id
    })
    if (response && response.success) {
      ElMessage.success('brand创建成功')
      resetNewBrand()
      await fetchBrands()
      // 切换到删除brand标签页查看新创建的brand
      activeTab.value = 'delete'
    } else {
      ElMessage.error('brand创建失败')
    }
  } catch (error) {
    ElMessage.error('brand创建失败')
    console.error(error)
  } finally {
    creatingBrand.value = false
  }
}
</script>

<style scoped>
.website-configs {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}


.main-content {
  gap: 20px;
  margin-top: 20px;
}

/* 上方平台选择区域 */
.platform-selector {
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  padding: 20px;
  /* margin-bottom: 16px; */
}

.platform-header {
  margin-bottom: 20px;
  gap: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.platform-stats-compact {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stat-compact {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.stat-compact:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.stat-number-compact {
  font-weight: 700;
  color: #8b7ec8;
  font-size: 14px;
}

.stat-label-compact {
  color: #64748b;
  font-weight: 500;
  font-size: 12px;
}

.platform-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
}

.clear-btn {
  color: #64748b;
  font-weight: 500;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  color: #ef4444;
  transform: scale(1.05);
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  /* margin-bottom: 32px; */
}

.platform-card {
  background: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}



.platform-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}



.platform-card.active {
  border-color: #8b7ec8;
  background: linear-gradient(135deg, #f5f3ff 0%, #f0edff 100%);
  box-shadow: 0 8px 25px rgba(139, 126, 200, 0.15);
}



.platform-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: #fff;
  font-size: 20px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.platform-card:hover .platform-icon {
  transform: scale(1.1);
}

.ks-icon {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
}

.dy-icon {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
}

.h5-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.platform-name {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.platform-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

.platform-count {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #f1f5f9;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  min-width: 24px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.platform-card.active .platform-count {
  background: linear-gradient(135deg, #8b7ec8 0%, #7c5a9a 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(139, 126, 200, 0.3);
  transform: scale(1.05);
}


/* 下方网站列表 */
.websites-panel {
  width: 100%;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  padding: 24px;
}

.websites-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.websites-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.websites-actions {
  display: flex;
  gap: 8px;
}

.brand-manage-btn {
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.brand-manage-btn:hover {
  border-color: #c7d2fe;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.brand-manage-btn .btn-text {
  font-weight: 600;
}

.websites-table {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.table-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  font-weight: 600;
  font-size: 14px;
  color: #303133;
}

.table-body {
  background: #fff;
}

.table-cell {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

/* 表格头部列宽 */
.table-header .name-cell {
  /* flex: 1; */
  min-width: 120px;
}

.table-header .platform-cell {
  width: 100px;
  flex-shrink: 0;
}

.table-header .brand-cell {
  flex: 1;
  width: 100px;
  flex-shrink: 0;
}

.table-header .actions-cell {
  width: 400px;
  flex-shrink: 0;
}

/* 展开内容样式 */
.expanded-content {
  width: 100%;
  padding: 16px;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
}

.content-row {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.time-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-label {
  color: #475569;
  font-size: 12px;
}

.time-value {
  color: #1e293b;
  font-size: 14px;
}

.config-info-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #e2e8f0;
  position: relative;
}

.config-info-section::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  width: 40px;
  height: 2px;
  border-radius: 1px;
  background: #8b7ec8;
}

.config-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  transition: all 0.2s ease;
}

.config-label {
  color: #475569;
  font-weight: 500;
  white-space: nowrap;
  font-size: 14px;
}

.config-value {
  color: #409eff;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 1px 3px #b8d9fb;
}
/* brand管理对话框样式 */
.brand-management-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.brand-dialog-subtitle {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 8px;
}

/* 标签页样式 */
.brand-tabs {
  margin-top: 16px;
}

.brand-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
}

.brand-tabs :deep(.el-tabs__nav-wrap::after) {
  background-color: #e2e8f0;
}

.brand-tabs :deep(.el-tabs__item) {
  font-weight: 600;
  font-size: 14px;
}

.brand-tabs :deep(.el-tabs__item.is-active) {
  color: #8b7ec8;
}

.brand-tabs :deep(.el-tabs__active-bar) {
  background-color: #8b7ec8;
}

.brand-tabs :deep(.el-tabs__item:hover) {
  color: #8b7ec8;
}

/* 新建brand标签页 */
.create-brand-tab {
  padding: 20px 0;
}

.create-form {
  max-width: 400px;
}

.create-form .el-form-item {
  margin-bottom: 20px;
}

.create-form .el-form-item:last-child {
  margin-bottom: 0;
}


/* 删除brand标签页 */
.delete-brand-tab {
  padding: 20px 0;
}

.tab-description {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #8b7ec8;
}

.brand-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 360px;
  overflow-y: auto;
}

/* removed intro/toolbar styles */

.brand-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
}

.brand-info {
  flex: 1;
}

.brand-main {
  display: flex;
  align-items: center;
  gap: 20px;
}

.brand-code-section {
  display: flex;
  align-items: center;
}

.brand-code {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.brand-stats {
  display: flex;
  align-items: center;
}

.client-count {
  display: flex;
  align-items: center;
  font-size: 12px;
  background: rgba(139, 126, 200, 0.1);
  padding: 3px 6px;
  border-radius: 8px;
  border: 1px solid rgba(139, 126, 200, 0.3);
}

.count-number {
  font-weight: 600;
  color: #8b7ec8;
}

.count-label {
  color: #8b7ec8;
  font-weight: 400;
}

.brand-actions {
  display: flex;
  gap: 8px;
}

.delete-brand-btn {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
  transition: all 0.3s ease;
}

.delete-brand-btn:hover:not(:disabled) {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #b91c1c;
  transform: scale(1.1);
}

.delete-brand-btn:disabled {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

/* removed brand-meta count styles */

/* 响应式设计 */
@media (max-width: 1200px) {
  .platform-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 14px;
  }
}

@media (max-width: 768px) {
  .website-configs {
    padding: 0 16px;
  }

  .platform-selector,
  .websites-panel {
    padding: 20px;
  }

  .platform-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }

  .header-actions {
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }

  .platform-stats-compact {
    gap: 12px;
  }

  .websites-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
