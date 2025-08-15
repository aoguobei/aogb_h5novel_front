<template>
  <div class="step-content">
    <div class="step-header">
      <h2>第五步：UI配置</h2>
      <p class="step-description">配置网站的主题色彩和视觉风格</p>
    </div>

    <div class="config-layout">
      <!-- 左侧颜色配置 -->
      <div class="color-config-section">
        <el-form :model="uiConfig" label-width="120px">
          <el-form-item label="主背景色" required>
            <el-color-picker v-model="uiConfig.theme_bg_main" :show-alpha="false" />
            <el-input
              v-model="uiConfig.theme_bg_main"
              style="margin-left: 10px;"
              placeholder="输入主背景色（16进制）"
              @input="(value) => handleColorInput('theme_bg_main', value)"
            />
          </el-form-item>
          <el-form-item label="次背景色" required>
            <el-color-picker v-model="uiConfig.theme_bg_second" :show-alpha="true" />
            <el-input
              v-model="uiConfig.theme_bg_second"
              style="margin-left: 10px;"
              placeholder="输入次背景色（支持rgba格式）"
              @input="(value) => handleColorInput('theme_bg_second', value)"
            />
          </el-form-item>
          <el-form-item label="主文字色" required>
            <el-color-picker v-model="uiConfig.theme_text_main" :show-alpha="true" />
            <el-input
              v-model="uiConfig.theme_text_main"
              style="margin-left: 10px;"
              placeholder="输入主文字色（支持rgba格式）"
              @input="(value) => handleColorInput('theme_text_main', value)"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 右侧预览组件 -->
      <div v-if="basicInfo?.businessType === 'novel'" class="preview-section">
        <novel-business-6 
          :theme-config="uiConfig"
          :business-config="businessConfig"
          @color-change="handleComponentColorChange"
          @config-update="handleComponentConfigUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import NovelBusiness6 from '@/components/business/novelBusiness6.vue'

defineProps({
  uiConfig: {
    type: Object,
    required: true
  },
  basicInfo: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['colorInput'])

const handleColorInput = (field, value) => {
  emit('colorInput', field, value)
}

// 业务配置对象
const businessConfig = {
  businessType: 'novel',
  paymentMethod: 'subscription',
  packageCount: 2,
  status: 'active'
}

// 处理组件颜色变化事件
const handleComponentColorChange = (newThemeConfig) => {
  // 可以在这里处理组件返回的颜色变化
  console.log('组件颜色变化:', newThemeConfig)
}

// 处理组件配置更新事件
const handleComponentConfigUpdate = (configUpdate) => {
  // 可以在这里处理组件的配置更新
  console.log('组件配置更新:', configUpdate)
}
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

/* 配置布局 */
.config-layout {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.color-config-section {
  flex: 1;
  min-width: 400px;
}

.preview-section {
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .config-layout {
    flex-direction: column;
    gap: 20px;
  }
  
  .color-config-section {
    min-width: auto;
  }
}
</style> 