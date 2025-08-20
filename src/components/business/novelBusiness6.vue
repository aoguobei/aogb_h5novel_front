<template>
  <div class="novel-business-6" :style="themeStyle">
    <!-- 支付弹窗预览 -->
    <div class="preview-payment-dialog">
      <!-- 背景装饰 -->
      <div class="bg-1"></div>
      <div class="bg-2 payment-dialog-head-bg"></div>
      
      <!-- 标题区域 -->
      <div class="dialog-content">
        <div class="novel-title">《宁安春若梦》</div>
        <p class="novel-desc">后续是付费内容，开通会员阅读全站内容</p>
        
        <!-- 解锁说明 -->
        <div class="unlock-section">
          <span class="unlock-title">解锁书籍</span>
          <span class="unlock-desc">也可充值书币，本书仅需990阅读币</span>
        </div>
        
        <!-- 套餐选择区域 -->
        <div class="packages-grid">
          <div 
            v-for="(pkg, index) in packages" 
            :key="index"
            :class="['package-item', { 'selected': selectedIndex === index }]"
            @click="selectPackage(index)"
          >
            <div class="package-name">{{ pkg.name }}</div>
            <div class="package-price">
              <span class="price-symbol">¥</span>
              <span class="price-value">{{ pkg.price }}</span>
            </div>
            <div class="package-desc">{{ pkg.desc }}</div>
          </div>
        </div>
        
        <!-- 免责声明 -->
        <div class="disclaimer">
          <p class="disclaimer-text">日卡内测</p>
          <p class="disclaimer-detail">不允许未成年购买，购买后不支持退款，购买后如果您遇到无法解决，订单超时等问题，请<text class="contact">联系客服</text></p>
        </div>
        
        <!-- 支付按钮 -->
        <div class="pay-button">
          <span class="pay-text">立即支付 ¥{{ selectedPackage.price }}</span>
        </div>
        
        <!-- 协议勾选 -->
        <div class="agreement">
          <input type="checkbox" id="agreement" v-model="isAgreed" class="agreement-checkbox">
          <label for="agreement" class="agreement-text">同意《星辰文鉴付费服务协议》</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  themeConfig: {
    type: Object,
    default: () => ({
      theme_bg_main: '#409eff',
      theme_bg_second: 'rgba(240, 240, 240, 0.8)',
      theme_text_main: '#161812'
    })
  },
  businessConfig: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['color-change', 'config-update'])

// 套餐数据（写死）
const packages = ref([
  { name: '日卡内测', price: '1.00', desc: '日卡内测' },
  { name: '日卡测', price: '0.10', desc: '日卡内测' },
  { name: '连包内测', price: '13.00', desc: '连包内测' },
  { name: '日卡内测', price: '0.01', desc: '日卡内测' },
  { name: 'h5内测连包', price: '0.10', desc: 'h5内测连包' },
  { name: 'h5内测连包', price: '0.10', desc: 'h5内测连包' }
])

const selectedIndex = ref(0)
const isAgreed = ref(true)

const selectedPackage = computed(() => packages.value[selectedIndex.value])

// 主题样式计算
const themeStyle = computed(() => {
  const { theme_bg_main, theme_bg_second, theme_text_main } = props.themeConfig
  
  // 将主色调转换为RGB格式
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '64, 158, 255'
  }
  
  const primaryRgb = hexToRgb(theme_bg_main)
  
  return {
    '--primary-rgb': primaryRgb,
    '--primary-color': theme_bg_main,
    '--primary-light08': `rgba(${primaryRgb}, 0.08)`,
    '--primary-light80': `rgba(${primaryRgb}, 0.8)`,
    '--primary-headBg': theme_bg_second,
    '--text-main': theme_text_main
  }
})

const selectPackage = (index) => {
  selectedIndex.value = index
  emit('config-update', { selectedPackage: packages.value[index] })
}
</script>

<style scoped>
.novel-business-6 {
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
}

.preview-payment-dialog {
  width: 305px;
  position: relative;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 背景装饰 */
.bg-1 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: white;
  z-index: 1;
}

.bg-2 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 2;
}

.payment-dialog-head-bg {
  background: linear-gradient(180deg, var(--primary-headBg), #FFFFFF);
}

/* 内容区域 */
.dialog-content {
  position: relative;
  z-index: 3;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 标题 */
.novel-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.novel-desc {
  margin: 0 0 20px 0;
  font-size: 12px;
  color: rgba(22, 24, 18, 0.7);
  text-align: center;
  line-height: 1.4;
}

/* 解锁说明 */
.unlock-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.unlock-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-main);
}

.unlock-desc {
  font-size: 10px;
  color: rgba(22, 24, 18, 0.3);
}

/* 套餐网格 */
.packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.package-item {
  width: 80px;
  height: 100px;
  border: 0.5px solid #f5f5f5;
  border-radius: 8px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.package-item.selected {
  border-color: var(--primary-color);
  background: var(--primary-light08);
}

.package-name {
  font-size: 10px;
  color: var(--text-main);
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  line-height: 1.2;
}

.package-price {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
}

.price-symbol {
  font-size: 12px;
  color: var(--text-main);
  font-weight: bold;
}

.price-value {
  font-size: 16px;
  color: var(--text-main);
  font-weight: bold;
}

.package-item.selected .price-symbol,
.package-item.selected .price-value {
  color: var(--primary-color);
}

.package-desc {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  line-height: 20px;
  font-size: 9px;
  text-align: center;
  background: var(--primary-light08);
  color: var(--primary-color);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  font-weight: bold;
}

.package-item.selected .package-desc {
  background: var(--primary-color);
  color: white;
}

/* 免责声明 */
.disclaimer {
  margin-bottom: 16px;
}

.disclaimer-text {
  margin: 0 0 4px 0;
  font-size: 10px;
  color: rgba(22, 24, 18, 0.5);
  text-align: left;
}

.disclaimer-detail {
  margin: 0;
  font-size: 9px;
  color: rgba(22, 24, 18, 0.5);
  text-align: left;
  line-height: 1.3;
}

/* 支付按钮 */
.pay-button {
  height: 36px;
  border-radius: 18px;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 12px;
}

.pay-text {
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.contact {
    color: var(--primary-color);
}

/* 协议勾选 */
.agreement {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.agreement-checkbox {
  width: 14px;
  height: 14px;
  accent-color: var(--primary-color);
}

.agreement-text {
  font-size: 9px;
  color: rgba(22, 24, 18, 0.5);
  cursor: pointer;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .novel-business-6 {
    width: 100%;
    padding: 12px;
  }
  
  .preview-payment-dialog {
    width: 305px;
  }
}
</style> 