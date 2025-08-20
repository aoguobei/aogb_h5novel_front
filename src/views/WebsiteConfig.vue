<template>
  <div class="website-config">
    <div class="header">
      <el-button @click="$router.go(-1)" icon="ArrowLeft" class="back-btn">返回</el-button>
      <div class="header-content">
        <div class="header-title">网站配置详情</div>
        <div class="header-subtitle">查看和管理网站的所有配置信息</div>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p>加载配置中...</p>
      </div>
    </div>

    <div v-else-if="!config" class="error-container">
      <el-empty description="配置未找到" />
    </div>

    <div v-else class="config-content">
      <!-- 基本信息 -->
      <div class="basic-info-section">
        <div class="section-title">
          <el-icon class="header-icon"><InfoFilled /></el-icon>
          <span>基本信息</span>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="品牌代码">{{ config.client.brand.code }}</el-descriptions-item>
          <el-descriptions-item label="端类型">{{ config.client.host }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(config.client.created_at) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatDate(config.client.updated_at) }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 配置卡片容器 -->
      <div class="config-cards-container">
        <!-- 基础配置 -->
        <el-card class="config-card" shadow="hover" v-if="config.base_config?.id>0">
        <template #header>
          <div class="card-header-with-actions">
            <div class="card-header">
              <el-icon class="header-icon"><Setting /></el-icon>
              <span>基础配置</span>
            </div>
            <el-button type="primary" size="small" @click="openEditBaseConfig" class="edit-btn">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
          </div>
        </template>

        <div class="config-grid">
          <div class="config-item">
            <div class="config-label">应用名称</div>
            <div class="config-value">{{ config.base_config.app_name || '-' }}</div>
          </div>
          <div class="config-item">
            <div class="config-label">平台</div>
            <div class="config-value">{{ config.base_config.platform || '-' }}</div>
          </div>
          <div class="config-item">
            <div class="config-label">app_code</div>
            <div class="config-value">{{ config.base_config.app_code || '-' }}</div>
          </div>
          <div class="config-item">
            <div class="config-label">产品</div>
            <div class="config-value">{{ config.base_config.product || '-' }}</div>
          </div>
          <div class="config-item">
            <div class="config-label">customer</div>
            <div class="config-value">{{ config.base_config.customer || '-' }}</div>
          </div>
          <div class="config-item">
            <div class="config-label">应用ID</div>
            <div class="config-value">{{ config.base_config.appid || '-' }}</div>
          </div>
          <div class="config-item">
            <div class="config-label">版本</div>
            <div class="config-value">{{ config.base_config.version || '-' }}</div>
          </div>
          <div class="config-item">
            <div class="config-label">cl</div>
            <div class="config-value">{{ config.base_config.cl || '-' }}</div>
          </div>
          <div class="config-item">
            <div class="config-label">uc</div>
            <div class="config-value">{{ config.base_config.uc || '-' }}</div>
          </div>
        </div>
      </el-card>

      <!-- 通用配置 -->
      <el-card class="config-card" shadow="hover" v-if="config.common_config?.id > 0">
        <template #header>
          <div class="card-header-with-actions">
            <div class="card-header">
              <el-icon class="header-icon"><Tools /></el-icon>
              <span>通用配置</span>
            </div>
            <el-button type="primary" size="small" @click="openEditCommonConfig" class="edit-btn">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
          </div>
        </template>

        <!-- Deliver 配置 -->
        <div class="config-section">
          <div class="section-title">
            <el-icon><Connection /></el-icon>
            <span>Deliver 配置</span>
          </div>
          <div class="config-grid">
            <div class="config-item">
              <div class="config-label">启用 Business ID</div>
              <div class="config-value">
                <el-tag :type="config.common_config.deliver_business_id_enable ? 'success' : 'info'" size="small">
                  {{ config.common_config.deliver_business_id_enable ? '是' : '否' }}
                </el-tag>
              </div>
            </div>
            <div class="config-item" v-if="config.common_config.deliver_business_id_enable">
              <div class="config-label">Deliver Business ID</div>
              <div class="config-value">{{ config.common_config.deliver_business_id || '-' }}</div>
            </div>
            <div class="config-item">
              <div class="config-label">启用 Switch ID</div>
              <div class="config-value">
                <el-tag :type="config.common_config.deliver_switch_id_enable ? 'success' : 'info'" size="small">
                  {{ config.common_config.deliver_switch_id_enable ? '是' : '否' }}
                </el-tag>
              </div>
            </div>
            <div class="config-item" v-if="config.common_config.deliver_switch_id_enable">
              <div class="config-label">Deliver Switch ID</div>
              <div class="config-value">{{ config.common_config.deliver_switch_id || '-' }}</div>
            </div>
          </div>
        </div>

        <!-- 协议配置 -->
        <div class="config-section">
          <div class="section-title">
            <el-icon><Document /></el-icon>
            <span>协议配置</span>
          </div>
          <div class="config-grid">
            <div class="config-item">
              <div class="config-label">公司名称</div>
              <div class="config-value">{{ config.common_config.protocol_company || '-' }}</div>
            </div>
            <div class="config-item">
              <div class="config-label">联系客服URL</div>
              <div class="config-value">
                <el-link v-if="config.common_config.contact_url" :href="config.common_config.contact_url" target="_blank" type="primary">
                  {{ config.common_config.contact_url }}
                </el-link>
                <span v-else>-</span>
              </div>
            </div>
            <div class="config-item">
              <div class="config-label">部署目录url</div>
              <div class="config-value">{{ config.common_config.script_base || '-' }}</div>
            </div>
          </div>
        </div>

        <!-- 协议内容 -->
        <div class="config-section" v-if="config.common_config.protocol_about || config.common_config.protocol_privacy || config.common_config.protocol_vod || config.common_config.protocol_user_cancel">
          <div class="section-title">
            <el-icon><Document /></el-icon>
            <span>协议内容</span>
          </div>
          <div class="protocol-content">
            <div class="protocol-item" v-if="config.common_config.protocol_about">
              <div class="protocol-label">用户协议</div>
              <div class="text-content">{{ config.common_config.protocol_about }}</div>
            </div>
            <div class="protocol-item" v-if="config.common_config.protocol_privacy">
              <div class="protocol-label">隐私协议</div>
              <div class="text-content">{{ config.common_config.protocol_privacy }}</div>
            </div>
            <div class="protocol-item" v-if="config.common_config.protocol_vod">
              <div class="protocol-label">付费协议</div>
              <div class="text-content">{{ config.common_config.protocol_vod }}</div>
            </div>
            <div class="protocol-item" v-if="config.common_config.protocol_user_cancel">
              <div class="protocol-label">用户取消协议</div>
              <div class="text-content">{{ config.common_config.protocol_user_cancel }}</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 支付配置 -->
      <el-card class="config-card" shadow="hover" v-if="config.pay_config?.id > 0">
        <template #header>
          <div class="card-header-with-actions">
            <div class="card-header">
              <el-icon class="header-icon"><CreditCard /></el-icon>
              <span>支付配置</span>
            </div>
            <el-button type="primary" size="small" @click="openEditPayConfig" class="edit-btn">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
          </div>
        </template>

        <!-- 普通支付 -->
        <div class="config-section">
          <div class="section-title">
            <el-icon><CreditCard /></el-icon>
            <span>普通支付</span>
          </div>
          <div class="config-grid">
            <div class="config-item">
              <div class="config-label">启用普通支付</div>
              <div class="config-value">
                <el-tag :type="config.pay_config.normal_pay_enable ? 'success' : 'info'" size="small">
                  {{ config.pay_config.normal_pay_enable ? '是' : '否' }}
                </el-tag>
              </div>
            </div>
            <div class="config-item" v-if="config.pay_config.normal_pay_enable">
              <div class="config-label">Android网关ID</div>
              <div class="config-value">{{ config.pay_config.normal_pay_gateway_android || '-' }}</div>
            </div>
            <div class="config-item" v-if="config.pay_config.normal_pay_enable">
              <div class="config-label">iOS网关ID</div>
              <div class="config-value">{{ config.pay_config.normal_pay_gateway_ios || '-' }}</div>
            </div>
          </div>
        </div>

        <!-- 连包支付 -->
        <div class="config-section">
          <div class="section-title">
            <el-icon><Refresh /></el-icon>
            <span>连包支付</span>
          </div>
          <div class="config-grid">
            <div class="config-item">
              <div class="config-label">启用连包支付</div>
              <div class="config-value">
                <el-tag :type="config.pay_config.renew_pay_enable ? 'success' : 'info'" size="small">
                  {{ config.pay_config.renew_pay_enable ? '是' : '否' }}
                </el-tag>
              </div>
            </div>
            <div class="config-item" v-if="config.pay_config.renew_pay_enable">
              <div class="config-label">Android网关ID</div>
              <div class="config-value">{{ config.pay_config.renew_pay_gateway_android || '-' }}</div>
            </div>
            <div class="config-item" v-if="config.pay_config.renew_pay_enable">
              <div class="config-label">iOS网关ID</div>
              <div class="config-value">{{ config.pay_config.renew_pay_gateway_ios || '-' }}</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- UI配置 -->
      <el-card class="config-card" shadow="hover" v-if="config.ui_config?.id>0">
        <template #header>
          <div class="card-header-with-actions">
            <div class="card-header">
              <el-icon class="header-icon"><Brush /></el-icon>
              <span>UI配置</span>
            </div>
            <el-button type="primary" size="small" @click="openEditUIConfig" class="edit-btn">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
          </div>
        </template>

        <div class="config-grid">
          <div class="config-item">
            <div class="config-label">主背景色</div>
            <div class="config-value">
              <div class="color-preview">
                <div class="color-box" :style="{ backgroundColor: config.ui_config.theme_bg_main }"></div>
                <span>{{ config.ui_config.theme_bg_main || '-' }}</span>
              </div>
            </div>
          </div>
          <div class="config-item">
            <div class="config-label">次背景色</div>
            <div class="config-value">
              <div class="color-preview">
                <div class="color-box" :style="{ backgroundColor: config.ui_config.theme_bg_second }"></div>
                <span>{{ config.ui_config.theme_bg_second || '-' }}</span>
              </div>
            </div>
          </div>
          <div class="config-item">
            <div class="config-label">主文字色</div>
            <div class="config-value">
              <div class="color-preview" v-if="config.ui_config.theme_text_main">
                <div class="color-box" :style="{ backgroundColor: config.ui_config.theme_text_main }"></div>
                <span>{{ config.ui_config.theme_text_main }}</span>
              </div>
              <span v-else>-</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 小说配置 -->
      <el-card class="config-card" shadow="hover" v-if="config.novel_config?.id>0">
        <template #header>
          <div class="card-header-with-actions">
            <div class="card-header">
              <el-icon class="header-icon"><Reading /></el-icon>
              <span>小说配置</span>
            </div>
            <el-button type="primary" size="small" @click="openEditNovelConfig" class="edit-btn">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
          </div>
        </template>

        <div class="config-grid">
          <div class="config-item">
            <div class="config-label">跳转抖音小程序首页URL</div>
            <div class="config-value">
              <el-link v-if="config.novel_config.tt_jump_home_url" :href="config.novel_config.tt_jump_home_url" target="_blank" type="primary">
                {{ config.novel_config.tt_jump_home_url }}
              </el-link>
              <span v-else>-</span>
            </div>
          </div>
          <div class="config-item">
            <div class="config-label">抖音h5登录回调域名</div>
            <div class="config-value">{{ config.novel_config.tt_login_callback_domain || '-' }}</div>
          </div>
        </div>
      </el-card>
      </div>

    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <el-button type="primary" size="large" @click="goToWebsiteConfigs">
        <el-icon><List /></el-icon>
        网站列表
      </el-button>
      <el-button size="large" @click="$router.go(-1)">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
    </div>

    <!-- 编辑器组件 -->
    <BaseConfigEditor
      v-model:visible="editBaseConfigVisible"
      :config="config?.base_config"
      :client-id="route.params.clientId"
      @save="handleBaseConfigSave"
      @cancel="editBaseConfigVisible = false"
    />

    <CommonConfigEditor
      v-model:visible="editCommonConfigVisible"
      :config="config?.common_config"
      :client-id="route.params.clientId"
      @save="handleCommonConfigSave"
      @cancel="editCommonConfigVisible = false"
    />

    <PayConfigEditor
      v-model:visible="editPayConfigVisible"
      :config="config?.pay_config"
      :client-id="route.params.clientId"
      @save="handlePayConfigSave"
      @cancel="editPayConfigVisible = false"
    />

    <UIConfigEditor
      v-model:visible="editUIConfigVisible"
      :config="config?.ui_config"
      :client-id="route.params.clientId"
      @save="handleUIConfigSave"
      @cancel="editUIConfigVisible = false"
    />

    <NovelConfigEditor
      v-model:visible="editNovelConfigVisible"
      :config="config?.novel_config"
      :client-id="route.params.clientId"
      @save="handleNovelConfigSave"
      @cancel="editNovelConfigVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Loading,
  Edit,
  InfoFilled,
  Setting,
  Tools,
  Document,
  CreditCard,
  Brush,
  Reading,
  List,
  ArrowLeft,
  Connection,
  Refresh
} from '@element-plus/icons-vue'
import { websiteApi } from '@/api/website'
import { configApi } from '@/api/config'
import {
  BaseConfigEditor,
  CommonConfigEditor,
  PayConfigEditor,
  UIConfigEditor,
  NovelConfigEditor
} from '@/components/config-editors'

const route = useRoute()
const router = useRouter()
const config = ref(null)
const loading = ref(false)

// 编辑弹窗显示状态
const editBaseConfigVisible = ref(false)
const editCommonConfigVisible = ref(false)
const editPayConfigVisible = ref(false)
const editUIConfigVisible = ref(false)
const editNovelConfigVisible = ref(false)

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

// 打开编辑弹窗的方法
const openEditBaseConfig = () => {
  if (!config.value?.base_config) {
    ElMessage.warning('基础配置不存在')
    return
  }
  editBaseConfigVisible.value = true
}

const openEditCommonConfig = () => {
  if (!config.value?.common_config) {
    ElMessage.warning('通用配置不存在')
    return
  }
  editCommonConfigVisible.value = true
}

const openEditPayConfig = () => {
  if (!config.value?.pay_config) {
    ElMessage.warning('支付配置不存在')
    return
  }
  editPayConfigVisible.value = true
}

const openEditUIConfig = () => {
  if (!config.value?.ui_config) {
    ElMessage.warning('UI配置不存在')
    return
  }
  editUIConfigVisible.value = true
}

const openEditNovelConfig = () => {
  if (!config.value?.novel_config) {
    ElMessage.warning('小说配置不存在')
    return
  }
  editNovelConfigVisible.value = true
}

// 处理保存成功后的回调
const handleBaseConfigSave = async (data) => {
  await fetchConfig()
}

const handleCommonConfigSave = async (data) => {
  await fetchConfig()
}

const handlePayConfigSave = async (data) => {
  await fetchConfig()
}

const handleUIConfigSave = async (data) => {
  await fetchConfig()
}

const handleNovelConfigSave = async (data) => {
  await fetchConfig()
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
  padding: 20px;
  background: white;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.back-btn {
  border-radius: 8px;
  font-weight: 500;
}

.header-content {
  flex: 1;
}

.header-title {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 60px 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-container .el-icon {
  font-size: 48px;
  color: #667eea;
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
  gap: 24px;
}

.config-card {
  margin-bottom: 0;
  border-radius: 16px;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.config-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  padding: 2px;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.config-card:hover {
  transform: translateY(-4px);
  border: 2px solid #764ba2;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
}

.config-card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.header-icon {
  color: #667eea;
  font-size: 18px;
}

.card-header-with-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  transform: scale(1.05);
}

.text-content {
  max-height: 120px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 16px;
  border-radius: 10px;
  font-size: 13px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.text-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #28a745 0%, #20c997 100%);
  border-radius: 0 2px 2px 0;
}

.color-preview {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.color-box {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.color-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
  padding: 2px;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.color-box:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.color-box:hover::before {
  opacity: 1;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px 0;
}

.actions .el-button {
  border-radius: 12px;
  font-weight: 600;
  padding: 12px 24px;
  transition: all 0.3s ease;
}

.actions .el-button:hover {
  transform: none;
  box-shadow: none;
}

/* 配置网格布局 */
.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.config-item {
  background: #ffffff;
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid #f1f3f4;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.config-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.config-item:hover {
  background: #f8f9fa;
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
  transform: translateX(2px);
}

.config-label {
  font-size: 14px;
  font-weight: 600;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 100px;
  flex-shrink: 0;
}

.config-value {
  font-size: 15px;
  color: #2c3e50;
  font-weight: 500;
  word-break: break-word;
}

/* 基本信息区域 */
.basic-info-section {
  /* margin-bottom: 30px;
  padding: 20px 0; */
}

/* 配置卡片容器 - Grid布局 */
.config-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.config-card {
  margin-bottom: 0;
  transition: all 0.3s ease;
}

/* 配置分组 */
.config-section {
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.config-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 2px 2px 0;
}

.config-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #dee2e6;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
}

.section-title .el-icon {
  color: #667eea;
  font-size: 16px;
}

/* 协议内容样式 */
.protocol-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.protocol-item {
  background: linear-gradient(135deg, #f8fff8 0%, #f0f8f0 100%);
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid #d4edda;
  border-left: 3px solid #28a745;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.protocol-label {
  font-size: 12px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  letter-spacing: 0.5px;
}

.protocol-label::before {
  content: '';
  width: 3px;
  height: 3px;
  background: #28a745;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .config-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .config-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .config-item {
    padding: 10px 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .config-label {
    min-width: auto;
    font-size: 11px;
  }

  .config-value {
    font-size: 12px;
  }

  .section-title {
    font-size: 13px;
  }

  .protocol-label {
    font-size: 11px;
  }
}
</style>
