<template>
  <div class="step-content">
    <div class="step-header">
      <h2>第五步：UI配置</h2>
      <p class="step-description">配置网站的主题色彩和视觉风格</p>
    </div>

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
</template>

<script setup>
defineProps({
  uiConfig: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['colorInput'])

const handleColorInput = (field, value) => {
  emit('colorInput', field, value)
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
</style> 