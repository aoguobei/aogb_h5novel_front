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
                  :class="{ selected: selectedFunction === 'email' }"
                  @click="onFunctionChange('email')"
                >
                  <el-icon><Message /></el-icon>
                  发送邮件
                </div>
                <div
                  class="function-option"
                  :class="{ selected: selectedFunction === 'generate' }"
                  @click="onFunctionChange('generate')"
                >
                  <el-icon><Monitor /></el-icon>
                  生成网站
                </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">

    <!-- 邮件发送模块 - 增强面板效果 -->
    <div v-if="selectedFunction === 'email'" class="function-panel email-panel">
      <div class="panel-header">
        <div class="header-content">
          <el-icon class="panel-icon"><Message /></el-icon>
          <div class="header-text">
            <div class="panel-title">邮件配置</div>
            <p>填写您的邮箱，我们将发送详细的网站配置信息</p>
          </div>
        </div>
      </div>

      <div class="panel-body">
        <EmailForm
          ref="emailFormRef"
          :default-subject="'网站创建配置信息'"
          @email-sent="handleEmailSent"
        />
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Setting, Document, Monitor, Right, Message } from '@element-plus/icons-vue'
import EmailForm from '@/components/common/EmailForm.vue'
import Header from '@/components/common/Header.vue'

const router = useRouter()
const selectedFunction = ref('generate')
const emailFormRef = ref()

// 功能选择切换
const onFunctionChange = (value) => {
  if (value === 'email') {
    console.log('切换到邮件发送模块')
    selectedFunction.value = 'email'
  } else {
    console.log('切换到网站生成模块')
    selectedFunction.value = 'generate'
  }
}

// 处理邮件发送结果
const handleEmailSent = (result) => {
  if (result.success) {
    ElMessage.success('邮件已发送，请查收！')
    // 邮件发送成功后，可以考虑跳转到网站生成模块
    selectedFunction.value = 'generate'
  }
}

// 跳转到创建网站页面
const goToCreateWebsite = () => {
  router.push('/create-website')
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

      // 特性展示
      .feature-highlights {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;

        .feature-item {
          text-align: center;
          padding: 20px 15px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          }

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
            font-size: 28px;
            color: white;
          }

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
</style>

