<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑通用配置"
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
      <!-- Business ID 相关 -->
      <el-form-item label="启用 Business ID" prop="deliver_business_id_enable">
        <el-switch v-model="form.deliver_business_id_enable" />
      </el-form-item>
      
      <el-form-item 
        label="Deliver Business ID" 
        prop="deliver_business_id"
        v-if="form.deliver_business_id_enable"
      >
        <el-input v-model="form.deliver_business_id" />
      </el-form-item>

      <!-- Switch ID 相关 -->
      <el-form-item label="启用 Switch ID" prop="deliver_switch_id_enable">
        <el-switch v-model="form.deliver_switch_id_enable" />
      </el-form-item>
      
      <el-form-item 
        label="Deliver Switch ID" 
        prop="deliver_switch_id"
        v-if="form.deliver_switch_id_enable"
      >
        <el-input v-model="form.deliver_switch_id" />
      </el-form-item>

      <!-- 其他配置 -->
      <el-form-item label="公司名称" prop="protocol_company" required>
        <el-input v-model="form.protocol_company" />
      </el-form-item>

      <el-form-item label="部署目录url" prop="script_base" required>
        <el-input v-model="form.script_base" placeholder="/tt/xingchen/" />
      </el-form-item>

      <el-form-item label="联系客服URL" prop="contact_url" required>
        <el-input v-model="form.contact_url" type="textarea" />
      </el-form-item>

      <!-- 协议内容 -->
      <el-divider content-position="left">协议内容</el-divider>
      
      <el-form-item label="用户协议" prop="protocol_about">
        <el-input
          v-model="form.protocol_about"
          type="textarea"
          :rows="4"
          placeholder="请输入用户协议内容"
        />
      </el-form-item>

      <el-form-item label="隐私协议" prop="protocol_privacy">
        <el-input
          v-model="form.protocol_privacy"
          type="textarea"
          :rows="4"
          placeholder="请输入隐私协议内容"
        />
      </el-form-item>

      <el-form-item label="付费协议" prop="protocol_vod">
        <el-input
          v-model="form.protocol_vod"
          type="textarea"
          :rows="4"
          placeholder="请输入付费协议内容"
        />
      </el-form-item>

      <el-form-item label="用户取消协议" prop="protocol_user_cancel">
        <el-input
          v-model="form.protocol_user_cancel"
          type="textarea"
          :rows="4"
          placeholder="请输入用户取消协议内容"
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
  deliver_business_id_enable: false,
  deliver_business_id: '',
  deliver_switch_id_enable: false,
  deliver_switch_id: '',
  protocol_company: '',
  protocol_about: '',
  protocol_privacy: '',
  protocol_vod: '',
  protocol_user_cancel: '',
  contact_url: '',
  script_base: ''
})

// 表单验证规则
const rules = {
  deliver_business_id: [
    { required: true, message: '请输入Business ID', trigger: 'blur' }
  ],
  deliver_switch_id: [
    { required: true, message: '请输入Switch ID', trigger: 'blur' }
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
      deliver_business_id_enable: newConfig.deliver_business_id_enable || false,
      deliver_business_id: newConfig.deliver_business_id || '',
      deliver_switch_id_enable: newConfig.deliver_switch_id_enable || false,
      deliver_switch_id: newConfig.deliver_switch_id || '',
      protocol_company: newConfig.protocol_company || '',
      protocol_about: newConfig.protocol_about || '',
      protocol_privacy: newConfig.protocol_privacy || '',
      protocol_vod: newConfig.protocol_vod || '',
      protocol_user_cancel: newConfig.protocol_user_cancel || '',
      contact_url: newConfig.contact_url || '',
      script_base: newConfig.script_base || ''
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
    await configApi.updateCommonConfigByClientId(props.clientId, form.value)
    ElMessage.success('保存成功')
    emit('save', form.value)
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('保存失败：' + (error.response?.data?.message || error.message || '未知错误'))
    console.error('保存通用配置失败:', error)
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