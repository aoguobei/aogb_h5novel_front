<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑小说配置"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="180px"
      label-position="left"
    >
      <el-form-item label="跳转抖音小程序首页URL" prop="tt_jump_home_url" required>
        <el-input
          v-model="form.tt_jump_home_url"
          placeholder="例如：sslocal://miniapp?ticket=v1_3532788994"
          clearable
        >
        </el-input>
        <span class="form-tip">抖音小程序跳转首页的URL</span>
      </el-form-item>

      <el-form-item label="抖音h5登录回调域名" prop="tt_login_callback_domain" required>
        <el-input
          v-model="form.tt_login_callback_domain"
          placeholder="例如：novetest.fun.tv"
          clearable
        />
        <span class="form-tip">抖音登录回调的域名</span>
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
const isGeneratingUrl = ref(false)
const form = ref({
  tt_jump_home_url: '',
  tt_login_callback_domain: ''
})

// 表单验证规则
const rules = {
  tt_jump_home_url: [
    { required: true, message: '请输入TT跳转首页URL', trigger: 'blur' }
  ],
  tt_login_callback_domain: [
    { required: true, message: '请输入TT登录回调域名', trigger: 'blur' }
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
      tt_jump_home_url: newConfig.tt_jump_home_url || '',
      tt_login_callback_domain: newConfig.tt_login_callback_domain || ''
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
    await configApi.updateNovelConfigByClientId(props.clientId, form.value)
    ElMessage.success('保存成功')
    emit('save', form.value)
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('保存失败：' + (error.response?.data?.message || error.message || '未知错误'))
    console.error('保存小说配置失败:', error)
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

.form-tip {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}
</style>
