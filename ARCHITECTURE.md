# 前端架构说明

## 📁 目录结构

```
frontend/src/
├── api/                    # API 请求层
│   ├── request.js         # axios 配置和拦截器
│   ├── brand.js           # 品牌相关 API
│   ├── website.js         # 网站相关 API
│   └── config.js          # 配置相关 API
├── components/            # 组件
│   ├── common/           # 通用组件
│   │   ├── BaseCard.vue
│   │   └── LoadingSpinner.vue
│   └── business/         # 业务组件
│       ├── BrandCard.vue
│       ├── WebsiteCard.vue
│       └── ConfigStatus.vue
├── composables/          # 组合式函数
│   ├── useBrand.js       # 品牌相关逻辑
│   ├── useWebsite.js     # 网站相关逻辑
│   └── useConfig.js      # 配置相关逻辑
├── stores/               # 状态管理
│   ├── brand.js
│   ├── website.js
│   └── index.js
├── views/                # 页面组件
│   ├── BrandList.vue
│   ├── CreateWebsite.vue
│   ├── WebsiteConfigs.vue
│   └── WebsiteConfig.vue
├── router/
│   └── index.js
├── App.vue
└── main.js
```

## 🏗️ 架构特点

### 1. **API 层 (api/)**
- 按功能分组：`brand.js`、`website.js`、`config.js`
- 统一的请求配置和错误处理
- 响应拦截器自动处理数据格式

### 2. **组合式函数 (composables/)**
- 封装业务逻辑，提高代码复用性
- 统一的错误处理和用户提示
- 响应式数据管理

### 3. **组件分层 (components/)**
- **通用组件 (common/)**: 基础UI组件，如卡片、加载器等
- **业务组件 (business/)**: 特定业务逻辑的组件，如品牌卡片、网站卡片等

### 4. **状态管理 (stores/)**
- 使用 Pinia 进行状态管理
- 按功能模块划分 store
- 提供 getters 和 actions

## 🔧 使用示例

### API 调用
```javascript
import { brandApi } from '@/api/brand'

// 获取品牌列表
const response = await brandApi.getBrands()
```

### 组合式函数
```javascript
import { useBrand } from '@/composables/useBrand'

const { brands, loading, fetchBrands, createBrand } = useBrand()
```

### 状态管理
```javascript
import { useBrandStore } from '@/stores/brand'

const brandStore = useBrandStore()
await brandStore.fetchBrands()
```

### 组件使用
```vue
<template>
  <BrandCard 
    :brand="brand" 
    @view="handleView" 
    @edit="handleEdit" 
    @delete="handleDelete" 
  />
</template>
```

## 🎯 优势

1. **模块化**: 按功能分组，便于维护
2. **可复用性**: 通用组件和组合式函数提高代码复用
3. **类型安全**: API 层统一管理，减少重复代码
4. **状态管理**: 使用 Pinia 进行集中状态管理
5. **易于扩展**: 结构清晰，便于后续功能扩展 