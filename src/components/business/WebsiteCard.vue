<template>
  <el-card class="website-card" shadow="hover">
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

      <!-- 配置状态指示器 -->
      <ConfigStatus :website="website" @viewExtra="$emit('viewExtra', $event)" />
    </div>
  </el-card>
</template>

<script setup>
import ConfigStatus from './ConfigStatus.vue'

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const getWebsiteDisplayName = (website) => {
  const hostName = getHostDisplayName(website.client.host)
  const appName = hasBaseConfig(website) ? website.base_config.app_name : '未配置'
  return `${hostName}-${appName}`
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
</style> 