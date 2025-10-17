<template>
  <div class="config-confirm-step">
    <div class="confirm-header">
      <h2 class="confirm-title">配置确认</h2>
      <p class="confirm-subtitle">请仔细检查以下配置信息，确认无误后点击"确认配置"继续</p>
    </div>

    <div class="config-container">
      <!-- 配置模块展示区域 -->
      <div class="config-display">
        <div class="config-header">
          <el-icon class="config-icon"><Document /></el-icon>
          <h3>网站配置 (JSON格式)</h3>
          <el-tag type="info" size="small">{{ configSize }} 字符</el-tag>
          <div class="header-actions">
            <el-button 
              type="primary" 
              @click="copyConfig" 
              :icon="CopyDocument" 
              class="action-btn copy-btn"
            >
              复制配置
            </el-button>
            <el-button 
              @click="toggleFormat" 
              :icon="View" 
              class="action-btn format-btn"
            >
              {{ showFormatted ? '紧凑模式' : '格式化模式' }}
            </el-button>
          </div>
        </div>
        
        <div class="config-modules">
          <!-- 基本信息 -->
          <div class="config-module">
            <div class="module-header">
              <h4>基本信息 (basicInfo)</h4>
            </div>
            <div class="json-container">
              <pre class="json-content" :class="{ 'formatted': showFormatted }">{{ getModuleConfig('basicInfo') }}</pre>
            </div>
          </div>

          <!-- 基础配置 -->
          <div class="config-module">
            <div class="module-header">
              <h4>基础配置 (baseConfig)</h4>
            </div>
            <div class="json-container">
              <pre class="json-content" :class="{ 'formatted': showFormatted }">{{ getModuleConfig('baseConfig') }}</pre>
            </div>
          </div>

          <!-- 额外基础配置 -->
          <div v-if="needsExtraBaseConfig && extraBaseConfig" class="config-module">
            <div class="module-header">
              <h4>{{ extraBaseConfigLabel }} (extraBaseConfig)</h4>
            </div>
            <div class="json-container">
              <pre class="json-content" :class="{ 'formatted': showFormatted }">{{ getModuleConfig('extraBaseConfig') }}</pre>
            </div>
          </div>

          <!-- 通用配置 -->
          <div class="config-module">
            <div class="module-header">
              <h4>通用配置 (commonConfig)</h4>
            </div>
            <div class="json-container">
              <pre class="json-content" :class="{ 'formatted': showFormatted }">{{ getModuleConfig('commonConfig') }}</pre>
            </div>
          </div>

          <!-- 支付配置 -->
          <div class="config-module">
            <div class="module-header">
              <h4>支付配置 (payConfig)</h4>
            </div>
            <div class="json-container">
              <pre class="json-content" :class="{ 'formatted': showFormatted }">{{ getModuleConfig('payConfig') }}</pre>
            </div>
          </div>

          <!-- UI配置 -->
          <div class="config-module">
            <div class="module-header">
              <h4>UI配置 (uiConfig)</h4>
            </div>
            <div class="json-container">
              <pre class="json-content" :class="{ 'formatted': showFormatted }">{{ getModuleConfig('uiConfig') }}</pre>
            </div>
          </div>

          <!-- 小说配置 - 只在tth5端或有配置时显示 -->
          <div v-if="shouldShowNovelConfig" class="config-module">
            <div class="module-header">
              <h4>小说特有配置 (novelConfig)</h4>
            </div>
            <div class="json-container">
              <pre class="json-content" :class="{ 'formatted': showFormatted }">{{ getModuleConfig('novelConfig') }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="confirm-actions">
      <el-button type="primary" @click="$emit('confirm-config')" class="action-btn confirm-btn">
        <el-icon><Check /></el-icon>
        确认配置
      </el-button>
    </div>
  </div>
</template>

<script setup>
import {
  Document,
  Check,
  CopyDocument,
  View
} from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  basicInfo: {
    type: Object,
    required: true
  },
  baseConfig: {
    type: Object,
    required: true
  },
  extraBaseConfig: {
    type: Object,
    required: true
  },
  commonConfig: {
    type: Object,
    required: true
  },
  payConfig: {
    type: Object,
    required: true
  },
  uiConfig: {
    type: Object,
    required: true
  },
  novelConfig: {
    type: Object,
    required: true
  },
  brands: {
    type: Array,
    required: true
  },
  needsExtraBaseConfig: {
    type: Boolean,
    required: true
  },
  extraBaseConfigLabel: {
    type: String,
    required: true
  }
})

defineEmits(['confirm-config'])

// 格式化模式切换
const showFormatted = ref(true)

// 判断是否应该显示小说配置
const shouldShowNovelConfig = computed(() => {
  // 检查小说配置是否存在
  if (!props.novelConfig) {
    return false
  }
  
  // 检查是否所有值都为空
  const allValuesEmpty = Object.values(props.novelConfig).every(value => {
    if (value === null || value === undefined) return true
    if (typeof value === 'string' && value.trim() === '') return true
    if (typeof value === 'object' && Object.keys(value).length === 0) return true
    return false
  })
  
  // 如果不是所有值都为空，就显示
  return !allValuesEmpty
})

// 合并所有配置为JSON格式
const mergedConfig = computed(() => {
  const config = {
    basicInfo: props.basicInfo,
    baseConfig: props.baseConfig,
    commonConfig: props.commonConfig,
    payConfig: props.payConfig,
    uiConfig: props.uiConfig
  }

  // 如果需要额外基础配置，添加到配置中
  if (props.needsExtraBaseConfig && props.extraBaseConfig) {
    config.extraBaseConfig = props.extraBaseConfig
  }

  // 如果需要显示小说配置，添加到配置中
  if (shouldShowNovelConfig.value) {
    config.novelConfig = props.novelConfig
  }

  return config
})

// 获取单个模块的配置
const getModuleConfig = (moduleName) => {
  const config = mergedConfig.value[moduleName]
  if (!config) return '{}'
  
  return showFormatted.value 
    ? JSON.stringify(config, null, 2)
    : JSON.stringify(config)
}

// 配置大小
const configSize = computed(() => {
  return JSON.stringify(mergedConfig.value).length
})

// 复制配置
const copyConfig = async () => {
  try {
    const configText = JSON.stringify(mergedConfig.value, null, 2)
    await navigator.clipboard.writeText(configText)
    ElMessage.success('配置已复制到剪贴板')
  } catch (error) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = JSON.stringify(mergedConfig.value, null, 2)
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('配置已复制到剪贴板')
  }
}

// 切换格式
const toggleFormat = () => {
  showFormatted.value = !showFormatted.value
}
</script>

<style scoped>
.config-confirm-step {
  padding: 20px 0 0;
  max-width: 1200px;
  margin: 0 auto;
}

.confirm-header {
  text-align: center;
  margin-bottom: 30px;
}

.confirm-title {
  margin: 0 0 10px 0;
  color: #409eff;
  font-size: 28px;
  font-weight: 600;
}

.confirm-subtitle {
  margin: 0;
  color: #909399;
  font-size: 18px;
}

.config-container {
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  overflow: hidden;
  margin-bottom: 30px;
}

.config-display {
  background: #ffffff;
  margin: 0;
}

.config-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.config-icon {
  font-size: 20px;
  color: #409eff;
}

.config-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
  flex: 1;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  height: 32px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.copy-btn {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.copy-btn:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.copy-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
}

.format-btn {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #495057;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.format-btn:hover {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  color: #343a40;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #adb5bd;
}

.format-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.action-btn .el-icon {
  font-size: 14px;
  width: 14px;
  height: 14px;
}

.config-modules {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.config-module {
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.module-header {
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
}

.module-header h4 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.json-container {
  padding: 16px;
  background: #ffffff;
  max-height: 300px;
  overflow-y: auto;
}

.json-content {
  margin: 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 15px;
  line-height: 1.6;
  color: #2c3e50;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  white-space: pre-wrap;
  word-break: break-all;
}

.json-content.formatted {
  white-space: pre;
  word-break: normal;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.confirm-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  padding: 12px 24px;
}

.confirm-btn .el-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .config-confirm-step {
    padding: 15px;
  }

  .confirm-title {
    font-size: 24px;
  }

  .confirm-subtitle {
    font-size: 16px;
  }

  .config-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
    gap: 8px;
  }

  .action-btn {
    flex: 1;
    max-width: 140px;
    height: 36px;
    font-size: 12px;
  }

  .config-modules {
    padding: 15px;
    gap: 15px;
  }

  .json-container {
    padding: 12px;
  }

  .json-content {
    font-size: 13px;
    padding: 12px;
  }
}

/* 滚动条样式 */
.json-container::-webkit-scrollbar {
  width: 6px;
}

.json-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.json-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.json-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
