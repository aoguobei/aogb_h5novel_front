<template>
  <div id="app">
    <el-container>
      <el-aside width="180px">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <img src="/logo.svg" alt="Logo" class="logo-image" />
          </div>
        </div>
        <el-menu
          :default-active="$route.path"
          class="sidebar-menu"
          router
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>小说列表</span>
          </el-menu-item>
          <el-menu-item index="/website-configs">
            <el-icon><Setting /></el-icon>
            <span>小说配置</span>
          </el-menu-item>
          <el-menu-item index="/website-generation">
            <el-icon><Document /></el-icon>
            <span>网站生成</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { House, Setting, Document } from '@element-plus/icons-vue'
</script>

<style lang="less">
@import "@/app.less";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  background: #fafbfc;
}

.el-container {
  height: 100vh;
}

.el-main {
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
}

.el-aside {
  background: linear-gradient(180deg, #ffffff 0%, #faf5ff 100%);
  border-right: 1px solid #e9d5ff;
  box-shadow: 2px 0 12px rgba(139, 92, 246, 0.08);
  height: 100vh;
}

.sidebar-header {
  padding: 24px 20px 20px;
  border-bottom: 1px solid #e9d5ff;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  text-align: center;
}

.sidebar-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
}

.logo-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.15);
  transition: all 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.25);
}

.sidebar-menu {
  border-right: none;
  background-color: transparent;
}

.sidebar-menu .el-menu-item {
  margin: 8px;
  border-radius: 8px;
  height: 44px;
  line-height: 44px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.sidebar-menu .el-menu-item:hover {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
}

.sidebar-menu .el-menu-item.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style>
