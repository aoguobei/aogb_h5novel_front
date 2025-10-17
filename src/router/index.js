import { createRouter, createWebHistory } from 'vue-router'
import CreateWebsite from '../views/CreateWebsite.vue'
import WebsiteConfig from '../views/WebsiteConfig.vue'
import WebsiteConfigs from '../views/WebsiteConfigs.vue'
import WebsiteGeneration from '../views/WebsiteGeneration.vue'
import GitSync from '../views/GitSync.vue'
import IntranetPublish from '../views/IntranetPublish.vue'
import InternetPublish from '../views/InternetPublish.vue'
import DatabaseExport from '../views/DatabaseExport.vue'
// 保留组件导入，用于向后兼容
import TestLinkManagement from '../views/TestLinkManagement.vue'

const routes = [
  {
    path: '/',
    name: 'WebsiteConfigs',
    component: WebsiteConfigs
  },
  {
    path: '/create-website',
    name: 'CreateWebsite',
    component: CreateWebsite
  },
  {
    path: '/website-config/:clientId',
    name: 'WebsiteConfig',
    component: WebsiteConfig,
    props: true
  },
  {
    path: '/website-generation',
    name: 'WebsiteGeneration',
    component: WebsiteGeneration
  },

  {
    path: '/git-sync',
    name: 'GitSync',
    component: GitSync
  },

  // 内网发布页面
  {
    path: '/intranet-publish',
    name: 'IntranetPublish',
    component: IntranetPublish
  },

  // 外网发布页面
  {
    path: '/internet-publish',
    name: 'InternetPublish',
    component: InternetPublish
  },

  // 数据库导出页面
  {
    path: '/database-export',
    name: 'DatabaseExport',
    component: DatabaseExport
  },

  {
    path: '/test-links',
    name: 'TestLinkManagement',
    component:TestLinkManagement,
    meta: {
      title: '测试链接列表',
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory('/h5novelwebconfig/'),
  routes
})

export default router
