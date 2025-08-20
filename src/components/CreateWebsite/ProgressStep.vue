<template>
  <div class="step-content">
    <div class="step-header">
      <div class="step-title">第七步：配置确认与生成</div>
      <p class="step-description">正在为您创建网站，请稍候...</p>
    </div>

    <div class="progress-section">
      <div class="progress-header">
        <div class="progress-title">正在创建网站...</div>
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
        <transition-group name="detail-fade" tag="div">
          <div v-for="(detail, index) in progressDetails" :key="index" class="progress-detail" :class="{ 'text-message': detail.isText, 'error-message': detail.status === 'error', 'rollback-message': detail.isText && detail.text.includes('回滚'), 'failure-message': detail.isText && detail.text.includes('失败') }">
            <el-icon v-if="detail.isText && detail.text.includes('回滚')" color="#E6A23C"><CircleClose /></el-icon>
            <el-icon v-else-if="detail.isText && detail.text.includes('失败')" color="#F56C6C"><CircleClose /></el-icon>
            <el-icon v-else-if="detail.status === 'success'" color="#67C23A"><CircleCheck /></el-icon>
            <el-icon v-else color="#E6A23C"><Loading /></el-icon>
            <span v-if="detail.isText" class="text-part" :class="{ 'rollback-text': detail.text.includes('回滚'), 'failure-text': detail.text.includes('失败') }">{{ detail.text }}</span>
            <span v-if="detail.isText && detail.detail" class="detail-separator">      </span>
            <span v-if="detail.isText && detail.detail" class="detail-part">{{ detail.detail }}</span>
            <span v-if="!detail.isText" class="detail-message" :class="{ 'error-text': detail.status === 'error' }">{{ detail.message }}</span>
          </div>
        </transition-group>
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

.step-title {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 22px;
  font-weight: 600;
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
  padding: 20px 0;
}

.progress-header {
  margin-bottom: 30px;
}

.progress-title {
  margin: 0 0 10px 0;
  color: #409eff;
  font-size: 28px;
  font-weight: 600;
}

.progress-header p {
  margin: 0;
  color: #909399;
  font-size: 18px;
}

.main-progress {
  margin-bottom: 20px;
}

.progress-text {
  margin-top: 20px;
  font-size: 18px;
  color: #606266;
}

.progress-details {
  margin-top: 20px;
  text-align: left;
  max-height: 240px;
  overflow-y: auto;
}

.progress-detail {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.progress-detail.text-message {
  background-color: #f5f7fa;
  border-left: 4px solid #67C23A;
  font-weight: 500;
}

.progress-detail.error-message {
  background-color: #fef0f0;
  border-left: 4px solid #F56C6C;
}

.progress-detail.rollback-message {
  background-color: #fdf6ec;
  border-left: 4px solid #E6A23C;
}

.progress-detail.failure-message {
  background-color: #fef0f0;
  border-left: 4px solid #F56C6C;
}

.progress-detail span {
  font-size: 16px;
  color: #606266;
}

.text-part {
  color: #67C23A !important;
  font-weight: 600;
  min-width: 60px;
}

.detail-separator {
  color: transparent !important;
  user-select: none;
}

.detail-part {
  color: #606266 !important;
  font-weight: normal;
}

.detail-message {
  color: #606266 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.error-text {
  color: #F56C6C !important;
  font-weight: 500;
}

.rollback-text {
  color: #E6A23C !important;
  font-weight: 500;
}

.failure-text {
  color: #F56C6C !important;
  font-weight: 500;
}

/* 动画效果 */
.detail-fade-enter-active,
.detail-fade-leave-active {
  transition: all 0.3s ease;
}

.detail-fade-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.detail-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 进度条动画 */
.main-progress :deep(.el-progress-bar__outer) {
  transition: all 0.3s ease;
}

.main-progress :deep(.el-progress-bar__inner) {
  transition: width 0.5s ease;
}

/* 状态指示器 */
.progress-detail .el-icon {
  animation: pulse 2s infinite;
  flex-shrink: 0;
  margin-top: 2px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 全局字体大小优化 */
:deep(.el-progress__text) {
  font-size: 16px !important;
  font-weight: 500;
}

:deep(.el-progress-bar__outer) {
  font-size: 16px !important;
}
</style>
