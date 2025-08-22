<template>
  <div class="website-generation">
    <!-- 使用Header组件 -->
    <Header title="网站生成器" subtitle="快速创建专业的H5网站" />

    <!-- 左右布局容器 -->
    <div class="page-layout">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <!-- 功能选择区域 - 增强视觉效果 -->
        <div class="function-selection">
          <div class="selection-container">
            <div class="function-title">选择功能</div>
            <div class="function-options">
                <div
                  class="function-option"
                  :class="{ selected: selectedFunction === 'domain' }"
                  @click="onFunctionChange('domain')"
                >
                  <el-icon><Link /></el-icon>
                  申请资质
                </div>
                <div
                  class="function-option"
                  :class="{ selected: selectedFunction === 'publish' }"
                  @click="onFunctionChange('publish')"
                >
                  <el-icon><Upload /></el-icon>
                  生成发布配置
                </div>
                <div
                  class="function-option"
                  :class="{ selected: selectedFunction === 'generate' }"
                  @click="onFunctionChange('generate')"
                >
                  <el-icon><Monitor /></el-icon>
                  生成网站
                </div>

                <div
                  class="function-option"
                  :class="{ selected: selectedFunction === 'preview' }"
                  @click="onFunctionChange('preview')"
                >
                  <el-icon><View /></el-icon>
                  预览功能
                </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">

    <!-- 申请资质模块 -->
    <div v-if="selectedFunction === 'domain'" class="function-panel domain-panel">
      <div class="panel-header">
        <div class="header-content">
          <el-icon class="panel-icon"><Link /></el-icon>
          <div class="header-text">
            <div class="panel-title">申请资质</div>
            <p>配置资质申请相关信息和后台配置</p>
          </div>
        </div>
      </div>

      <div class="panel-body">
        <div class="domain-content">
          <div class="domain-steps">
            <div
              class="step-item"
              :class="{ 'active': selectedStep === 'email' }"
              @click="selectStep('email')"
            >
              <div class="step-icon-wrapper">
                <el-icon class="step-icon"><Message /></el-icon>
              </div>
              <div class="step-title">发送邮件</div>
              <p>申请域名，点击下方按钮使用邮件发送功能</p>
            </div>

            <div
              class="step-item"
              :class="{ 'active': selectedStep === 'backend' }"
              @click="selectStep('backend')"
            >
              <div class="step-icon-wrapper">
                <el-icon class="step-icon"><Setting /></el-icon>
              </div>
              <div class="step-title">网站应用后台配置</div>
              <p>配置网站应用后台设置</p>
              <div class="step-links">
                <a href="https://open.kuaishou.com/platform/console?tabType=4" target="_blank" class="link-btn">
                  <el-icon><Link /></el-icon>
                  快手控制台
                </a>
                <a href="https://developer.open-douyin.com/console?type=4" target="_blank" class="link-btn">
                  <el-icon><Link /></el-icon>
                  抖音控制台
                </a>
              </div>
            </div>

            <div
              class="step-item"
              :class="{ 'active': selectedStep === 'poseidon' }"
              @click="selectStep('poseidon')"
            >
              <div class="step-icon-wrapper">
                <el-icon class="step-icon"><Setting /></el-icon>
              </div>
              <div class="step-title">波塞冬后台配置</div>
              <p>配置波塞冬后台系统</p>
            </div>
          </div>

          <!-- 邮件表单区域 -->
          <div v-if="selectedStep === 'email'" class="content-section">
            <div class="email-form-container">
              <div class="email-form-header">
                <el-icon class="form-icon"><Message /></el-icon>
                <h3>发送配置邮件</h3>
                <p>填写您的邮箱，我们将发送详细的网站配置信息</p>
              </div>
              <EmailForm
                ref="emailFormRef"
                :default-subject="'网站创建配置信息'"
                :template="'domain'"
                @email-sent="handleEmailSent"
              />
            </div>
          </div>

          <!-- 网站应用后台配置备注 -->
          <div v-if="selectedStep === 'backend'" class="content-section">
            <div class="notes-container">
              <div class="horizontal alignCenter notes-header">
                <el-icon class="notes-icon"><Document /></el-icon>
                <div>
                  <h3>网站应用后台配置说明</h3>
                  <p>详细的配置步骤和注意事项</p>
                </div>
              </div>
              <div class="step-notes">
                <div class="note-item">
                  <strong>抖音端配置：</strong>
                  <ul>
                    <li>添加开发者权限</li>
                    <li>配置安全域名、应用信息、授权回调地址</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 波塞冬后台配置备注 -->
          <div v-if="selectedStep === 'poseidon'" class="content-section">
            <div class="notes-container">
              <div class="horizontal alignCenter notes-header">
                <el-icon class="notes-icon"><Document /></el-icon>
                <div>
                  <h3>波塞冬后台配置说明</h3>
                  <p>详细的配置步骤和注意事项</p>
                </div>
              </div>
              <div class="step-notes">
                <div class="note-item">
                  <strong>抖音端配置：</strong>
                  <ul>
                    <li>getSignInfo接口域名白名单配置</li>
                    <li>播放接口内容问题处理</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 生成发布配置模块 -->
    <div v-if="selectedFunction === 'publish'" class="function-panel publish-panel">
      <div class="panel-header">
        <div class="header-content">
          <el-icon class="panel-icon"><Upload /></el-icon>
          <div class="header-text">
            <div class="panel-title">生成发布配置</div>
            <p>配置发布相关信息和发送通知邮件</p>
          </div>
        </div>
      </div>

      <div class="panel-body">
        <div class="publish-content">
          <div class="publish-steps">
            <div
              class="step-item"
              :class="{ 'active': selectedStep === 'branch' }"
              @click="selectStep('branch')"
            >
              <div class="step-icon-wrapper">
                <el-icon class="step-icon"><Connection /></el-icon>
              </div>
              <div class="step-title">拉分支</div>
              <p>找开发拉取相应的代码分支</p>
            </div>

            <div
              class="step-item"
              :class="{ 'active': selectedStep === 'publish-email' }"
              @click="selectStep('publish-email')"
            >
              <div class="step-icon-wrapper">
                <el-icon class="step-icon"><Message /></el-icon>
              </div>
              <div class="step-title">发邮件</div>
              <p>发送发布配置邮件通知</p>
            </div>
          </div>

          <!-- 拉分支备注 -->
          <div v-if="selectedStep === 'branch'" class="content-section">
            <div class="notes-container">
              <div class="horizontal alignCenter notes-header">
                <el-icon class="notes-icon"><Connection /></el-icon>
                <div>
                  <h3>拉分支说明</h3>
                  <p>联系开发团队拉取相应的代码分支</p>
                </div>
              </div>
              <div class="step-notes">
                <div class="note-item">
                  <strong>操作步骤：</strong>
                  <ul>
                    <li>联系开发团队负责人</li>
                    <li>提供项目信息和分支名称</li>
                    <li>确认分支拉取完成</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 发布邮件表单区域 -->
          <div v-if="selectedStep === 'publish-email'" class="content-section">
            <div class="email-form-container">
              <div class="vertical align_center email-form-header">
                <el-icon class="form-icon"><Message /></el-icon>
                <h3>发送发布配置邮件</h3>
                <p>填写收件人邮箱，发送发布配置信息</p>
              </div>
              <EmailForm
                ref="publishEmailFormRef"
                :default-subject="'网站发布配置信息'"
                :template="'publish'"
                @email-sent="handlePublishEmailSent"
              />
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 网站生成模块 - 增强面板效果 -->
    <div v-if="selectedFunction === 'generate'" class="function-panel generate-panel">
      <div class="panel-header">
        <div class="header-content">
          <el-icon class="panel-icon"><Monitor /></el-icon>
          <div class="header-text">
            <div class="panel-title">生成网站</div>
            <p>通过简单的步骤配置，快速创建您的网站</p>
          </div>
        </div>
      </div>

      <div class="panel-body">
        <div class="generate-content">
          <div class="feature-highlights">
            <div class="feature-item">
              <div class="feature-icon-wrapper">
                <el-icon class="feature-icon"><Setting /></el-icon>
              </div>
              <div class="feature-title">简单配置</div>
              <p>选择品牌、配置基础信息、设置主题等</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon-wrapper">
                <el-icon class="feature-icon"><Monitor /></el-icon>
              </div>
              <div class="feature-title">实时预览</div>
              <p>配置过程中实时预览网站效果</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon-wrapper">
                <el-icon class="feature-icon"><Document /></el-icon>
              </div>
              <div class="feature-title">自动生成</div>
              <p>自动生成配置文件和项目结构</p>
            </div>
          </div>

          <div class="action-section">
            <el-button type="primary" size="large" @click="goToCreateWebsite" class="start-btn">
              <el-icon><Right /></el-icon>
              开始创建网站
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 预览功能模块 -->
    <div v-if="selectedFunction === 'preview'" class="function-panel preview-panel">
      <div class="panel-header">
        <div class="header-content">
          <el-icon class="panel-icon"><View /></el-icon>
          <div class="header-text">
            <div class="panel-title">预览功能</div>
            <p>查看测试用例集合，体验网站效果</p>
          </div>
        </div>
      </div>

      <div class="panel-body">
        <div class="preview-content">
          <div class="preview-links-section">
            <div class="preview-link-card">
              <div class="horizontal alignCenter link-header">
                <el-icon class="link-icon"><Monitor /></el-icon>
                <div class="link-info">
                  <h4>前端测试页面</h4>
                  <p>体验完整的用户端功能展示</p>
                </div>
              </div>
              <div class="link-actions">
                <a
                  href="http://172.17.3.118:5000/index.html"
                  target="_blank"
                  class="preview-btn primary"
                >
                  <el-icon><View /></el-icon>
                  查看页面
                </a>
                <div class="link-url">
                  <span>http://172.17.3.118:5000/index.html</span>
                </div>
              </div>
            </div>

            <div class="preview-link-card">
              <div class="link-header">
                <el-icon class="link-icon"><Setting /></el-icon>
                <div class="link-info">
                  <h4>后台管理页面</h4>
                  <p>体验完整的后台管理功能</p>
                </div>
              </div>
              <div class="link-actions">
                <a
                  href="http://172.17.3.118:5000/admin.html"
                  target="_blank"
                  class="preview-btn primary"
                >
                  <el-icon><Setting /></el-icon>
                  管理后台
                </a>
                <div class="link-url">
                  <span>http://172.17.3.118:5000/admin.html</span>
                </div>
              </div>
            </div>
          </div>

          <div class="preview-features">
            <h3>功能特点</h3>
            <div class="features-grid">
              <div class="feature-card">
                <el-icon class="feature-icon"><Monitor /></el-icon>
                <h4>测试用例集合</h4>
                <p>集合所有测试用例，无需查找文档</p>
              </div>
              <div class="feature-card">
                <el-icon class="feature-icon"><Setting /></el-icon>
                <h4>用例管理</h4>
                <p>支持管理测试用例，进行增删改查</p>
              </div>
              <div class="feature-card">
                <el-icon class="feature-icon"><Link /></el-icon>
                <h4>便捷访问</h4>
                <p>一键跳转，即时扫码查看网站效果，无需手动拷贝测试链接</p>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Setting, Document, Monitor, Right, Message, Link, Upload, Connection, View, InfoFilled } from '@element-plus/icons-vue'
import EmailForm from '@/components/common/EmailForm.vue'
import Header from '@/components/common/Header.vue'

const router = useRouter()
const selectedFunction = ref('generate')
const emailFormRef = ref()
const publishEmailFormRef = ref()
const selectedStep = ref('') // 选中的步骤

// 功能选择切换
const onFunctionChange = (value) => {
  if (value === 'domain') {
    console.log('切换到申请资质模块')
    selectedFunction.value = 'domain'
  } else if (value === 'publish') {
    console.log('切换到生成发布配置模块')
    selectedFunction.value = 'publish'
  } else if (value === 'preview') {
    console.log('切换到预览功能模块')
    selectedFunction.value = 'preview'
  } else {
    console.log('切换到网站生成模块')
    selectedFunction.value = 'generate'
  }
}

// 处理申请资质
const handleQualificationApply = () => {
  ElMessage.success('资质申请功能开发中...')
}

// 跳转到创建网站页面
const goToCreateWebsite = () => {
  router.push('/create-website')
}

// 选择步骤
const selectStep = (step) => {
  selectedStep.value = step
}

// 处理邮件发送成功
const handleEmailSent = () => {
  selectedStep.value = '' // 关闭表单
}

// 处理发布邮件发送成功
const handlePublishEmailSent = () => {
  selectedStep.value = '' // 关闭表单
}
</script>

<style lang="less" scoped>
.website-generation {
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
      flex: 0 0 400px;
      display: flex;
      flex-direction: column;
      gap: 25px;
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
  .function-panel,
  .action-section {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(15px);
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
          height: 65px;
          display: flex;
          align-items: center;
          gap: 15px;
          font-weight: 600;
          font-size: 16px;
          padding: 0 25px;
          cursor: pointer;
          border-radius: 16px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border: 2px solid transparent;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;

          &:hover {
            transform: translateX(8px);
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            box-shadow: 0 8px 25px rgba(168, 164, 230, 0.3);
          }

          &.selected {
            background: linear-gradient(135deg, #a8a4e6 0%, #9b7bb8 100%);
            color: white;
            transform: translateX(8px);
          }

          .el-icon {
            font-size: 22px;
            width: 22px;
            height: 22px;
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

      // 通用卡片样式
      .feature-highlights {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;

        .feature-item {
          .card-base();
          text-align: center;
          padding: 20px 15px;

          .feature-title {
            font-size: 16px;
            color: #2c3e50;
            margin-bottom: 8px;
            font-weight: 600;
          }

          p {
            color: #7f8c8d;
            line-height: 1.5;
            margin: 0;
            font-size: 13px;
          }
        }
      }

      // 通用卡片基础样式 mixin
      .card-base() {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.4);
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }
      }

      // 通用图标样式
      .feature-icon-wrapper,
      .step-icon-wrapper {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        margin: 0 auto 15px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }

      .feature-icon,
      .step-icon {
        font-size: 28px;
        color: white;
      }

      // 通用步骤展示样式
      .domain-steps,
      .publish-steps {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;

        .step-item {
          .card-base();
          text-align: center;
          padding: 20px 15px;
          cursor: pointer;

          &.active {
            transform: translateY(-3px);
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
          }



          .step-title {
            font-size: 16px;
            color: #2c3e50;
            margin-bottom: 8px;
            font-weight: 600;
          }

          p {
            color: #7f8c8d;
            line-height: 1.5;
            margin: 0;
            font-size: 13px;
          }

          .step-links {
            margin-top: 15px;
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;

            .link-btn {
              display: inline-flex;
              align-items: center;
              gap: 5px;
              padding: 6px 12px;
              background: transparent;
              color: #667eea;
              text-decoration: none;
              border-radius: 6px;
              font-size: 13px;
              font-weight: 500;
              transition: all 0.3s ease;
              border: 1px solid #e1e8ed;

              &:hover {
                background: #f8f9fa;
                color: #5a67d8;
                border-color: #667eea;
                text-decoration: none;
              }

              .el-icon {
                font-size: 14px;
              }
            }
          }
        }
      }

      // 内容区域
      .content-section {
        margin-top: 30px;
        animation: fadeInUp 0.3s ease;

        // 邮件表单容器样式
        .email-form-container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 25px;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 35px rgba(0, 0, 0, 0.15);
          }
        }

        // 通用头部样式
        .email-form-header,
        .notes-header {
          margin-bottom: 20px;

          .form-icon,
          .notes-icon {
            font-size: 32px;
            color: #667eea;
            margin-right: 10px;
          }

          h3 {
            font-size: 18px;
            color: #2c3e50;
            margin: 10px 0 5px 0;
            font-weight: 600;
          }

          p {
            color: #7f8c8d;
            margin: 0;
            font-size: 14px;
          }
        }

        // 邮件表单头部特殊样式
        .email-form-header {
          text-align: center;

          .form-icon {
            margin-bottom: 10px;
            margin-right: 0;
          }
        }
      }

      // 备注样式
      .step-notes {
        margin-top: 15px;
        margin-bottom: 15px;
        padding: 16px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 12px;
        border: 1px solid #dee2e6;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        .note-item {
          margin-bottom: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 8px;
          border-left: 4px solid #667eea;
          transition: all 0.3s ease;

          &:hover {
            transform: translateX(2px);
            box-shadow: 0 3px 10px rgba(102, 126, 234, 0.1);
          }

          &:last-child {
            margin-bottom: 0;
          }

          strong {
            color: #2c3e50;
            font-weight: 600;
            font-size: 14px;
            display: block;
            margin-bottom: 8px;
          }

          ul {
            list-style: none;
            padding: 0;
            margin: 0;
            color: #555;
            font-size: 13px;
            line-height: 1.6;

            li {
              margin-bottom: 4px;
              position: relative;
              padding-left: 16px;

              &::before {
                content: "•";
                position: absolute;
                left: 0;
                top: 0;
                color: #667eea;
                font-weight: bold;
                font-size: 14px;
              }
            }
          }
        }
      }

      // 操作区域
      .action-section {
        text-align: center;
        padding: 25px;
        margin-top: auto;

        .start-btn {
          height: 48px;
          padding: 0 35px;
          font-size: 16px;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 24px;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;
          margin-bottom: 20px;
          color: white;

          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.6);
          }

          .el-icon {
            margin-right: 6px;
            font-size: 18px;
          }
        }

        // 预览功能样式
        .preview-section {
          margin-top: 30px;
          padding: 25px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          }

          .preview-header {
            margin-bottom: 20px;
            text-align: center;

            .preview-icon {
              font-size: 32px;
              color: #667eea;
              margin-bottom: 10px;
            }

            h3 {
              font-size: 18px;
              color: #2c3e50;
              margin: 10px 0 5px 0;
              font-weight: 600;
            }

            p {
              color: #7f8c8d;
              margin: 0;
              font-size: 14px;
            }
          }

          .preview-links {
            display: flex;
            flex-direction: column;
            gap: 15px;

            .preview-link {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              padding: 16px 20px;
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              color: #495057;
              text-decoration: none;
              border-radius: 12px;
              border: 2px solid transparent;
              font-weight: 500;
              font-size: 15px;
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;

              &:hover {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                text-decoration: none;
              }

              .el-icon {
                font-size: 18px;
                width: 18px;
                height: 18px;
              }

              .external-icon {
                font-size: 14px;
                opacity: 0.8;
                margin-left: auto;
              }

              span {
                flex: 1;
                text-align: center;
              }

              // 添加悬停时的光效
              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
              }

              &:hover::before {
                left: 100%;
              }
            }
          }
        }
      }

    }
  }

  // 预览功能模块样式
  .preview-panel {
    .preview-content {
      .preview-description {
        margin-bottom: 30px;

        .description-card {
          gap: 15px;
          padding: 0 10px 10px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          border: 1px solid #dee2e6;

          .description-icon {
            font-size: 24px;
            color: #667eea;
            margin-top: 2px;
          }

          .description-text {
            font-size: 16px;
            color: #2c3e50;

            p {
              color: #6c757d;
              margin: 0;
              font-size: 14px;
            }
          }
        }
      }

      .preview-links-section {
        margin-bottom: 20px;

        .preview-link-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 10px;
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .link-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;

            .link-icon {
              font-size: 24px;
              color: #667eea;
              width: 24px;
              height: 24px;
            }

            .link-info {
              h4 {
                font-size: 16px;
                color: #2c3e50;
                margin: 0 0 5px 0;
                font-weight: 600;
              }

              p {
                color: #6c757d;
                margin: 0;
                font-size: 14px;
              }
            }
          }

          .link-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .preview-btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 12px 20px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 500;
              font-size: 14px;
              transition: all 0.3s ease;
              border: none;
              cursor: pointer;

              &.primary {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                color: #495057;
                border: 1px solid #dee2e6;

                &:hover {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  border-color: transparent;
                  transform: translateY(-2px);
                }
              }

              .el-icon {
                font-size: 16px;
                width: 16px;
                height: 16px;
              }
            }

            .link-url {
              span {
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 12px;
                color: #6c757d;
              }
            }
          }
        }
      }

      .preview-features {
        h3 {
          font-size: 18px;
          color: #2c3e50;
          margin: 0 0 20px 0;
          font-weight: 600;
          text-align: center;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;

          .feature-card {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            border: 1px solid #e9ecef;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-3px);
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            }

            .feature-icon {
              font-size: 32px;
              color: #667eea;
              margin-bottom: 15px;
              width: 32px;
              height: 32px;
            }

            h4 {
              font-size: 16px;
              color: #2c3e50;
              margin: 0 0 10px 0;
              font-weight: 600;
            }

            p {
              color: #6c757d;
              margin: 0;
              font-size: 14px;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }
}



// 响应式设计
@media (max-width: 1200px) {
  .website-generation {
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
  .website-generation {
    padding: 15px;

    .page-layout {
      gap: 15px;
    }

    .page-header .page-title {
      font-size: 20px;
    }

    .selection-container {
      padding: 25px 20px;
    }

    .function-title {
      font-size: 20px;
    }

    .panel-body {
      padding: 20px 15px;

      .feature-highlights {
        grid-template-columns: 1fr;
        gap: 15px;
      }
    }

    .action-section {
      padding: 20px 15px;

      .start-btn {
        height: 44px;
        padding: 0 30px;
        font-size: 15px;
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

