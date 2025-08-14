<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑基础配置"
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
      <el-form-item label="应用名称" prop="app_name" required>
        <el-input v-model="form.app_name" placeholder="输入app_name" />
      </el-form-item>
      
      <el-form-item label="平台" prop="platform" required>
        <el-select v-model="form.platform" placeholder="请选择平台">
          <el-option label="Android" value="android" />
          <el-option label="iOS" value="ios" />
          <el-option label="H5" value="h5" />
          <el-option label="douyin" value="douyin" />
          <el-option label="kuaishou" value="kuaishou" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="app_code" prop="app_code" required>
        <el-input v-model="form.app_code" placeholder="输入app_code" />
      </el-form-item>
      
      <el-form-item label="产品" prop="product" required>
        <el-input v-model="form.product" placeholder="输入product" />
      </el-form-item>
      
      <el-form-item label="customer" prop="customer" required>
        <el-input v-model="form.customer" placeholder="输入customer" />
      </el-form-item>
      
      <el-form-item label="应用ID" prop="appid" required>
        <el-input v-model="form.appid" placeholder="输入appid" />
      </el-form-item>
      
      <el-form-item label="版本" prop="version" required>
        <el-input v-model="form.version" placeholder="输入version" />
      </el-form-item>
      
      <el-form-item label="cl" prop="cl" required>
        <el-input v-model="form.cl" placeholder="输入cl" />
      </el-form-item>
      
      <el-form-item label="uc" prop="uc">
        <el-input v-model="form.uc" placeholder="输入uc" />
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
  app_name: '',
  platform: '',
  app_code: '',
  product: '',
  customer: '',
  appid: '',
  version: '',
  cl: '',
  uc: ''
})

// 表单验证规则
const rules = {
  app_name: [
    { required: true, message: '请输入应用名称', trigger: 'blur' }
  ],
  platform: [
    { required: true, message: '请选择平台', trigger: 'change' }
  ],
  app_code: [
    { required: true, message: '请输入应用代码', trigger: 'blur' }
  ],
  product: [
    { required: true, message: '请输入产品名称', trigger: 'blur' }
  ],
  customer: [
    { required: true, message: '请输入客户名称', trigger: 'blur' }
  ],
  cl: [
    { required: true, message: '请输入渠道代码', trigger: 'blur' }
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
      app_name: newConfig.app_name || '',
      platform: newConfig.platform || '',
      app_code: newConfig.app_code || '',
      product: newConfig.product || '',
      customer: newConfig.customer || '',
      appid: newConfig.appid || '',
      version: newConfig.version || '',
      cl: newConfig.cl || '',
      uc: newConfig.uc || ''
    }
  }
}, { immediate: true, deep: true })

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
    await configApi.updateBaseConfigByClientId(props.clientId, form.value)
    ElMessage.success('保存成功')
    emit('save', form.value)
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('保存失败：' + (error.response?.data?.message || error.message || '未知错误'))
    console.error('保存基础配置失败:', error)
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