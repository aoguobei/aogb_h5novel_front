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
                  :class="{ selected: selectedFunction === 'generate' }"
                  @click="onFunctionChange('generate')"
                >
                  <el-icon><Monitor /></el-icon>
                  创建网站
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
              <div class="step-number">1</div>
              <div class="step-content">
                <div class="step-header">
                  <div class="step-icon-wrapper">
                    <el-icon class="step-icon"><Message /></el-icon>
                  </div>
                  <div class="step-info">
                    <div class="step-title">找运维申请域名</div>
                    <p>发送邮件,申请域名</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="step-item"
              :class="{ 'active': selectedStep === 'backend' }"
              @click="selectStep('backend')"
            >
              <div class="step-number">2</div>
              <div class="step-content">
                <div class="step-header">
                  <div class="step-icon-wrapper">
                    <el-icon class="step-icon"><Setting /></el-icon>
                  </div>
                  <div class="step-info">
                    <div class="step-title">抖音/快手网站应用配置</div>
                    <p>配置网站应用后台</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="step-item"
              :class="{ 'active': selectedStep === 'poseidon' }"
              @click="selectStep('poseidon')"
            >
              <div class="step-number">3</div>
              <div class="step-content">
                <div class="step-header">
                  <div class="step-icon-wrapper">
                    <el-icon class="step-icon"><Setting /></el-icon>
                  </div>
                  <div class="step-info">
                    <div class="step-title">风行后台配置</div>
                    <p>配置波塞冬系统&微距系统</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 邮件表单区域 -->
          <div v-if="selectedStep === 'email'" class="content-section">
            <div class="email-form-container">
              <div class="email-form-header">
                <el-icon class="form-icon"><Message /></el-icon>
                <h3>发送域名申请邮件</h3>
                <p>填写后，我们将立即发送邮件通知运维团队，为您启动域名申请流程</p>
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
                  <p style="color: red;">为确保正常使用，请您前往平台完成必要的配置</p>
                   <div class="step-links">
                     <a href="https://developer.open-douyin.com/console?type=4" target="_blank" class="link-btn">
                       <el-icon><Link /></el-icon>
                       抖音控制台
                     </a>
                     <a href="https://open.kuaishou.com/platform/console?tabType=4" target="_blank" class="link-btn">
                       <el-icon><Link /></el-icon>
                       快手控制台
                     </a>
                   </div>
                </div>
              </div>
              <div class="step-notes">
                <div class="note-item">
                  <strong>抖音端配置：</strong>
                  <ul>
                    <li>新建一个网站应用</li>
                    <li>添加开发者权限</li>
                    <li>配置安全域名、应用信息、授权回调地址</li>
                  </ul>
                  <strong>快手端配置：</strong>
                  <ul>
                    <li>新建一个网站应用</li>
                    <li>配置授权回调域</li>
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
                  <p style="color: red;">为确保正常使用，请您前往平台完成必要的配置 </p>
                  <div class="step-links">
                     <a href="https://poadmin2.funshion.com/static/html/main.html" target="_blank" class="link-btn">
                       <el-icon><Link /></el-icon>
                       波塞冬平台系统
                     </a>
                  </div>
                </div>
              </div>
              <div class="step-notes">
                <div class="note-item">
                  <strong>基础信息适配：</strong>
                  <ul>
                    <li>cl:比如tt_h5_xingchennovel</li>
                    <li>customer:tt_xingchennovel</li>
                    <li>client key:xxx</li>
                    <li>client sercret:xxx</li>
                    <li>支付网关适配，包括商户管理，支付网关管理，代运营客户管理</li>
                  </ul>
                  <strong>抖音端特殊配置：</strong>
                  <ul>
                    <li>getSignInfo接口域名白名单配置</li>
                    <li>业务线配置access_token权限</li>
                    <li>播放接口内容问题处理</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

            <!-- 微距后台配置备注 -->
            <div v-if="selectedStep === 'poseidon'" class="content-section">
            <div class="notes-container">
              <div class="horizontal alignCenter notes-header">
                <el-icon class="notes-icon"><Document /></el-icon>
                <div>
                  <h3>微距后台配置说明</h3>
                  <p style="color: red;">为确保正常使用，请您前往平台完成必要的配置 </p>
                  <div class="step-links">
                     <a href="https://atlas.funshion.com/atlas3/ad/index" target="_blank" class="link-btn">
                       <el-icon><Link /></el-icon>
                       微距广告投放系统
                     </a>
                  </div>
                </div>
              </div>
              <div class="step-notes">
                <div class="note-item">
                  <strong>微距广告位申请：</strong>
                  <ul>
                    <li>抖音_H5_商业化策略, 比如tt_h5_xingchen_business_type</li>
                    <li>抖音_H5_公共开关, 比如tt_h5_xingchen_public_switch</li>
                  </ul>
                </div>
              </div>
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
            <div class="panel-title">创建网站</div>
            <p>通过简单的步骤配置，快速创建您的网站</p>
          </div>
        </div>
      </div>

      <div class="panel-body">
        <div class="generate-content">
          <div class="preview-features">
            <div class="features-list">
              <div class="title">功能特点</div>
              <div class="feature-item">
                <div class="feature-icon-wrapper">
                  <el-icon class="feature-icon"><Setting /></el-icon>
                </div>
                <div class="feature-content">
                  <h4>简单配置</h4>
                  <p>选择brand、配置基础信息、设置主题等</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon-wrapper">
                  <el-icon class="feature-icon"><Monitor /></el-icon>
                </div>
                <div class="feature-content">
                  <h4>实时预览</h4>
                  <p>配置过程中实时预览网站效果</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon-wrapper">
                  <el-icon class="feature-icon"><Document /></el-icon>
                </div>
                <div class="feature-content">
                  <h4>自动生成</h4>
                  <p>自动生成配置文件和项目结构</p>
                </div>
              </div>
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

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Setting, Document, Monitor, Right, Message, Link } from '@element-plus/icons-vue'
import EmailForm from '@/components/common/EmailForm.vue'
import Header from '@/components/common/Header.vue'

const router = useRouter()
const selectedFunction = ref('domain')
const emailFormRef = ref()
const selectedStep = ref('') // 选中的步骤



// 功能选择切换
const onFunctionChange = (value) => {
  if (value === 'domain') {
    selectedFunction.value = 'domain'
  } else {
    selectedFunction.value = 'generate'
  }
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
      width: 250px;
      box-sizing: border-box;
      flex-shrink: 0;
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
          gap: 10px;
          font-weight: 600;
          font-size: 16px;
          padding: 0 25px;
          cursor: pointer;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;

          &:hover {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          }

          &.selected {
            background: linear-gradient(135deg, #a8a4e6 0%, #9b7bb8 100%);
            color: white;
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
    overflow: visible;

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

      // 预览功能样式 - 通用
      .preview-features {
        h3 {
          font-size: 18px;
          color: #2c3e50;
          margin: 0 0 20px 0;
          font-weight: 600;
          text-align: center;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          //gap: 12px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 15px 20px;
          border: 1px solid #e9ecef;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

          .title {
            font-size: 18px;
            font-weight: 600;
            padding: 5px 15px;
          }

          .feature-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 15px;
            border-radius: 8px;

            .feature-icon-wrapper {
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 50%;
              flex-shrink: 0;

              .feature-icon {
                font-size: 14px;
                color: white;
                width: 14px;
                height: 14px;
              }
            }

            .feature-content {
              flex: 1;

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
                line-height: 1.5;
              }
            }
          }
        }
      }

      // 通用图标样式
      .feature-icon-wrapper {
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

      .feature-icon {
        font-size: 32px;
        color: white;
        width: 32px;
        height: 32px;
      }

      // 通用步骤展示样式
      .domain-steps,
      .publish-steps,
      .deploy-steps {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;

        .step-item {
          .card-base();
          padding: 15px;
          cursor: pointer;
          position: relative;

          &.active {
            transform: translateY(-3px);
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
          }

          .step-number {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 28px;
            height: 28px;
            background: #fff;
            // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            // color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 2px 8px rgb(184, 197, 209);
            z-index: 2;
          }

          .step-content {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .step-header {
            display: flex;
            align-items: flex-start;
            gap: 15px;
          }

          .step-icon-wrapper {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            flex-shrink: 0;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }

          .step-icon {
            font-size: 24px;
            color: white;
          }

          .step-info {
            flex: 1;
            min-width: 0;
          }

          .step-title {
            font-size: 16px;
            color: #2c3e50;
            margin-bottom: 4px;
            font-weight: 600;
            line-height: 1.3;
          }

          p {
            color: #7f8c8d;
            line-height: 1.5;
            margin: 0;
            font-size: 13px;
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
          box-sizing: border-box;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 35px rgba(0, 0, 0, 0.15);
          }
        }

        // 分支表单容器样式
        .branch-form-container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 25px;
          transition: all 0.3s ease;
          box-sizing: border-box;

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

      // 全局step-links样式
      .step-links {
        margin-top: 5px;
        display: flex;
        gap: 10px;
        justify-content: flex-start;
        flex-wrap: wrap;

        .link-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          background: #f8f9fa;
          color: #495057;
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
        margin-top: 20px;

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
    }

    .action-section {
      .start-btn {
        height: 44px;
        padding: 0 30px;
        font-size: 15px;
      }
    }

    /* 右侧面板小屏幕样式 */
    .right-panel {
      width: 100%;
      min-width: 0;
    }

    .function-panel {
      width: 100%;
      min-width: 0;
    }

    .panel-body {
      width: 100%;
      min-width: 0;
    }

    .content-area {
      width: 100%;
      min-width: 0;
    }

    /* 邮件表单容器小屏幕样式 */
    .email-form-container {
      padding: 15px;
      max-width: 100%;
      width: 100%;
    }

    .content-section {
      margin-top: 20px;
      max-width: 100%;
    }

    /* 强制所有内容不溢出 */
    .publish-content {
      max-width: 100%;
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

