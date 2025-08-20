<template>
  <div class="config-confirm-step">
    <div class="confirm-header">
      <h2 class="confirm-title">配置确认</h2>
      <p class="confirm-subtitle">请仔细检查以下配置信息，确认无误后点击"确认配置"继续</p>
    </div>

    <div class="config-sections">
      <!-- 基本信息 -->
      <div class="config-section">
        <div class="section-header">
          <el-icon class="section-icon"><User /></el-icon>
          <h3 class="section-title">基本信息</h3>
        </div>
        <div class="section-content">
          <div class="config-item">
            <span class="config-label">品牌：</span>
            <span class="config-value">{{ basicInfo.brandCode }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">端类型：</span>
            <span class="config-value">{{ getHostLabel(basicInfo.host) }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">业务类型：</span>
            <span class="config-value">{{ getBusinessTypeLabel(basicInfo.businessType) }}</span>
          </div>
        </div>
      </div>

      <!-- 基础配置 -->
      <div class="config-section">
        <div class="section-header">
          <el-icon class="section-icon"><Setting /></el-icon>
          <h3 class="section-title">基础配置</h3>
        </div>
        <div class="section-content">
          <div class="config-item">
            <span class="config-label">应用名称：</span>
            <span class="config-value">{{ baseConfig.app_name }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">平台：</span>
            <span class="config-value">{{ baseConfig.platform }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">应用代码：</span>
            <span class="config-value">{{ baseConfig.app_code }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">产品：</span>
            <span class="config-value">{{ baseConfig.product }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">客户：</span>
            <span class="config-value">{{ baseConfig.customer }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">应用ID：</span>
            <span class="config-value">{{ baseConfig.appid }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">版本：</span>
            <span class="config-value">{{ baseConfig.version }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">CL：</span>
            <span class="config-value">{{ baseConfig.cl }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">UC：</span>
            <span class="config-value">{{ baseConfig.uc }}</span>
          </div>
        </div>
      </div>

      <!-- 额外基础配置 -->
      <div v-if="extraBaseConfig && needsExtraBaseConfig" class="config-section">
        <div class="section-header">
          <el-icon class="section-icon"><Platform /></el-icon>
          <h3 class="section-title">{{ extraBaseConfigLabel }}</h3>
        </div>
        <div class="section-content">
          <div class="config-item">
            <span class="config-label">应用名称：</span>
            <span class="config-value">{{ extraBaseConfig.app_name }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">平台：</span>
            <span class="config-value">{{ extraBaseConfig.platform }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">应用代码：</span>
            <span class="config-value">{{ extraBaseConfig.app_code }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">产品：</span>
            <span class="config-value">{{ extraBaseConfig.product }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">客户：</span>
            <span class="config-value">{{ extraBaseConfig.customer }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">应用ID：</span>
            <span class="config-value">{{ extraBaseConfig.appid }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">版本：</span>
            <span class="config-value">{{ extraBaseConfig.version }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">CL：</span>
            <span class="config-value">{{ extraBaseConfig.cl }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">UC：</span>
            <span class="config-value">{{ extraBaseConfig.uc }}</span>
          </div>
        </div>
      </div>

      <!-- 通用配置 -->
      <div class="config-section">
        <div class="section-header">
          <el-icon class="section-icon"><Tools /></el-icon>
          <h3 class="section-title">通用配置</h3>
        </div>
        <div class="section-content">
          <div class="config-item">
            <span class="config-label">业务ID开关：</span>
            <span class="config-value">
              <el-tag :type="commonConfig.deliver_business_id_enable ? 'success' : 'info'">
                {{ commonConfig.deliver_business_id_enable ? '启用' : '禁用' }}
              </el-tag>
            </span>
          </div>
          <div v-if="commonConfig.deliver_business_id_enable" class="config-item">
            <span class="config-label">业务ID：</span>
            <span class="config-value">{{ commonConfig.deliver_business_id }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">开关ID开关：</span>
            <span class="config-value">
              <el-tag :type="commonConfig.deliver_switch_id_enable ? 'success' : 'info'">
                {{ commonConfig.deliver_switch_id_enable ? '启用' : '禁用' }}
              </el-tag>
            </span>
          </div>
          <div v-if="commonConfig.deliver_switch_id_enable" class="config-item">
            <span class="config-label">开关ID：</span>
            <span class="config-value">{{ commonConfig.deliver_switch_id }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">协议公司：</span>
            <span class="config-value">{{ commonConfig.protocol_company }}</span>
          </div>
          <div v-if="basicInfo.businessType !== 'novel' && commonConfig.protocol_about" class="config-item">
            <span class="config-label">用户协议：</span>
            <span class="config-value">{{ commonConfig.protocol_about }}</span>
          </div>
          <div v-if="basicInfo.businessType !== 'novel' && commonConfig.protocol_privacy" class="config-item">
            <span class="config-label">隐私协议：</span>
            <span class="config-value">{{ commonConfig.protocol_privacy }}</span>
          </div>
          <div v-if="basicInfo.businessType !== 'novel' && commonConfig.protocol_vod" class="config-item">
            <span class="config-label">付费协议：</span>
            <span class="config-value">{{ commonConfig.protocol_vod }}</span>
          </div>
          <div v-if="basicInfo.businessType !== 'novel' && commonConfig.protocol_user_cancel" class="config-item">
            <span class="config-label">用户取消协议：</span>
            <span class="config-value">{{ commonConfig.protocol_user_cancel }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">联系客服URL：</span>
            <span class="config-value">{{ commonConfig.contact_url }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">部署目录URL：</span>
            <span class="config-value">{{ commonConfig.script_base }}</span>
          </div>
        </div>
      </div>

      <!-- 支付配置 -->
      <div class="config-section">
        <div class="section-header">
          <el-icon class="section-icon"><Money /></el-icon>
          <h3 class="section-title">支付配置</h3>
        </div>
        <div class="section-content">
          <div class="config-item">
            <span class="config-label">普通支付：</span>
            <span class="config-value">
              <el-tag :type="payConfig.normal_pay_enable ? 'success' : 'info'">
                {{ payConfig.normal_pay_enable ? '启用' : '禁用' }}
              </el-tag>
            </span>
          </div>
          <div v-if="payConfig.normal_pay_enable" class="config-item">
            <span class="config-label">Android网关：</span>
            <span class="config-value">{{ payConfig.normal_pay_gateway_android }}</span>
          </div>
          <div v-if="payConfig.normal_pay_enable" class="config-item">
            <span class="config-label">iOS网关：</span>
            <span class="config-value">{{ payConfig.normal_pay_gateway_ios }}</span>
          </div>
          <div class="config-item">
            <span class="config-label">续费支付：</span>
            <span class="config-value">
              <el-tag :type="payConfig.renew_pay_enable ? 'success' : 'info'">
                {{ payConfig.renew_pay_enable ? '启用' : '禁用' }}
              </el-tag>
            </span>
          </div>
          <div v-if="payConfig.renew_pay_enable" class="config-item">
            <span class="config-label">Android网关：</span>
            <span class="config-value">{{ payConfig.renew_pay_gateway_android }}</span>
          </div>
          <div v-if="payConfig.renew_pay_enable" class="config-item">
            <span class="config-label">iOS网关：</span>
            <span class="config-value">{{ payConfig.renew_pay_gateway_ios }}</span>
          </div>
        </div>
      </div>

      <!-- UI配置 -->
      <div class="config-section">
        <div class="section-header">
          <el-icon class="section-icon"><Brush /></el-icon>
          <h3 class="section-title">UI配置</h3>
        </div>
        <div class="section-content">
          <div class="config-item">
            <span class="config-label">主背景色：</span>
            <span class="config-value">
              <div class="color-preview" :style="{ backgroundColor: uiConfig.theme_bg_main }"></div>
              <span>{{ uiConfig.theme_bg_main }}</span>
            </span>
          </div>
          <div class="config-item">
            <span class="config-label">次背景色：</span>
            <span class="config-value">
              <div class="color-preview" :style="{ backgroundColor: uiConfig.theme_bg_second }"></div>
              <span>{{ uiConfig.theme_bg_second }}</span>
            </span>
          </div>
          <div class="config-item">
            <span class="config-label">主文字色：</span>
            <span class="config-value">
              <div class="color-preview" :style="{ backgroundColor: uiConfig.theme_text_main }"></div>
              <span>{{ uiConfig.theme_text_main }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- 小说特有配置 -->
      <div v-if="basicInfo.host === 'tth5' || basicInfo.host === 'ksh5'" class="config-section">
        <div class="section-header">
          <el-icon class="section-icon"><Document /></el-icon>
          <h3 class="section-title">小说特有配置</h3>
        </div>
        <div class="section-content">
          <div v-if="basicInfo.host === 'tth5'" class="config-item">
            <span class="config-label">抖音跳转首页URL：</span>
            <span class="config-value">{{ novelConfig.tt_jump_home_url }}</span>
          </div>
          <div v-if="basicInfo.host === 'tth5'" class="config-item">
            <span class="config-label">抖音登录回调域名：</span>
            <span class="config-value">{{ novelConfig.tt_login_callback_domain }}</span>
          </div>
          <div v-if="basicInfo.host === 'ksh5'" class="config-item">
            <span class="config-label">快手端配置：</span>
            <span class="config-value">
              <el-tag type="info">快手端暂无特殊配置</el-tag>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="confirm-actions">
      <el-button @click="$emit('prev-step')" class="action-btn prev-btn">
        <el-icon><ArrowLeft /></el-icon>
        返回修改
      </el-button>
      <el-button type="primary" @click="$emit('confirm-config')" class="action-btn confirm-btn">
        <el-icon><Check /></el-icon>
        确认配置
      </el-button>
    </div>
  </div>
</template>

<script setup>
import {
  User,
  Setting,
  Platform,
  Tools,
  Money,
  Brush,
  Document,
  ArrowLeft,
  Check
} from '@element-plus/icons-vue'

const props = defineProps({
  basicInfo: {
    type: Object,
    required: true
  },
  baseConfig: {
    type: Object,
    required: true
  },
  extraBaseConfig: {
    type: Object,
    required: true
  },
  commonConfig: {
    type: Object,
    required: true
  },
  payConfig: {
    type: Object,
    required: true
  },
  uiConfig: {
    type: Object,
    required: true
  },
  novelConfig: {
    type: Object,
    required: true
  },
  brands: {
    type: Array,
    required: true
  },
  needsExtraBaseConfig: {
    type: Boolean,
    required: true
  },
  extraBaseConfigLabel: {
    type: String,
    required: true
  }
})

defineEmits(['prev-step', 'confirm-config'])

// 获取端类型标签
const getHostLabel = (host) => {
  const hostMap = {
    'h5': 'H5',
    'tth5': '抖音H5',
    'ksh5': '快手H5'
  }
  return hostMap[host] || host
}

// 获取业务类型标签
const getBusinessTypeLabel = (businessType) => {
  const businessTypeMap = {
    'novel': '小说',
    'game': '游戏',
    'other': '其他'
  }
  return businessTypeMap[businessType] || businessType
}
</script>

<style scoped>
.config-confirm-step {
  padding: 20px 0;
}

.confirm-header {
  text-align: center;
  margin-bottom: 30px;
}

.confirm-title {
  margin: 0 0 10px 0;
  color: #409eff;
  font-size: 28px;
  font-weight: 600;
}

.confirm-subtitle {
  margin: 0;
  color: #909399;
  font-size: 18px;
}

.config-sections {
  column-count: 3;
  /* column-gap: 40px;
  max-width: 1000px; */
  margin: 0 auto;
}

.config-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e9ecef;
  min-height: fit-content;
  break-inside: avoid;
  margin-bottom: 20px;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #409eff;
}

.section-icon {
  font-size: 20px;
  color: #409eff;
}

.section-title {
  margin: 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.config-label {
  min-width: 140px;
  color: #606266;
  font-size: 16px;
  font-weight: 500;
}

.config-value {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #303133;
  font-size: 16px;
  flex: 1;
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid #dcdfe6;
}

.confirm-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  padding: 12px 24px;
}

.prev-btn .el-icon {
  font-size: 18px;
}

.confirm-btn .el-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .config-sections {
    column-count: 2;
    max-width: 720px;
  }
}

@media (max-width: 768px) {
  .config-sections {
    column-count: 1;
    max-width: 400px;
  }

  .config-section {
    padding: 16px;
  }

  .section-title {
    font-size: 18px;
  }

  .config-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .config-label {
    min-width: auto;
    font-size: 14px;
  }

  .config-value {
    font-size: 14px;
  }

  .confirm-actions {
    flex-direction: column;
    gap: 12px;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
