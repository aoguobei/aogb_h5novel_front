<template>
  <div class="step-content">
    <div class="step-header">
      <div class="step-title">第三步：通用配置</div>
      <p class="step-description">配置网站的通用设置和协议信息</p>
    </div>

    <el-form :model="commonConfig" label-width="150px">
      <div class="section-title">
        <div class="section-title-icon">
          <el-icon><Connection /></el-icon>
        </div>
        <span>Deliver 配置</span>
      </div>
      <div class="deliver-config-row">
        <el-form-item label="启用 Business ID">
          <el-switch v-model="commonConfig.deliver_business_id_enable" />
        </el-form-item>
        <el-form-item label="Deliver Business ID" v-if="commonConfig.deliver_business_id_enable">
          <el-input v-model="commonConfig.deliver_business_id" />
        </el-form-item>
      </div>
      <div class="deliver-config-row">
        <el-form-item label="启用 Switch ID">
          <el-switch v-model="commonConfig.deliver_switch_id_enable" />
        </el-form-item>
        <el-form-item label="Deliver Switch ID" v-if="commonConfig.deliver_switch_id_enable">
          <el-input v-model="commonConfig.deliver_switch_id" />
        </el-form-item>
      </div>

      <div class="section-title">
        <div class="section-title-icon">
          <el-icon><Document /></el-icon>
        </div>
        <span>协议配置</span>
      </div>
      <el-form-item label="公司名称" required>
        <el-input v-model="commonConfig.protocol_company" />
      </el-form-item>
      <el-form-item v-if="basicInfo.businessType !== 'novel'" label="用户协议">
        <el-input v-model="commonConfig.protocol_about" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item v-if="basicInfo.businessType !== 'novel'" label="隐私协议">
        <el-input v-model="commonConfig.protocol_privacy" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item v-if="basicInfo.businessType !== 'novel'" label="付费协议">
        <el-input v-model="commonConfig.protocol_vod" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item v-if="basicInfo.businessType !== 'novel'" label="用户取消协议">
        <el-input v-model="commonConfig.protocol_user_cancel" type="textarea" :rows="3" @input="validateScriptBase"/>
      </el-form-item>

      <div class="section-title">
        <div class="section-title-icon">
          <el-icon><Link /></el-icon>
        </div>
        <span>其他配置</span>
      </div>
      <el-form-item label="联系客服URL" required>
        <el-input v-model="commonConfig.contact_url" type="textarea" />
      </el-form-item>
      <el-form-item label="部署目录url" required>
        <el-input
          v-model="commonConfig.script_base"
          placeholder="/tt/xingchen/"
          @input="validateScriptBase"
        />
        <div v-if="scriptBaseError" class="error-tip">
          <el-icon><Warning /></el-icon>
          <span>{{ scriptBaseError }}</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Connection, Document, Link, Warning } from '@element-plus/icons-vue'

defineProps({
  commonConfig: {
    type: Object,
    required: true
  },
  basicInfo: {
    type: Object,
    required: true
  }
})

const scriptBaseError = ref('')

const validateScriptBase = (value) => {
  if (!value) {
    scriptBaseError.value = '请输入部署目录url'
    return
  }

  if (!value.startsWith('/')) {
    scriptBaseError.value = '部署目录url必须以/开头'
    return
  }

  if (!value.endsWith('/')) {
    scriptBaseError.value = '部署目录url必须以/结尾'
    return
  }

  // 验证通过，清除错误提示
  scriptBaseError.value = ''
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

/* 错误提示样式 */
.error-tip {
  display: flex;
  align-items: center;
  margin-top: 5px;
  color: #f56c6c;
  font-size: 14px;
}

.error-tip .el-icon {
  margin-right: 4px;
  font-size: 14px;
}

/* Deliver配置行布局 */
.deliver-config-row {
  display: flex;
  gap: 20px;
  margin-bottom: 18px;
  align-items: flex-start;
}

.deliver-config-row .el-form-item {
  flex: 1;
  margin-bottom: 0;
}

.deliver-config-row .el-form-item:first-child {
  flex: 0 0 auto;
  min-width: 200px;
}

/* 响应式设计 */
@media (max-width: 768px) {
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
}
</style>
