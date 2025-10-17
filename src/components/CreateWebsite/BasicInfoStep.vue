<template>
  <div class="step-content">
    <div class="step-header">
      <div class="step-title">第一步：选择brand和platform</div>
      <p class="step-description">请选择要创建网站的brand和对应的platform</p>
    </div>

    <el-form :model="basicInfo" label-width="120px">
      <el-form-item label="brand" required>
        <el-select
          v-model="basicInfo.brandId"
          placeholder="选择brand"
          @change="onBrandChange"
        >
          <el-option
            v-for="brand in brands"
            :key="brand.id"
            :label="brand.name || brand.code"
            :value="brand.id"
          />
        </el-select>
        <el-button
          type="primary"
          @click="showCreateBrandDialog = true"
          style="margin-left: 10px;"
        >
          新建brand
        </el-button>
      </el-form-item>

      <el-form-item label="platform" required>
        <el-select
          v-model="basicInfo.host"
          placeholder="选择platform"
          :disabled="!basicInfo.brandId"
        >
          <el-option
            v-for="host in availableHosts"
            :key="host.value"
            :label="host.disabled ? `${host.label} (已存在)` : host.label"
            :value="host.value"
            :disabled="host.disabled"
          />
        </el-select>
        <div v-if="availableHosts.every(host => host.disabled)" class="form-tip form-tip-warning">
          该brand的所有platform都已创建完成
        </div>
        <div v-else-if="!isCurrentHostAvailable" class="form-tip form-tip-error">
          当前选择的platform已存在，请重新选择
        </div>
      </el-form-item>
    </el-form>

    <!-- 创建brand对话框 -->
    <el-dialog v-model="showCreateBrandDialog" title="创建新brand" width="500px" class="brand-dialog">
      <el-form :model="newBrand" label-width="100px">
        <el-form-item label="业务类型" required>
          <el-select v-model="newBrand.type_id" placeholder="选择业务类型">
            <el-option
              v-for="type in types"
              :key="type.id"
              :label="type.name"
              :value="type.id"
              :disabled="type.code !== 'novel'"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="brand" required>
          <el-input v-model="newBrand.code" placeholder="输入brand" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateBrandDialog = false">取消</el-button>
          <el-button type="primary" @click="createBrand">创建</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { brandApi } from '@/api/brand'
import { useType } from '@/composables/useType'

const props = defineProps({
  basicInfo: {
    type: Object,
    required: true
  },
  brands: {
    type: Array,
    required: true
  },
  availableHosts: {
    type: Array,
    required: true
  },
  isCurrentHostAvailable: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:basicInfo', 'brandChange', 'brandCreated'])

// 使用类型相关的composable
const { types, fetchTypes } = useType()

const showCreateBrandDialog = ref(false)
const newBrand = ref({
  code: '',
  type_id: null
})

const onBrandChange = () => {
  emit('brandChange')
}

const createBrand = async () => {
  if (!newBrand.value.type_id) {
    ElMessage.error('请选择业务类型')
    return
  }

  if (!newBrand.value.code.trim()) {
    ElMessage.error('请输入brand')
    return
  }

  try {
    const response = await brandApi.createBrand({
      code: newBrand.value.code,
      type_id: newBrand.value.type_id
    })
    if (response && response.success) {
      ElMessage.success('brand创建成功')
      showCreateBrandDialog.value = false
      newBrand.value = { code: '', type_id: null }
      emit('brandCreated')
    } else {
      ElMessage.error('brand创建失败')
    }
  } catch (error) {
    ElMessage.error('brand创建失败')
    console.error(error)
  }
}

// 组件挂载时获取类型列表
fetchTypes()
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
  font-size: 16px;
  color: #909399;
  margin-bottom: 15px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.form-tip {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.form-tip-warning {
  color: #E6A23C;
}

.form-tip-error {
  color: #F56C6C;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 全局字体大小优化 */
:deep(.el-dialog__title) {
  font-size: 18px !important;
  font-weight: 600;
}
</style>
