<template>
    <div class="git-sync">
      <!-- 使用Header组件 -->
      <Header title="代码同步" subtitle="同步远程和本地代码库" />

      <!-- 左右布局容器 -->
      <div class="page-layout">
        <!-- 左侧面板 -->
        <div class="left-panel">
          <!-- 功能选择区域 -->
          <div class="function-selection">
            <div class="selection-container">
              <div class="function-title">选择功能</div>
              <div class="function-options">
                <div
                  class="function-option"
                  :class="{ selected: selectedFunction === 'pull' }"
                  @click="onFunctionChange('pull')"
                >
                  <el-icon><Download /></el-icon>
                  从远程更新代码
                </div>
                <div
                  class="function-option"
                  :class="{ selected: selectedFunction === 'push' }"
                  @click="onFunctionChange('push')"
                >
                  <el-icon><Upload /></el-icon>
                  上传代码到远程
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧面板 -->
        <div class="right-panel">
                    <!-- 从远程更新代码模块 -->
          <div v-if="selectedFunction === 'pull'" class="function-panel pull-panel">
            <div class="panel-header">
              <div class="header-content">
                <el-icon class="panel-icon"><Download /></el-icon>
                <div class="header-text">
                  <div class="panel-title">从远程更新代码</div>
                  <p>从远程代码库拉取最新代码到本地</p>
                </div>
              </div>
            </div>

            <div class="panel-body">
              <div class="pull-content">
                <div class="feature-highlights">
                  <div class="feature-item">
                    <div class="feature-icon">🔄</div>
                    <div class="feature-title">一键同步</div>
                    <p>从远程仓库拉取最新代码到本地</p>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">📊</div>
                    <div class="feature-title">状态监控</div>
                    <p>实时查看操作结果和详细信息</p>
                  </div>
                </div>

                <!-- 项目信息展示 -->
                <div class="project-info-section">
                  <div class="section-header">
                    <h4>项目信息</h4>
                    <el-button
                      link
                      size="small"
                      @click="refreshGitStatus"
                      class="refresh-btn"
                    >
                      <el-icon><Refresh /></el-icon>
                      刷新状态
                    </el-button>
                  </div>
                  <div class="project-details">
                    <div class="info-item">
                      <span class="info-label">项目名称：</span>
                      <span class="info-value">funNovel</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">当前分支：</span>
                      <span class="info-value">{{ gitStatus?.branch || '获取中...' }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">工作区状态：</span>
                      <span class="info-value">{{ gitStatus?.status || '获取中...' }}</span>
                    </div>
                    <div class="info-item" v-if="gitStatus?.ahead > 0">
                      <span class="info-label">分支状态：</span>
                      <span class="info-value warning-text">领先远程 {{ gitStatus.ahead }} 个提交</span>
                    </div>
                    <div class="info-item" v-if="gitStatus?.behind > 0">
                      <span class="info-label">分支状态：</span>
                      <span class="info-value warning-text">落后远程 {{ gitStatus.behind }} 个提交</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">远程仓库：</span>
                      <span class="info-value">origin</span>
                    </div>
                  </div>
                </div>

                <!-- 拉取操作 -->
                <div class="pull-section">
                  <h4>拉取操作</h4>
                  <div class="pull-description">
                    <p>
                      🔄 点击按钮从远程仓库拉取最新代码到本地
                    </p>
                  </div>

                  <div class="pull-actions">
                    <el-button
                      type="primary"
                      size="large"
                      @click="pullCode"
                      :loading="pullLoading"
                      class="pull-btn"
                    >
                      <el-icon><Download /></el-icon>
                      {{ gitStatus?.ahead > 0 ? '智能同步 (自动重置)' : '拉取最新代码' }}
                    </el-button>
                  </div>

                  <!-- 简单提示 -->
                  <div v-if="gitStatus?.ahead > 0" class="simple-tip">
                    <el-icon><Connection /></el-icon>
                    <span>检测到提交被abandon，将自动重置分支后拉取代码</span>
                  </div>

                  <!-- 拉取结果 -->
                  <div v-if="pullResult" class="pull-result-section">
                    <h4>拉取结果</h4>
                    <div class="result-content">
                      <div class="result-header">
                        <span :class="pullResult.success ? 'result-success' : 'result-error'">
                          {{ pullResult.success ? '✅ 拉取成功' : '❌ 拉取失败' }}
                        </span>
                        <div v-if="pullResult.message">
                          {{ pullResult.message }}
                        </div>
                      </div>

                      <div v-if="pullResult.details && pullResult.details.length > 0" class="operation-details">
                        <h5>操作详情：</h5>
                        <div v-for="detail in pullResult.details" :key="detail.operation" class="detail-item">
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
              </div>
            </div>
          </div>

                    <!-- 上传代码到远程模块 -->
          <div v-if="selectedFunction === 'push'" class="function-panel push-panel">
            <div class="panel-header">
              <div class="header-content">
                <el-icon class="panel-icon"><Upload /></el-icon>
                <div class="header-text">
                  <div class="panel-title">上传代码到远程</div>
                  <p>将本地代码提交并推送到远程仓库</p>
                </div>
              </div>
            </div>

            <div class="panel-body">
              <div class="push-content">
                <div class="feature-highlights">
                  <div class="feature-item">
                    <div class="feature-icon">📝</div>
                    <div class="feature-title">代码提交</div>
                    <p>填写提交信息并推送到远程仓库</p>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">📊</div>
                    <div class="feature-title">状态监控</div>
                    <p>实时查看操作结果和详细信息</p>
                  </div>
                </div>

                <!-- 项目信息展示 -->
                <div class="project-info-section">
                  <div class="section-header">
                    <h4>项目信息</h4>
                    <el-button
                      link
                      size="small"
                      @click="refreshGitStatus"
                      class="refresh-btn"
                    >
                      <el-icon><Refresh /></el-icon>
                      刷新状态
                    </el-button>
                  </div>
                  <div class="project-details">
                    <div class="info-item">
                      <span class="info-label">项目名称：</span>
                      <span class="info-value">funNovel</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">当前分支：</span>
                      <span class="info-value">{{ gitStatus?.branch || '获取中...' }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">工作区状态：</span>
                      <span class="info-value">{{ gitStatus?.status || '获取中...' }}</span>
                    </div>
                    <div class="info-item" v-if="gitStatus?.ahead > 0">
                      <span class="info-label">分支状态：</span>
                      <span class="info-value warning-text">领先远程 {{ gitStatus.ahead }} 个提交</span>
                    </div>
                    <div class="info-item" v-if="gitStatus?.behind > 0">
                      <span class="info-label">分支状态：</span>
                      <span class="info-value warning-text">落后远程 {{ gitStatus.behind }} 个提交</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">远程仓库：</span>
                      <span class="info-value">origin</span>
                    </div>
                  </div>
                </div>

                <!-- 代码提交功能 -->
                <div class="push-section">
                  <h4>代码提交</h4>
                  <div class="push-description">
                    <p>
                      🚀 填写提交信息并点击按钮将当前代码提交到远程仓库
                    </p>
                  </div>

                  <div class="commit-form">
                    <div class="form-item">
                      <label>提交信息：</label>
                      <el-input
                        v-model="commitMessage"
                        placeholder="请输入提交信息，例如：更新网站配置"
                        type="textarea"
                        :rows="3"
                        maxlength="200"
                        show-word-limit
                        class="commit-input"
                      />
                    </div>
                  </div>

                  <div class="push-actions">
                    <el-button
                      type="primary"
                      size="large"
                      @click="pushCode"
                      :loading="pushLoading"
                      class="push-btn"
                    >
                      <el-icon><Upload /></el-icon>
                      提交代码
                    </el-button>
                  </div>

                  <!-- 提交结果 -->
                  <div v-if="pushResult" class="push-result-section">
                    <h4>提交结果</h4>
                    <div class="result-content">
                      <div class="result-header">
                        <span :class="pushResult.success ? 'result-success' : 'result-error'">
                          {{ pushResult.success ? '✅ 提交成功' : '❌ 提交失败' }}
                        </span>
                        <div v-if="pushResult.message">
                          {{ pushResult.message }}
                        </div>
                      </div>

                      <div v-if="pushResult.details && pushResult.details.length > 0" class="operation-details">
                        <h5>操作详情：</h5>
                        <div v-for="detail in pushResult.details" :key="detail.operation" class="detail-item">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Download, Upload, Refresh, Connection } from '@element-plus/icons-vue'
import Header from '@/components/common/Header.vue'
import { useGit } from '@/composables/useGit'

const router = useRouter()
const route = useRoute()

// 根据URL参数设置默认选中的功能
const getDefaultFunction = () => {
  const tab = route.query.tab
  if (tab === 'upload') {
    return 'push'
  }
  return 'pull'
}

const selectedFunction = ref(getDefaultFunction())

// 使用Git composable
const {
  gitStatus,
  pullLoading,
  pushLoading,
  pullResult,
  pushResult,
  getGitStatus,
  refreshGitStatus,
  pullCode: pullCodeFromComposable,
  pushCode: pushCodeFromComposable
} = useGit()

const commitMessage = ref('')

// 功能选择切换
const onFunctionChange = (value) => {
  selectedFunction.value = value
}

// 拉取代码
const pullCode = async () => {
  await pullCodeFromComposable()
}

// 推送代码
const pushCode = async () => {
  const result = await pushCodeFromComposable(commitMessage.value)
  if (result) {
    // 提交成功后清空提交信息
    commitMessage.value = ''
  }
}

// 页面加载时获取Git状态
onMounted(async () => {
  await getGitStatus()
})
  </script>

  <style lang="less" scoped>
  .git-sync {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;

    .page-layout {
      display: flex;
      gap: 30px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 40px);

      .left-panel {
        width: 380px;
        box-sizing: border-box;
      }

      .right-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 25px;
        height: fit-content;
      }
    }

    // 通用卡片样式
    .selection-container,
    .function-panel {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 35px rgba(0, 0, 0, 0.15);
      }
    }

    // 功能选择
    .function-selection {
      margin-bottom: 0;
      flex: 1;

      .selection-container {
        padding: 35px;
        height: fit-content;

        .function-title {
          font-size: 24px;
          color: #2c3e50;
          margin-bottom: 25px;
          text-align: center;
          font-weight: 700;
        }

        .function-options {
          display: flex;
          flex-direction: column;
          gap: 20px;

                    .function-option {
            height: 50px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            font-size: 15px;
            padding: 0 20px;
            cursor: pointer;
            border-radius: 8px;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            transition: all 0.2s ease;

            &:hover {
              background: #e9ecef;
            }

            &.selected {
              background: linear-gradient(135deg, #a8a4e6 0%, #9b7bb8 100%)
               #667eea;
              color: white;
            }

            .el-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
            }
          }
        }
      }
    }

    // 功能面板
    .function-panel {
      flex: 1;
      overflow: hidden;

      .panel-header {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        padding: 25px;
        text-align: center;

        .header-content {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          .panel-icon {
            font-size: 36px;
            margin-bottom: 12px;
          }

          .header-text {
            .panel-title {
              font-size: 20px;
              margin-bottom: 6px;
              font-weight: 600;
            }

            p {
              margin: 0;
              font-size: 14px;
              opacity: 0.9;
            }
          }
        }
      }

      .panel-body {
        padding: 30px;
        background: rgba(255, 255, 255, 0.8);
        flex: 1;
        display: flex;
        flex-direction: column;

        // 功能高亮区域样式
        .feature-highlights {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;

          .feature-item {
            flex: 1;
            text-align: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;

            .feature-title {
              font-size: 14px;
              font-weight: 500;
              color: #2c3e50;
              margin-bottom: 5px;
            }

            p {
              margin: 0;
              font-size: 12px;
              color: #6c757d;
              line-height: 1.4;
            }
          }
        }

        // 功能图标样式
        .feature-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #667eea;
          border-radius: 6px;
          margin: 0 auto 8px;
          color: white;
          font-size: 16px;
        }

        // 拉取和推送区域样式
        .pull-section,
        .push-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-left: 4px solid #667eea;
          border-radius: 16px;
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(102, 126, 234, 0.1);

          h4 {
            font-size: 16px;
            color: #2c3e50;
            margin: 0 0 15px 0;
            font-weight: 600;
          }

          .pull-description,
          .push-description {
            margin-bottom: 20px;
            font-size: 14px;
            text-align: center;

            p {
              margin: 0;
              padding: 6px 16px;
              border-radius: 8px;
              font-weight: 500;
              color: #667eea;
              background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
              border: 1px solid rgba(102, 126, 234, 0.2);
              box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
            }
          }

          .pull-actions,
          .push-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 20px;
          }

          .pull-btn,
          .push-btn {
            height: 48px;
            padding: 0 35px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 24px;
            transition: all 0.3s ease;
            color: white;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

            &:hover {
              transform: translateY(-3px);
              box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
              background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
            }

            &:active {
              transform: translateY(-1px);
              box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }

            .el-icon {
              margin-right: 8px;
              font-size: 18px;
            }
          }

          .pull-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

            &:hover {
              transform: translateY(-3px);
              box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
              background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
            }

            &:active {
              transform: translateY(-1px);
              box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }
          }

          .reset-btn {
            background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
            box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);

            &:hover {
              transform: translateY(-3px);
              box-shadow: 0 12px 35px rgba(243, 156, 18, 0.5);
              background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
            }

            &:active {
              transform: translateY(-1px);
              box-shadow: 0 6px 20px rgba(243, 156, 18, 0.4);
            }
          }
        }

        // 提交表单样式
        .commit-form {
          margin-bottom: 20px;

          .form-item {
            margin-bottom: 20px;

            label {
              display: block;
              font-weight: 600;
              color: #2c3e50;
              margin-bottom: 8px;
              font-size: 14px;
            }

            .commit-input {
              .el-textarea__inner {
                border-radius: 8px;
                border: 2px solid #e9ecef;
                transition: all 0.3s ease;

                &:focus {
                  border-color: #667eea;
                  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
              }
            }
          }
        }

        // 简单提示样式
        .simple-tip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 8px;
          padding: 12px 16px;
          margin-top: 15px;
          font-size: 14px;
          color: #856404;

          .el-icon {
            color: #856404;
            font-size: 16px;
          }
        }

        // 项目信息样式
        .project-info-section {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          border: 1px solid #e9ecef;

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;

            h4 {
              font-size: 14px;
              color: #2c3e50;
              margin: 0;
              font-weight: 500;
            }

            .refresh-btn {
              color: #667eea;
              font-size: 12px;
              padding: 2px 6px;

              &:hover {
                color: #5a67d8;
              }
            }
          }

          .project-details {
            .info-item {
              display: flex;
              align-items: center;
              margin-bottom: 8px;
              font-size: 13px;

              &:last-child {
                margin-bottom: 0;
              }

              .info-label {
                font-weight: 500;
                color: #6c757d;
                width: 80px;
                flex-shrink: 0;
              }

              .info-value {
                color: #2c3e50;
                font-weight: 500;
                font-family: monospace;

                &.warning-text {
                  color: #e67e22;
                  font-weight: 600;
                }
              }
            }
          }
        }



        // 结果展示样式
        .pull-result-section,
        .push-result-section {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin-top: 15px;
          border: 1px solid #e9ecef;

          h4 {
            font-size: 14px;
            color: #2c3e50;
            margin: 0 0 10px 0;
            font-weight: 500;
          }

          .result-content {
            .result-header {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 10px;
              padding: 8px;
              background: #ffffff;
              border-radius: 6px;
              border: 1px solid #e9ecef;

              .result-success {
                color: #28a745;
                font-weight: 500;
                font-size: 14px;
              }

              .result-error {
                color: #dc3545;
                font-weight: 500;
                font-size: 14px;
              }

              .result-message {
                font-weight: 500;
                color: #2c3e50;
                font-size: 13px;
              }
            }

            .operation-details {
              h5 {
                font-size: 13px;
                color: #2c3e50;
                margin: 0 0 8px 0;
                font-weight: 500;
              }

              .detail-item {
                background: #ffffff;
                border-radius: 4px;
                padding: 8px;
                margin-bottom: 6px;
                border: 1px solid #e9ecef;

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
    }
  }

  // 响应式设计
  @media (max-width: 1200px) {
    .git-sync {
      .page-layout {
        flex-direction: column;
        gap: 20px;

        .left-panel {
          flex: none;
          width: 100%;
        }

        .right-panel {
          flex: none;
          width: 100%;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .git-sync {
      padding: 15px;

      .page-layout {
        gap: 15px;
      }

      .selection-container {
        padding: 25px 20px;
      }

      .function-title {
        font-size: 20px;
      }

      .panel-body {
        padding: 20px 15px;

        .sync-options {
          gap: 15px;
        }
      }
    }
  }

  // 动画效果
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

</style>
