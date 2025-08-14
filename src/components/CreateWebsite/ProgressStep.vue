<template>
  <div class="step-content">
    <div class="step-header">
      <h2>第七步：生成文件</h2>
      <p class="step-description">正在为您创建网站，请稍候...</p>
    </div>

    <div class="progress-section">
      <div class="progress-header">
        <h3>正在创建网站...</h3>
        <p>请耐心等待，系统正在为您生成网站文件</p>
      </div>

      <el-progress
        :percentage="progressPercentage"
        :status="progressStatus"
        :stroke-width="20"
        class="main-progress"
      />
      <div class="progress-text">{{ progressText }}</div>

      <div class="progress-details" v-if="progressDetails.length > 0">
        <div v-for="(detail, index) in progressDetails" :key="index" class="progress-detail">
          <el-icon v-if="detail.status === 'success'" color="#67C23A"><CircleCheck /></el-icon>
          <el-icon v-else-if="detail.status === 'error'" color="#F56C6C"><CircleClose /></el-icon>
          <el-icon v-else color="#E6A23C"><Loading /></el-icon>
          <span>{{ detail.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CircleCheck, CircleClose, Loading } from '@element-plus/icons-vue'

defineProps({
  progressPercentage: {
    type: Number,
    default: 0
  },
  progressStatus: {
    type: String,
    default: ''
  },
  progressText: {
    type: String,
    default: '准备创建...'
  },
  progressDetails: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.step-content {
  margin: 15px 0;
  min-height: 300px;
}

.step-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.step-header h2 {
  margin: 0 0 8px 0;
  color: #409eff;
  font-size: 20px;
}

.step-description {
  font-size: 14px;
  color: #909399;
  margin-bottom: 15px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.progress-section {
  text-align: center;
  padding: 40px 0;
}

.progress-header {
  margin-bottom: 30px;
}

.progress-header h3 {
  margin: 0 0 10px 0;
  color: #409eff;
  font-size: 24px;
}

.progress-header p {
  margin: 0;
  color: #909399;
  font-size: 16px;
}

.main-progress {
  margin-bottom: 20px;
}

.progress-text {
  margin-top: 20px;
  font-size: 16px;
  color: #606266;
}

.progress-details {
  margin-top: 20px;
  text-align: left;
  max-height: 200px;
  overflow-y: auto;
}

.progress-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.progress-detail span {
  font-size: 14px;
  color: #606266;
}
</style> 