<template>
  <div class="website-table-row">
    <!-- 网站名称列 -->
    <div class="table-cell name-cell">
      <div class="website-name">{{ getWebsiteDisplayName(website) }}</div>
    </div>

    <!-- 网站平台列 -->
    <div class="table-cell platform-cell">
      <el-tag :type="getHostTagType(website.client.host)" size="small" class="platform-tag">
        {{ getHostDisplayName(website.client.host) }}
      </el-tag>
    </div>

    <!-- 品牌code列 -->
    <div class="table-cell brand-cell">
      <span class="brand-text">{{ website.client.brand.code }}</span>
    </div>

    <!-- 操作列 -->
    <div class="table-cell actions-cell">
      <div class="action-buttons">
        <el-button
          size="small"
          @click="$emit('toggle', website)"
          :type="website.expanded ? 'info' : 'default'"
          class="info-btn"
        >
          {{ website.expanded ? '收起信息' : '基础信息' }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="$emit('view', website.client.id)"
          class="edit-btn"
        >
          网站配置
        </el-button>
        <el-button
          v-if="miniClientId"
          size="small"
          type="success"
          class="mini-btn"
          @click="$emit('viewMini', miniClientId)"
        >
          小程序配置
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="$emit('delete', { clientId: website.client.id, miniClientId })"
          class="delete-btn"
        >
          删除
        </el-button>
      </div>
    </div>

  </div>
</template>

<script setup>

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
  },
  miniClientId: {
    type: [Number, String, null],
    default: null
  }
})

defineEmits(['toggle', 'view', 'viewExtra', 'viewMini', 'delete'])
</script>

<style scoped>
.website-table-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  background: #fff;
  transition: background-color 0.2s ease;
}

.website-table-row:hover {
  background-color: #f5f7fa;
}

.table-cell {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

/* 网站名称列 */
.name-cell {
  min-width: 120px;
}

.website-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

/* 网站平台列 */
.platform-cell {
  width: 100px;
  flex-shrink: 0;
}

.platform-tag {
  font-size: 12px;
  font-weight: 500;
}

/* 品牌code列 */
.brand-cell {
  flex: 1;
  width: 100px;
  flex-shrink: 0;
}

.brand-text {
  font-size: 14px;
  color: #606266;
}

/* 操作列 */
.actions-cell {
  width: 400px;
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.info-btn {
  font-size: 12px;
  padding: 5px 12px;
}

.edit-btn {
  font-size: 12px;
  padding: 5px 12px;
}

.mini-btn {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  color: #fff;
  border: none;
  font-size: 12px;
  padding: 5px 12px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.mini-btn:hover,
.mini-btn:focus {
  background: linear-gradient(135deg, #2cc08f 0%, #0ea774 100%);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
}

.mini-btn:active {
  transform: translateY(0.5px);
}

.delete-btn {
  font-size: 12px;
  padding: 5px 12px;
}

</style>
