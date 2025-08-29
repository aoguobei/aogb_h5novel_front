<template>
  <div class="client-list">
    <div class="header">
      <div class="header-left">
        <div class="header-title">{{ brandName }} — 客户端列表</div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="$router.push(`/create-website?brandId=${props.brandId}&brandCode=${props.brandCode}`)">
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
              <div class="fwb">{{getAppName(client)}}</div>
              <el-tag :type="getHostTagType(client.host)" size="large">
                {{ getHostDisplayName(client.host) }}
              </el-tag>
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
              基础配置
            </el-tag>
            <el-tag
              :type="client.common_configs?.length ? 'success' : 'info'"
              size="small"
            >
              通用配置
            </el-tag>
            <el-tag
              :type="client.pay_configs?.length ? 'success' : 'info'"
              size="small"
            >
              支付配置
            </el-tag>
            <el-tag
              :type="client.ui_configs?.length ? 'success' : 'info'"
              size="small"
            >
              UI配置
            </el-tag>
            <el-tag
              :type="client.novel_configs?.length ? 'success' : 'info'"
              size="small"
            >
              小说配置
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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, View, Delete } from '@element-plus/icons-vue'
import { websiteApi } from '@/api/website'
import { useConfig } from '@/composables/useConfig'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  brandId: {
    type: Number,
    required: true
  },
  brandCode: {
    type: String,
    required: true
  },
  websites: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh'])

const router = useRouter()
const { getHostDisplayName } = useConfig()
const error = ref('')
const deleteDialogVisible = ref(false)
const clientToDelete = ref(null)
const deleting = ref(false)

// 获取品牌名称
const brandName = computed(() => {
  return props.brandCode || '未知品牌'
})

// 获取当前品牌的所有客户端
const clients = computed(() => {
  return props.websites
    .filter(website => website.client.brand_id === props.brandId)
    .map(website => website.client)
    .sort((a, b) => {
      // 按创建时间倒序排列（从新到旧）
      const dateA = new Date(a.created_at || 0)
      const dateB = new Date(b.created_at || 0)
      return dateB - dateA
    })
})

const getAppName = (client) => {
  if (client.base_configs?.length > 0) {
    return client.base_configs[0].app_name
  }
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

    // 通知父组件刷新数据
    emit('refresh')
  } catch (error) {
    ElMessage.error('删除失败: ' + (error.response?.data?.message || error.message))
  } finally {
    deleting.value = false
  }
}

// 监听brandId变化，重置错误状态
watch(() => props.brandId, () => {
  error.value = ''
})
</script>

<style scoped>
.client-list {
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-title {
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.clients-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
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
