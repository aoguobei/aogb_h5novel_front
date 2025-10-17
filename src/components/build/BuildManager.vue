<template>
  <div class="build-manager">
    <div class="build-layout">
      <!-- 构建配置 -->
      <div class="build-left">
        <el-card class="build-card">
          <template #header>
            <div class="card-header">
              <h2>H5网站构建上传</h2>
            </div>
          </template>

          <el-form
            ref="buildFormRef"
            :model="buildForm"
            :rules="buildRules"
            class="build-form"
          >


            <!-- SSH部署配置 -->
            <el-divider content-position="left">
              <span class="divider-text">服务器连接配置</span>
            </el-divider>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="服务器地址" prop="sshHost">
                  <el-input
                    v-model="buildForm.sshHost"
                    placeholder="如: 172.17.5.92"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="SSH用户名" prop="sshUser">
                  <el-input
                    v-model="buildForm.sshUser"
                    placeholder="如: fun"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="SSH密码" prop="sshPassword">
                  <el-input
                    v-model="buildForm.sshPassword"
                    type="password"
                    placeholder="SSH连接密码"
                    show-password
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- Git配置 -->
            <el-divider content-position="left">
              <span class="divider-text">Git配置</span>
            </el-divider>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Git分支" prop="branch">
                  <el-input
                    v-model="buildForm.branch"
                    placeholder="如: uni/funNovel/devNew"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="版本号" prop="version">
                  <el-input
                    v-model="buildForm.version"
                    placeholder="如: 1.0.0"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 环境选择 -->
            <el-divider content-position="left">
              <span class="divider-text">环境配置</span>
            </el-divider>

            <el-row>
              <el-col :span="24">
                <el-form-item label="构建环境" prop="environments">
                  <el-checkbox-group v-model="buildForm.environments">
                    <el-checkbox
                      style="margin-left: 20px;"
                      v-for="env in environmentOptions"
                      :key="env.value"
                      :value="env.value"
                    >
                      {{ env.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 项目选择 -->
            <el-divider content-position="left">
              <span class="divider-text">项目选择</span>
            </el-divider>

            <el-row>
              <el-col :span="24">
                <el-form-item label="项目列表" prop="projects">
                  <div v-if="projectsLoading" class="loading-container">
                    <el-icon class="is-loading"><Loading /></el-icon>
                    <span>正在加载项目列表...</span>
                  </div>
                  <div v-else-if="projectOptions.length === 0" class="empty-container">
                    <el-icon><Warning /></el-icon>
                    <span>暂无可用的项目</span>
                  </div>
                  <div v-else class="project-selection-container">
                    <div class="horizontal project-selection-header">
                      <div class="flex1"></div>
                      <div class="project-info">
                        <el-button
                          size="small"
                          @click="toggleSelectAllProjects"
                          :type="isAllProjectsSelected ? 'primary' : 'default'"
                          class="select-all-projects-btn"
                        >
                          {{ isAllProjectsSelected ? '取消全选' : '全选' }}
                        </el-button>
                        <span class="project-count">共 {{ projectOptions.length }} 个项目</span>
                      </div>
                    </div>
                    <el-checkbox-group v-model="buildForm.projects">
                      <div class="project-grid">
                        <el-checkbox
                          v-for="project in projectOptions"
                          :key="project.value"
                          :value="project.value"
                          class="project-checkbox"
                        >
                          <div class="project-item">
                            <span class="project-name">{{ project.label }}</span>
                            <el-tag
                              :type="getPlatformTagType(project.host)"
                              size="small"
                            >
                              {{ getPlatformLabel(project.host) }}
                            </el-tag>
                            <el-tag
                              type="info"
                              size="small"
                            >
                              {{ project.brandCode }}
                            </el-tag>
                          </div>
                        </el-checkbox>
                      </div>
                    </el-checkbox-group>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 高级选项 -->
            <div v-if="showAdvancedOptions">
              <el-divider content-position="left">
                <span class="divider-text">⚙️ 高级选项</span>
              </el-divider>

              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <el-checkbox v-model="buildForm.forceForeignNet">
                      强制使用外网套餐 (仅Local环境生效)
                    </el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>


            <!-- 操作按钮 -->
            <el-divider content-position="left">
              <span class="divider-text">🎯 构建操作</span>
            </el-divider>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-button
                  type="primary"
                  @click="startBuild"
                  :loading="building"
                  :disabled="!canBuild"
                  size="large"
                  class="build-btn primary-btn"
                >
                  <el-icon><Tools /></el-icon>
                  {{ building ? '正在构建部署...' : '开始构建并部署' }}
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button
                  @click="resetForm"
                  :disabled="building"
                  size="large"
                  class="build-btn reset-btn"
                >
                  <el-icon><Refresh /></el-icon>
                  重置配置
                </el-button>
              </el-col>
            </el-row>
          </el-form>

          <!-- 构建结果 -->
          <div v-if="buildResult" class="build-result">
            <el-alert
              :title="buildResult.success ? '构建成功' : '构建失败'"
              :type="buildResult.success ? 'success' : 'error'"
              :description="buildResult.message"
              show-icon
              :closable="false"
            />
          </div>

          <!-- 构建日志 -->
          <div v-if="buildLogs.length > 0" class="build-logs">
            <el-card>
              <template #header>
                <div class="logs-header">
                  <h3>📋 构建日志</h3>
                  <el-button size="small" @click="clearLogs" type="text">清空日志</el-button>
                </div>
              </template>
              <div class="logs-content" ref="logsContainer">
                <pre class="log-content">{{ buildLogs.join('\n') }}</pre>
              </div>
            </el-card>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Tools, Refresh, Loading, Warning } from '@element-plus/icons-vue'
import websocketManager from '@/utils/websocket'
import { useNovelSelector } from '@/composables/useConfig'
import { deployApi } from '@/api/deploy'

// 接收父组件传递的环境类型参数
const props = defineProps({
  envType: {
    type: String,
    default: 'intranet' // 默认为内网
  }
})

// 使用小说选择器 composable
const {
  novelsLoading,
  allNovelData,
  fetchNovelOptions,
  getPlatformLabel,
  getPlatformTagType
} = useNovelSelector()

// 响应式数据
const building = ref(false)
const buildResult = ref(null)
const buildLogs = ref([])
const logsContainer = ref()
const currentTaskId = ref(null)

// 项目加载状态
const projectsLoading = ref(false)

// 表单数据
const buildForm = reactive({
  branch: 'uni/funNovel/devNew',
  version: '1.0.0',
  environments: [], // 初始为空，根据环境类型动态设置
  projects: [],
  forceForeignNet: false,
  sshHost: '172.17.5.92',
  sshUser: 'fun',
  sshPassword: ''
})

// 表单引用
const buildFormRef = ref()

// 环境选项 - 根据环境类型动态生成
const environmentOptions = computed(() => {
  const allEnvironments = [
    { label: 'Local (公司内网-测试环境)   (服务器 172.17.5.92)', value: 'local' },
    { label: 'Master (公网-测试环境)', value: 'master' },
    { label: 'Release (公网-正式环境)', value: 'release' },
  ]

  if (props.envType === 'intranet') {
    // 内网：只显示Local环境
    return allEnvironments.filter(env => env.value === 'local')
  } else if (props.envType === 'internet') {
    // 外网：显示Master和Release环境
    return allEnvironments.filter(env => env.value !== 'local')
  }

  // 默认显示所有环境
  return allEnvironments
})

// 项目选项 - 从接口动态获取
const projectOptions = computed(() => {
  return allNovelData.value.map(novel => ({
    value: `${novel.host}-${novel.brandCode}`,
    label: novel.appName,
    host: novel.host,
    brandCode: novel.brandCode,
    clientId: novel.clientId,
    appName: novel.appName
  }))
})

// 全选状态管理
const isAllProjectsSelected = computed(() => {
  return projectOptions.value.length > 0 && buildForm.projects.length === projectOptions.value.length
})

// 是否显示高级选项
const showAdvancedOptions = computed(() => {
  return props.envType !== 'internet'
})

// 表单验证规则
const buildRules = {
  branch: [
    { required: true, message: '请输入Git分支', trigger: 'blur' }
  ],
  version: [
    { required: true, message: '请输入版本号', trigger: 'blur' },
    { pattern: /^\d+\.\d+\.\d+$/, message: '版本号格式应为 x.x.x', trigger: 'blur' }
  ],
  environments: [
    { required: true, message: '请选择至少一个环境', trigger: 'change' }
  ],
  projects: [
    { required: true, message: '请选择至少一个项目', trigger: 'change' }
  ],
  sshUser: [
    { required: true, message: '请输入SSH用户名', trigger: 'blur' }
  ],
  sshPassword: [
    { required: true, message: '请输入SSH密码', trigger: 'blur' }
  ]
}

// 是否可以构建
const canBuild = computed(() => {
  return buildForm.branch &&
         buildForm.version &&
         buildForm.environments.length > 0 &&
         buildForm.projects.length > 0 &&
         buildForm.sshUser &&
         buildForm.sshPassword &&
         !building.value
})

// 加载项目列表
const loadProjects = async () => {
  projectsLoading.value = true
  try {
    await fetchNovelOptions()
  } catch (error) {
    console.error('加载项目列表失败:', error)
    ElMessage.error('加载项目列表失败')
  } finally {
    projectsLoading.value = false
  }
}

// WebSocket消息处理器
const handleBuildOutput = (outputData) => {
  console.log('🔔 收到构建输出:', outputData)

  // 直接显示构建输出消息，这些是真实的构建日志
  if (outputData.message && outputData.message.trim()) {
    // 过滤掉时间戳重复的问题，如果消息已经包含时间戳就不再添加前缀
    const message = outputData.message
    addLogOutput(message)
  }

  // 处理特殊的状态消息
  if (outputData.type === 'success') {
    buildResult.value = {
      success: true,
      message: outputData.message
    }
    building.value = false
    ElMessage.success(outputData.message)
  } else if (outputData.type === 'failed') {
    buildResult.value = {
      success: false,
      message: outputData.message
    }
    building.value = false
    ElMessage.error(outputData.message)
  }
}

const handleTaskStatus = (taskData) => {
  console.log('📊 构建任务状态更新:', taskData)
  if (taskData.status === 'completed') {
    addLogOutput(`✅ 任务完成: ${taskData.message}`)
    building.value = false
    // 任务完成，断开WebSocket连接
    if (currentTaskId.value) {
      websocketManager.disconnectDeploy(currentTaskId.value)
    }
  } else if (taskData.status === 'failed') {
    addLogOutput(`❌ 任务失败: ${taskData.error || taskData.message}`)
    buildResult.value = {
      success: false,
      message: taskData.error || taskData.message
    }
    building.value = false    // 任务失败，断开WebSocket连接
    if (currentTaskId.value) {
      websocketManager.setTaskStatus(currentTaskId.value, 'failed')
      websocketManager.disconnectDeploy(currentTaskId.value)
    }
  } else if (taskData.status === 'running') {
    // 只显示有意义的进度信息，过滤掉特殊进度值(-999)的消息
    if (taskData.progress !== undefined && taskData.progress !== null && taskData.progress >= 0 && taskData.progress !== -999) {
      addLogOutput(`🔄 任务进度: ${taskData.progress}% - ${taskData.message}`)
    } else if (taskData.message && taskData.message.trim() && taskData.progress !== -999) {
      // 如果有消息内容但没有有效进度，只显示消息（不显示进度百分比）
      addLogOutput(`🔄 ${taskData.message}`)
    }
    // 对于progress为-999的消息，完全忽略不显示
  }
}

// 开始构建
const startBuild = async () => {
  try {
    await buildFormRef.value.validate()

    building.value = true
    buildResult.value = null
    buildLogs.value = []

    const buildConfig = {
      branch: buildForm.branch,
      version: buildForm.version,
      environments: buildForm.environments,
      projects: buildForm.projects,
      forceForeignNet: buildForm.forceForeignNet,
      deployAfterBuild: true, // 默认自动部署
      sshHost: buildForm.sshHost,
      sshUser: buildForm.sshUser,
      sshPassword: buildForm.sshPassword
    }

    addLogOutput(`🚀 开始构建并部署项目`)
    addLogOutput(`📝 分支: ${buildConfig.branch}`)
    addLogOutput(`📝 版本: ${buildConfig.version}`)
    addLogOutput(`📝 环境: ${buildConfig.environments.join(', ')}`)
    addLogOutput(`📝 项目: ${buildConfig.projects.join(', ')}`)
    addLogOutput(`📝 SSH主机: ${buildConfig.sshHost}`)
    addLogOutput(`📝 SSH用户: ${buildConfig.sshUser}`)
    addLogOutput('═'.repeat(80))

    // 使用 deployApi 替代直接 fetch
    const result = await deployApi.buildH5(buildConfig)

    if (!result.success) {
      throw new Error(result.error || '创建构建任务失败')
    }

    currentTaskId.value = result.taskId
    addLogOutput(`📋 构建任务已创建: ${result.taskId}`)

    // 建立WebSocket连接
    await websocketManager.connectForDeploy(result.taskId, {
      onDeployOutput: handleBuildOutput,
      onTaskStatus: handleTaskStatus,
      onError: (error) => {
        addLogOutput(`❌ WebSocket连接错误: ${error.message}`)
      },
      onClose: () => {
        addLogOutput(`🔌 WebSocket连接已断开`)
      }
    })

    ElMessage.success('构建部署任务已启动')

  } catch (error) {
    console.error('构建失败:', error)
    addLogOutput(`❌ 构建失败: ${error.message}`)
    buildResult.value = {
      success: false,
      message: error.message || '构建过程中发生错误'
    }
    ElMessage.error('构建失败')
    building.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (currentTaskId.value) {
    websocketManager.disconnectDeploy(currentTaskId.value)
  }
  currentTaskId.value = null

  buildFormRef.value.resetFields()
  buildResult.value = null
  buildLogs.value = []

  building.value = false
}

// 添加日志输出
const addLogOutput = (message) => {
  const timestamp = new Date().toLocaleTimeString()
  buildLogs.value.push(`[${timestamp}] ${message}`)

  nextTick(() => {
    if (logsContainer.value) {
      logsContainer.value.scrollTop = logsContainer.value.scrollHeight
    }
  })
}

// 清空日志
const clearLogs = () => {
  buildLogs.value = []
}

// 全选切换逻辑
const toggleSelectAllProjects = () => {
  if (isAllProjectsSelected.value) {
    // 取消全选
    buildForm.projects = []
  } else {
    // 全选所有项目
    buildForm.projects = projectOptions.value.map(project => project.value)
  }
}

// 组件挂载时加载项目列表
onMounted(() => {
  loadProjects()

  // 根据环境类型设置默认环境
  if (props.envType === 'intranet') {
    buildForm.environments = ['local']
  } else if (props.envType === 'internet') {
    buildForm.environments = ['master']
  } else {
    buildForm.environments = ['local']
  }
})
</script>

<style scoped>
.build-manager {
  /* 移除 min-height: 100vh */
  padding: 0;
}

/* 单列布局 */
.build-layout {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.build-left {
  width: 100%;
  max-width: 1200px;
}

.build-card {
  border: 1px solid #b4c6fc;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.build-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.build-form {
  padding: 0 20px;
}

.divider-text {
  color: #667eea;
  font-weight: 600;
  font-size: 14px;
}

/* 项目选择容器 */
.project-selection-container {
  width: 100%;
}

.project-selection-header {
  margin-bottom: 16px;
  padding: 0;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-count {
  font-size: 14px;
  color: #4a5568;
  font-weight: 600;
}

/* 全选按钮样式 */
.select-all-projects-btn {
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  color: #4a5568;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  padding: 6px 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.select-all-projects-btn:hover {
  border-color: #a0aec0;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.select-all-projects-btn.is-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.select-all-projects-btn.is-primary:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
  transform: translateY(-1px);
}

/* 加载和空状态样式 */
.loading-container,
.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

.loading-container .el-icon {
  font-size: 16px;
}

.empty-container .el-icon {
  color: #f56c6c;
  font-size: 16px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
  width: 100%;
}

.project-checkbox {
  width: 100%;
  margin: 0;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #f8faff;
  transition: all 0.3s ease;
}

.project-item:hover {
  background: #f0f2ff;
  border-color: #b4c6fc;
}

.project-name {
  flex: 1;
  font-weight: 500;
}

.build-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.reset-btn {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(100, 116, 139, 0.4);
}

.build-result {
  margin: 20px 0;
}

.build-logs {
  margin: 20px 0;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logs-header h3 {
  margin: 0;
  color: #303133;
}

.logs-content {
  max-height: 400px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.log-content {
  background-color: #000;
  color: #00ff00;
  padding: 15px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  min-height: 100px;
}

/* Element Plus 组件样式覆盖 */
.build-form :deep(.el-form-item__label) {
  color: #2d3748;
  font-weight: 600;
}

.build-form :deep(.el-input__wrapper) {
  border-radius: 6px;
  border: 1px solid #b4c6fc;
  transition: all 0.3s ease;
}

.build-form :deep(.el-input__wrapper:hover) {
  border-color: #8faef5;
}

.build-form :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.build-form :deep(.el-divider__text) {
  background-color: #f8faff;
  padding: 0 16px;
}

.build-form :deep(.el-divider--horizontal) {
  border-color: #d0dcff;
  margin: 24px 0;
}

.build-form :deep(.el-checkbox-group) {
  width: 100%;
}

.build-form :deep(.el-checkbox) {
  margin-right: 0;
  margin-bottom: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .build-manager {
    padding: 12px;
  }

  .build-layout {
    gap: 16px;
  }

  .build-form {
    padding: 20px;
  }

  .build-btn {
    height: 40px;
    font-size: 14px;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>
