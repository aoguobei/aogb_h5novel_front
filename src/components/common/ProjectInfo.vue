<template>
  <div class="project-info">
    <div class="info-section">
      <div class="info-item">
        <span class="info-label">项目名称：</span>
        <span class="info-value">{{ projectName }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">当前分支：</span>
        <span class="info-value">{{ gitStatus?.branch || '获取中...' }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">工作区状态：</span>
        <span class="info-value" :class="getStatusClass(gitStatus?.status)">
          {{ getStatusText(gitStatus?.status) }}
        </span>
        <el-button
          v-if="gitStatus?.status === 'dirty'"
          link
          size="small"
          @click="toggleStatusDetails"
          class="status-details-btn"
        >
          <el-icon class="status-arrow" :class="{ 'arrow-up': showStatusDetails, 'arrow-down': !showStatusDetails }">
            <ArrowRight v-if="!showStatusDetails" />
            <ArrowUp v-else />
          </el-icon>
          {{ showStatusDetails ? '收起' : '展开' }}
        </el-button>
      </div>
      <div class="info-item" v-if="gitStatus?.ahead > 0">
        <span class="info-label">领先提交：</span>
        <span class="info-value ahead" @click="openGerrit">
          当前分支领先远程 {{ gitStatus.ahead }} 个提交，请访问 Gerrit 平台查看并完成代码评审流程。(点击跳转)
        </span>
      </div>
      <div class="info-item" v-if="gitStatus?.behind > 0">
        <span class="info-label">落后提交：</span>
        <span class="info-value behind">{{ gitStatus.behind }} 个提交</span>
      </div>
      <div class="info-item">
        <span class="info-label">远程仓库：</span>
        <span class="info-value">origin</span>
      </div>
    </div>

    <!-- 详细状态信息 -->
    <div v-if="showStatusDetails && gitStatus?.status === 'dirty'" class="status-details-section">
      <div class="status-details-header">
        <h5>文件变更详情</h5>
      </div>
      <div class="status-details-content">
        <div v-if="stagedFiles.length === 0 && modifiedFiles.length === 0 && untrackedFiles.length === 0" class="no-changes">
          <el-icon><Document /></el-icon>
          <span>暂无变更信息</span>
        </div>
        <div v-else class="changes-groups">
          <!-- 已暂存文件 -->
          <div v-if="stagedFiles.length > 0" class="change-group">
            <div class="group-header">
              <h6>Changes to be committed:</h6>
              <div class="group-hint">(use "git restore --staged &lt;file&gt;..." to unstage)</div>
            </div>
            <div class="group-files">
              <div
                v-for="(file, index) in stagedFiles"
                :key="'staged-' + index"
                class="change-item change-staged"
              >
                <span class="change-type">modified:</span>
                <span class="change-file">{{ file }}</span>
              </div>
            </div>
          </div>

          <!-- 未暂存的修改 -->
          <div v-if="modifiedFiles.length > 0" class="change-group">
            <div class="group-header">
              <h6>Changes not staged for commit:</h6>
              <div class="group-hint">(use "git add &lt;file&gt;..." to update what will be committed)</div>
              <div class="group-hint">(use "git restore &lt;file&gt;..." to discard changes in working directory)</div>
            </div>
            <div class="group-files">
              <div
                v-for="(file, index) in modifiedFiles"
                :key="'modified-' + index"
                class="change-item change-modified"
              >
                <span class="change-type">modified:</span>
                <span class="change-file">{{ file }}</span>
              </div>
            </div>
          </div>

          <!-- 未跟踪文件 -->
          <div v-if="untrackedFiles.length > 0" class="change-group">
            <div class="group-header">
              <h6>Untracked files:</h6>
              <div class="group-hint">(use "git add &lt;file&gt;..." to include in what will be committed)</div>
            </div>
            <div class="group-files">
              <div
                v-for="(file, index) in untrackedFiles"
                :key="'untracked-' + index"
                class="change-item change-untracked"
              >
                <span class="change-file">{{ file }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { ArrowRight, ArrowUp, Document } from '@element-plus/icons-vue'

const props = defineProps({
  projectName: {
    type: String,
    default: 'funNovel'
  },
  gitStatus: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['toggle-status-details'])

const showStatusDetails = ref(false)

// 计算属性：分组文件
const stagedFiles = computed(() => {
  return props.gitStatus?.staged || []
})

const modifiedFiles = computed(() => {
  return props.gitStatus?.modified || []
})

const untrackedFiles = computed(() => {
  return props.gitStatus?.untracked || []
})

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'clean':
      return 'clean'
    case 'dirty':
      return 'dirty (您有尚未提交的代码修改)'
    default:
      return '获取中...'
  }
}

// 获取状态样式类
const getStatusClass = (status) => {
  switch (status) {
    case 'clean':
      return 'status-clean'
    case 'dirty':
      return 'status-dirty'
    default:
      return 'status-loading'
  }
}

// 切换状态详情显示
const toggleStatusDetails = () => {
  showStatusDetails.value = !showStatusDetails.value
  emit('toggle-status-details', showStatusDetails.value)
}

// 打开 Gerrit 审查页面
const openGerrit = () => {
  location.href = 'http://172.17.12.189:8150/#/q/status:open'
}
</script>

<style scoped lang="less">
.project-info {
  .info-section {
    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      font-size: 14px;

      .info-label {
        color: #666;
        min-width: 80px;
        margin-right: 8px;
      }

      .info-value {
        color: #333;
        font-weight: 500;

        &.status-clean {
          color: #52c41a;
        }

        &.status-dirty {
          color: #ff4d4f;
        }

        &.status-loading {
          color: #1890ff;
        }

        &.ahead {
          // color: #52c41a;
          color: #ff4d4f;
          cursor: pointer;
        }

        &.behind {
          color: #faad14;
        }
      }

      .status-details-btn {
        margin-left: 8px;
        margin-top: 2px;
        color: #667eea;
        font-size: 12px;
        padding: 2px 6px;

        &:hover {
          color: #5a67d8;
        }

        .status-arrow {
          transition: transform 0.3s ease;
          margin-right: 4px;

          &.arrow-down {
            transform: rotate(0deg);
          }

          &.arrow-up {
            transform: rotate(180deg);
          }
        }
      }
    }
  }

  .status-details-section {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    margin-top: 15px;
    border: 1px solid #e9ecef;

    .status-details-header {
      margin-bottom: 10px;

      h5 {
        font-size: 14px;
        color: #2c3e50;
        margin: 0;
        font-weight: 500;
      }
    }

    .status-details-content {
      .no-changes {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #6c757d;
        font-size: 13px;
        padding: 10px 0;

        .el-icon {
          color: #dee2e6;
        }
      }

      .changes-groups {
        .change-group {
          margin-bottom: 16px;

          &:last-child {
            margin-bottom: 0;
          }

          .group-header {
            margin-bottom: 8px;

            h6 {
              font-size: 14px;
              color: #2c3e50;
              margin: 0 0 4px 0;
              font-weight: 600;
            }

            .group-hint {
              font-size: 12px;
              color: #6c757d;
              font-style: italic;
              margin-bottom: 2px;
            }
          }

          .group-files {
            .change-item {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 4px 0;
              font-size: 13px;
              font-family: monospace;

              .change-type {
                color: #dc3545;
                font-weight: 500;
                min-width: 60px;
              }

              .change-file {
                color: #dc3545;
                flex: 1;
              }

              &.change-staged {
                .change-type,
                .change-file {
                  color: #28a745;
                }
              }

              &.change-modified {
                .change-type,
                .change-file {
                  color: #dc3545;
                }
              }

              &.change-untracked {
                .change-file {
                  color: #dc3545;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
