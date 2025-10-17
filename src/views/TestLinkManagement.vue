<template>
  <div class="test-link-management">
    <Header title="测试管理" subtitle="管理测试网站和测试链接配置" />

    <!-- 功能切换标签页 -->
    <div class="tab-section">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="测试网站列表" name="websites">
          <div class="website-management">
            <!-- 网站操作栏 -->
            <div class="action-bar">
              <div class="left-actions">
                <el-button type="primary" @click="addTestWebsite">
                  <el-icon><Plus /></el-icon>
                  添加测试网站
                </el-button>
                <el-button @click="refreshWebsites">
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </div>
              <div class="right-actions">
                <el-input
                  v-model="websiteSearchKeyword"
                  placeholder="搜索网站名称"
                  style="width: 300px"
                  clearable
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </div>
            </div>

            <!-- 测试网站列表 -->
            <div class="table-container">
              <el-table
                :data="paginatedWebsites"
                v-loading="websiteLoading"
                stripe
                style="width: 100%"
              >
                <el-table-column prop="name" label="网站名称" min-width="200" />
                <el-table-column prop="type" label="网站类型" width="120" sortable>
                  <template #default="{ row }">
                    <el-tag
                      :type="getWebsiteTypeTag(row.type)"
                      size="small"
                      effect="light"
                    >
                      {{ row.type }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="script_base" label="脚本基础路径" min-width="150" show-overflow-tooltip />
                <el-table-column prop="test_domain" label="测试域名" min-width="200" show-overflow-tooltip />
                <el-table-column prop="prod_domain" label="正式域名" min-width="200" show-overflow-tooltip />
                <el-table-column prop="test_links_count" label="测试链接数" width="100" align="center">
                  <template #default="{ row }">
                    <el-tag type="info" size="small">{{ row.test_links_count || 0 }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="210" fixed="right">
                  <template #default="{ row }">
                    <el-button type="primary" size="small" @click="editTestWebsite(row)">
                      编辑
                    </el-button>
                    <el-button type="success" size="small" @click="viewTestLinks(row)">
                      查看链接
                    </el-button>
                    <el-button type="danger" size="small" @click="deleteTestWebsite(row)" :disabled="row.test_links_count > 0">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <!-- 测试网站分页组件 -->
              <div v-if="filteredWebsites.length > 0" class="pagination-container">
                <el-pagination
                  v-model:current-page="websiteCurrentPage"
                  v-model:page-size="websitePageSize"
                  :page-sizes="[10, 20, 50]"
                  :total="filteredWebsites.length"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleWebsiteSizeChange"
                  @current-change="handleWebsiteCurrentChange"
                />
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="测试链接列表" name="links">
    <!-- 类型和网站选择区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label>选择类型：</label>
          <el-select
            v-model="selectedTypeId"
            placeholder="请选择类型"
            style="width: 200px"
            @change="onTypeChange"
            clearable
          >
            <el-option
              v-for="type in types"
              :key="type.id"
              :label="type.name"
              :value="type.id"
            />
          </el-select>
        </div>
        <div class="filter-item">
                <label>选择测试网站：</label>
          <el-select
                  v-model="selectedWebsiteId"
                  placeholder="请选择测试网站"
            style="width: 300px"
                  @change="onWebsiteChange"
            clearable
            :disabled="!selectedTypeId"
            filterable
          >
            <el-option
                    v-for="website in filteredWebsites"
                    :key="website.id"
                    :value="website.id"
                    :label="`${website.name} (${website.type})`"
                  >
                    <div class="website-option">
                <el-tag
                        :type="getWebsiteTypeTag(website.type)"
                  size="small"
                        class="type-tag"
                >
                        {{ website.type }}
                </el-tag>
                      <span class="website-text">{{ website.name }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
        <div class="filter-item">
          <label>环境类型：</label>
          <el-select
            v-model="currentDomainType"
            placeholder="请选择环境类型"
            style="width: 150px"
            @change="onDomainTypeChange"
          >
            <el-option label="正式环境" value="prod" />
            <el-option label="测试环境" value="test" />
          </el-select>
        </div>
      </div>
    </div>


    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="left-actions">
        <el-button
          type="primary"
          @click="addTestLink"
                :disabled="!selectedWebsiteId"
        >
          <el-icon><Plus /></el-icon>
          添加测试链接
        </el-button>
        <el-button
          type="success"
          @click="showBatchAddDialog"
                :disabled="!selectedWebsiteId"
        >
          <el-icon><Plus /></el-icon>
          批量添加
        </el-button>
              <el-button @click="handleLoadTestLinks" :disabled="!selectedWebsiteId">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
      <div class="right-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索测试标题"
          style="width: 300px"
          clearable
                :disabled="!selectedWebsiteId"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 测试链接列表 -->
    <div class="table-container">
      <el-table
        :data="paginatedTestLinks"
        v-loading="loading"
        stripe
        style="width: 100%"
        v-if="selectedWebsiteId"
      >
        <el-table-column label="测试标题" min-width="160" prop="test_title" show-overflow-tooltip />
        <el-table-column label="页面URL" min-width="200" prop="test_url" show-overflow-tooltip />
        <el-table-column label="完整链接" min-width="400" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="full-url">
              <el-link
                :href="getFullUrl(row)"
                target="_blank"
                :type="currentDomainType === 'prod' ? 'success' : 'primary'"
                underline="never"
              >
                {{ getFullUrl(row) }}
              </el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editTestLink(row)">
              编辑
            </el-button>
            <el-button type="success" size="small" @click="copyTestLink(row)">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
            <el-tooltip
              effect="dark"
              placement="top"
              :show-after="500"
              :disabled="!qrCodeCache[row.id]"
            >
              <template #content>
                <div class="qr-tooltip">
                  <div class="qr-tooltip-title">{{ row.test_title }}</div>
                  <img
                    v-if="qrCodeCache[row.id]"
                    :src="qrCodeCache[row.id]"
                    class="qr-image"
                    alt="二维码"
                  />
                </div>
              </template>
              <el-button
                type="info"
                size="small"
                @mouseenter="generateQRCode(row.id, getFullUrl(row))"
              >
                <el-icon><Grid /></el-icon>
                二维码
              </el-button>
            </el-tooltip>
            <el-button type="danger" size="small" @click="handleDeleteTestLink(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div v-if="selectedWebsiteId && filteredTestLinks.length > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredTestLinks.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-empty description="请先选择类型和测试网站" />
      </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 测试网站创建/编辑对话框 -->
    <el-dialog
      :title="isEditWebsite ? '编辑测试网站' : '添加测试网站'"
      v-model="showWebsiteDialog"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="websiteFormRef"
        :model="websiteFormData"
        :rules="websiteFormRules"
        label-width="120px"
      >

        <el-form-item label="网站名称" prop="name">
          <el-input v-model="websiteFormData.name" placeholder="请输入网站名称" />
        </el-form-item>
        <el-form-item label="网站类型" prop="type">
          <el-select v-model="websiteFormData.type" placeholder="请选择网站类型" :disabled="isEditWebsite" style="width: 100%">
            <el-option
              v-for="type in types"
              :key="type.id"
              :label="type.name"
              :value="type.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="脚本基础路径" prop="script_base">
          <el-input
            v-model="websiteFormData.script_base"
            placeholder="请输入脚本基础路径，必须以 / 开头和结尾，如：/api/"
          />
        </el-form-item>
        <el-form-item label="测试域名" prop="test_domain">
          <el-input v-model="websiteFormData.test_domain" placeholder="请输入测试域名，如：https://test.example.com" />
        </el-form-item>
        <el-form-item label="正式域名" prop="prod_domain">
          <el-input v-model="websiteFormData.prod_domain" placeholder="请输入正式域名，如：https://prod.example.com" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showWebsiteDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitWebsiteForm"
          :loading="websiteSubmitting"
          :disabled="!isWebsiteFormValid"
        >
          {{ isEditWebsite ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      :title="isEdit ? '编辑测试链接' : '添加测试链接'"
      v-model="showCreateDialog"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="网站" prop="website_id">
          <el-select
            v-model="formData.website_id"
            placeholder="请选择测试网站"
            style="width: 100%"
            filterable
            disabled
          >
            <el-option
              v-for="website in filteredWebsites"
              :key="website.id"
              :value="website.id"
              :label="`${website.name} (${website.type})`"
            >
              <div class="website-option">
                <el-tag
                  :type="getWebsiteTypeTag(website.type)"
                  size="small"
                  class="type-tag"
                >
                  {{ website.type }}
                </el-tag>
                <span class="website-text">{{ website.name }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试URL" prop="test_url">
          <el-input v-model="formData.test_url" placeholder="请输入测试URL" />
        </el-form-item>
        <el-form-item label="测试标题" prop="test_title">
          <el-input v-model="formData.test_title" placeholder="请输入测试标题" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm" :loading="submitting">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>


    <!-- 批量添加对话框 -->
    <el-dialog
      title="批量添加测试链接"
      v-model="showBatchDialog"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="batchFormRef"
        :model="batchFormData"
        :rules="batchFormRules"
        label-width="120px"
      >
        <el-form-item label="选择项目" prop="website_ids">
          <el-select
            v-model="batchFormData.website_ids"
            placeholder="请选择测试网站"
            style="width: 100%"
            multiple
            filterable
            :disabled="true"
          >
            <el-option
              v-for="website in filteredWebsites"
              :key="website.id"
              :value="website.id"
              :label="`${website.name} (${website.type})`"
            >
              <div class="website-option">
                <el-tag
                  :type="getWebsiteTypeTag(website.type)"
                  size="small"
                  class="type-tag"
                >
                  {{ website.type }}
                </el-tag>
                <span class="website-text">{{ website.name }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="测试链接数据" prop="test_links_data">
          <div class="match_width textarea-with-action">
            <el-input
              v-model="batchFormData.test_links_data"
              type="textarea"
              :rows="12"
              placeholder="请输入测试链接数据，格式：标题 空格 完整URL（必须是 http/https）&#10;例如：&#10;退出登录 https://novel.fun.tv/tt/xingchen/pages/userInfo/userInfo&#10;支付链接跳转 https://novel.fun.tv/tt/xingchen/pages/testJump/testJump"
              style="width: 100%"
            />
            <el-button class="fill-default-btn" type="primary" plain size="small" @click="fillDefaultBatchData">一键填充</el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBatchDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitBatchForm" :loading="batchSubmitting">
          批量创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { Plus, Refresh, Search, CopyDocument, Grid } from '@element-plus/icons-vue'
import Header from '@/components/common/Header.vue'
import { useType } from '@/composables/useType'
import { useTestLink } from '@/composables/useTestLink'
import { testWebsiteApi } from '@/api/testWebsite'

const route = useRoute()
// 使用 useType composable
const { types, fetchTypes } = useType()

// 使用 useTestLink composable
const {
  // 纯业务数据
  testLinks,
  selectedWebsiteId,
  selectedWebsite,
  qrCodeCache,
  currentDomainType,
  formData,
  batchFormData,
  parsedLinks,
  formRules,
  batchFormRules,
  // 业务方法
  getFullUrl,
  generateQRCode,
  loadTestLinks,
  resetForm,
  resetBatchForm,
  submitForm,
  fillDefaultBatchData,
  submitBatchForm,
  deleteTestLink,
  copyTestLink,
  setSelectedWebsite,
  clearSelection
} = useTestLink()

// UI/交互相关状态
const showCreateDialog = ref(false)
const showBatchDialog = ref(false)
const isEdit = ref(false)
const selectedTypeId = ref(null)
const formRef = ref()
const batchFormRef = ref()
const loading = ref(false)
const submitting = ref(false)
const batchSubmitting = ref(false)
const searchKeyword = ref('')

// 新增的响应式数据
const activeTab = ref('websites')
const websiteLoading = ref(false)
const websiteSubmitting = ref(false)
const showWebsiteDialog = ref(false)
const isEditWebsite = ref(false)
const websiteSearchKeyword = ref('')
const websites = ref([])
const websiteFormRef = ref()

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(50)

// 测试网站分页相关状态
const websiteCurrentPage = ref(1)
const websitePageSize = ref(50)

// 测试网站表单数据
const websiteFormData = reactive({
  id: null,
  name: '',
  type: '',
  script_base: '',
  test_domain: '',
  prod_domain: ''
})

// 测试网站表单验证规则
const websiteFormRules = {
  name: [
    { required: true, message: '请输入网站名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择网站类型', trigger: 'change' }
  ],
  script_base: [
    { required: true, message: '请输入脚本基础路径', trigger: 'blur' },
    {
      pattern: /^\/.*\/$/,
      message: '脚本基础路径必须以 / 开头和结尾，如：/api/',
      trigger: 'blur'
    }
  ]
}

// 计算属性 - 过滤后的测试链接
const filteredTestLinks = computed(() => {
  let filtered = testLinks.value

  // 按搜索关键词过滤
  if (searchKeyword.value) {
    filtered = filtered.filter(link =>
      link.test_title?.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  return filtered
})

// 计算属性 - 分页后的测试链接
const paginatedTestLinks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTestLinks.value.slice(start, end)
})

// 计算属性 - 分页后的测试网站
const paginatedWebsites = computed(() => {
  const start = (websiteCurrentPage.value - 1) * websitePageSize.value
  const end = start + websitePageSize.value
  return filteredWebsites.value.slice(start, end)
})

// 修改 filteredWebsites 计算属性，添加类型筛选逻辑
const filteredWebsites = computed(() => {
  let filtered = websites.value

  // 只有在测试链接管理标签页且有选择类型时，才按类型筛选
  if (activeTab.value === 'links' && selectedTypeId.value) {
    const typeName = getTypeCodeById(selectedTypeId.value)
    filtered = filtered.filter(website => website.type === typeName)
  }

  // 按搜索关键词过滤
  if (websiteSearchKeyword.value) {
    filtered = filtered.filter(website =>
      website.name?.toLowerCase().includes(websiteSearchKeyword.value.toLowerCase())
    )
  }

  return filtered
})

// 类型变化处理
const onTypeChange = (typeId) => {
  clearSelection()
}

// 修改 onWebsiteChange 方法
const onWebsiteChange = (websiteId) => {
  if (websiteId) {
    const website = websites.value.find(website => website.id === websiteId)
    setSelectedWebsite(website)
    handleLoadTestLinks()
  } else {
    clearSelection()
  }
}

// 环境类型变化处理
const onDomainTypeChange = (domainType) => {
  // 环境类型变化时，清空二维码缓存，这样会重新生成对应环境的二维码
  qrCodeCache.value = {}
}

// 添加测试链接
const addTestLink = () => {
  resetForm()
  isEdit.value = false
  showCreateDialog.value = true
}

// 显示批量添加对话框
const showBatchAddDialog = () => {
  resetBatchForm()
  if (selectedWebsiteId.value) {
    batchFormData.website_ids = [selectedWebsiteId.value]
  }
  showBatchDialog.value = true
}

// 编辑测试链接
const editTestLink = (row) => {
  resetForm()
  isEdit.value = true
  Object.assign(formData, {
    id: row.id,
    website_id: row.website_id,
    test_url: row.test_url,
    test_title: row.test_title
  })
  showCreateDialog.value = true
}

// 修改提交表单方法
const handleSubmitForm = async () => {
  try {
    submitting.value = true
    const success = await submitForm(formRef.value)
    if (success) {
      showCreateDialog.value = false
      await handleLoadTestLinks()
      updateWebsiteTestLinksCount(1)
    }
  } finally {
    submitting.value = false
  }
}

// 修改提交批量表单方法
const handleSubmitBatchForm = async () => {
  try {
    batchSubmitting.value = true
    const success = await submitBatchForm(batchFormRef.value)
    if (success) {
      showBatchDialog.value = false
      await handleLoadTestLinks()
      const createdCount = parsedLinks.value.length
      updateWebsiteTestLinksCount(createdCount)
    }
  } finally {
    batchSubmitting.value = false
  }
}

// 修改删除测试链接方法
const handleDeleteTestLink = async (row) => {
  const success = await deleteTestLink(row)
  if (success) {
    await handleLoadTestLinks()

    // 更新网站的测试链接数量（减1）
    updateWebsiteTestLinksCount(-1)
  }
}

// 新增：更新网站测试链接数量的通用方法
const updateWebsiteTestLinksCount = (changeCount) => {
  if (selectedWebsiteId.value) {
    // 更新 websites 数组中的数量
    const websiteIndex = websites.value.findIndex(w => w.id === selectedWebsiteId.value)
    if (websiteIndex !== -1) {
      websites.value[websiteIndex] = {
        ...websites.value[websiteIndex],
        test_links_count: Math.max(0, (websites.value[websiteIndex].test_links_count || 0) + changeCount)
      }
    }

    // 更新 selectedWebsite 中的数量
    if (selectedWebsite.value && selectedWebsite.value.id === selectedWebsiteId.value) {
      selectedWebsite.value = {
        ...selectedWebsite.value,
        test_links_count: Math.max(0, (selectedWebsite.value.test_links_count || 0) + changeCount)
      }
    }
  }
}

// 测试网站相关方法
const loadWebsites = async () => {
  try {
    websiteLoading.value = true
    const response = await testWebsiteApi.getTestWebsites()

    if (response && response.data) {

      // 使用新的数据结构
      let websiteData = []
      if (response.data.list) {
        websiteData = response.data.list
      } else if (Array.isArray(response.data)) {
        websiteData = response.data
      } else {
        websiteData = response.data
      }

      websites.value = Array.isArray(websiteData) ? websiteData : []

      if (selectedWebsiteId.value) {
          selectedWebsite.value = websites.value.find(website => website.id === selectedWebsiteId.value)
      }
    } else {
      websites.value = []
    }
  } catch (error) {
    console.error('获取测试网站失败:', error)
    ElMessage.error('获取测试网站失败: ' + error.message)
    websites.value = []
  } finally {
    websiteLoading.value = false
  }
}

const refreshWebsites = () => {
  loadWebsites()
}

// 修改重置网站表单方法
const resetWebsiteForm = () => {
  Object.assign(websiteFormData, {
    id: null,
    name: '',
    type: '',
    script_base: '',
    test_domain: '',
    prod_domain: ''
  })
  if (websiteFormRef.value) {
    websiteFormRef.value.resetFields()
  }
}

const resetTestLinkForm = () => {
  // 重置测试链接页面的所有选项
  selectedTypeId.value = null
  clearSelection()
}

// 添加提交网站表单方法
const submitWebsiteForm = async () => {
  if (!websiteFormRef.value) return
  try {
    await websiteFormRef.value.validate()
    websiteSubmitting.value = true

    if (isEditWebsite.value) {
      await testWebsiteApi.updateTestWebsite(websiteFormData.id, websiteFormData)
      ElMessage.success('测试网站更新成功')
    } else {
      await testWebsiteApi.createTestWebsite(websiteFormData)
      ElMessage.success('测试网站创建成功')
    }

    showWebsiteDialog.value = false
    resetWebsiteForm()
    resetTestLinkForm()
    loadWebsites()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(isEditWebsite.value ? '更新失败' : (error?.response?.data?.message || '创建失败'))
  } finally {
    websiteSubmitting.value = false
  }
}

// 添加删除测试网站方法
const deleteTestWebsite = async (row) => {
  try {
    if (row.test_links_count > 0) {
      ElMessage.error('该测试网站存在关联测试链接，无法删除')
      return
    }
    await ElMessageBox.confirm(
      `确定要删除测试网站"${row.name}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await testWebsiteApi.deleteTestWebsite(row.id)
    ElMessage.success('删除成功')
    loadWebsites()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error(error?.response?.data?.message || '删除失败')
    }
  }
}

// 添加查看测试链接方法
const viewTestLinks = (row) => {
  // 切换到测试链接标签页
  activeTab.value = 'links'
  // 这里可以根据需要设置筛选条件
    const typeId = (types.value.find(t => t.code === row.type))?.id
  if (typeId) {
    selectedTypeId.value = typeId
    // 设置测试网站筛选
    setSelectedWebsite(row)
    onWebsiteChange(row.id)
  }
}

// 添加编辑测试网站方法
const editTestWebsite = (row) => {
  resetWebsiteForm()
  isEditWebsite.value = true
  Object.assign(websiteFormData, {
    id: row.id,
    name: row.name,
    type: row.type,
    script_base: row.script_base,
    test_domain: row.test_domain,
    prod_domain: row.prod_domain
  })
  showWebsiteDialog.value = true
}

// 添加获取网站类型标签样式方法
const getWebsiteTypeTag = (type) => {
  const typeMap = {
    'novel': 'primary',      // 小说 - 蓝色
    'video': 'success',      // 视频 - 绿色
    'tool': 'warning',       // 工具 - 橙色
    'other': 'info'          // 其他 - 灰色
  }
  return typeMap[type] || 'info'
}

// 在 script setup 部分添加缺失的 addTestWebsite 方法
const addTestWebsite = () => {
  resetWebsiteForm()
  isEditWebsite.value = false
  showWebsiteDialog.value = true
}

// 添加根据类型ID获取类型名称的方法
const getTypeCodeById = (typeId) => {
  const type = types.value.find(t => t.id === typeId)
  return type ? type.code : ''
}

// 计算属性：测试网站表单验证状态
const isWebsiteFormValid = computed(() => {
  if (!websiteFormRef.value) return false

  // 检查必填字段
  if (!websiteFormData.name || !websiteFormData.type || !websiteFormData.script_base) {
    return false
  }

  // 检查脚本基础路径格式
  const scriptBasePattern = /^\/.*\/$/
  if (!scriptBasePattern.test(websiteFormData.script_base)) {
    return false
  }

  return true
})

// 分页相关方法
const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 测试网站分页相关方法
const handleWebsiteSizeChange = (val) => {
  websitePageSize.value = val
  websiteCurrentPage.value = 1
}

const handleWebsiteCurrentChange = (val) => {
  websiteCurrentPage.value = val
}

// 修改组件挂载时获取数据
onMounted(async () => {
  const envType = route.query.envType
  if (envType === 'test') {
    currentDomainType.value = 'test'
  }
  await fetchTypes()
  await loadWebsites()
})

// 修改 loadTestLinks 方法，添加 loading 状态管理
const handleLoadTestLinks = async () => {
  if (!selectedWebsiteId.value) return

  try {
    loading.value = true
    await loadTestLinks()
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.test-link-management {
  padding: 0 20px;
  min-height: 100vh;
}

.filter-section {
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
}

/* 项目域名管理区域 */

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.left-actions {
  display: flex;
  gap: 12px;
}

.right-actions {
  display: flex;
  gap: 12px;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.pagination-container {
  margin-top: 20px;
  padding: 10px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.project-info {
  line-height: 1.4;
}

.project-name {
  font-weight: 500;
  color: #303133;
}

.project-id {
  font-size: 12px;
  color: #909399;
}

.brand-info {
  line-height: 1.4;
}

.brand-name {
  font-weight: 500;
  color: #303133;
}

.brand-type {
  font-size: 12px;
  color: #909399;
}

/* 项目选项样式 */
.project-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.platform-tag {
  flex-shrink: 0;
}

.project-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 完整链接样式 */
.full-url {
  word-break: break-all;
  line-height: 1.4;
}

.full-url .el-link {
  font-size: 12px;
  max-width: 100%;
  display: inline-block;
}

/* 二维码悬浮提示样式 */
.qr-tooltip {
  text-align: center;
  padding: 10px;
  background: white;
  border-radius: 4px;
}

.qr-tooltip-title {
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
  font-size: 14px;
}

.qr-image {
  display: block;
  margin: 0 auto;
  max-width: 160px;
  max-height: 160px;
}

.format-alert :deep(.el-alert__title) {
  font-size: 12px;
}

.format-alert :deep(.el-alert__description) {
  font-size: 12px;
}

.format-examples {
  margin-top: 8px;
  color: #606266;
  font-size: 12px;
}

.format-code {
  margin: 6px 0;
  padding: 8px;
  background: #f8f8f8;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 12px;
  line-height: 1.5;
}

.format-tips {
  font-size: 12px;
  color: #909399;
}
.format-simple {
  font-size: 12px;
  color: #606266;
}
.format-title {
  font-weight: 600;
  margin-bottom: 4px;
  color: #303133;
}
.format-desc {
  line-height: 1.5;
}

/* 文本域右下角按钮布局 */
.textarea-with-action {
  position: relative;
}

.fill-default-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 1;
}

:deep(.el-table) {
  border-radius: 8px;
}

:deep(.el-table th) {
  background: #fafafa;
  color: #606266;
  font-weight: 600;
}

:deep(.el-table td) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-button + .el-button) {
  margin-left: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-item {
    justify-content: space-between;
  }

  .action-bar {
    flex-direction: column;
    gap: 12px;
  }

}
</style>

