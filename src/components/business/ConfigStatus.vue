<template>
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

    <!-- 附加小程序配置 -->
    <div v-if="website.client.host === 'ksh5' && hasKsConfig(website)" class="extra-config">
      <div class="extra-config-header">
        <h4>快手小程序配置</h4>
        <el-button
          size="small"
          type="primary"
          @click="$emit('viewExtra', website.ks_config.client.id)"
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
          @click="$emit('viewExtra', website.tt_config.client.id)"
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
</template>

<script setup>
import { Check, Close } from '@element-plus/icons-vue'

const hasBaseConfig = (website) => {
  return website.base_config && Object.keys(website.base_config).length > 0
}

const hasCommonConfig = (website) => {
  return website.common_config && Object.keys(website.common_config).length > 0
}

const hasPayConfig = (website) => {
  return website.pay_config && Object.keys(website.pay_config).length > 0
}

const hasUIConfig = (website) => {
  return website.ui_config && Object.keys(website.ui_config).length > 0
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

const getHostDisplayName = (host) => {
  const hostMap = {
    'tt': '抖音小程序',
    'ks': '快手小程序'
  }
  return hostMap[host] || host
}

const getHostTagType = (host) => {
  const typeMap = {
    'tt': 'info',
    'ks': 'danger'
  }
  return typeMap[host] || 'default'
}

defineProps({
  website: {
    type: Object,
    required: true
  }
})

defineEmits(['viewExtra'])
</script>

<style scoped>
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

.extra-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f8f9fa;
}
</style>
