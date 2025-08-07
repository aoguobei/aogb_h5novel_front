<template>
  <div id="app">
    <el-container>
      <el-aside width="180px">
        <div class="sidebar-header">
          <h3>配置管理</h3>
        </div>
        <el-menu
          :default-active="$route.path"
          class="sidebar-menu"
          router
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>品牌管理</span>
          </el-menu-item>
          <el-menu-item index="/website-configs">
            <el-icon><Setting /></el-icon>
            <span>网站配置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <h1>品牌配置管理系统</h1>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { House, Setting } from '@element-plus/icons-vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}

.el-container {
  height: 100vh;
}

.el-main {
  padding: 20px;
  margin-top: 60px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.el-aside {
  background-color: #ffffff;
  border-right: 1px solid #f0f0f0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  height: calc(100vh - 60px);
  margin-top: 60px;
}

.sidebar-header {
  padding: 20px 16px 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  color: #606266;
  font-weight: 500;
}

.sidebar-menu {
  border-right: none;
  background-color: transparent;
}

.sidebar-menu .el-menu-item {
  margin: 4px 8px;
  border-radius: 6px;
  height: 44px;
  line-height: 44px;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #f5f7fa;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #409eff;
  color: white;
}

.el-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  line-height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.el-header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.el-main {
  padding: 20px;
}
</style>
