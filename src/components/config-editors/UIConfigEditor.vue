<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑UI配置"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <div class="config-layout">
      <!-- 左侧颜色配置表单 -->
      <div class="form-section">
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
      </div>

      <!-- 右侧实时预览 -->
      <div class="preview-section">
        <div class="preview-content">
          <novel-business-6
            :theme-config="form"
            :business-config="businessConfig"
            @color-change="handleComponentColorChange"
            @config-update="handleComponentConfigUpdate"
          />
        </div>
      </div>
    </div>

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
import NovelBusiness6 from '@/components/business/novelBusiness6.vue'

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

// 业务配置对象
const businessConfig = {
  businessType: 'novel',
  paymentMethod: 'subscription',
  packageCount: 2,
  status: 'active'
}

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

/* 配置布局 */
.config-layout {
  display: flex;
  gap: 25px;
  align-items: flex-start;
   min-height: 300px;
}

.form-section {
  flex: 1;
  min-width: 300px;
}

.preview-section {
  flex-shrink: 0;
  width: 200px;
}

.preview-content {
  position: absolute;
  transform: scale(0.6);
  transform-origin: top left;
  overflow: hidden;
  display: inline-block;
  padding: 0;
  margin: 0;
  width: fit-content;
  height: fit-content;
}

/* 缩小预览组件 */


/* 响应式设计 */
@media (max-width: 768px) {
  .config-layout {
    flex-direction: column;
    gap: 20px;
  }

  .form-section {
    min-width: auto;
  }

  .preview-section {
    width: 100%;
  }
}
</style>
