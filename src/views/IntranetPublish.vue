<template>
    <div class="deploy-management">
      <!-- 页面标题 -->
      <Header title="内网发布" subtitle="统一管理H5网站在内网（172.17.5.92）的构建、部署和环境配置"></Header>

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
              :class="{ active: activeTab === 'build' }"
              @click="switchTab('build')"
            >
              <div class="step-number">1</div>
              <div class="item-content">
                <h4>构建上传</h4>
                <p>网站构建与部署</p>
              </div>
            </div>

            <div
              class="function-item"
              :class="{ active: activeTab === 'nginx' }"
              @click="switchTab('nginx')"
            >
              <div class="step-number">2</div>
              <div class="item-content">
                <h4>环境配置</h4>
                <p>Nginx与DNS配置</p>
              </div>
            </div>

            <div
              class="function-item"
              :class="{ active: activeTab === 'preview' }"
              @click="switchTab('preview')"
            >
              <div class="step-number">3</div>
              <div class="item-content">
                <h4>预览功能</h4>
                <p>测试链接预览</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧功能内容区 -->
        <div class="function-content">
          <!-- 构建上传功能 -->
          <div v-if="activeTab === 'build'" class="tab-content">
            <BuildManager :env-type="'intranet'" />
          </div>

          <!-- 环境配置 (Nginx/DNS) -->
          <div v-if="activeTab === 'nginx'" class="tab-content">
            <DeployManager />
          </div>

          <!-- 预览功能 -->
          <div v-if="activeTab === 'preview'" class="tab-content">
            <div class="preview-content">
              <div class="content-header">
                <h3>测试链接预览</h3>
                <p>管理和预览网站的测试链接</p>
              </div>

              <!-- DNS配置提示 -->
              <div class="dns-notice">
                <div class="notice-content">
                  <el-icon class="notice-icon"><Warning /></el-icon>
                  <div class="notice-text">
                    <p class="notice-title">DNS配置说明</p>
                    <p class="notice-desc">内网发布时，网站部署在 <strong>172.17.5.92</strong> 上。</p>
                    <p class="notice-action">所以预览内网发布的网站时，请将您所用设备（电脑或手机）的DNS服务器地址修改为：<strong>172.17.5.92</strong></p>
                  </div>
                </div>
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
                      <li>在测试环境下，预览网站的效果</li>
                    </ul>
                  </div>
                  <div class="horizontal img-container">
                    <div class="vertical align_center">
                      <div class="img-item">
                        <img class="match_width" src="/imgs/intranet.jpg" alt="内网预览图1">
                      </div>
                      <text>内网测试环境</text>
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
  import DeployManager from '@/components/deploy/DeployManager.vue'
  import { Link, Warning } from '@element-plus/icons-vue'

  const router = useRouter()
  const route = useRoute()

  // 标签页状态
  const activeTab = ref('build')

  // 切换标签页
  const switchTab = (tabName) => {
    activeTab.value = tabName
  }

  // 跳转到测试链接页面
  const goToTestLinks = () => {
    router.push('/test-links?envType=test')
  }

  onMounted(() => {
    const tab = route.query.tab
    if (tab) {
      activeTab.value = tab
    }
  })
  </script>

  <style scoped>
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
    text-align: center;
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

  /* 预览功能样式 */
  .preview-content {
    padding: 20px;
  }

  /* DNS配置提示样式 */
  .dns-notice {
    margin: 20px 0;
    padding: 16px 20px;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    border: 1px solid #fecaca;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.1);
  }

  .notice-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .notice-icon {
    font-size: 20px;
    color: #dc2626;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .notice-text {
    flex: 1;
  }

  .notice-text p {
    margin: 0 0 8px 0;
    color: #dc2626;
    font-size: 14px;
    line-height: 1.5;
  }

  .notice-text p:last-child {
    margin-bottom: 0;
  }

  .notice-title {
    font-weight: 600;
    font-size: 15px;
    color: #b91c1c;
  }

  .notice-desc {
    font-weight: 500;
  }

  .notice-action {
    font-weight: 500;
  }

  .notice-text strong {
    color: #b91c1c;
    font-weight: 700;
  }

  .preview-info {
    margin-top: 20px;
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
