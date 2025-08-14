<template>
  <div class="step-content">
    <div class="step-header">
      <h2>第一步：选择品牌和端类型</h2>
      <p class="step-description">请选择要创建网站的品牌和对应的端类型</p>
    </div>
    
    <el-form :model="basicInfo" label-width="120px">
      <el-form-item label="品牌" required>
        <el-select v-model="basicInfo.brandId" placeholder="选择品牌" @change="onBrandChange">
          <el-option
            v-for="brand in brands"
            :key="brand.id"
            :label="brand.code"
            :value="brand.id"
          />
        </el-select>
        <el-button type="primary" @click="showCreateBrandDialog = true" style="margin-left: 10px;">
          新建品牌
        </el-button>
      </el-form-item>
      <el-form-item label="端类型" required>
        <el-select
          v-model="basicInfo.host"
          placeholder="选择端类型"
          :disabled="!basicInfo.brandId"
        >
          <el-option
            v-for="host in availableHosts"
            :key="host.value"
            :label="host.label"
            :value="host.value"
          />
        </el-select>
        <div v-if="!basicInfo.brandId" class="form-tip">
          请先选择品牌
        </div>
        <div v-else-if="availableHosts.length === 0" class="form-tip form-tip-warning">
          该品牌的所有端类型都已创建完成
        </div>
        <div v-else-if="!isCurrentHostAvailable" class="form-tip form-tip-error">
          当前选择的端类型已存在，请重新选择
        </div>
      </el-form-item>
    </el-form>

    <!-- 创建品牌对话框 -->
    <el-dialog v-model="showCreateBrandDialog" title="创建新品牌" width="400px" class="brand-dialog">
      <el-form :model="newBrand" label-width="80px">
        <el-form-item label="品牌代码" required>
          <el-input v-model="newBrand.code" placeholder="输入品牌代码" />
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
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { brandApi } from '@/api/brand'

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

const showCreateBrandDialog = ref(false)
const newBrand = ref({ code: '' })

const onBrandChange = () => {
  emit('brandChange')
}

const createBrand = async () => {
  try {
    const response = await brandApi.createBrand({ code: newBrand.value.code })
    if (response && response.success) {
      ElMessage.success('品牌创建成功')
      showCreateBrandDialog.value = false
      newBrand.value.code = ''
      emit('brandCreated')
    } else {
      ElMessage.error('品牌创建失败')
    }
  } catch (error) {
    ElMessage.error('品牌创建失败')
    console.error(error)
  }
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

.form-tip {
  font-size: 12px;
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
</style> 