<template>
  <el-card class="website-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <div class="website-info">
          <div class="website-name">{{ getWebsiteDisplayName(website) }}</div>
          <el-tag :type="getHostTagType(website.client.host)" size="small">
            {{ getHostDisplayName(website.client.host) }}
          </el-tag>
          <span class="brand-code">{{ website.client.brand.code }}</span>
        </div>
        <div class="card-actions">
          <el-button
            size="small"
            @click="$emit('toggle', website)"
            :type="website.expanded ? 'info' : 'default'"
          >
            {{ website.expanded ? '收起详情' : '详细信息' }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="$emit('view', website.client.id)"
          >
            查看配置
          </el-button>
        </div>
      </div>
    </template>

    <template v-if="website.expanded">
      <div class="card-content">
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
  </el-card>
</template>

<script setup>

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const getWebsiteDisplayName = (website) => {
  const appName = hasBaseConfig(website) ? website.base_config.app_name : '未配置'
  return appName
}

const hasBaseConfig = (website) => {
  const config = website.base_config
  return config && config.app_name && config.app_name.trim() !== '' && config.id > 0
}

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

const getHostTagType = (host) => {
  const typeMap = {
    'h5': 'primary',
    'tth5': 'success',
    'ksh5': 'warning'
  }
  return typeMap[host] || 'default'
}

defineProps({
  website: {
    type: Object,
    required: true
  }
})

defineEmits(['toggle', 'view', 'viewExtra'])
</script>

<style scoped>
.website-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.website-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-color: #cbd5e1;
}

.website-card :deep(.el-card__header) {
  padding: 16px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
}

.website-card :deep(.el-card__body) {
  padding: 0;
  background: #ffffff;
}

.website-card :deep(.el-card__body:empty) {
  padding: 0;
  display: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.website-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.website-info .website-name {
  font-weight: 700;
  min-width: 80px;
  font-size: 17px;
  color: #1e293b;
  letter-spacing: -0.025em;
}

.brand-code {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.card-actions {
  flex-shrink: 0;
}

.card-content {
  padding: 20px;
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
  //background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 1px;
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
  //border: 1px solid #93c5fd;
  box-shadow: 0 1px 3px #b8d9fb;
}
</style>
