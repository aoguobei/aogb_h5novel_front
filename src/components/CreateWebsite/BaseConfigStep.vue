<template>
  <div class="step-content">
    <div class="step-header">
      <div class="step-title">第二步：基础配置</div>
      <p class="step-description">配置网站的基本信息和参数</p>
    </div>

    <!-- 主基础配置 -->
    <div class="section-title" style="margin-top: 0;">
      <div class="section-title-icon">
        <el-icon><Setting /></el-icon>
      </div>
      <span>{{ getHostName(basicInfo.host) }}端基础配置</span>
    </div>
    <el-form :model="baseConfig" label-width="120px">
      <div class="form-row">
        <el-form-item label="应用名称" required>
          <el-input v-model="baseConfig.app_name" placeholder="输入app_name" />
        </el-form-item>
        <el-form-item label="平台" required>
          <el-input v-model="baseConfig.platform" placeholder="输入platform" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="app_code" required>
          <el-input v-model="baseConfig.app_code" placeholder="输入app_code" />
        </el-form-item>
        <el-form-item label="产品" required>
          <el-input v-model="baseConfig.product" placeholder="输入product" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="customer" required>
          <el-input v-model="baseConfig.customer" placeholder="输入customer" />
        </el-form-item>
        <el-form-item label="应用ID" required>
          <el-input v-model="baseConfig.appid" placeholder="输入appid" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="版本" required>
          <el-input v-model="baseConfig.version" placeholder="输入version" />
        </el-form-item>
        <el-form-item label="cl" required>
          <el-input v-model="baseConfig.cl" placeholder="输入cl" />
        </el-form-item>
      </div>

      <el-form-item label="uc">
        <el-input v-model="baseConfig.uc" placeholder="输入uc" />
      </el-form-item>
    </el-form>

    <!-- 额外的基础配置（tth5 需要 tt，ksh5 需要 ks） -->
    <div v-if="needsExtraBaseConfig">
      <div class="section-title">
        <div class="section-title-icon">
          <el-icon><Setting /></el-icon>
        </div>
        <span>{{ extraBaseConfigLabel }}</span>
      </div>
      <el-form :model="extraBaseConfig" label-width="120px">
        <!-- 抖音端：只显示cl字段 -->
        <template v-if="props.basicInfo.host === 'tth5'">
          <el-form-item label="cl" required>
            <el-input v-model="extraBaseConfig.cl" placeholder="输入cl" />
          </el-form-item>
        </template>

        <!-- 快手端：只显示appid字段 -->
        <template v-else-if="props.basicInfo.host === 'ksh5'">
          <el-form-item label="应用ID" required>
            <el-input v-model="extraBaseConfig.appid" placeholder="输入appid" />
          </el-form-item>
        </template>

        <!-- 其他端：显示所有字段 -->
        <template v-else>
          <div class="form-row">
            <el-form-item label="应用名称" required>
              <el-input v-model="extraBaseConfig.app_name" placeholder="输入app_name" />
            </el-form-item>
            <el-form-item label="平台" required>
              <el-input v-model="extraBaseConfig.platform" placeholder="输入platform" />
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="app_code" required>
              <el-input v-model="extraBaseConfig.app_code" placeholder="输入app_code" />
            </el-form-item>
            <el-form-item label="产品" required>
              <el-input v-model="extraBaseConfig.product" placeholder="输入product" />
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="customer" required>
              <el-input v-model="extraBaseConfig.customer" placeholder="输入customer" />
            </el-form-item>
            <el-form-item label="应用ID" required>
              <el-input v-model="extraBaseConfig.appid" placeholder="输入appid" />
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="版本" required>
              <el-input v-model="extraBaseConfig.version" placeholder="输入version" />
            </el-form-item>
            <el-form-item label="cl" required>
              <el-input v-model="extraBaseConfig.cl" placeholder="输入cl" />
            </el-form-item>
          </div>

          <el-form-item label="uc">
            <el-input v-model="extraBaseConfig.uc" placeholder="输入uc" />
          </el-form-item>
        </template>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { useConfig } from '@/composables/useConfig.js'

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
  }
})

const needsExtraBaseConfig = computed(() => {
  return props.basicInfo.businessType === 'novel' &&
         (props.basicInfo.host === 'tth5' || props.basicInfo.host === 'ksh5')
})

const extraBaseConfigLabel = computed(() => {
  if (props.basicInfo.host === 'tth5') return '抖音小程序端基础配置（仅需cl标识）'
  if (props.basicInfo.host === 'ksh5') return '快手小程序端基础配置（仅需appid标识）'
  return '额外基础配置'
})

const getHostName = function (host) {
  const {getHostDisplayName} = useConfig()
  return getHostDisplayName(host)
}

</script>

<style scoped>
.step-content {
  margin: 15px 0;
  min-height: 300px;
}

.step-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.step-title {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 22px;
  font-weight: 600;
}

.step-description {
  font-size: 16px;
  color: #909399;
  margin-bottom: 15px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

/* 分组标题样式 */
.section-title {
  display: flex;
  align-items: center;
  margin: 20px 0 15px 0;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}

.section-title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 4px;
  margin-right: 8px;
}

.section-title-icon .el-icon {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.section-title span {
  font-size: 16px;
  font-weight: 500;
  color: #475569;
}

/* 表单行布局 */
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 18px;
}

.form-row .el-form-item {
  flex: 1;
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-row .el-form-item {
    margin-bottom: 18px;
  }
}
</style>
