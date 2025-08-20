<template>
  <div class="brand-management">
    <Header title="品牌管理" subtitle="管理所有品牌和网站配置" />

    <div class="main-content">
      <!-- 左侧品牌列表 -->
      <div class="left-panel">
        <div class="panel-header">
          <div class="panel-title">品牌列表</div>
          <el-button type="primary" @click="showCreateDialog = true" size="large">
            <el-icon><Plus /></el-icon>
            新建品牌
          </el-button>
        </div>

        <div class="brands-list">
          <LoadingSpinner v-if="loading" />

          <el-empty
            v-else-if="!brands.length"
            description="暂无品牌数据"
          >
            <el-button type="primary" @click="showCreateDialog = true" size="large">
              创建第一个品牌
            </el-button>
          </el-empty>

          <div v-else class="brand-items">
            <div
              v-for="brand in brands"
              :key="brand.id"
              class="brand-item"
              :class="{ active: selectedBrandId === brand.id }"
              @click="selectBrand(brand)"
            >
              <div class="brand-content">
                <div class="brand-info">
                  <div class="brand-code">{{ brand.code }}</div>
                  <div class="brand-meta">
                    <span class="client-count">{{ getClientCount(brand.id) }} 个客户端</span>
                  </div>
                </div>

              <!-- 删除按钮 - 仅在没有客户端时显示 -->
              <div v-if="getClientCount(brand.id) === 0" class="brand-actions">
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  circle
                  @click.stop="handleDeleteBrand(brand)"
                  class="delete-btn"
                />
              </div>

              <div class="brand-status">
                <el-tag
                  :type="getClientCount(brand.id) > 0 ? 'success' : 'info'"
                  size="small"
                  effect="light"
                >
                  {{ getClientCount(brand.id) > 0 ? '活跃' : '待配置' }}
                </el-tag>
              </div>
            </div>

            </div>
          </div>
        </div>
      </div>

      <!-- 右侧客户端列表 -->
      <div class="right-panel">
        <div v-if="!selectedBrandId" class="no-selection">
          <el-empty description="请选择一个品牌查看客户端列表">
          </el-empty>
        </div>

        <ClientList
          v-else
          :brand-id="selectedBrandId"
          :brand-code="selectedBrandCode"
          :websites="websites"
          :loading="websitesLoading"
          @refresh="refreshWebsites"
        />
      </div>
    </div>

    <!-- Create Brand Dialog -->
    <el-dialog v-model="showCreateDialog" title="创建品牌" width="500px">
      <el-form :model="newBrand" label-width="100px">
        <el-form-item label="品牌代码">
          <el-input v-model="newBrand.code" placeholder="请输入brand" />
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { useBrand } from '@/composables/useBrand'
import { useWebsite } from '@/composables/useWebsite'
import ClientList from '@/components/business/ClientList.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Header from '@/components/common/Header.vue'

const router = useRouter()
const { brands, loading, fetchBrands, createBrand, deleteBrand } = useBrand()
const { websites, loading: websitesLoading, fetchWebsites } = useWebsite()

const showCreateDialog = ref(false)
const newBrand = ref({ code: '' })
const selectedBrandId = ref(null)
const selectedBrandCode = ref('')

// 获取指定品牌的客户端数量
const getClientCount = (brandId) => {
  return websites.value.filter(website => website.client.brand_id === brandId).length
}

// 选择品牌
const selectBrand = (brand) => {
  selectedBrandId.value = brand.id
  selectedBrandCode.value = brand.code
}

// 创建品牌
const handleCreateBrand = async () => {
  if (!newBrand.value.code.trim()) {
    ElMessage.error('请输入brand')
    return
  }

  const success = await createBrand(newBrand.value)
  if (success) {
    showCreateDialog.value = false
    newBrand.value.code = ''
    // 自动选择新创建的品牌
    const newBrandItem = brands.value.find(b => b.code === newBrand.value.code)
    if (newBrandItem) {
      selectedBrandId.value = newBrandItem.id
    }
  }
}

// 删除品牌
const handleDeleteBrand = async (brand) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除品牌 "${brand.code}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    const success = await deleteBrand(brand)
    if (success) {
      // 如果删除的是当前选中的品牌，清空选择
      if (selectedBrandId.value === brand.id) {
        selectedBrandId.value = null
        selectedBrandCode.value = ''
      }
    }
  } catch (error) {
    // 用户取消删除
    if (error !== 'cancel') {
      console.error('删除品牌错误:', error)
    }
  }
}



// 刷新网站数据
const refreshWebsites = async () => {
  await fetchBrands()
  await fetchWebsites(true)
}

onMounted(async () => {
  await Promise.all([
    fetchBrands(),
    fetchWebsites(true)
  ])
  selectBrand(brands.value[0])
})
</script>

<style scoped>
.brand-management {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.main-content {
  display: flex;
  gap: 32px;
  margin-top: 32px;
}

.left-panel {
  width: 380px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.panel-header {
  padding: 24px 20px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.panel-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.brands-list {
  padding: 20px;
  height: calc(100vh - 40px - 40px - 32px - 40px);
  overflow-y: auto;
  overflow-x: hidden;
}

.brand-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.brand-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.brand-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #e4e7ed;
  transition: all 0.3s ease;
}

.brand-item:hover {
  border-color: #8b7ec8;
  box-shadow: 0 4px 20px rgba(139, 126, 200, 0.15);
  transform: translateY(-2px);
}

.brand-item:hover::before {
  background: #8b7ec8;
}

.brand-item.active {
  border-color: #8b7ec8;
  background: linear-gradient(135deg, #f5f3ff 0%, #f0edff 100%);
  box-shadow: 0 4px 20px rgba(139, 126, 200, 0.25);
}

.brand-item.active::before {
  background: #8b7ec8;
  width: 6px;
}

.brand-actions {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.brand-item:hover .brand-actions {
  opacity: 1;
}

.delete-btn {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #b91c1c;
  transform: scale(1.1);
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
  border-radius: 12px;
  flex-shrink: 0;
}

.brand-item.active .brand-icon {
  background: linear-gradient(135deg, #8b7ec8 0%, #7c5a9a 100%);
}

.brand-item.active .brand-icon .el-icon {
  color: #fff !important;
}

.brand-info {
  flex: 1;
  min-width: 0;
}

.brand-code {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1.2;
}

.brand-meta {
  font-size: 14px;
  color: #909399;
}

.client-count {
  color: #8b7ec8;
  font-weight: 500;
  background: rgba(139, 126, 200, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.brand-status {
  flex-shrink: 0;
}

.right-panel {
  flex: 1;
  height: fit-content;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.no-selection {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  padding: 40px;
  text-align: center;
}

.warning-text {
  color: #e6a23c;
  font-size: 14px;
  margin-top: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
