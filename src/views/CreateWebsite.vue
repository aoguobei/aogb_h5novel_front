<template>
  <div class="create-mini-app">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>创建网站</h2>
          <el-steps :active="currentStep" finish-status="success" simple>
            <el-step title="基本信息" />
            <el-step title="基础配置" />
            <el-step title="通用配置" />
            <el-step title="支付配置" />
            <el-step title="UI配置" />
            <el-step title="小说特有配置" />
            <el-step title="生成文件" />
          </el-steps>
        </div>
      </template>

      <!-- 步骤1: 基本信息 -->
      <div v-if="currentStep === 0" class="step-content">
        <h3>第一步：选择品牌和端类型</h3>
        <el-form :model="basicInfo" label-width="120px">
          <el-form-item label="品牌">
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
          <el-form-item label="端类型">
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
      </div>

      <!-- 步骤2: 基础配置 -->
      <div v-if="currentStep === 1" class="step-content">
        <h3>第二步：基础配置</h3>

        <!-- 主基础配置 -->
        <el-divider content-position="left">{{ basicInfo.host.toUpperCase() }}端基础配置</el-divider>
        <el-form :model="baseConfig" label-width="120px">
          <el-form-item label="应用名称">
            <el-input v-model="baseConfig.app_name" placeholder="输入app_name" />
          </el-form-item>
          <el-form-item label="平台">
            <el-input v-model="baseConfig.platform" placeholder="输入platform" />
          </el-form-item>

          <el-form-item label="app_code">
            <el-input v-model="baseConfig.app_code" placeholder="输入app_code" />
          </el-form-item>
          <el-form-item label="产品">
            <el-input v-model="baseConfig.product" placeholder="输入product" />
          </el-form-item>
          <el-form-item label="customer">
            <el-input v-model="baseConfig.customer" placeholder="输入customer" />
          </el-form-item>
          <el-form-item label="应用ID">
            <el-input v-model="baseConfig.appid" placeholder="输入appid" />
          </el-form-item>
          <el-form-item label="版本">
            <el-input v-model="baseConfig.version" placeholder="输入version" />
          </el-form-item>
          <el-form-item label="cl">
            <el-input v-model="baseConfig.cl" placeholder="输入cl" />
          </el-form-item>
          <el-form-item label="uc">
            <el-input v-model="baseConfig.uc" placeholder="输入uc" />
          </el-form-item>
        </el-form>

        <!-- 额外的基础配置（tth5 需要 tt，ksh5 需要 ks） -->
        <div v-if="needsExtraBaseConfig">
          <el-divider content-position="left">{{ extraBaseConfigLabel }}</el-divider>
          <el-form :model="extraBaseConfig" label-width="120px">
            <el-form-item label="应用名称">
              <el-input v-model="extraBaseConfig.app_name" placeholder="输入app_name" />
            </el-form-item>
            <el-form-item label="平台">
              <el-input v-model="extraBaseConfig.platform" placeholder="输入platform" />
            </el-form-item>

            <el-form-item label="app_code">
              <el-input v-model="extraBaseConfig.app_code" placeholder="输入app_code" />
            </el-form-item>
            <el-form-item label="产品">
              <el-input v-model="extraBaseConfig.product" placeholder="输入product" />
            </el-form-item>
            <el-form-item label="customer">
              <el-input v-model="extraBaseConfig.customer" placeholder="输入customer" />
            </el-form-item>
            <el-form-item label="应用ID">
              <el-input v-model="extraBaseConfig.appid" placeholder="输入appid" />
            </el-form-item>
            <el-form-item label="版本">
              <el-input v-model="extraBaseConfig.version" placeholder="输入version" />
            </el-form-item>
            <el-form-item label="cl">
              <el-input v-model="extraBaseConfig.cl" placeholder="输入cl" />
            </el-form-item>
            <el-form-item label="uc">
              <el-input v-model="extraBaseConfig.uc" placeholder="输入uc" />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 步骤3: 通用配置 -->
      <div v-if="currentStep === 2" class="step-content">
        <h3>第三步：通用配置</h3>
        <el-form :model="commonConfig" label-width="150px">
          <el-divider content-position="left">Deliver 配置</el-divider>
          <el-form-item label="启用 Business ID">
            <el-switch v-model="commonConfig.deliver_business_id_enable" />
          </el-form-item>
          <el-form-item label="Deliver Business ID" v-if="commonConfig.deliver_business_id_enable">
            <el-input v-model="commonConfig.deliver_business_id" />
          </el-form-item>
          <el-form-item label="启用 Switch ID">
            <el-switch v-model="commonConfig.deliver_switch_id_enable" />
          </el-form-item>
          <el-form-item label="Deliver Switch ID" v-if="commonConfig.deliver_switch_id_enable">
            <el-input v-model="commonConfig.deliver_switch_id" />
          </el-form-item>

          <el-divider content-position="left">协议配置</el-divider>
          <el-form-item label="公司名称">
            <el-input v-model="commonConfig.protocol_company" />
          </el-form-item>
          <el-form-item label="用户协议">
            <el-input v-model="commonConfig.protocol_about" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="隐私协议">
            <el-input v-model="commonConfig.protocol_privacy" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="付费协议">
            <el-input v-model="commonConfig.protocol_vod" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="用户取消协议">
            <el-input v-model="commonConfig.protocol_user_cancel" type="textarea" :rows="3" />
          </el-form-item>

          <el-divider content-position="left">其他配置</el-divider>
          <el-form-item label="联系客服URL">
            <el-input v-model="commonConfig.contact_url" type="textarea" />
          </el-form-item>
          <el-form-item label="部署目录url">
            <el-input v-model="commonConfig.script_base" placeholder="/tt/xingchen/" />
          </el-form-item>
        </el-form>
      </div>

      <!-- 步骤4: 支付配置 -->
      <div v-if="currentStep === 3" class="step-content">
        <h3>第四步：支付配置</h3>
        <el-form :model="payConfig" label-width="150px">
          <el-divider content-position="left">普通支付</el-divider>
          <el-form-item label="启用普通支付">
            <el-switch v-model="payConfig.normal_pay_enable" />
          </el-form-item>
          <el-form-item label="Android网关ID" v-if="payConfig.normal_pay_enable">
            <el-input-number v-model="payConfig.normal_pay_gateway_android" :min="0" />
          </el-form-item>
          <el-form-item label="iOS网关ID" v-if="payConfig.normal_pay_enable">
            <el-input-number v-model="payConfig.normal_pay_gateway_ios" :min="0" />
          </el-form-item>

          <el-divider content-position="left">连包支付</el-divider>
          <el-form-item label="启用连包支付">
            <el-switch v-model="payConfig.renew_pay_enable" />
          </el-form-item>
          <el-form-item label="Android网关ID" v-if="payConfig.renew_pay_enable">
            <el-input-number v-model="payConfig.renew_pay_gateway_android" :min="0" />
          </el-form-item>
          <el-form-item label="iOS网关ID" v-if="payConfig.renew_pay_enable">
            <el-input-number v-model="payConfig.renew_pay_gateway_ios" :min="0" />
          </el-form-item>
        </el-form>
      </div>

      <!-- 步骤5: UI配置 -->
      <div v-if="currentStep === 4" class="step-content">
        <h3>第五步：UI配置</h3>
        <el-form :model="uiConfig" label-width="120px">
          <el-form-item label="主背景色">
            <el-color-picker v-model="uiConfig.theme_bg_main" :show-alpha="false" />
            <el-input
              v-model="uiConfig.theme_bg_main"
              style="margin-left: 10px;"
              placeholder="输入主背景色（16进制）"
              @input="(value) => handleColorInput('theme_bg_main', value)"
            />
          </el-form-item>
          <el-form-item label="次背景色">
            <el-color-picker v-model="uiConfig.theme_bg_second" :show-alpha="true" />
            <el-input
              v-model="uiConfig.theme_bg_second"
              style="margin-left: 10px;"
              placeholder="输入次背景色（支持rgba格式）"
              @input="(value) => handleColorInput('theme_bg_second', value)"
            />
          </el-form-item>
          <el-form-item label="主文字色">
            <el-color-picker v-model="uiConfig.theme_text_main" :show-alpha="true" />
            <el-input
              v-model="uiConfig.theme_text_main"
              style="margin-left: 10px;"
              placeholder="输入主文字色（支持rgba格式）"
              @input="(value) => handleColorInput('theme_text_main', value)"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 步骤6: 小说配置 -->
      <div v-if="currentStep === 5" class="step-content">
        <h3>第六步：小说特有配置（可选）</h3>
        <p class="step-description">
          这些配置将存储到数据库中，并写入本地文件。如果不需要可以跳过。
        </p>

        <div v-if="basicInfo.host === 'tth5'">
          <el-form :model="novelConfig" label-width="120px">
            <el-form-item label="TT跳转首页URL">
              <el-input
                v-model="novelConfig.tt_jump_home_url"
                placeholder="例如：sslocal://miniapp?ticket=v1_3532788994"
                clearable
              >
                <template #append>
                  <el-button @click="generateTTUrl" :loading="isGeneratingUrl">
                    生成URL
                  </el-button>
                </template>
              </el-input>
              <span class="form-tip">头条小程序跳转首页的URL</span>
            </el-form-item>

            <el-form-item label="TT登录回调域名">
              <el-input
                v-model="novelConfig.tt_login_callback_domain"
                placeholder="例如：novetest.fun.tv"
                clearable
              />
              <span class="form-tip">头条登录回调的域名</span>
            </el-form-item>
          </el-form>
        </div>

        <div v-else class="step-description">
          <div></div>
          <el-empty description="当前端类型不支持小说特有配置" />
        </div>
      </div>

      <!-- 步骤7: 生成文件 -->
      <div v-if="currentStep === 6" class="step-content">
        <h3>第七步：生成文件</h3>
        <div class="progress-section">
          <el-progress
            :percentage="progressPercentage"
            :status="progressStatus"
            :stroke-width="20"
          />
          <div class="progress-text">{{ progressText }}</div>
          <div class="progress-details" v-if="progressDetails.length > 0">
            <div v-for="(detail, index) in progressDetails" :key="index" class="progress-detail">
              <el-icon v-if="detail.status === 'success'" color="#67C23A"><CircleCheck /></el-icon>
              <el-icon v-else-if="detail.status === 'error'" color="#F56C6C"><CircleClose /></el-icon>
              <el-icon v-else color="#E6A23C"><Loading /></el-icon>
              <span>{{ detail.message }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="step-actions">
        <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
        <el-button
          v-if="currentStep < 6"
          type="primary"
          @click="nextStep"
          :disabled="!canProceed"
        >
          下一步
        </el-button>
        <el-button
          v-if="currentStep === 6"
          type="success"
          @click="createWebsite"
          :loading="isCreating"
          :disabled="isCreating"
        >
          开始创建网站 (当前步骤: {{ currentStep }})
        </el-button>
      </div>
    </el-card>

    <!-- 创建品牌对话框 -->
    <el-dialog v-model="showCreateBrandDialog" title="创建新品牌" width="400px">
      <el-form :model="newBrand" label-width="80px">
        <el-form-item label="品牌代码">
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
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheck, CircleClose, Loading } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { brandApi } from '@/api/brand'
import { websiteApi } from '@/api/website'

const router = useRouter()

// 步骤控制
const currentStep = ref(0)
const isCreating = ref(false)
const progressPercentage = ref(0)
const progressStatus = ref('')
const progressText = ref('准备创建...')
const progressDetails = ref([])

// 数据
const brands = ref([])
const showCreateBrandDialog = ref(false)
const newBrand = ref({ code: '' })

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
  theme_text_main: '#FF542B'
})

// 小说特有配置
const novelConfig = ref({
  tt_jump_home_url: '',
  tt_login_callback_domain: ''
})

// 生成URL状态
const isGeneratingUrl = ref(false)

// 颜色格式验证函数
const validateColor = (color) => {
  if (!color) return true
  // 支持16进制格式：3位、6位、8位（带alpha通道）
  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/
  // 支持rgba格式
  const rgbaRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/
  const isValid = hexRegex.test(color) || rgbaRegex.test(color)
  console.log(`验证颜色: ${color}, 结果: ${isValid}`)
  return isValid
}

// 颜色输入处理函数
const handleColorInput = (field, value) => {
  // 主背景色只允许16进制格式
  if (field === 'theme_bg_main' && value && value.startsWith('rgba')) {
    // 如果是rgba格式，转换为16进制
    const rgbaMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, '0')
      const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, '0')
      const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, '0')
      uiConfig.value[field] = `#${r}${g}${b}`
    }
  } else {
    // 次背景色和主文字色允许rgba格式
    uiConfig.value[field] = value
  }
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
      { label: '头条H5', value: 'tth5' },
      { label: '快手H5', value: 'ksh5' }
    ]
  }

  // 获取该品牌已有的host列表
  const existingHosts = selectedBrand.value.clients?.map(client => client.host) || []

  // 所有可选的host
  const allHosts = [
    { label: 'H5', value: 'h5' },
    { label: '头条H5', value: 'tth5' },
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
             baseConfig.value.uc &&
             (!needsExtraBaseConfig.value || (
               extraBaseConfig.value.app_name &&
               extraBaseConfig.value.platform &&
               extraBaseConfig.value.app_code &&
               extraBaseConfig.value.product &&
               extraBaseConfig.value.customer &&
               extraBaseConfig.value.appid &&
               extraBaseConfig.value.version &&
               extraBaseConfig.value.cl &&
               extraBaseConfig.value.uc
             ))
    case 2:
      return commonConfig.value.script_base
    case 3:
      return true // 支付配置都是可选的
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
      return basicInfo.value.host === 'tth5' ? true : true // 小说特有配置是可选的，只有tth5才显示表单
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

const createBrand = async () => {
  try {
    const response = await brandApi.createBrand({ code: newBrand.value.code })
    // 统一适配包装结构
    if (response && response.success) {
      ElMessage.success('品牌创建成功')
      showCreateBrandDialog.value = false
      newBrand.value.code = ''
      await fetchBrands()
    } else {
      ElMessage.error('品牌创建失败')
    }
  } catch (error) {
    ElMessage.error('品牌创建失败')
    console.error(error)
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

const updateProgress = (percentage, status, text, detail = null) => {
  progressPercentage.value = percentage
  progressStatus.value = status
  progressText.value = text

  if (detail) {
    progressDetails.value.push(detail)
  }
}

const resetProgress = () => {
  progressPercentage.value = 0
  progressStatus.value = ''
  progressText.value = '准备创建...'
  progressDetails.value = []
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
  resetProgress()

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

    // 如果用户填写了小说配置，添加到请求中
    if (basicInfo.value.host === 'tth5' && (novelConfig.value.tt_jump_home_url || novelConfig.value.tt_login_callback_domain)) {
      requestData.novel_config = novelConfig.value
    }

    // 模拟进度更新
    updateProgress(10, '', '验证数据...', { status: 'loading', message: '验证表单数据...' })
    await new Promise(resolve => setTimeout(resolve, 300))
    updateProgress(20, '', '验证数据...', { status: 'success', message: '数据验证通过' })

    updateProgress(30, '', '创建Client...', { status: 'loading', message: '创建Client...' })
    await new Promise(resolve => setTimeout(resolve, 400))
    updateProgress(40, '', '创建Client...', { status: 'success', message: 'Client创建成功' })

    updateProgress(45, '', '创建BaseConfig...', { status: 'loading', message: '创建BaseConfig...' })
    await new Promise(resolve => setTimeout(resolve, 500))
    updateProgress(50, '', '创建BaseConfig...', { status: 'success', message: 'BaseConfig创建成功' })

    // 如果需要额外的BaseConfig
    if (needsExtraBaseConfig.value) {
      updateProgress(52, '', '创建额外BaseConfig...', { status: 'loading', message: '创建额外BaseConfig...' })
      await new Promise(resolve => setTimeout(resolve, 400))
      updateProgress(54, '', '创建额外BaseConfig...', { status: 'success', message: '额外BaseConfig创建成功' })
    }

    updateProgress(needsExtraBaseConfig.value ? 55 : 60, '', '创建支付配置...', { status: 'loading', message: '创建PayConfig...' })
    await new Promise(resolve => setTimeout(resolve, 300))
    updateProgress(needsExtraBaseConfig.value ? 55 : 60, '', '创建支付配置...', { status: 'success', message: 'PayConfig创建成功' })

    // 创建UIConfig
    updateProgress(needsExtraBaseConfig.value ? 57 : 65, '', '创建UI配置...', { status: 'loading', message: '创建UIConfig...' })
    await new Promise(resolve => setTimeout(resolve, 600))
    updateProgress(needsExtraBaseConfig.value ? 60 : 70, '', '创建UI配置...', { status: 'success', message: 'UIConfig创建成功' })

    // 创建小说特有配置（如果有）
    if (basicInfo.value.host === 'tth5' && (novelConfig.value.tt_jump_home_url || novelConfig.value.tt_login_callback_domain)) {
      updateProgress(needsExtraBaseConfig.value ? 62 : 72, '', '创建小说特有配置...', { status: 'loading', message: '创建小说特有配置...' })
      await new Promise(resolve => setTimeout(resolve, 400))
      updateProgress(needsExtraBaseConfig.value ? 64 : 74, '', '创建小说特有配置...', { status: 'success', message: '小说特有配置创建成功' })
    }

    // 调用批量创建接口
    const hasNovelConfig = basicInfo.value.host === 'tth5' && (novelConfig.value.tt_jump_home_url || novelConfig.value.tt_login_callback_domain)
    updateProgress(needsExtraBaseConfig.value ? (hasNovelConfig ? 70 : 68) : (hasNovelConfig ? 80 : 78), '', '提交到后端...', { status: 'loading', message: '调用后端API...' })
    console.log('Sending request to backend:', requestData)
    const response = await websiteApi.createWebsite(requestData)
    console.log('Backend response:', response.data)
    updateProgress(needsExtraBaseConfig.value ? (hasNovelConfig ? 75 : 73) : (hasNovelConfig ? 85 : 83), '', '更新项目配置...', { status: 'success', message: '后端API调用成功' })

    // 模拟项目配置文件更新进度
    updateProgress(needsExtraBaseConfig.value ? (hasNovelConfig ? 77 : 75) : (hasNovelConfig ? 87 : 85), '', '更新项目配置...', { status: 'loading', message: '更新 _host.js 文件...' })
    await new Promise(resolve => setTimeout(resolve, 300))
    updateProgress(needsExtraBaseConfig.value ? (hasNovelConfig ? 79 : 77) : (hasNovelConfig ? 89 : 87), '', '更新项目配置...', { status: 'success', message: '_host.js 文件更新成功' })

    updateProgress(needsExtraBaseConfig.value ? (hasNovelConfig ? 81 : 79) : (hasNovelConfig ? 91 : 89), '', '更新项目配置...', { status: 'loading', message: '更新 index.js 文件...' })
    await new Promise(resolve => setTimeout(resolve, 300))
    updateProgress(needsExtraBaseConfig.value ? (hasNovelConfig ? 83 : 81) : (hasNovelConfig ? 93 : 91), '', '更新项目配置...', { status: 'success', message: 'index.js 文件更新成功' })

    updateProgress(needsExtraBaseConfig.value ? (hasNovelConfig ? 85 : 83) : (hasNovelConfig ? 95 : 93), '', '更新项目配置...', { status: 'loading', message: '更新 vite.config.js 文件...' })
    await new Promise(resolve => setTimeout(resolve, 300))
    updateProgress(needsExtraBaseConfig.value ? (hasNovelConfig ? 87 : 85) : (hasNovelConfig ? 97 : 95), '', '更新项目配置...', { status: 'success', message: 'vite.config.js 文件更新成功' })

    updateProgress(needsExtraBaseConfig.value ? (hasNovelConfig ? 89 : 87) : (hasNovelConfig ? 99 : 97), '', '更新项目配置...', { status: 'loading', message: '更新 package.json 文件...' })
    await new Promise(resolve => setTimeout(resolve, 300))
    updateProgress(100, 'success', '网站创建完成！', { status: 'success', message: 'package.json 文件更新成功，所有配置完成' })

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
    updateProgress(0, 'exception', '创建失败', { status: 'error', message: '创建失败: ' + (error.response?.data?.error || error.message) })
    ElMessage.error('创建失败: ' + (error.response?.data?.error || error.message))
    console.error('Create website error:', error)
  } finally {
    isCreating.value = false
  }
}

// 生成头条跳转首页URL
const generateTTUrl = async () => {
  isGeneratingUrl.value = true

  try {
    // 构建请求参数
    const requestParam = {
      business: extraBaseConfig.value.cl, // 使用基础配置中的cl作为business
      path: 'pages/homePage/homePage',
      query: JSON.stringify({})
    }

    // 设置请求头
    const header = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    // 发送POST请求
    const response = await fetch('https://paps.funshion.com/v1/applet/createschema', {
      method: 'POST',
      headers: header,
      body: new URLSearchParams(requestParam)
    })

    const result = await response.json()

    if (result.data && result.data.schema) {
      novelConfig.value.tt_jump_home_url = result.data.schema
      ElMessage.success('头条跳转首页URL生成成功！')
    } else {
      ElMessage.error('生成URL失败：' + (result.message || '未知错误'))
    }
  } catch (error) {
    console.error('生成URL失败:', error)
    ElMessage.error('生成URL失败：网络错误')
  } finally {
    isGeneratingUrl.value = false
  }
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
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
}

.step-content {
  margin: 20px 0;
  min-height: 400px;
}

.step-content h3 {
  margin-bottom: 20px;
  color: #409eff;
}

.step-description {
  font-size: 14px;
  color: #909399;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.progress-section {
  text-align: center;
  padding: 40px 0;
}

.progress-text {
  margin-top: 20px;
  font-size: 16px;
  color: #606266;
}

.progress-details {
  margin-top: 20px;
  text-align: left;
  max-height: 200px;
  overflow-y: auto;
}

.progress-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.progress-detail span {
  font-size: 14px;
  color: #606266;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
</style>
