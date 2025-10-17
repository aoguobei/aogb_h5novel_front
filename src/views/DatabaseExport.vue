<template>
  <div class="database-export">
    <div class="export-container">
      <el-card class="export-card">
        <template #header>
          <div class="card-header">
            <h2>数据库导出</h2>
            <p>导出完整的数据库结构和数据</p>
          </div>
        </template>

        <div class="export-content">
          <!-- 密码输入区域 -->
          <div class="password-section">
            <el-form :model="exportForm" label-width="120px">
              <el-form-item label="数据库密码" required>
                <el-input
                  v-model="exportForm.password"
                  type="password"
                  placeholder="请输入数据库密码"
                  show-password
                  clearable
                  :disabled="exporting"
                />
              </el-form-item>
            </el-form>
          </div>

          <!-- 导出操作区域 -->
          <div class="export-section">
            <el-button
              type="success"
              size="large"
              @click="startExport"
              :loading="exporting"
              :disabled="!exportForm.password"
              class="export-btn"
            >
              <el-icon><Download /></el-icon>
              {{ exporting ? '正在导出...' : '开始导出' }}
            </el-button>
          </div>

          <!-- 导出状态区域 -->
          <div v-if="exportStatus !== 'idle'" class="status-section">
            <el-alert
              :title="getStatusTitle()"
              :type="getStatusType()"
              :description="getStatusDescription()"
              show-icon
              :closable="false"
            />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { databaseApi } from '@/api/database'

// 响应式数据
const exporting = ref(false)
const exportStatus = ref('idle') // idle, exporting, completed, error

// 表单数据
const exportForm = reactive({
  password: ''
})

// 开始导出
const startExport = async () => {
  if (!exportForm.password) {
    ElMessage.warning('请输入数据库密码')
    return
  }

  exporting.value = true
  exportStatus.value = 'exporting'

  try {
    const response = await databaseApi.exportDatabase(exportForm.password)

    // 检查响应状态码
    if (response.status === 200) {
      // 成功响应：直接处理文件下载
      const blob = response.data

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `database_export_${new Date().toISOString().slice(0, 10)}.sql`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      exportStatus.value = 'completed'
      ElMessage.success('数据库导出成功，文件已下载')
    } else {
      // 错误响应：尝试解析JSON错误信息
      let errorMessage = '导出失败'
      try {
        const errorData = JSON.parse(response.data)
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // 如果无法解析JSON，使用状态文本
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }
  } catch (error) {
    exportStatus.value = 'error'
    // ElMessage.error('数据库导出失败：' + (error.message || '未知错误'))
    console.error('数据库导出失败:', error)
  } finally {
    exporting.value = false
  }
}

// 获取状态标题
const getStatusTitle = () => {
  switch (exportStatus.value) {
    case 'exporting':
      return '正在导出数据库...'
    case 'completed':
      return '导出完成'
    case 'error':
      return '导出失败'
    default:
      return ''
  }
}

// 获取状态类型
const getStatusType = () => {
  switch (exportStatus.value) {
    case 'exporting':
      return 'info'
    case 'completed':
      return 'success'
    case 'error':
      return 'error'
    default:
      return 'info'
  }
}

// 获取状态描述
const getStatusDescription = () => {
  switch (exportStatus.value) {
    case 'exporting':
      return '正在导出数据库结构和数据，请稍候...'
    case 'completed':
      return '数据库导出成功，文件已自动下载到您的设备'
    case 'error':
      return '导出失败，请检查密码是否正确'
    default:
      return ''
  }
}
</script>

<style scoped>
.database-export {
  padding: 0;
  min-height: calc(100vh - 40px);
}

.export-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}

.export-card {
  width: 100%;
  max-width: 600px;
  border: 1px solid #b4c6fc;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.export-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0 0 8px 0;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-size: 24px;
  font-weight: 600;
}

.card-header p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.export-content {
  padding: 30px;
}

.password-section {
  margin-bottom: 30px;
}

.export-section {
  text-align: center;
  margin-bottom: 30px;
}

.export-btn {
  width: 200px;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.export-btn:disabled {
  transform: none;
  box-shadow: none;
  opacity: 0.6;
}

.status-section {
  margin-top: 20px;
}

/* Element Plus 组件样式覆盖 */
.export-content :deep(.el-form-item__label) {
  color: #2d3748;
  font-weight: 600;
}

.export-content :deep(.el-input__wrapper) {
  border-radius: 6px;
  border: 1px solid #b4c6fc;
  transition: all 0.3s ease;
}

.export-content :deep(.el-input__wrapper:hover) {
  border-color: #8faef5;
}

.export-content :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .export-container {
    padding: 10px;
  }

  .export-content {
    padding: 20px;
  }

  .export-btn {
    width: 100%;
  }
}
</style>
