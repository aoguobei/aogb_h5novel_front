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

.website-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.website-info .website-name {
  font-weight: bold;
  min-width: 80px;;
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

.config-info-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.config-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.config-label {
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.config-value {
  background: #f0f9ff;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  border: 1px solid #dbeafe;
}
</style> 