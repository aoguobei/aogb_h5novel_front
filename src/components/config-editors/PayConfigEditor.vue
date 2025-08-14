<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑支付配置"
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
      <!-- 普通支付配置 -->
      <el-divider content-position="left">普通支付</el-divider>
      <el-form-item label="启用普通支付" prop="normal_pay_enable">
        <el-switch v-model="form.normal_pay_enable" />
      </el-form-item>
      
      <el-form-item 
        label="Android网关ID" 
        prop="normal_pay_gateway_android"
        v-if="form.normal_pay_enable"
        required
      >
        <el-input-number 
          v-model="form.normal_pay_gateway_android" 
          :min="0" 
        />
      </el-form-item>
      
      <el-form-item 
        label="iOS网关ID" 
        prop="normal_pay_gateway_ios"
        v-if="form.normal_pay_enable"
        required
      >
        <el-input-number 
          v-model="form.normal_pay_gateway_ios" 
          :min="0" 
        />
      </el-form-item>

      <!-- 连包支付配置 -->
      <el-divider content-position="left">连包支付</el-divider>
      <el-form-item label="启用连包支付" prop="renew_pay_enable">
        <el-switch v-model="form.renew_pay_enable" />
      </el-form-item>
      
      <el-form-item 
        label="Android网关ID" 
        prop="renew_pay_gateway_android"
        v-if="form.renew_pay_enable"
        required
      >
        <el-input-number 
          v-model="form.renew_pay_gateway_android" 
          :min="0" 
        />
      </el-form-item>
      
      <el-form-item 
        label="iOS网关ID" 
        prop="renew_pay_gateway_ios"
        v-if="form.renew_pay_enable"
        required
      >
        <el-input-number 
          v-model="form.renew_pay_gateway_ios" 
          :min="0" 
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
  normal_pay_enable: false,
  normal_pay_gateway_android: 0,
  normal_pay_gateway_ios: 0,
  renew_pay_enable: false,
  renew_pay_gateway_android: 0,
  renew_pay_gateway_ios: 0
})

// 表单验证规则
const rules = {
  normal_pay_gateway_android: [
    { required: true, message: '请输入Android网关ID', trigger: 'blur' }
  ],
  normal_pay_gateway_ios: [
    { required: true, message: '请输入iOS网关ID', trigger: 'blur' }
  ],
  renew_pay_gateway_android: [
    { required: true, message: '请输入Android网关ID', trigger: 'blur' }
  ],
  renew_pay_gateway_ios: [
    { required: true, message: '请输入iOS网关ID', trigger: 'blur' }
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
      normal_pay_enable: newConfig.normal_pay_enable || false,
      normal_pay_gateway_android: newConfig.normal_pay_gateway_android || 0,
      normal_pay_gateway_ios: newConfig.normal_pay_gateway_ios || 0,
      renew_pay_enable: newConfig.renew_pay_enable || false,
      renew_pay_gateway_android: newConfig.renew_pay_gateway_android || 0,
      renew_pay_gateway_ios: newConfig.renew_pay_gateway_ios || 0
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
    await configApi.updatePayConfigByClientId(props.clientId, form.value)
    ElMessage.success('保存成功')
    emit('save', form.value)
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('保存失败：' + (error.response?.data?.message || error.message || '未知错误'))
    console.error('保存支付配置失败:', error)
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