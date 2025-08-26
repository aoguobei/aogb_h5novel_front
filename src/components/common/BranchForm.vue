<template>
  <div class="branch-form-component">
    <div class="vertical align_center branch-form-header">
      <h3>创建代码分支</h3>
      <p>输入代码库地址和分支名称，自动创建新分支</p>
    </div>
    <el-form
      ref="branchFormRef"
      :model="branchForm"
      :rules="branchRules"
      label-width="120px"
      class="branch-form"
    >
      <el-form-item label="代码库地址" prop="repositoryUrl">
        <el-input
          v-model="branchForm.repositoryUrl"
          placeholder="请输入代码库地址"
        />
        <div class="form-tip">请输入代码库地址</div>
      </el-form-item>

      <el-form-item label="分支名称" prop="branchName">
        <el-input
          v-model="branchForm.branchName"
          placeholder="请输入要创建的分支名称"
        />
        <div class="form-tip">例如：master_tt_jinse, release_ks_xingchen等</div>
      </el-form-item>

      <el-form-item label="默认分支" prop="defaultBranch">
        <el-input
          v-model="branchForm.defaultBranch"
          placeholder="请输入默认分支名称，如: master, main, develop"
        />
        <div class="form-tip">请输入要基于的默认分支名称</div>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSubmit"
          class="submit-btn"
        >
          <el-icon><Connection /></el-icon>
          创建分支
        </el-button>
        <el-button @click="handleReset" class="reset-btn">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 操作结果展示 -->
    <div v-if="result" class="result-section">
      <el-alert
        :type="result.success ? 'success' : 'error'"
        :title="result.success ? '创建成功' : '创建失败'"
        :description="result.message"
        :closable="false"
        show-icon
      />

      <!-- 详细操作日志 -->
      <div v-if="result && result.details && result.details.length > 0" class="details-section">
        <h4>操作详情：</h4>
        <div class="details-list">
          <div
            v-for="(detail, index) in result.details"
            :key="index"
            class="detail-item"
          >
            <div class="detail-header">
              <span :class="'detail-status-' + detail.status">
                {{ detail.status === 'success' ? '✓' : detail.status === 'error' ? '✗' : detail.status === 'skipped' ? '⏭' : '⚠' }}
              </span>
              <span class="detail-operation">{{ detail.operation }}:{{ detail.message }}</span>
              <span class="detail-duration">{{ detail.duration }}ms</span>
            </div>
            <div v-if="detail.output" class="detail-output">
              <code>{{ detail.output }}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Connection } from '@element-plus/icons-vue'
import { useGit } from '@/composables/useGit'

const emit = defineEmits(['branch-pulled'])

const { pullBranchFromRepository } = useGit()

const branchFormRef = ref()
const loading = ref(false)
const result = ref(null)

// 表单数据
const branchForm = reactive({
  repositoryUrl: 'git@code.funshion.com:somalia/funnovel.git',
  branchName: '',
  defaultBranch: 'master'
})

// 表单验证规则
const branchRules = {
  repositoryUrl: [
    { required: true, message: '请输入代码库地址', trigger: 'blur' },
    {
      pattern: /^(https?:\/\/|git@).*\.git$/,
      message: '请输入有效的Git代码库地址',
      trigger: 'blur'
    }
  ],
  branchName: [
    { required: true, message: '请输入分支名称', trigger: 'blur' },
    { min: 1, max: 100, message: '分支名称长度在1到100个字符', trigger: 'blur' }
  ],
  defaultBranch: [
    { required: true, message: '请选择默认分支', trigger: 'change' }
  ]
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 验证表单
    await branchFormRef.value.validate()

    loading.value = true
    result.value = null

    // 调用创建分支接口
    const resultData = await pullBranchFromRepository(
      branchForm.repositoryUrl,
      branchForm.branchName,
      branchForm.defaultBranch
    )

    if (resultData) {
      result.value = resultData
      emit('branch-pulled', resultData)
    }
  } catch (error) {
    console.error('表单提交失败:', error)
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    loading.value = false
  }
}

// 重置表单
const handleReset = () => {
  branchFormRef.value.resetFields()
  result.value = null
}


</script>

<style lang="less" scoped>
.branch-form-component {
  .branch-form-header {
    margin-bottom: 20px;
    h3 {
      font-size: 18px;
      color: #2c3e50;
      margin: 10px 0 5px 0;
      font-weight: 600;
    }

    p {
      color: #7f8c8d;
      line-height: 1.5;
      margin: 0;
      font-size: 13px;
    }
  }
  .branch-form {
    .form-tip {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
      line-height: 1.4;
    }

    .submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      padding: 12px 24px;
      font-weight: 500;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      .el-icon {
        margin-right: 6px;
      }
    }

    .reset-btn {
      margin-left: 12px;
      padding: 12px 24px;
    }
  }

  .result-section {
    margin-top: 20px;

    .details-section {
      margin-top: 16px;

      h4 {
        font-size: 14px;
        color: #606266;
        margin: 0 0 12px 0;
        font-weight: 600;
      }

      .details-list {
        .detail-item {
          background: #ffffff;
          border-radius: 4px;
          padding: 8px;
          margin-bottom: 6px;
          border: 1px solid #e9ecef;

          &:last-child {
            margin-bottom: 0;
          }

          .detail-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;

            .detail-status-success {
              color: #28a745;
              font-weight: bold;
              font-size: 14px;
            }

            .detail-status-error {
              color: #dc3545;
              font-weight: bold;
              font-size: 14px;
            }

            .detail-status-warning {
              color: #ffc107;
              font-weight: bold;
              font-size: 14px;
            }

            .detail-status-skipped {
              color: #6c757d;
              font-weight: bold;
              font-size: 14px;
            }

            .detail-operation {
              flex: 1;
              font-weight: 500;
              color: #2c3e50;
              font-size: 12px;
            }

            .detail-duration {
              color: #6c757d;
              font-size: 11px;
              background: #f8f9fa;
              padding: 1px 4px;
              border-radius: 3px;
            }
          }

          .detail-output {
            background: #f8f9fa;
            color: #2c3e50;
            padding: 6px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 11px;
            overflow-x: auto;
            border: 1px solid #e9ecef;

            code {
              color: inherit;
              background: none;
              padding: 0;
            }
          }
        }
      }
    }
  }
}
</style>
