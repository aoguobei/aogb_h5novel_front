<template>
  <div class="loading-container">
    <el-icon class="is-loading"><Loading /></el-icon>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'

defineProps({
  message: {
    type: String,
    default: '加载中...'
  }
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #909399;
}

.loading-container .el-icon {
  font-size: 24px;
  margin-bottom: 12px;
}

.loading-container p {
  margin: 0;
  font-size: 14px;
}
</style> 