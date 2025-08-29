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

    <div v-else class="horizontal main-content">
      <!-- 左侧平台选择区域 -->
      <div class="platform-selector">
        <div class="horizontal j-c align_center platform-header">
          <div class="platform-title">选择平台</div>
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

        <div class="platform-grid">
          <div
            v-for="platform in platforms"
            :key="platform.value"
            class="platform-card"
            :class="{ active: selectedPlatforms.includes(platform.value) }"
            @click="togglePlatform(platform.value)"
          >
            <div class="platform-icon" :class="platform.iconClass">
              <el-icon><component :is="platform.icon" /></el-icon>
            </div>
            <div class="platform-info">
              <div class="platform-name">{{ platform.label }}</div>
              <div class="platform-desc">{{ platform.description }}</div>
            </div>
            <div class="platform-count">
              {{ getPlatformCount(platform.value) }}
            </div>
          </div>
        </div>

        <div class="platform-stats">
          <div class="stat-item">
            <div class="stat-number">{{ filteredWebsites.length }}</div>
            <div class="stat-label">筛选结果</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ websites.length }}</div>
            <div class="stat-label">总数量</div>
          </div>
        </div>
      </div>

      <!-- 右侧网站列表 -->
      <div class="websites-panel box">
        <div class="horizontal j-s-b align_center websites-header">
          <div class="websites-title">网站配置 ({{ filteredWebsites.length }})</div>
        </div>

        <el-empty
          v-if="!filteredWebsites.length"
          description="暂无符合条件的网站配置"
        />

        <div v-else class="vertical websites-grid">
          <WebsiteCard
            v-for="website in filteredWebsites"
            :key="website.id"
            :website="website"
            @toggle="toggleDetails"
            @view="viewConfig"
            @viewExtra="viewExtraConfig"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { House, Plus, VideoPlay, VideoCamera } from '@element-plus/icons-vue'
import { useWebsite } from '@/composables/useWebsite'
import { usePlatformInfo } from '@/composables/useConfig'
import WebsiteCard from '@/components/business/WebsiteCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Header from '@/components/common/Header.vue'

const router = useRouter()
const { websites, loading, fetchWebsites } = useWebsite()
const { getH5Platforms } = usePlatformInfo()
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

onMounted(async () => {
  try {
    await fetchWebsites()
  } catch (err) {
    error.value = '获取网站配置失败'
  }
})
</script>

<style scoped>
.website-configs {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-actions {
  margin-bottom: 32px;
}

.main-content {
  gap: 32px;
  margin-top: 32px;
}

/* 左侧平台选择区域 */
.platform-selector {
  width: 380px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  padding: 32px;
  height: fit-content;
  position: sticky;
  top: 32px;
}

.platform-header {
  margin-bottom: 32px;
  gap: 16px;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.platform-card {
  background: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
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
  width: 48px;
  height: 48px;
  border-radius: 14px;
  color: #fff;
  font-size: 22px;
  margin-bottom: 16px;
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

.platform-info {
  margin-bottom: 12px;
}

.platform-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.platform-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
}

.platform-count {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f1f5f9;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  min-width: 28px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.platform-card.active .platform-count {
  background: linear-gradient(135deg, #8b7ec8 0%, #7c5a9a 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(139, 126, 200, 0.3);
  transform: scale(1.05);
}

.platform-stats {
  display: flex;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 16px 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.stat-item:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.stat-number {
  font-size: 24px;
  font-weight: 800;
  color: #8b7ec8;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

/* 右侧网站列表 */
.websites-panel {
  flex: 1;
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

.websites-grid {
  gap: 16px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
    gap: 24px;
  }

  .platform-selector {
    width: 100%;
    position: static;
    max-width: 600px;
    margin: 0 auto;
  }

  .platform-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
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
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .platform-stats {
    flex-direction: column;
    gap: 16px;
  }

  .websites-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
