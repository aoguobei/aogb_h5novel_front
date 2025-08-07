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
        <el-button type="success" @click="createWebsite">
          <el-icon><Plus /></el-icon>
          创建网站
        </el-button>
      </div>
    </div>

    <div class="content-area">
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p>加载中...</p>
      </div>

      <div v-else-if="!brands.length" class="empty-container">
        <el-empty description="暂无品牌数据">
          <el-button type="primary" @click="showCreateDialog = true">创建第一个品牌</el-button>
        </el-empty>
      </div>

      <div v-else class="brands-grid">
        <el-card
          v-for="brand in brands"
          :key="brand.id"
          class="brand-card"
          shadow="hover"
        >
          <template #header>
            <div class="brand-header">
              <h3>{{ brand.code }}</h3>
              <div class="brand-actions">
                <el-button size="small" type="primary" @click="viewBrandWebsites(brand)">
                  查看网站
                </el-button>
                <el-button size="small" @click="editBrand(brand)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteBrand(brand)">删除</el-button>
              </div>
            </div>
          </template>
          
          <div class="brand-info">
            <p><strong>品牌代码:</strong> {{ brand.code }}</p>
            <p><strong>创建时间:</strong> {{ formatDate(brand.created_at) }}</p>
            <p><strong>网站数量:</strong> {{ brand.clients?.length || 0 }} 个</p>
          </div>
        </el-card>
      </div>
    </div>

    <!-- Create Brand Dialog -->
    <el-dialog v-model="showCreateDialog" title="Create Brand" width="500px">
      <el-form :model="newBrand" label-width="100px">
        <el-form-item label="Brand Code">
          <el-input v-model="newBrand.code" placeholder="Enter brand code" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateDialog = false">Cancel</el-button>
          <el-button type="primary" @click="createBrand">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Loading } from '@element-plus/icons-vue'
import axios from 'axios'

const router = useRouter()
const brands = ref([])
const loading = ref(false)
const showCreateDialog = ref(false)
const newBrand = ref({
  code: ''
})

// Fetch brand list
const fetchBrands = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/brands')
    brands.value = response.data.data
  } catch (error) {
    ElMessage.error('Failed to fetch brand list')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 查看品牌的网站
const viewBrandWebsites = (brand) => {
  // 跳转到网站配置页面，可以通过筛选显示该品牌的网站
  router.push('/website-configs')
  ElMessage.info(`查看 ${brand.code} 品牌的网站配置`)
}

// Edit brand
const editBrand = (brand) => {
  // TODO: Implement edit functionality
  ElMessage.info('Edit functionality to be implemented')
}

// Create website
const createWebsite = () => {
  router.push('/create-website')
}

// Delete brand
const deleteBrand = async (brand) => {
  try {
    await ElMessageBox.confirm(`Are you sure to delete brand "${brand.code}"?`, 'Confirm', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })
    
    await axios.delete(`/api/brands/${brand.id}`)
    ElMessage.success('Deleted successfully')
    fetchBrands()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Delete failed')
      console.error(error)
    }
  }
}

// Create brand
const createBrand = async () => {
  try {
    await axios.post('/api/brands', { code: newBrand.value.code })
    ElMessage.success('Created successfully')
    showCreateDialog.value = false
    newBrand.value = { code: '' }
    fetchBrands()
  } catch (error) {
    ElMessage.error('Create failed')
    console.error(error)
  }
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

.loading-container,
.empty-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-container .el-icon {
  font-size: 32px;
  color: #409eff;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.brand-card {
  transition: all 0.3s ease;
}

.brand-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.brand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.brand-actions {
  display: flex;
  gap: 8px;
}

.brand-info p {
  margin: 8px 0;
  color: #606266;
  font-size: 14px;
}

.brand-info strong {
  color: #303133;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 