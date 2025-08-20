<template>
  <el-card class="brand-card" shadow="hover">
    <div class="brand-content">
      <div>
        <!-- 品牌图标和标题区域 -->
        <div class="brand-header">
          <div class="brand-icon">
            <el-icon size="24"><Shop /></el-icon>
          </div>
          <div class="brand-title">
            <div class="brand-name">{{ brand.code }}</div>
            <p class="brand-subtitle">品牌代码</p>
          </div>
        </div>
        <!-- 品牌信息区域 -->
        <div class="brand-info">
          <div class="info-row">
            <div class="info-item">
              <el-icon><Calendar /></el-icon>
              <span class="info-text">创建时间: {{ formatDate(brand.created_at) }}</span>
            </div>
            <div class="info-item">
              <el-icon><Link /></el-icon>
              <span class="info-text">客户端数量: {{ brand.clients?.length || 0 }} 个</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 操作按钮区域 -->
      <div class="brand-actions">
        <el-button
          type="primary"
          size="small"
          @click="$emit('view', brand)"
          :icon="View"
        >
          查看客户端
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { Shop, Calendar, Link, View, } from '@element-plus/icons-vue'

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

defineProps({
  brand: {
    type: Object,
    required: true
  }
})

defineEmits(['view',])
</script>

<style scoped>
.brand-card {
  transition: all 0.3s ease;
  border: none;
  border-radius: 10px;
  overflow: hidden;
}

.brand-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.brand-content {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.brand-title {
  flex: 1;
}

.brand-name {
  margin: 0 0 2px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.brand-subtitle {
  margin: 0;
  color: #909399;
  font-size: 11px;
}

.brand-info {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  gap: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-item .el-icon {
  color: #909399;
  font-size: 14px;
  width: 16px;
}

.info-text {
  color: #606266;
  font-size: 13px;
}

.brand-actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.brand-actions .el-button {
  border-radius: 6px;
  font-weight: 500;
  font-size: 12px;
  padding: 4px 10px;
  height: 28px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .brand-content {
    padding: 16px;
  }

  .brand-header {
    gap: 12px;
    margin-bottom: 16px;
  }

  .brand-icon {
    width: 40px;
    height: 40px;
  }

  .brand-name {
    font-size: 16px;
  }

  .brand-actions {
    flex-wrap: wrap;
  }
}
</style>
