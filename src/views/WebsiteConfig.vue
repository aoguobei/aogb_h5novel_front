<template>
  <div class="website-config">
    <div class="header">
      <el-button @click="$router.go(-1)" icon="ArrowLeft">Back</el-button>
      <h2>网站配置详情</h2>
    </div>

    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
      <p>加载配置中...</p>
    </div>

    <div v-else-if="!config" class="error-container">
      <el-empty description="配置未找到" />
    </div>

    <div v-else class="config-content">
      <!-- 基本信息 -->
      <el-card class="info-card">
        <template #header>
          <span>基本信息</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="品牌代码">{{ config.client.brand.code }}</el-descriptions-item>
          <el-descriptions-item label="端类型">{{ config.client.host }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(config.client.created_at) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatDate(config.client.updated_at) }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 基础配置 -->
      <el-card class="config-card" v-if="config.base_config">
        <template #header>
          <span>基础配置</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="应用名称">{{ config.base_config.app_name }}</el-descriptions-item>
          <el-descriptions-item label="平台">{{ config.base_config.platform }}</el-descriptions-item>
          <el-descriptions-item label="应用代码">{{ config.base_config.app_code }}</el-descriptions-item>
          <el-descriptions-item label="产品">{{ config.base_config.product }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ config.base_config.customer }}</el-descriptions-item>
          <el-descriptions-item label="应用ID">{{ config.base_config.appid }}</el-descriptions-item>
          <el-descriptions-item label="版本">{{ config.base_config.version }}</el-descriptions-item>
          <el-descriptions-item label="渠道代码">{{ config.base_config.cl }}</el-descriptions-item>
          <el-descriptions-item label="UC代码">{{ config.base_config.uc }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 通用配置 -->
      <el-card class="config-card" v-if="config.common_config">
        <template #header>
          <span>通用配置</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="启用Business ID">
            <el-tag :type="config.common_config.deliver_business_id_enable ? 'success' : 'info'">
              {{ config.common_config.deliver_business_id_enable ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Business ID">{{ config.common_config.deliver_business_id || '-' }}</el-descriptions-item>
          <el-descriptions-item label="启用Switch ID">
            <el-tag :type="config.common_config.deliver_switch_id_enable ? 'success' : 'info'">
              {{ config.common_config.deliver_switch_id_enable ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Switch ID">{{ config.common_config.deliver_switch_id || '-' }}</el-descriptions-item>
          <el-descriptions-item label="协议公司">{{ config.common_config.protocol_company || '-' }}</el-descriptions-item>
          <el-descriptions-item label="脚本基础">{{ config.common_config.script_base || '-' }}</el-descriptions-item>
          <el-descriptions-item label="联系URL" :span="2">
            <el-link v-if="config.common_config.contact_url" :href="config.common_config.contact_url" target="_blank" type="primary">
              {{ config.common_config.contact_url }}
            </el-link>
            <span v-else>-</span>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 协议内容 -->
        <el-divider content-position="left">协议内容</el-divider>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="用户协议">
            <div class="text-content">{{ config.common_config.protocol_about || '-' }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="隐私协议">
            <div class="text-content">{{ config.common_config.protocol_privacy || '-' }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="付费协议">
            <div class="text-content">{{ config.common_config.protocol_vod || '-' }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="用户取消协议">
            <div class="text-content">{{ config.common_config.protocol_user_cancel || '-' }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 支付配置 -->
      <el-card class="config-card" v-if="config.pay_config">
        <template #header>
          <span>支付配置</span>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="启用普通支付">
            <el-tag :type="config.pay_config.normal_pay_enable ? 'success' : 'info'">
              {{ config.pay_config.normal_pay_enable ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Android网关ID">{{ config.pay_config.normal_pay_gateway_android || '-' }}</el-descriptions-item>
          <el-descriptions-item label="iOS网关ID">{{ config.pay_config.normal_pay_gateway_ios || '-' }}</el-descriptions-item>
          <el-descriptions-item label="启用连包支付">
            <el-tag :type="config.pay_config.renew_pay_enable ? 'success' : 'info'">
              {{ config.pay_config.renew_pay_enable ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="续费Android网关ID">{{ config.pay_config.renew_pay_gateway_android || '-' }}</el-descriptions-item>
          <el-descriptions-item label="续费iOS网关ID">{{ config.pay_config.renew_pay_gateway_ios || '-' }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- UI配置 -->
      <el-card class="config-card" v-if="config.ui_config">
        <template #header>
          <span>UI配置</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="主背景色">
            <div class="color-preview">
              <div class="color-box" :style="{ backgroundColor: config.ui_config.theme_bg_main }"></div>
              <span>{{ config.ui_config.theme_bg_main }}</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="次背景色">
            <div class="color-preview">
              <div class="color-box" :style="{ backgroundColor: config.ui_config.theme_bg_second }"></div>
              <span>{{ config.ui_config.theme_bg_second }}</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="主文字色">
            <div class="color-preview" v-if="config.ui_config.theme_text_main">
              <div class="color-box" :style="{ backgroundColor: config.ui_config.theme_text_main }"></div>
              <span>{{ config.ui_config.theme_text_main }}</span>
            </div>
            <span v-else>-</span>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 小说配置 -->
      <el-card class="config-card" v-if="config.novel_config">
        <template #header>
          <span>小说配置</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="TT跳转首页URL">
            <el-link v-if="config.novel_config.tt_jump_home_url" :href="config.novel_config.tt_jump_home_url" target="_blank" type="primary">
              {{ config.novel_config.tt_jump_home_url }}
            </el-link>
            <span v-else>-</span>
          </el-descriptions-item>
          <el-descriptions-item label="TT登录回调域名">
            <span>{{ config.novel_config.tt_login_callback_domain || '-' }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 操作按钮 -->
      <div class="actions">
        <el-button type="primary" @click="editConfig">编辑配置</el-button>
        <el-button type="success" @click="goToWebsiteConfigs">网站列表</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { websiteApi } from '@/api/website'

const route = useRoute()
const router = useRouter()
const config = ref(null)
const loading = ref(false)

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取配置
const fetchConfig = async () => {
  loading.value = true
  try {
    const response = await websiteApi.getWebsiteConfig(route.params.clientId)
    // 适配新的后端返回结构
    config.value = response.data.data || response.data
  } catch (error) {
    ElMessage.error('获取配置失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 编辑配置
const editConfig = () => {
  ElMessage.info('编辑功能将在后续版本中实现')
}

// 跳转到网站配置列表
const goToWebsiteConfigs = () => {
  router.push('/website-configs')
}

onMounted(() => {
  fetchConfig()
})
</script>

<style scoped>
.website-config {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 40px;
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

.config-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card,
.config-card {
  margin-bottom: 20px;
}

.text-content {
  max-height: 100px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
}

.color-preview {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-box {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}
</style>
