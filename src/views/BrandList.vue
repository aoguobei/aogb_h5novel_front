<template>
  <div class="brand-list">
    <div class="header">
      <div class="header-content">
        <h2>品牌管理</h2>
        <p class="header-subtitle">管理所有品牌和网站配置</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showCreateDialog = true">
          <el-icon><Plus /></el-icon>
          新建品牌
        </el-button>
        <el-button type="success" @click="$router.push('/create-website')">
          <el-icon><Plus /></el-icon>
          创建网站
        </el-button>
      </div>
    </div>

    <div class="content-area">
      <LoadingSpinner v-if="loading" />
      
      <el-empty 
        v-else-if="!brands.length" 
        description="暂无品牌数据"
      >
        <el-button type="primary" @click="showCreateDialog = true">
          创建第一个品牌
        </el-button>
      </el-empty>
      
      <div v-else class="brands-grid">
        <BrandCard
          v-for="brand in brands"
          :key="brand.id"
          :brand="brand"
          @view="viewBrandWebsites"
          @edit="editBrand"
          @delete="handleDeleteBrand"
        />
      </div>
    </div>

    <!-- Create Brand Dialog -->
    <el-dialog v-model="showCreateDialog" title="创建品牌" width="500px">
      <el-form :model="newBrand" label-width="100px">
        <el-form-item label="品牌代码">
          <el-input v-model="newBrand.code" placeholder="请输入品牌代码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" @click="handleCreateBrand">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useBrand } from '@/composables/useBrand'
import BrandCard from '@/components/business/BrandCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const { brands, loading, fetchBrands, createBrand, deleteBrand } = useBrand()

const showCreateDialog = ref(false)
const newBrand = ref({
  code: ''
})

// 创建品牌
const handleCreateBrand = async () => {
  if (!newBrand.value.code.trim()) {
    ElMessage.error('请输入品牌代码')
    return
  }

  const success = await createBrand(newBrand.value)
  if (success) {
    showCreateDialog.value = false
    newBrand.value.code = ''
  }
}

// 删除品牌
const handleDeleteBrand = async (brand) => {
  try {
  return ElMessage.info('删除功能暂未实现')
    await ElMessageBox.confirm(
      `确定要删除品牌 "${brand.code}" 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await deleteBrand(brand)
  } catch (error) {
    // 用户取消删除
  }
}

// 编辑品牌
const editBrand = (brand) => {
  ElMessage.info('编辑功能暂未实现')
}

// 查看品牌网站
const viewBrandWebsites = (brand) => {
  router.push('/website-configs')
}

onMounted(() => {
  fetchBrands()
})
</script>

<style scoped>
.brand-list {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.header-subtitle {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.content-area {
  min-height: 400px;
}

.brands-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
