<template>
  <div class="step-content">
    <div class="step-header">
      <div class="step-title">第四步：支付配置</div>
      <p class="step-description">配置支付相关的网关和参数</p>
    </div>

    <el-form :model="payConfig" label-width="150px">
      <div class="section-title">
        <div class="section-title-icon">
          <el-icon><CreditCard /></el-icon>
        </div>
        <span>普通支付</span>
      </div>
      <el-form-item label="启用普通支付">
        <el-switch v-model="payConfig.normal_pay_enable" />
      </el-form-item>
      <div v-if="payConfig.normal_pay_enable" class="gateway-row">
        <el-form-item label="Android网关ID" required>
          <el-input-number data-e2e="normal-android" v-model="payConfig.normal_pay_gateway_android" :min="0" />
        </el-form-item>
        <el-form-item label="iOS网关ID" required>
          <el-input-number data-e2e="normal-ios" v-model="payConfig.normal_pay_gateway_ios" :min="0" />
        </el-form-item>
      </div>

      <div class="section-title">
        <div class="section-title-icon">
          <el-icon><Refresh /></el-icon>
        </div>
        <span>连包支付</span>
      </div>
      <el-form-item label="启用连包支付">
        <el-switch v-model="payConfig.renew_pay_enable" />
      </el-form-item>
      <div v-if="payConfig.renew_pay_enable" class="gateway-row">
        <el-form-item label="Android网关ID" required>
          <el-input-number data-e2e="renew-android" v-model="payConfig.renew_pay_gateway_android" :min="0" />
        </el-form-item>
        <el-form-item label="iOS网关ID" required>
          <el-input-number data-e2e="renew-ios" v-model="payConfig.renew_pay_gateway_ios" :min="0" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { CreditCard, Refresh } from '@element-plus/icons-vue'

defineProps({
  payConfig: {
    type: Object,
    required: true
  }
})
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

/* 网关配置行布局 */
.gateway-row {
  display: flex;
  gap: 20px;
  margin-bottom: 18px;
}

.gateway-row .el-form-item {
  flex: 1;
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gateway-row {
    flex-direction: column;
    gap: 0;
  }

  .gateway-row .el-form-item {
    margin-bottom: 18px;
  }
}
</style>
