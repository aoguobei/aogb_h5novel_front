<template>
  <div class="create-mini-app">
    <div class="page-header">
      <div class="page-header-content">
        <div class="page-title">创建网站</div>
        <p class="page-subtitle">通过简单的步骤配置，快速创建您的网站</p>
      </div>
    </div>

    <el-card class="main-card" shadow="hover">
            <!-- 步骤指示器 -->
      <StepIndicator :steps="steps" :current-step="currentStep" />

      <!-- 步骤内容 -->
      <div class="step-content-wrapper">
        <!-- 步骤1: 基本信息 -->
        <BasicInfoStep
          v-if="currentStep === 0"
          :basic-info="basicInfo"
          :brands="brands"
          :available-hosts="availableHosts"
          :is-current-host-available="isCurrentHostAvailable"
          @brand-change="onBrandChange"
          @brand-created="fetchBrands"
        />

        <!-- 步骤2: 基础配置 -->
        <BaseConfigStep
          v-if="currentStep === 1"
          :basic-info="basicInfo"
          :base-config="baseConfig"
          :extra-base-config="extraBaseConfig"
        />

        <!-- 步骤3: 通用配置 -->
        <CommonConfigStep
          ref="commonConfigStepRef"
          v-if="currentStep === 2"
          :common-config="commonConfig"
          :basic-info="basicInfo"
        />

        <!-- 步骤4: 支付配置 -->
        <PayConfigStep
          v-if="currentStep === 3"
          :pay-config="payConfig"
        />

        <!-- 步骤5: UI配置 -->
        <UIConfigStep
          v-if="currentStep === 4"
          :ui-config="uiConfig"
          :basic-info="basicInfo"
          @color-input="onColorInput"
        />

        <!-- 步骤6: 小说配置 -->
        <NovelConfigStep
          v-if="currentStep === 5"
          :basic-info="basicInfo"
          :novel-config="novelConfig"
          :is-generating-url="isGeneratingUrl"
          @generate-t-t-url="onGenerateTTUrl"
        />

        <!-- 步骤7: 配置确认与生成 -->
        <div v-if="currentStep === 6">
          <!-- 配置确认部分 -->
          <ConfigConfirmStep
            v-if="!isCreating"
            :basic-info="basicInfo"
            :base-config="baseConfig"
            :extra-base-config="extraBaseConfig"
            :common-config="commonConfig"
            :pay-config="payConfig"
            :ui-config="uiConfig"
            :novel-config="novelConfig"
            :brands="brands"
            :needs-extra-base-config="needsExtraBaseConfig"
            :extra-base-config-label="extraBaseConfigLabel"
            @prev-step="prevStep"
            @confirm-config="onConfirmConfig"
          />

          <!-- 生成文件部分 -->
          <ProgressStep
            v-if="isCreating"
            :progress-percentage="progressPercentage"
            :progress-status="progressStatus"
            :progress-text="progressText"
            :progress-details="progressDetails"
          />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="step-actions">
        <el-button
          v-if="currentStep > 0"
          @click="prevStep"
          class="action-btn prev-btn"
        >
          <el-icon><ArrowLeft /></el-icon>
          上一步
        </el-button>

        <el-button
          v-if="currentStep < 6"
          type="primary"
          @click="nextStep"
          :disabled="!canProceed"
          class="action-btn next-btn"
        >
          下一步
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </el-card>


  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  ArrowRight,
} from '@element-plus/icons-vue'
import StepIndicator from '@/components/CreateWebsite/StepIndicator.vue'
import BasicInfoStep from '@/components/CreateWebsite/BasicInfoStep.vue'
import BaseConfigStep from '@/components/CreateWebsite/BaseConfigStep.vue'
import CommonConfigStep from '@/components/CreateWebsite/CommonConfigStep.vue'
import PayConfigStep from '@/components/CreateWebsite/PayConfigStep.vue'
import UIConfigStep from '@/components/CreateWebsite/UIConfigStep.vue'
import NovelConfigStep from '@/components/CreateWebsite/NovelConfigStep.vue'
import ConfigConfirmStep from '@/components/CreateWebsite/ConfigConfirmStep.vue'
import ProgressStep from '@/components/CreateWebsite/ProgressStep.vue'
import { useRouter, useRoute } from 'vue-router'
import { brandApi } from '@/api/brand'
import { websiteApi } from '@/api/website'
import { validateColor, handleColorInput, generateTTUrl, updateProgress, resetProgress } from '@/composables/useCreateWebsite'
import websocketManager from '@/utils/websocket'

const router = useRouter()
const route = useRoute()

// 步骤配置
const steps = [
  { title: '基本信息' },
  { title: '基础配置' },
  { title: '通用配置' },
  { title: '支付配置' },
  { title: 'UI配置' },
  { title: '小说特有配置' },
  { title: '配置确认与生成' }
]

// 步骤控制
const currentStep = ref(0)
const isCreating = ref(false)
const progressPercentage = ref(0)
const progressStatus = ref('')
const progressText = ref('准备创建...')
const progressDetails = ref([])
const currentTaskId = ref('')

// 步骤组件引用
const commonConfigStepRef = ref(null)

// 数据
const brands = ref([])

// 表单数据
const basicInfo = ref({
  brandId: null,
  host: '',
  businessType: 'novel'
})

const baseConfig = ref({
  app_name: '',
  platform: '',
  app_code: '',
  product: '',
  customer: '',
  appid: '',
  version: '1.0.0',
  cl: '',
  uc: ''
})

// 额外的 baseConfig（用于 tt 或 ks 端）
const extraBaseConfig = ref({
  app_name: '',
  platform: '',
  app_code: '',
  product: '',
  customer: '',
  appid: '',
  version: '1.0.0',
  cl: '',
  uc: ''
})

const commonConfig = ref({
  deliver_business_id_enable: false,
  deliver_business_id: 'tt_h5_xingchen_business_type',
  deliver_switch_id_enable: false,
  deliver_switch_id: 'tt_h5_xingchen_public_switch',
  protocol_company: '武汉风行在线技术有限公司',
  protocol_about: '',
  protocol_privacy: '',
  protocol_vod: '',
  protocol_user_cancel: '',
  contact_url: '',
  script_base: ''
})

const payConfig = ref({
  normal_pay_enable: true,
  normal_pay_gateway_android: 0,
  normal_pay_gateway_ios: 0,
  renew_pay_enable: true,
  renew_pay_gateway_android: 0,
  renew_pay_gateway_ios: 0
})

const uiConfig = ref({
  theme_bg_main: '#268045',
  theme_bg_second: '#95acfc',
  theme_text_main: '#000000'
})

// 小说特有配置
const novelConfig = ref({
  tt_jump_home_url: '',
  tt_login_callback_domain: ''
})

// 生成URL状态
const isGeneratingUrl = ref(false)

// 颜色输入处理函数
const onColorInput = (field, value) => {
  handleColorInput(uiConfig.value, field, value)
}

// 计算属性
const needsExtraBaseConfig = computed(() => {
  return basicInfo.value.businessType === 'novel' &&
         (basicInfo.value.host === 'tth5' || basicInfo.value.host === 'ksh5')
})

const extraBaseConfigLabel = computed(() => {
  if (basicInfo.value.host === 'tth5') return '抖音小程序端基础配置'
  if (basicInfo.value.host === 'ksh5') return '快手小程序端基础配置'
  return '额外基础配置'
})

// 获取当前选中品牌的已有host列表
const selectedBrand = computed(() => {
  return brands.value.find(b => b.id === basicInfo.value.brandId)
})

// 获取可选的host选项
const availableHosts = computed(() => {
  if (!selectedBrand.value) {
    return [
      { label: 'H5', value: 'h5' },
      { label: '抖音H5', value: 'tth5' },
      { label: '快手H5', value: 'ksh5' }
    ]
  }

  // 获取该品牌已有的host列表
  const existingHosts = selectedBrand.value.clients?.map(client => client.host) || []

  // 所有可选的host
  const allHosts = [
    { label: 'H5', value: 'h5' },
    { label: '抖音H5', value: 'tth5' },
    { label: '快手H5', value: 'ksh5' }
  ]

  // 过滤掉已存在的host
  return allHosts.filter(host => !existingHosts.includes(host.value))
})

// 检查当前选择的host是否可用
const isCurrentHostAvailable = computed(() => {
  if (!basicInfo.value.host) return true
  return availableHosts.value.some(host => host.value === basicInfo.value.host)
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return basicInfo.value.brandId &&
             basicInfo.value.host &&
             isCurrentHostAvailable.value
    case 1:
      // 基础配置验证：只验证主配置的必要字段
      const baseConfigValid = baseConfig.value.app_name &&
                             baseConfig.value.platform &&
                             baseConfig.value.app_code &&
                             baseConfig.value.product &&
                             baseConfig.value.customer &&
                             baseConfig.value.appid &&
                             baseConfig.value.version &&
                             baseConfig.value.cl

      // 如果需要额外配置，验证必要的字段
      if (needsExtraBaseConfig.value) {
        if (basicInfo.value.host === 'tth5') {
          // 抖音端只需要cl字段
          return baseConfigValid && extraBaseConfig.value.cl
        } else if (basicInfo.value.host === 'ksh5') {
          // 快手端只需要appid字段
          return baseConfigValid && extraBaseConfig.value.appid
        } else {
          // 其他端需要所有字段
          return baseConfigValid &&
                 extraBaseConfig.value.app_name &&
                 extraBaseConfig.value.platform &&
                 extraBaseConfig.value.app_code &&
                 extraBaseConfig.value.product &&
                 extraBaseConfig.value.customer &&
                 extraBaseConfig.value.appid &&
                 extraBaseConfig.value.version &&
                 extraBaseConfig.value.cl
        }
      }

      return baseConfigValid
    case 2:
      // 验证script_base格式：必须以/开头和结尾
      const scriptBaseValid = commonConfig.value.script_base &&
                             /^\/.*\/$/.test(commonConfig.value.script_base)

      return scriptBaseValid &&
             commonConfig.value.protocol_company &&
             commonConfig.value.contact_url
    case 3:
      // 检查支付配置：如果启用了支付，网关ID必须大于0
      const normalPayValid = !payConfig.value.normal_pay_enable ||
        (payConfig.value.normal_pay_gateway_android > 0 && payConfig.value.normal_pay_gateway_ios > 0)
      const renewPayValid = !payConfig.value.renew_pay_enable ||
        (payConfig.value.renew_pay_gateway_android > 0 && payConfig.value.renew_pay_gateway_ios > 0)
      return normalPayValid && renewPayValid
    case 4:
      const bgMainValid = uiConfig.value.theme_bg_main && validateColor(uiConfig.value.theme_bg_main)
      const bgSecondValid = uiConfig.value.theme_bg_second && validateColor(uiConfig.value.theme_bg_second)
      const textMainValid = uiConfig.value.theme_text_main && validateColor(uiConfig.value.theme_text_main)

      console.log('UI配置验证:', {
        theme_bg_main: uiConfig.value.theme_bg_main,
        theme_bg_second: uiConfig.value.theme_bg_second,
        theme_text_main: uiConfig.value.theme_text_main,
        bgMainValid,
        bgSecondValid,
        textMainValid
      })

      return bgMainValid && bgSecondValid && textMainValid
    case 5:
      // 如果是tth5端，小说特有配置是必填的
      if (basicInfo.value.host === 'tth5') {
        return novelConfig.value.tt_jump_home_url && novelConfig.value.tt_login_callback_domain
      }
      return true // 其他端类型不需要小说特有配置
    case 6:
      // 配置确认与生成步骤，如果正在创建则不允许返回
      return !isCreating.value
    default:
      return true
  }
})

// 方法
const fetchBrands = async () => {
  try {
    const response = await brandApi.getBrands()
    // 适配新的后端返回结构
    brands.value = response.data.data || response.data || []

    // 在brands加载完成后，检查是否需要预填充品牌信息
    console.log('检查URL参数:', route.query)
    if (route.query.brandId && route.query.brandCode) {
      const brandId = parseInt(route.query.brandId)
      // 验证品牌是否存在
      const brandExists = brands.value.some(brand => brand.id === brandId)
      if (brandExists) {
        basicInfo.value.brandId = brandId
        basicInfo.value.brandCode = route.query.brandCode
      } else {
        console.warn('指定的品牌不存在:', brandId)
      }
    }
  } catch (error) {
    console.error('Failed to fetch brands:', error)
  }
}

const onBrandChange = () => {
  // 当品牌改变时，可以预填充一些配置
const selectedBrand = brands.value.find(b => b.id === basicInfo.value.brandId)
basicInfo.value.brandCode = selectedBrand.code
}

// 当host改变时，重置额外的baseConfig
const resetExtraBaseConfig = () => {
  extraBaseConfig.value = {
    app_name: '',
    platform: '',
    app_code: '',
    product: '',
    customer: '',
    appid: '',
    version: '1.0.0',
    cl: '',
    uc: ''
  }
}



const nextStep = () => {
  if (currentStep.value < 6) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const updateProgressState = (percentage, status, text, detail = null) => {
  updateProgress({ percentage: progressPercentage, status: progressStatus, text: progressText, details: progressDetails }, percentage, status, text, detail)
}

const resetProgressState = () => {
  resetProgress({ percentage: progressPercentage, status: progressStatus, text: progressText, details: progressDetails })
}

const createWebsite = async () => {
  console.log('createWebsite function called!')
  console.log('Current step:', currentStep.value)
  console.log('Form data:', {
    basicInfo: basicInfo.value,
    baseConfig: baseConfig.value,
    commonConfig: commonConfig.value,
    payConfig: payConfig.value,
    uiConfig: uiConfig.value,
    novelConfig: novelConfig.value
  })

  isCreating.value = true
  resetProgressState()

  try {
    // 构建请求数据
    const requestData = {
      basic_info: {
        brand_id: basicInfo.value.brandId,
        host: basicInfo.value.host
      },
      base_config: baseConfig.value,
      common_config: commonConfig.value,
      pay_config: payConfig.value,
      ui_config: uiConfig.value
    }

    // 如果需要额外的baseConfig，添加到请求中
    if (needsExtraBaseConfig.value) {
      requestData.extra_base_config = extraBaseConfig.value
    }

    // 如果是tth5端，小说配置是必填的
    if (basicInfo.value.host === 'tth5') {
      requestData.novel_config = novelConfig.value
    }

    // 调用后端API创建任务
    console.log('Sending request to backend:', requestData)
    const response = await websiteApi.createWebsite(requestData)
    console.log('Backend response:', response.data)

    // 获取任务ID
    const responseData = response.data.data || response.data
    if (!responseData?.task_id) {
      throw new Error('未获取到任务ID')
    }

    currentTaskId.value = responseData.task_id
    console.log('Task ID:', currentTaskId.value)

    // 连接到WebSocket
    websocketManager.connect(
      currentTaskId.value,
      // onMessage
      (data) => {
        console.log('WebSocket message received:', data)

        if (data.type === 'progress') {
          console.log('收到进度消息:', data.data)
          const progressData = data.data
          progressPercentage.value = progressData.percentage
          // 将后端的 status 映射为 Element Plus 支持的值
          if (progressData.status === 'running') {
            progressStatus.value = '' // 运行状态使用空字符串
          } else {
            progressStatus.value = progressData.status
          }
          progressText.value = progressData.text

          // 将text和detail合并为一条消息
          if (progressData.text && progressData.details && progressData.details.length > 0) {
            const detail = progressData.details[0]
            progressDetails.value.push({
              status: detail.status || 'success',
              text: progressData.text,
              detail: detail.message,
              isText: true
            })
          } else if (progressData.text) {
            // 处理只有text的情况，比如回滚完成消息
            progressDetails.value.push({
              status: 'success',
              text: progressData.text,
              detail: '',
              isText: true
            })
          } else if (progressData.details && progressData.details.length > 0) {
            progressDetails.value.push(...progressData.details)
          }

          // 特殊处理：如果是回滚相关的消息，确保显示
          if (progressData.text && (progressData.text.includes('回滚') || progressData.text.includes('Rollback'))) {
            console.log('检测到回滚相关消息:', progressData.text)
          }
        } else if (data.type === 'task_status') {
          console.log('收到任务状态消息:', data.data)
          // 处理任务状态更新
          const taskData = data.data
          if (taskData.status === 'failed') {
            // 任务失败，显示错误信息
            progressPercentage.value = 0
            progressStatus.value = 'exception'
            progressText.value = '任务执行失败'
            progressDetails.value.push({
              status: 'error',
              message: taskData.error || taskData.message || '未知错误'
            })
          } else if (taskData.status === 'completed') {
            // 任务完成
            progressPercentage.value = 100
            progressStatus.value = 'success'
            progressText.value = '任务完成'

            // 添加完成消息到details
            progressDetails.value.push({
              status: 'success',
              message: '任务完成'
            })

            // 延迟跳转
            setTimeout(() => {
              if (taskData.client_id) {
                router.push(`/website-config/${taskData.client_id}`)
              } else {
                router.push('/website-configs')
              }
            }, 3000)
          } else if (taskData.status === 'running') {
            // 任务运行中
            progressPercentage.value = taskData.progress || 0
            progressStatus.value = 'success' // 使用空字符串表示运行状态
            progressText.value = taskData.message || '正在处理...'

            // 添加运行消息到details
            if (taskData.message) {
              progressDetails.value.push({
                status: 'success',
                message: taskData.message
              })
            }
          }
        } else if (data.type === 'result') {
          // 任务完成，收到最终结果
          console.log('Task completed with result:', data.data)

          // 延迟跳转
          setTimeout(() => {
            if (data.data?.client_id) {
              router.push(`/website-config/${data.data.client_id}`)
            } else {
              router.push('/website-configs')
            }
          }, 3000)
        } else {
          console.log('收到未知类型的消息:', data.type)
        }
      },
      // onError
      (error) => {
        console.error('WebSocket error:', error)
        ElMessage.error('WebSocket连接失败')
      },
      // onClose
      (event) => {
        console.log('WebSocket closed:', event)
      }
    )

    ElMessage.success('任务已创建，正在处理...')

  } catch (error) {
    console.error('Create website error:', error)
    ElMessage.error('创建失败: ' + (error.response?.data?.error || error.message))
    isCreating.value = false
  }
}

// 生成抖音跳转首页URL
const onGenerateTTUrl = async () => {
  await generateTTUrl(extraBaseConfig.value, novelConfig.value, isGeneratingUrl)
}

// 配置确认处理
const onConfirmConfig = () => {
  // 用户确认配置后，开始创建网站
  createWebsite()
}

// 监听host变化，重置额外的baseConfig
watch(() => basicInfo.value.host, (newHost) => {
  if (newHost && (newHost === 'tth5' || newHost === 'ksh5')) {
    // 预填充一些默认值
    if (newHost === 'tth5') {
      extraBaseConfig.value.platform = 'douyin'
    } else if (newHost === 'ksh5') {
      extraBaseConfig.value.platform = 'kuaishou'
    }
  } else {
    resetExtraBaseConfig()
  }
})

// 监听品牌变化，重置host选择
watch(() => basicInfo.value.brandId, (newBrandId) => {
  if (newBrandId) {
    // 检查当前选择的host是否在新品牌中可用
    const brand = brands.value.find(b => b.id === newBrandId)
    if (brand && basicInfo.value.host) {
      const existingHosts = brand.clients?.map(client => client.host) || []
      if (existingHosts.includes(basicInfo.value.host)) {
        // 如果当前host已存在，清空选择
        basicInfo.value.host = ''
      }
    }
  } else {
    // 如果没有选择品牌，清空host
    basicInfo.value.host = ''
  }
})

// 监听host变化，重置额外的baseConfig
watch(() => baseConfig.value, (conf) => {
  const sameChangeKeyArr = [ 'app_name', 'product' ]
  sameChangeKeyArr.forEach( item => {
    if (conf[item]) extraBaseConfig.value[item] = conf[item]
  })
}, {
  deep: true
})

onMounted(() => {
  fetchBrands()
})

// 组件卸载时清理WebSocket连接
onUnmounted(() => {
  if (currentTaskId.value) {
    websocketManager.disconnect(currentTaskId.value)
  }
})
</script>

<style scoped>
.create-mini-app {
  max-width: 1400px ;
  margin: 0 auto;
  padding: 15px;
}

.page-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.page-header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.page-title {
  margin: 0;
  color: #303133;
  font-size: 28px;
  font-weight: 600;
}

.page-subtitle {
  margin: 0;
  color: #909399;
  font-size: 16px;
  font-weight: 400;
}

.main-card {
  margin-top: 10px;
}



.step-content-wrapper {
  margin-top: 20px;
}



.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prev-btn .el-icon {
  font-size: 18px;
}

.next-btn .el-icon {
  font-size: 18px;
}

.create-btn .el-icon {
  font-size: 18px;
}





.form-tip {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-tip .el-icon {
  font-size: 14px;
}

.form-tip-warning {
  color: #E6A23C;
}

.form-tip-error {
  color: #F56C6C;
}

/* 必填字段红色星号样式 */
:deep(.el-form-item.is-required .el-form-item__label::before) {
  color: #F56C6C;
  content: '*';
  margin-right: 4px;
}

/* 输入框长度优化 */
:deep(.el-input) {
  max-width: 300px;
}

:deep(.el-textarea) {
  max-width: 400px;
}

:deep(.el-input-number) {
  max-width: 200px;
}

/* 选择框长度优化 */
:deep(.el-select) {
  max-width: 200px;
}

/* 字体大小优化 */
:deep(.el-form-item__label) {
  font-size: 16px !important;
  font-weight: 500;
}

:deep(.el-input__inner) {
  font-size: 16px !important;
}

:deep(.el-textarea__inner) {
  font-size: 16px !important;
}

:deep(.el-select .el-input__inner) {
  font-size: 16px !important;
}

:deep(.el-radio__label) {
  font-size: 16px !important;
}

:deep(.el-checkbox__label) {
  font-size: 16px !important;
}

:deep(.el-button) {
  font-size: 16px !important;
}





/* 表单提示间距 */
.form-tip {
  font-size: 14px;
  color: #909399;
  margin-top: 12px;
  display: block;
  line-height: 1.4;
}



/* 响应式设计 */
@media (max-width: 768px) {
  .create-mini-app {
    padding: 10px;
  }



  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-row .el-form-item {
    margin-bottom: 18px;
  }

  .deliver-config-row {
    flex-direction: column;
    gap: 0;
  }

  .deliver-config-row .el-form-item {
    margin-bottom: 18px;
  }

  .deliver-config-row .el-form-item:first-child {
    min-width: auto;
  }

  .form-item-content {
    flex-direction: column;
    gap: 10px;
  }

  .url-input-container {
    flex-direction: column;
    gap: 10px;
  }

  .generate-btn {
    min-width: auto;
    width: 100%;
  }

  .color-input-group {
    flex-direction: column;
    gap: 10px;
  }

  .url-input-group {
    flex-direction: column;
    gap: 10px;
  }
}

/* 动画效果 */
.step-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片阴影效果 */
.main-card {
  transition: box-shadow 0.3s ease;
}

.main-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* 按钮悬停效果 */
.action-btn {
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
