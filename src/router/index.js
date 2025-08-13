import { createRouter, createWebHistory } from 'vue-router'
import BrandList from '../views/BrandList.vue'
import CreateWebsite from '../views/CreateWebsite.vue'
import WebsiteConfig from '../views/WebsiteConfig.vue'
import WebsiteConfigs from '../views/WebsiteConfigs.vue'
import BrandClients from '../views/BrandClients.vue'

const routes = [
  {
    path: '/',
    name: 'BrandList',
    component: BrandList
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
    path: '/website-configs',
    name: 'WebsiteConfigs',
    component: WebsiteConfigs
  },
  {
    path: '/brand/:brandId/clients',
    name: 'BrandClients',
    component: BrandClients,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 