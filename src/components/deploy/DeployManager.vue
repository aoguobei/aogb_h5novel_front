<template>
  <div class="deploy-manager">
    <div class="deploy-layout">
      <!-- 左侧：部署配置 -->
      <div class="deploy-left">
        <el-card class="deploy-card">
          <template #header>
            <div class="card-header">
              <h2>Nginx配置部署</h2>
            </div>
          </template>

      <!-- 重要提示信息 -->
      <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 8px; margin: 0; text-align: center;">
        <div style="color: #dc2626; font-size: 14px; font-weight: 600;">此环境配置流程仅针对新创建的网站。对于已上线运行的网站，无需也请勿重复配置</div>
      </div>

      <!-- 统一的部署配置表单 -->
      <el-form
        ref="configFormRef"
        :model="formData"
        :rules="configRules"
        class="unified-form"
      >
        <!-- 服务器连接配置 -->
        <el-divider content-position="left">
          <span class="divider-text">🖥️ 服务器连接配置</span>
        </el-divider>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="服务器地址" prop="server.host">
              <el-input
                v-model="serverForm.host"
                placeholder="如: 192.168.1.100 或 server.example.com"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SSH端口" prop="server.port">
              <el-input-number
                v-model="serverForm.port"
                :min="1"
                :max="65535"
                :controls="false"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SSH用户名" prop="server.username">
              <el-input
                v-model="serverForm.username"
                placeholder="fun"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SSH密码" prop="server.password">
              <el-input
                v-model="serverForm.password"
                type="password"
                placeholder="请输入SSH密码"
                clearable
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Nginx配置 -->
        <el-divider content-position="left">
          <span class="divider-text">⚙️ Nginx部署配置</span>
        </el-divider>

        <!-- 小说选择 - 级联选择器 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="小说选择">
              <el-cascader
                v-model="selectedCascaderValue"
                :options="cascaderOptions"
                :props="{
                  value: 'value',
                  label: 'label',
                  children: 'children',
                  emitPath: false,
                  expandTrigger: 'hover'
                }"
                placeholder="请选择小说应用"
                clearable
                filterable
                @change="handleCascaderChange"
                style="width: 100%"
                :loading="novelsLoading"
                :disabled="novelsLoading || allNovelData.length === 0"
              >
                <template #default="{ node, data }">
                  <div class="cascader-item">
                    <span class="cascader-label">{{ data.label }}</span>
                    <el-tag
                      v-if="data.platformTag"
                      size="small"
                      :type="data.platformType"
                      style="margin-left: 8px"
                    >
                      {{ data.platformTag }}
                    </el-tag>
                  </div>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
          <div class="field-help">
                <small v-if="novelsLoading">🔄 正在加载小说配置...</small>
                <small v-else-if="allNovelData.length === 0">⚠️ 暂无可用的小说配置</small>
                <small v-else-if="!selectedNovel">💡 请选择小说应用</small>
                <small v-else>✅ 选择完成，已自动填充网站文件目录和访问路径</small>
              </div>
        </el-row>

        <!-- 域名和端口 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="域名" prop="domain">
              <el-input
                v-model="configForm.domain"
                placeholder="请输入域名 (如: example.com)"
                clearable
                @input="onDomainChange"
              />
            </el-form-item>
          </el-col>
          <el-row :span="8">
            <el-form-item label="端口" prop="port">
              <el-input-number
                v-model="configForm.port"
                :min="1"
                :max="65535"
                placeholder="例如: 80, 443"
                :controls="false"
                style="width: 100%"
              />
            </el-form-item>
            <el-tag
                :type="isHttps ? 'success' : 'info'"
                size="small"
                style="margin-top: 5px"
              >
                {{ isHttps ? 'HTTPS' : 'HTTP' }}
              </el-tag>
          </el-row>
        </el-row>

        <!-- 网站文件目录和访问路径 -->
        <el-col :gutter="20">
          <el-row :span="15">
            <el-form-item label="网站文件目录" prop="rootPath">
              <el-input
                v-model="configForm.rootPath"
                placeholder="如: /var/www/html 或 C:/inetpub/wwwroot"
                clearable
              />
            </el-form-item>
            <div class="field-help">
                <small>💡 网站静态文件的物理存储目录</small>
              </div>
          </el-row>
          <el-row :span="6">
            <el-form-item label="访问路径" prop="locationPath">
              <el-input
                v-model="configForm.locationPath"
                placeholder="如: /, /admin"
                clearable
              />
            </el-form-item>
            <div class="field-help">
                <small>💡 浏览器访问的URL路径</small>
              </div>
          </el-row>
        </el-col>

        <!-- SSL证书配置 -->
        <div class="ssl-config" v-if="isHttps">
          <el-divider content-position="left">🔒 SSL证书配置</el-divider>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="SSL证书文件" prop="sslCertPath">
                <el-input
                  v-model="configForm.sslCertPath"
                  placeholder="如: /etc/ssl/cert.pem"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="SSL私钥文件" prop="sslKeyPath">
                <el-input
                  v-model="configForm.sslKeyPath"
                  placeholder="如: /etc/ssl/key.pem"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 操作按钮区域 -->
        <el-divider content-position="left">
          <span class="divider-text">🎯 部署操作</span>
        </el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-button
              type="primary"
              @click="deployConfig"
              :loading="deploying"
              :disabled="!canDeploy"
              size="large"
              class="deploy-btn primary-btn"
            >
              <el-icon><Upload /></el-icon>
              {{ deploying ? '正在配置...' : '开始配置' }}
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-button
              @click="resetForm"
              :disabled="deploying"
              size="large"
              class="deploy-btn reset-btn"
            >
              <el-icon><Refresh /></el-icon>
              重置配置
            </el-button>
          </el-col>
        </el-row>
      </el-form>

      <!-- 部署结果 -->
      <div v-if="deployResult" class="deploy-result">
        <el-alert
          :title="deployResult.success ? '部署成功' : '部署失败'"
          :type="deployResult.success ? 'success' : 'error'"
          :description="deployResult.message"
          show-icon
          :closable="false"
        />
      </div>

      <!-- 脚本输出日志 -->
      <div v-if="scriptOutput.length > 0" class="script-output">
        <el-card>
          <template #header>
            <div class="output-header">
              <h3>📋 脚本执行日志</h3>
              <el-button size="small" @click="clearOutput" type="text">清空日志</el-button>
            </div>
          </template>
          <div class="output-content" ref="logContainer">
            <pre class="log-content">{{ scriptOutput.join('\n') }}</pre>
          </div>
        </el-card>
      </div>

        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload, Refresh } from '@element-plus/icons-vue'
import { useNovelSelector } from '@/composables/useConfig'
import websocketManager from '@/utils/websocket'
import { deployApi } from '@/api/deploy'

// 响应式数据
const deploying = ref(false)
const deployResult = ref(null)
const scriptOutput = ref([])
const logContainer = ref()
const currentTaskId = ref(null)

const serverForm = reactive({
  host: '172.17.5.92',
  port: 22, // 默认SSH端口，与后端配置保持一致
  username: 'fun',
  password: ''
})

const configForm = reactive({
  domain: '',
  port: 443, // 默认HTTPS端口
  rootPath: '',
  locationPath: '',
  sslCertPath: '',
  sslKeyPath: ''
})

// 统一的表单数据对象，用于验证
const formData = computed(() => ({
  server: serverForm,
  ...configForm
}))

// 使用小说选择器 composable
const {
  novelsLoading,
  allNovelData,
  selectedNovel,
  selectedCascaderValue,
  cascaderOptions,
  fetchNovelOptions,
  clearSelection,
  onCascaderChange
} = useNovelSelector()

// WebSocket连接状态
const wsConnected = ref(false)
const wsConnecting = ref(false)
const wsError = ref(null)

// WebSocket消息处理器
const handleDeployOutput = (outputData) => {
  if (outputData.type === 'output') {
    addLogOutput(outputData.message)
  } else if (outputData.type === 'error') {
    addLogOutput(`❌ 错误: ${outputData.message}`)
  } else if (outputData.type === 'success') {
    addLogOutput(`✅ ${outputData.message}`)
    deployResult.value = {
      success: true,
      message: outputData.message
    }
    // 部署完成，停止loading状态
    deploying.value = false
    ElMessage.success(outputData.message)
  } else if (outputData.type === 'failed') {
    addLogOutput(`❌ ${outputData.message}`)
    deployResult.value = {
      success: false,
      message: outputData.message
    }
    // 部署失败，停止loading状态
    deploying.value = false
    ElMessage.error(outputData.message)
  }
}

const handleTaskStatus = (taskData) => {
  console.log('📊 任务状态更新:', taskData)
  if (taskData.status === 'completed') {
    addLogOutput(`✅ 任务完成: ${taskData.message}`)
    deploying.value = false
    wsConnected.value = false
  } else if (taskData.status === 'failed') {
    addLogOutput(`❌ 任务失败: ${taskData.error || taskData.message}`)
    deployResult.value = {
      success: false,
      message: taskData.error || taskData.message
    }
    deploying.value = false
    wsConnected.value = false
    ElMessage.error('部署任务失败')
  } else if (taskData.status === 'running') {
    addLogOutput(`🔄 任务进度: ${taskData.progress}% - ${taskData.message}`)
  }
}

// 表单引用
const configFormRef = ref()

// 表单验证规则
const configRules = {
  // 服务器连接验证规则
  'server.host': [
    { required: true, message: '请输入服务器地址', trigger: 'blur' }
  ],
  'server.port': [
    { required: true, message: '请输入SSH端口', trigger: 'blur' },
    { type: 'number', min: 1, max: 65535, message: 'SSH端口必须在1-65535之间', trigger: 'blur' }
  ],
  'server.username': [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  'server.password': [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  // Nginx配置验证规则
  domain: [
    { required: true, message: '请输入域名', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入域名'))
          return
        }

        // 允许 localhost
        if (value === 'localhost') {
          callback()
          return
        }

        // 允许 IP 地址
        const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        if (ipPattern.test(value)) {
          callback()
          return
        }

        // 允许标准域名
        const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/
        if (domainPattern.test(value)) {
          callback()
          return
        }

        callback(new Error('请输入有效的域名、IP地址或localhost'))
      },
      trigger: 'blur'
    }
  ],
  port: [
    { required: true, message: '请输入端口号', trigger: 'blur' },
    { type: 'number', min: 1, max: 65535, message: '端口号必须在1-65535之间', trigger: 'blur' }
  ],
  rootPath: [
    { required: true, message: '请输入网站文件目录', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入网站文件目录'))
          return
        }

        // 支持Unix/Linux路径（以/开头）和Windows路径（以盘符开头，如C:）
        const unixPattern = /^\//
        const windowsPattern = /^[A-Za-z]:[\\\/]/

        if (unixPattern.test(value) || windowsPattern.test(value)) {
          callback()
          return
        }

        callback(new Error('请输入有效的绝对路径（Unix: /path/to/dir 或 Windows: C:/path/to/dir）'))
      },
      trigger: 'blur'
    }
  ],
  locationPath: [
    { required: true, message: '请输入访问路径', trigger: 'blur' },
    { pattern: /^\//, message: '访问路径必须以 / 开头', trigger: 'blur' }
  ]
}

// 判断是否为HTTPS
const isHttps = computed(() => {
  return configForm.port === 443 ||
         configForm.port === 8443 ||
         configForm.port === 9443 ||
         (configForm.sslCertPath && configForm.sslKeyPath)
})

// 表单验证 - 检查服务器表单是否完整
const isServerFormValid = computed(() => {
  return serverForm.host &&
         serverForm.port &&
         serverForm.username &&
         serverForm.password
})

// 表单验证 - 检查配置表单是否完整
const isConfigFormValid = computed(() => {
  const basicValid = configForm.domain &&
                    configForm.port &&
                    configForm.rootPath &&
                    configForm.locationPath

  // 如果是HTTPS，还需要检查SSL证书
  if (isHttps.value) {
    return basicValid && configForm.sslCertPath && configForm.sslKeyPath
  }

  return basicValid
})

// 部署按钮是否可用
const canDeploy = computed(() => {
  return isServerFormValid.value && isConfigFormValid.value && !deploying.value
})

// 部署配置
const deployConfig = async () => {
  try {
    // 验证表单
    await configFormRef.value.validate()

    deploying.value = true
    deployResult.value = null
    scriptOutput.value = []

    // 构建完整的部署配置
    const deployConfigData = {
      ...configForm,
      server: serverForm
    }

    // 添加开始日志
    addLogOutput(`🚀 开始配置: ${configForm.domain}:${configForm.port}${configForm.locationPath}`)
    addLogOutput(`📝 服务器: ${serverForm.username}@${serverForm.host}:${serverForm.port}`)
    addLogOutput(`📝 参数: ${JSON.stringify(deployConfigData, null, 2)}`)
    addLogOutput('═'.repeat(80))

    // 调用后端API创建任务
    const result = await deployApi.nginxDeploy(deployConfigData)

    if (!result.success) {
      throw new Error(result.error || '创建部署任务失败')
    }

    currentTaskId.value = result.taskId
    addLogOutput(`📋 部署任务已创建: ${result.taskId}`)
    addLogOutput(`🔗 正在建立WebSocket连接...`)

    // 建立WebSocket连接
    wsConnecting.value = true
    try {
      await websocketManager.connectForDeploy(result.taskId, {
        onDeployOutput: handleDeployOutput,
        onTaskStatus: handleTaskStatus,
        onError: (error) => {
          wsError.value = error
          wsConnecting.value = false
          addLogOutput(`❌ WebSocket连接错误: ${error.message}`)
        },
        onClose: () => {
          wsConnected.value = false
          wsConnecting.value = false
          addLogOutput(`🔌 WebSocket连接已断开`)
        }
      })
      wsConnected.value = true
      wsConnecting.value = false
      addLogOutput(`✅ WebSocket连接已建立`)
      ElMessage.success('部署任务已启动，正在通过WebSocket获取实时进度')
    } catch (error) {
      wsConnecting.value = false
      throw error
    }

  } catch (error) {
    console.error('部署错误:', error)
    addLogOutput(`❌ 部署失败: ${error.message}`)
    deployResult.value = {
      success: false,
      message: error.message || '部署过程中发生错误'
    }
    ElMessage.error('部署失败')
    deploying.value = false
  }
}

// 重置表单
const resetForm = () => {
  // 断开WebSocket连接
  if (currentTaskId.value) {
    websocketManager.disconnectDeploy(currentTaskId.value)
  }
  currentTaskId.value = null

  configFormRef.value.resetFields()
  clearSelection(configForm)
  resetServerForm()
  deployResult.value = null
  scriptOutput.value = []

  // 重置部署状态
  deploying.value = false
  wsConnected.value = false
  wsConnecting.value = false
  wsError.value = null
}

// 重置服务器连接表单
const resetServerForm = () => {
  // 重置服务器表单数据
  Object.assign(serverForm, {
    host: '172.17.5.92',
    port: 22,
    username: 'fun',
    password: ''
  })
}

// 域名变化时的处理
const onDomainChange = () => {
  if (isHttps.value && configForm.domain) {
    // 如果当前选择的是HTTPS且有域名，自动填充证书路径
    autoFillCertPaths()
  }
}

// 包装级联选择器变化事件，传入 configForm
const handleCascaderChange = (value) => {
  onCascaderChange(value, configForm)
}

// 域名到SSL证书路径的映射
const DOMAIN_SSL_MAPPING = {
  'funshion.tv': {
    certificate: '/home/fun/nico/funshion.tv_ssl/funshion.tv.pem',
    key: '/home/fun/nico/funshion.tv_ssl/funshion.tv.key'
  },
  'ibidian.com': {
    certificate: '/home/fun/nico/ibidian_ssl_20250609/f7489892__ibidian.com.pem',
    key: '/home/fun/nico/ibidian_ssl_20250609/f7489892__ibidian.com.key'
  },
  'funshion.com': {
    certificate: '/home/fun/nico/ssl_funshion/funshion.com.crt',
    key: '/home/fun/nico/ssl_funshion/funshion.com.crt.key'
  },
  'fun.tv': {
    certificate: '/home/fun/nico/ssl_fun.tv/fun.tv.crt',
    key: '/home/fun/nico/ssl_fun.tv/fun.tv.crt.key'
  }
}

// 自动填充证书路径
const autoFillCertPaths = () => {
  // 确保域名存在
  if (!configForm.domain) {
    return
  }

  const domain = configForm.domain.toLowerCase()

  // 查找匹配的域名
  const matchedDomain = Object.keys(DOMAIN_SSL_MAPPING).find(key =>
    domain.includes(key)
  )

  if (matchedDomain) {
    const sslConfig = DOMAIN_SSL_MAPPING[matchedDomain]
    configForm.sslCertPath = sslConfig.certificate
    configForm.sslKeyPath = sslConfig.key
  } else {
    console.warn(`⚠️ 未找到域名 ${domain} 对应的SSL证书配置`)
    // 清空证书路径
    configForm.sslCertPath = ''
    configForm.sslKeyPath = ''
  }
}

// 添加日志输出
const addLogOutput = (message) => {
  const timestamp = new Date().toLocaleTimeString()
  scriptOutput.value.push(`[${timestamp}] ${message}`)

  // 自动滚动到底部 - 改进版本
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
}

// 清空输出日志
const clearOutput = () => {
  scriptOutput.value = []
}

// 监听端口变化
watch(() => configForm.port, (newPort) => {
  if (newPort === 80) {
    // 如果选择端口80，清空SSL证书路径
    configForm.sslCertPath = ''
    configForm.sslKeyPath = ''
  } else if (isHttps.value && configForm.domain) {
    // 如果选择HTTPS端口且有域名，自动填充证书路径
    autoFillCertPaths()
  }
})

// 监听日志变化自动滚动
watch(() => scriptOutput.value.length, () => {
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
})

// 组件挂载时获取小说配置
onMounted(() => {
  fetchNovelOptions()
})
</script>

<style scoped>
.deploy-manager {
  /* 移除 min-height: 100vh */
}

/* 单列布局 */
.deploy-layout {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.deploy-left {
  width: 100%;
  max-width: 1200px;
}

.deploy-card {
  border: 1px solid #b4c6fc;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.deploy-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-header {
  display: flex;
  align-items: baseline;
}

.card-header h2 {
  margin: 0;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.unified-form {
  padding: 0 20px;
}

.deploy-result {
  margin-bottom: 20px;
}

.ssl-config {
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #c7d5fe;
  border-radius: 8px;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(102, 126, 234, 0.06);
}

/* 分割线样式 */
.divider-text {
  color: #667eea;
  font-weight: 600;
  font-size: 14px;
}

.deploy-btn {
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

.script-output {
  margin: 20px 0;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.output-header h3 {
  margin: 0;
  color: #303133;
}

.output-content {
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

.field-help {
  margin-top: 4px;
  padding-left: 8px;
}

.field-help small {
  color: #718096;
  font-size: 12px;
  line-height: 1.3;
  font-weight: 500;
}

/* 禁用按钮样式 */
.el-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 级联选择器自定义样式 */
.cascader-item {
  display: flex;
  align-items: center;
  width: 100%;
}

.cascader-label {
  flex: 1;
}

/* Element Plus 组件样式覆盖 */
.unified-form :deep(.el-form-item__label) {
  color: #2d3748;
  font-weight: 600;
}

.unified-form :deep(.el-input__wrapper) {
  border-radius: 6px;
  border: 1px solid #b4c6fc;
  transition: all 0.3s ease;
}

.unified-form :deep(.el-input__wrapper:hover) {
  border-color: #8faef5;
}

.unified-form :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.unified-form :deep(.el-input-number .el-input__wrapper) {
  border-radius: 6px;
  border: 1px solid #b4c6fc;
}

.unified-form :deep(.el-cascader .el-input__wrapper) {
  border-radius: 6px;
  border: 1px solid #b4c6fc;
}

.unified-form :deep(.el-divider__text) {
  background-color: #f8faff;
  padding: 0 16px;
}

.unified-form :deep(.el-divider--horizontal) {
  border-color: #d0dcff;
  margin: 24px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .deploy-manager {
    padding: 12px;
  }

  .unified-form {
    padding: 20px;
  }

  .deploy-btn {
    height: 40px;
    font-size: 14px;
  }
}
</style>
