<template>
  <div class="create-mini-app">
    <div class="page-header">
      <div class="page-header-content">
        <h1 class="page-title">创建网站</h1>
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
          v-if="currentStep === 2"
          :common-config="commonConfig"
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

        <!-- 步骤7: 生成文件 -->
        <ProgressStep
          v-if="currentStep === 6"
          :progress-percentage="progressPercentage"
          :progress-status="progressStatus"
          :progress-text="progressText"
          :progress-details="progressDetails"
        />
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

        <el-button
          v-if="currentStep === 6"
          type="success"
          @click="createWebsite"
          :loading="isCreating"
          :disabled="isCreating"
          class="action-btn create-btn"
        >
          <el-icon><VideoPlay /></el-icon>
          开始创建网站
        </el-button>
      </div>
    </el-card>


  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft,
  ArrowRight,
  VideoPlay
} from '@element-plus/icons-vue'
import StepIndicator from '@/components/CreateWebsite/StepIndicator.vue'
import BasicInfoStep from '@/components/CreateWebsite/BasicInfoStep.vue'
import BaseConfigStep from '@/components/CreateWebsite/BaseConfigStep.vue'
import CommonConfigStep from '@/components/CreateWebsite/CommonConfigStep.vue'
import PayConfigStep from '@/components/CreateWebsite/PayConfigStep.vue'
import UIConfigStep from '@/components/CreateWebsite/UIConfigStep.vue'
import NovelConfigStep from '@/components/CreateWebsite/NovelConfigStep.vue'
import ProgressStep from '@/components/CreateWebsite/ProgressStep.vue'
import { useRouter } from 'vue-router'
import { brandApi } from '@/api/brand'
import { websiteApi } from '@/api/website'
import { validateColor, handleColorInput, generateTTUrl, updateProgress, resetProgress } from '@/composables/useCreateWebsite'

const router = useRouter()

// 步骤配置
const steps = [
  { title: '基本信息' },
  { title: '基础配置' },
  { title: '通用配置' },
  { title: '支付配置' },
  { title: 'UI配置' },
  { title: '小说特有配置' },
  { title: '生成文件' }
]

// 步骤控制
const currentStep = ref(0)
const isCreating = ref(false)
const progressPercentage = ref(0)
const progressStatus = ref('')
const progressText = ref('准备创建...')
const progressDetails = ref([])

// 数据
const brands = ref([])

// 表单数据
const basicInfo = ref({
  brandId: null,
  host: ''
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
  theme_bg_main: '#2552f5',
  theme_bg_second: '#2552f5',
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
  return basicInfo.value.host === 'tth5' || basicInfo.value.host === 'ksh5'
})

const extraBaseConfigLabel = computed(() => {
  if (basicInfo.value.host === 'tth5') return 'TT端基础配置'
  if (basicInfo.value.host === 'ksh5') return 'KS端基础配置'
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
      return baseConfig.value.app_name &&
             baseConfig.value.platform &&
             baseConfig.value.app_code &&
             baseConfig.value.product &&
             baseConfig.value.customer &&
             baseConfig.value.appid &&
             baseConfig.value.version &&
             baseConfig.value.cl &&
             (!needsExtraBaseConfig.value || (
               extraBaseConfig.value.app_name &&
               extraBaseConfig.value.platform &&
               extraBaseConfig.value.app_code &&
               extraBaseConfig.value.product &&
               extraBaseConfig.value.customer &&
               extraBaseConfig.value.appid &&
               extraBaseConfig.value.version &&
               extraBaseConfig.value.cl
             ))
    case 2:
      return commonConfig.value.script_base &&
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
  } catch (error) {
    console.error('Failed to fetch brands:', error)
  }
}

const onBrandChange = () => {
  // 当品牌改变时，可以预填充一些配置
const selectedBrand = brands.value.find(b => b.id === basicInfo.value.brandId)
// if (selectedBrand) {
//   baseConfig.value.app_code = selectedBrand.code
// }
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

    // 模拟进度更新
    updateProgressState(10, '', '验证数据...', { status: 'loading', message: '验证表单数据...' })
    await new Promise(resolve => setTimeout(resolve, 300))
    updateProgressState(20, '', '验证数据...', { status: 'success', message: '数据验证通过' })

    updateProgressState(30, '', '创建Client...', { status: 'loading', message: '创建Client...' })
    await new Promise(resolve => setTimeout(resolve, 400))
    updateProgressState(40, '', '创建Client...', { status: 'success', message: 'Client创建成功' })

    updateProgressState(45, '', '创建BaseConfig...', { status: 'loading', message: '创建BaseConfig...' })
    await new Promise(resolve => setTimeout(resolve, 500))
    updateProgressState(50, '', '创建BaseConfig...', { status: 'success', message: 'BaseConfig创建成功' })

    // 如果需要额外的BaseConfig
    if (needsExtraBaseConfig.value) {
      updateProgressState(52, '', '创建额外BaseConfig...', { status: 'loading', message: '创建额外BaseConfig...' })
      await new Promise(resolve => setTimeout(resolve, 400))
      updateProgressState(54, '', '创建额外BaseConfig...', { status: 'success', message: '额外BaseConfig创建成功' })
    }

    updateProgressState(needsExtraBaseConfig.value ? 55 : 60, '', '创建支付配置...', { status: 'loading', message: '创建PayConfig...' })
    await new Promise(resolve => setTimeout(resolve, 300))
    updateProgressState(needsExtraBaseConfig.value ? 55 : 60, '', '创建支付配置...', { status: 'success', message: 'PayConfig创建成功' })

    // 创建UIConfig
    updateProgressState(needsExtraBaseConfig.value ? 57 : 65, '', '创建UI配置...', { status: 'loading', message: '创建UIConfig...' })
    await new Promise(resolve => setTimeout(resolve, 600))
    updateProgressState(needsExtraBaseConfig.value ? 60 : 70, '', '创建UI配置...', { status: 'success', message: 'UIConfig创建成功' })

    // 创建小说特有配置（tth5端是必填的）
    if (basicInfo.value.host === 'tth5') {
      updateProgressState(needsExtraBaseConfig.value ? 62 : 72, '', '创建小说特有配置...', { status: 'loading', message: '创建小说特有配置...' })
      await new Promise(resolve => setTimeout(resolve, 400))
      updateProgressState(needsExtraBaseConfig.value ? 64 : 74, '', '创建小说特有配置...', { status: 'success', message: '小说特有配置创建成功' })
    }

    // 调用批量创建接口
    const hasNovelConfig = basicInfo.value.host === 'tth5'
    updateProgressState(needsExtraBaseConfig.value ? (hasNovelConfig ? 70 : 68) : (hasNovelConfig ? 80 : 78), '', '提交到后端...', { status: 'loading', message: '调用后端API...' })
    console.log('Sending request to backend:', requestData)
    const response = await websiteApi.createWebsite(requestData)
    console.log('Backend response:', response.data)
    updateProgressState(needsExtraBaseConfig.value ? (hasNovelConfig ? 75 : 73) : (hasNovelConfig ? 85 : 83), '', '更新项目配置...', { status: 'success', message: '后端API调用成功' })

    // 模拟项目配置文件更新进度
    updateProgressState(needsExtraBaseConfig.value ? (hasNovelConfig ? 77 : 75) : (hasNovelConfig ? 87 : 85), '', '更新项目配置...', { status: 'loading', message: '更新 _host.js 文件...' })
    await new Promise(resolve => setTimeout(resolve, 300))
    updateProgressState(needsExtraBaseConfig.value ? (hasNovelConfig ? 79 : 77) : (hasNovelConfig ? 89 : 87), '', '更新项目配置...', { status: 'success', message: '_host.js 文件更新成功' })

    updateProgressState(needsExtraBaseConfig.value ? (hasNovelConfig ? 81 : 79) : (hasNovelConfig ? 91 : 89), '', '更新项目配置...', { status: 'loading', message: '更新 index.js 文件...' })
    await new Promise(resolve => setTimeout(resolve, 300))
    updateProgressState(needsExtraBaseConfig.value ? (hasNovelConfig ? 83 : 81) : (hasNovelConfig ? 93 : 91), '', '更新项目配置...', { status: 'success', message: 'index.js 文件更新成功' })

    updateProgressState(needsExtraBaseConfig.value ? (hasNovelConfig ? 85 : 83) : (hasNovelConfig ? 95 : 93), '', '更新项目配置...', { status: 'loading', message: '更新 vite.config.js 文件...' })
    await new Promise(resolve => setTimeout(resolve, 300))
    updateProgressState(needsExtraBaseConfig.value ? (hasNovelConfig ? 87 : 85) : (hasNovelConfig ? 97 : 95), '', '更新项目配置...', { status: 'success', message: 'vite.config.js 文件更新成功' })

    updateProgressState(needsExtraBaseConfig.value ? (hasNovelConfig ? 89 : 87) : (hasNovelConfig ? 99 : 97), '', '更新项目配置...', { status: 'loading', message: '更新 package.json 文件...' })
    await new Promise(resolve => setTimeout(resolve, 300))
    updateProgressState(100, 'success', '网站创建完成！', { status: 'success', message: 'package.json 文件更新成功，所有配置完成' })

    ElMessage.success('网站创建成功！')

    // 延迟跳转，让用户看到完成状态
    setTimeout(() => {
      // 适配新的后端返回结构
      const responseData = response.data.data || response.data
      if (responseData?.client_id) {
        router.push(`/website-config/${responseData.client_id}`)
      } else {
        router.push('/website-configs')
      }
    }, 2000)

  } catch (error) {
    updateProgressState(0, 'exception', '创建失败', { status: 'error', message: '创建失败: ' + (error.response?.data?.error || error.message) })
    ElMessage.error('创建失败: ' + (error.response?.data?.error || error.message))
    console.error('Create website error:', error)
  } finally {
    isCreating.value = false
  }
}

// 生成抖音跳转首页URL
const onGenerateTTUrl = async () => {
  await generateTTUrl(extraBaseConfig.value, novelConfig.value, isGeneratingUrl)
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
  const sameChangeKeyArr = [ 'app_name', 'platform', 'product', 'uc' ]
  sameChangeKeyArr.forEach( item => {
    if (conf[item]) extraBaseConfig.value[item] = conf[item]
  })
  conf['cl'] = conf['app_code']
  if (conf['app_code']) {
    extraBaseConfig.value['app_code'] = conf['app_code'].replace('_h5_', '_miniapp_')
    extraBaseConfig.value['cl'] = extraBaseConfig.value['app_code']
  }
}, {
  deep: true
})

onMounted(() => {
  fetchBrands()
})
</script>

<style scoped>
.create-mini-app {
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
  font-size: 24px;
  font-weight: 600;
}

.page-subtitle {
  margin: 0;
  color: #909399;
  font-size: 14px;
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
  font-size: 12px;
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





/* 表单提示间距 */
.form-tip {
  font-size: 12px;
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
