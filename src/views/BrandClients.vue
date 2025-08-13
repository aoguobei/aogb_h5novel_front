<template>
  <div class="brand-clients">
    <div class="header">
      <div class="header-left">
        <el-button @click="$router.push('/')" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h2>{{ brandName }} - 客户端列表</h2>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="$router.push('/create-website')">
          <el-icon><Plus /></el-icon>
          新建客户端
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
      v-else-if="!clients.length" 
      description="该品牌暂无客户端" 
    />
    
    <div v-else class="clients-container">
      <el-card 
        v-for="client in clients" 
        :key="client.id" 
        class="client-card"
        shadow="hover"
      >
        <div class="client-header">
          <div class="client-info">
            <div class="client-title">
              <el-tag :type="getHostTagType(client.host)" size="large">
                {{ getHostDisplayName(client.host) }}
              </el-tag>
              <span class="client-id">ID: {{ client.id }}</span>
            </div>
            <div class="client-meta">
              <span class="created-time">创建时间: {{ formatDate(client.created_at) }}</span>
            </div>
          </div>
          <div class="client-actions">
            <el-button 
              type="primary" 
              size="small"
              @click="viewDetails(client)"
            >
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
            <el-button 
              type="danger" 
              size="small"
              @click="confirmDelete(client)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </div>

        <div class="client-configs">
          <div class="config-status">
            <el-tag 
              :type="client.base_configs?.length ? 'success' : 'info'" 
              size="small"
            >
              基础配置: {{ client.base_configs?.length || 0 }}
            </el-tag>
            <el-tag 
              :type="client.common_configs?.length ? 'success' : 'info'" 
              size="small"
            >
              通用配置: {{ client.common_configs?.length || 0 }}
            </el-tag>
            <el-tag 
              :type="client.pay_configs?.length ? 'success' : 'info'" 
              size="small"
            >
              支付配置: {{ client.pay_configs?.length || 0 }}
            </el-tag>
            <el-tag 
              :type="client.ui_configs?.length ? 'success' : 'info'" 
              size="small"
            >
              UI配置: {{ client.ui_configs?.length || 0 }}
            </el-tag>
            <el-tag 
              :type="client.novel_configs?.length ? 'success' : 'info'" 
              size="small"
            >
              小说配置: {{ client.novel_configs?.length || 0 }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="400px"
    >
      <p>确定要删除客户端 <strong>{{ clientToDelete?.host }}</strong> 吗？</p>
      <p class="warning-text">此操作不可恢复，请谨慎操作！</p>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteClient" :loading="deleting">
            确认删除
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Plus, View, Delete } from '@element-plus/icons-vue'
import { useWebsite } from '@/composables/useWebsite'
import { websiteApi } from '@/api/website'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const { websites, loading, fetchWebsites } = useWebsite()

const error = ref('')
const deleteDialogVisible = ref(false)
const clientToDelete = ref(null)
const deleting = ref(false)

// 从路由参数获取品牌ID
const brandId = computed(() => parseInt(route.params.brandId))

// 获取品牌名称
const brandName = computed(() => {
  const brand = websites.value.find(website => website.client.brand_id === brandId.value)
  return brand?.client.brand?.code || '未知品牌'
})

// 获取当前品牌的所有客户端
const clients = computed(() => {
  return websites.value
    .filter(website => website.client.brand_id === brandId.value)
    .map(website => website.client)
    .sort((a, b) => {
      // 自定义排序：h5, tth5, ksh5, tt, ks
      const order = { 'h5': 1, 'tth5': 2, 'ksh5': 3, 'tt': 4, 'ks': 5 }
      return (order[a.host] || 999) - (order[b.host] || 999)
    })
})

// 获取主机类型显示名称
const getHostDisplayName = (host) => {
  const hostMap = {
    'h5': 'H5',
    'tth5': '头条H5',
    'ksh5': '快手H5',
    'tt': '头条小程序',
    'ks': '快手小程序'
  }
  return hostMap[host] || host
}

// 获取主机类型标签颜色
const getHostTagType = (host) => {
  const typeMap = {
    'h5': 'primary',
    'tth5': 'warning',
    'ksh5': 'success',
    'tt': 'danger',
    'ks': 'info'
  }
  return typeMap[host] || 'default'
}

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 查看详情
const viewDetails = (client) => {
  router.push(`/website-config/${client.id}`)
}

// 确认删除
const confirmDelete = (client) => {
  clientToDelete.value = client
  deleteDialogVisible.value = true
}

// 删除客户端
const deleteClient = async () => {
  if (!clientToDelete.value) return
  
  deleting.value = true
  try {
    await websiteApi.deleteWebsite(clientToDelete.value.id)
    
    ElMessage.success('删除成功')
    deleteDialogVisible.value = false
    clientToDelete.value = null
    
    // 重新获取数据，包含所有类型的客户端
    await fetchWebsites(true)
  } catch (error) {
    ElMessage.error('删除失败: ' + (error.response?.data?.message || error.message))
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  try {
    await fetchWebsites(true) // 传入true，包含所有类型的客户端
  } catch (err) {
    error.value = '获取客户端列表失败'
  }
})
</script>

<style scoped>
.brand-clients {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  margin-right: 16px;
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

.clients-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.client-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.client-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.client-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.client-info {
  flex: 1;
}

.client-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.client-id {
  color: #909399;
  font-size: 14px;
}

.client-meta {
  color: #606266;
  font-size: 14px;
}

.client-actions {
  display: flex;
  gap: 8px;
}

.client-configs {
  border-top: 1px solid #ebeef5;
  padding-top: 16px;
}

.config-status {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.warning-text {
  color: #e6a23c;
  font-size: 14px;
  margin-top: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 