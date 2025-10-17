<template>
    <div class="deploy-management">
      <!-- 页面标题 -->
      <Header title="外网发布" subtitle="管理H5网站发布到外网的一系列流程"></Header>

      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 左侧功能选择区 -->
        <div class="function-selector">
          <div class="selector-header">
            <h3>操作步骤</h3>
          </div>

          <div class="function-list">
            <div
              class="function-item"
              :class="{ active: activeTab === 'branch' }"
              @click="switchTab('branch')"
            >
              <div class="step-number">1</div>
              <div class="item-content">
                <h4>拉分支</h4>
                <p>代码库新建发布分支</p>
              </div>
            </div>

            <div
              class="function-item"
              :class="{ active: activeTab === 'email' }"
              @click="switchTab('email')"
            >
              <div class="step-number">2</div>
              <div class="item-content">
                <h4>发邮件</h4>
                <p>通知运维创建发布配置</p>
              </div>
            </div>

            <div
              class="function-item"
              :class="{ active: activeTab === 'build' }"
              @click="switchTab('build')"
            >
              <div class="step-number">3</div>
              <div class="item-content">
                <h4>构建上传</h4>
                <p>网站构建与部署</p>
              </div>
            </div>

            <div
              class="function-item"
              :class="{ active: activeTab === 'spug' }"
              @click="switchTab('spug')"
            >
              <div class="step-number">4</div>
              <div class="item-content">
                <h4>Spug公网发布</h4>
                <p>通过Spug进行上线部署</p>
              </div>
            </div>

            <div
              class="function-item"
              :class="{ active: activeTab === 'preview' }"
              @click="switchTab('preview')"
            >
              <div class="step-number">5</div>
              <div class="item-content">
                <h4>预览功能</h4>
                <p>测试链接预览</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧功能内容区 -->
        <div class="function-content">
          <!-- 拉分支功能 -->
          <div v-if="activeTab === 'branch'" class="tab-content">
            <!-- 重要提示信息 -->
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 8px; margin: 0; text-align: center;">
              <div style="color: #dc2626; font-size: 14px; font-weight: 600;">此分支创建流程，仅针对新创建的网站。对于已上线运行的网站，无需也请勿重复配置</div>
            </div>

            <div class="branch-content">
              <BranchForm
                ref="branchFormRef"
                @branch-pulled="handleBranchPulled"
              />
            </div>
          </div>

          <!-- 发邮件功能 -->
          <div v-if="activeTab === 'email'" class="tab-content">
            <!-- 重要提示信息 -->
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 8px; margin: 0; text-align: center;">
              <div style="color: #dc2626; font-size: 14px; font-weight: 600;">此发布配置流程，仅针对新创建的网站。对于已上线运行的网站，无需也请勿重复配置</div>
            </div>

            <div class="email-content">
              <div class="content-header">
                <h3>给运维团队发送发布配置邮件</h3>
                <p>填写收件人邮箱，请求创建发布配置</p>
              </div>
              <EmailForm
                ref="emailFormRef"
                :default-subject="'网站发布配置信息'"
                :template="'publish'"
                @email-sent="handleEmailSent"
              />
            </div>
          </div>

          <!-- 构建上传功能 -->
          <div v-if="activeTab === 'build'" class="tab-content">
            <BuildManager :env-type="'internet'" />
          </div>

          <!-- Spug管理功能 -->
          <div v-if="activeTab === 'spug'" class="tab-content">
            <!-- 重要提示信息 -->
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 8px; margin: 0; text-align: center;">
              <div style="color: #dc2626; font-size: 14px; font-weight: 600;">考虑到风险，公网部署权限，仅对核心团队成员开放。</div>
            </div>
            <div class="spug-content">
              <div class="content-header">
                <h3>Spug公网发布</h3>
                <p>上线部署到公网服务器</p>
              </div>
              <div class="spug-notes">
                <div class="note-item">
                  <strong>Spug链接：</strong>
                  <div class="spug-link">
                    <a href="https://ops.funshion.com/deploy/request" target="_blank" class="link-btn primary">
                      <el-icon><Link /></el-icon>
                      访问Spug
                    </a>
                    <span class="link-url">https://ops.funshion.com/deploy/request</span>
                  </div>
                </div>
                <div class="note-item">
                  <strong>主要功能：</strong>
                  <ul>
                    <li>应用部署管理</li>
                    <li>服务器监控</li>
                    <li>日志查看</li>
                    <li>权限管理</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 预览功能 -->
          <div v-if="activeTab === 'preview'" class="tab-content">
            <div class="preview-content">
              <div class="content-header">
                <h3>测试链接预览</h3>
                <p>管理和预览网站的测试链接</p>
              </div>
              <div class="preview-info">
                <div class="info-card">
                  <div class="info-icon">
                    <el-icon><Link /></el-icon>
                  </div>
                  <div class="info-content">
                    <h4>测试链接管理</h4>
                    <p>在测试链接管理页面，您可以：</p>
                    <ul>
                      <li>管理测试网站</li>
                      <li>管理测试链接</li>
                      <li>在正式环境下, 预览网站的效果</li>
                    </ul>
                  </div>
                  <div class="horizontal img-container">
                    <div class="vertical align_center">
                      <div class="img-item">
                        <img style="width:251px" src="/imgs/internet1.jpg" alt="外网预览图1">
                      </div>
                      <text>外网测试环境</text>
                    </div>
                    <div class="vertical align_center">
                      <div class="img-item">
                        <img class="match_width" src="/imgs/internet2.jpg" alt="外网预览图2">
                      </div>
                      <text>外网正式环境</text>
                    </div>
                  </div>
                </div>
                <div class="preview-actions">
                  <el-button
                    type="primary"
                    size="large"
                    @click="goToTestLinks"
                    class="preview-btn"
                  >
                    <el-icon><Link /></el-icon>
                    跳转到测试链接管理
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
  import { onMounted, ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import Header from '@/components/common/Header.vue'
  import BuildManager from '@/components/build/BuildManager.vue'
  import BranchForm from '@/components/common/BranchForm.vue'
  import EmailForm from '@/components/common/EmailForm.vue'
  import { Link } from '@element-plus/icons-vue'

  const router = useRouter()
  const route = useRoute()

  // 标签页状态
  const activeTab = ref('branch')

  // 表单引用
  const branchFormRef = ref()
  const emailFormRef = ref()

  // 切换标签页
  const switchTab = (tabName) => {
    activeTab.value = tabName
  }

  // 跳转到测试链接页面
  const goToTestLinks = () => {
    router.push('/test-links')
  }

  // 处理分支拉取成功
  const handleBranchPulled = () => {
    // 不关闭表单，让用户可以看到操作结果
  }

  // 处理邮件发送成功
  const handleEmailSent = () => {
    // 可以在这里添加成功提示或其他逻辑
  }

  onMounted(() => {
    const tab = route.query.tab
    if (tab) {
      activeTab.value = tab
    }
  })
  </script>

  <style lang="less" scoped>
  .deploy-management {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* 主要内容区域 */
  .main-content {
    display: flex;
    gap: 24px;
    margin: 0 auto;
  }

  /* 左侧功能选择区 */
  .function-selector {
    width: 250px;
    box-sizing: border-box;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 20px;
    height: fit-content;
  }

  .selector-header {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e2e8f0;
  }

  .selector-header h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #2d3748;
    font-weight: 600;
  }

  .function-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .function-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }

  .step-number {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .function-item.active .step-number {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }

  .function-item:hover {
    background: #f8faff;
    border-color: #e2e8f0;
  }

  .function-item.active {
    background: linear-gradient(135deg, #f8faff 0%, #f0f2ff 100%);
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
  }

  .item-content {
    flex: 1;
  }

  .item-content h4 {
    margin: 0 0 4px 0;
    font-size: 1rem;
    color: #2d3748;
    font-weight: 600;
  }

  .item-content p {
    margin: 0;
    font-size: 0.85rem;
    color: #64748b;
    line-height: 1.4;
  }

  /* 右侧功能内容区 */
  .function-content {
    flex: 1;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  .tab-content {
    padding: 0;
  }

  /* 通用内容头部样式 */
  .content-header {
    /* padding: 20px; */
    text-align: center;
    /* background: linear-gradient(135deg, #f8faff 0%, #f0f2ff 100%); */
    /* border-radius: 12px; */
    /* margin: 20px; */
    margin-bottom: 20px;
  }

  .content-header h3 {
    margin: 0 0 8px 0;
    font-size: 20px;
    color: #2d3748;
    font-weight: 600;
  }

  .content-header p {
    margin: 0;
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
  }

  /* 分支功能样式 */
  .branch-content {
    padding: 20px;
  }

  /* 邮件功能样式 */
  .email-content {
    padding: 20px;
  }

  .info-card {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    margin-bottom: 20px;
    transition: all 0.3s ease;
  }

  .info-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .info-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    flex-shrink: 0;
  }

  .info-icon .el-icon {
    font-size: 24px;
    color: white;
  }

  .info-content {
    flex: 1;
  }

  .info-content h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #2d3748;
    font-weight: 600;
  }

  .info-content p {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
  }

  .info-content ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .info-content li {
    margin-bottom: 6px;
    font-size: 13px;
    color: #4a5568;
    position: relative;
    padding-left: 16px;
  }

  .info-content li::before {
    content: "•";
    position: absolute;
    left: 0;
    top: 0;
    color: #667eea;
    font-weight: bold;
    font-size: 14px;
  }

  /* Spug管理功能样式 */
  .spug-content {
    padding: 20px;
  }

  .spug-notes {
    margin-top: 20px;
    padding: 20px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    border: 1px solid #dee2e6;
  }

  .note-item {
    margin-bottom: 16px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    border-left: 4px solid #667eea;
  }

  .note-item:last-child {
    margin-bottom: 0;
  }

  .note-item strong {
    color: #2d3748;
    font-weight: 600;
    font-size: 14px;
    display: block;
    margin-bottom: 8px;
  }

  .note-item ul {
    list-style: none;
    padding: 0;
    margin: 0;
    color: #555;
    font-size: 13px;
    line-height: 1.6;
  }

  .note-item li {
    margin-bottom: 4px;
    position: relative;
    padding-left: 16px;
  }

  .note-item li::before {
    content: "•";
    position: absolute;
    left: 0;
    top: 0;
    color: #667eea;
    font-weight: bold;
    font-size: 14px;
  }

  .spug-link {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .link-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    width: fit-content;
  }

  .link-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    text-decoration: none;
  }

  .link-url {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    color: #6c757d;
    background: #f8f9fa;
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid #e9ecef;
    word-break: break-all;
  }

  /* 预览功能样式 */
  .preview-content {
    padding: 20px;
  }

  .preview-info {
    margin-top: 20px;
  }


  .preview-actions {
    display: flex;
    justify-content: center;
  }

  .preview-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
  }

  .preview-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  .img-container {
    gap: 12px;justify-content: space-around;padding: 8px;background:  #e2e8f0;border-radius:8px;

    .img-item {
      width: 250px;height: 400px;overflow: hidden;
    }

    & text {
      margin-top: 4px;
      font-size: 13px;
    }
  }

  /* 响应式设计 */
  @media (max-width: 1024px) {
    .main-content {
      flex-direction: column;
      gap: 20px;
    }

    .function-selector {
      width: 100%;
    }

    .function-list {
      flex-direction: row;
      gap: 12px;
    }

    .function-item {
      flex: 1;
      justify-content: center;
      text-align: center;
    }

    .item-content h4 {
      font-size: 0.9rem;
    }

    .item-content p {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 768px) {
    .deploy-management {
      padding: 16px;
    }

    .function-selector {
      padding: 16px;
    }

    .function-item {
      padding: 12px;
    }
  }

  @media (max-width: 480px) {
    .function-list {
      flex-direction: column;
    }

    .function-item {
      justify-content: flex-start;
      text-align: left;
    }
  }
  </style>
