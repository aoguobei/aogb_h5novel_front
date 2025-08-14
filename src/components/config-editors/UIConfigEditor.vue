<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑UI配置"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="140px"
      label-position="left"
    >
      <el-form-item label="主背景色" prop="theme_bg_main" required>
        <el-color-picker v-model="form.theme_bg_main" :show-alpha="false" />
        <el-input
          v-model="form.theme_bg_main"
          style="margin-left: 10px;"
          placeholder="输入主背景色（16进制）"
          @input="(value) => handleColorInput('theme_bg_main', value)"
        />
      </el-form-item>
      
      <el-form-item label="次背景色" prop="theme_bg_second" required>
        <el-color-picker v-model="form.theme_bg_second" :show-alpha="true" />
        <el-input
          v-model="form.theme_bg_second"
          style="margin-left: 10px;"
          placeholder="输入次背景色（支持rgba格式）"
          @input="(value) => handleColorInput('theme_bg_second', value)"
        />
      </el-form-item>
      
      <el-form-item label="主文字色" prop="theme_text_main" required>
        <el-color-picker v-model="form.theme_text_main" :show-alpha="true" />
        <el-input
          v-model="form.theme_text_main"
          style="margin-left: 10px;"
          placeholder="输入主文字色（支持rgba格式）"
          @input="(value) => handleColorInput('theme_text_main', value)"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { configApi } from '@/api/config'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object,
    default: () => ({})
  },
  clientId: {
    type: [String, Number],
    required: true
  }
})

// Emits
const emit = defineEmits(['update:visible', 'save', 'cancel'])

// 响应式数据
const formRef = ref()
const saving = ref(false)
const form = ref({
  theme_bg_main: '',
  theme_bg_second: '',
  theme_text_main: ''
})

// 表单验证规则
const rules = {
  theme_bg_main: [
    { required: true, message: '请选择主背景色', trigger: 'change' }
  ],
  theme_bg_second: [
    { required: true, message: '请选择次背景色', trigger: 'change' }
  ],
  theme_text_main: [
    { required: true, message: '请选择主文字色', trigger: 'change' }
  ]
}

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 监听配置变化，填充表单
watch(() => props.config, (newConfig) => {
  if (newConfig) {
    form.value = {
      theme_bg_main: newConfig.theme_bg_main || '',
      theme_bg_second: newConfig.theme_bg_second || '',
      theme_text_main: newConfig.theme_text_main || ''
    }
  }
}, { immediate: true, deep: true })

// 处理颜色输入
const handleColorInput = (field, value) => {
  // 主背景色只允许16进制格式
  if (field === 'theme_bg_main' && value && value.startsWith('rgba')) {
    // 如果是rgba格式，转换为16进制
    const rgbaMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, '0')
      const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, '0')
      const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, '0')
      form.value[field] = `#${r}${g}${b}`
    }
  } else {
    form.value[field] = value
  }
}

// 方法
const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch (error) {
    return
  }

  saving.value = true
  try {
    await configApi.updateUIConfigByClientId(props.clientId, form.value)
    ElMessage.success('保存成功')
    emit('save', form.value)
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('保存失败：' + (error.response?.data?.message || error.message || '未知错误'))
    console.error('保存UI配置失败:', error)
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
  dialogVisible.value = false
}

const handleClose = () => {
  emit('cancel')
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 