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

    <LoadingSpinner v-if="loading" />
    
    <el-alert
      v-else-if="error"
      :title="error"
      type="error"
      show-icon
      :closable="false"
    />
    
    <el-empty 
      v-else-if="!websites.length" 
      description="暂无网站配置" 
    />
    
    <div v-else class="websites-grid">
      <WebsiteCard
        v-for="website in websites"
        :key="website.id"
        :website="website"
        @toggle="toggleDetails"
        @view="viewConfig"
        @viewExtra="viewExtraConfig"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { House, Plus } from '@element-plus/icons-vue'
import { useWebsite } from '@/composables/useWebsite'
import WebsiteCard from '@/components/business/WebsiteCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const { websites, loading, fetchWebsites } = useWebsite()
const error = ref('')

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
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header h2 {
  margin: 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.websites-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style> 