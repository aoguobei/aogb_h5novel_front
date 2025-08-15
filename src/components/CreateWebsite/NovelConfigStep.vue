<template>
  <div class="step-content">
    <div class="step-header">
      <h2>第六步：小说特有配置</h2>
      <p class="step-description">这些配置将存储到数据库中，并写入本地文件。仅抖音H5端需要配置</p>
    </div>

    <div v-if="basicInfo.host === 'tth5' && basicInfo.businessType === 'novel'">
      <el-form :model="novelConfig" label-width="200px" class="novel-config">
        <el-form-item label="跳转抖音小程序首页URL" required>
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
        </el-form-item>

        <el-form-item label="抖音h5登录回调域名" required>
          <el-input
            v-model="novelConfig.tt_login_callback_domain"
            placeholder="例如：novetest.fun.tv"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>

    <div v-else-if="basicInfo.host === 'tth5'" class="empty-config">
      <el-empty description="当前业务类型不支持小说特有配置（仅小说类型支持）" />
    </div>

    <div v-else class="empty-config">
      <el-empty description="当前客户端类型不支持小说特有配置（仅抖音H5端支持）" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  basicInfo: {
    type: Object,
    required: true
  },
  novelConfig: {
    type: Object,
    required: true
  },
  isGeneratingUrl: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['generateTTUrl'])

const generateTTUrl = () => {
  emit('generateTTUrl')
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

.step-header h2 {
  margin: 0 0 8px 0;
  color: #409eff;
  font-size: 20px;
}

.step-description {
  font-size: 14px;
  color: #909399;
  margin-bottom: 15px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.empty-config {
  text-align: center;
  padding: 40px 0;
}
</style> 