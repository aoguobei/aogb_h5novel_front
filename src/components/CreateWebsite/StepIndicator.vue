<template>
  <div class="steps-container">
    <div class="custom-steps">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="step-item"
        :class="{
          'completed': index < currentStep,
          'current': index === currentStep,
          'pending': index > currentStep
        }"
      >
        <div class="step-icon">
          <div class="step-icon-inner">
            <el-icon v-if="index < currentStep" class="check-icon"><CircleCheck /></el-icon>
            <span v-else class="step-number">{{ index + 1 }}</span>
          </div>
        </div>
        <div class="step-label">{{ step.title }}</div>
        <div class="step-connector" v-if="index < steps.length - 1">
          <div class="connector-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CircleCheck } from '@element-plus/icons-vue'

defineProps({
  steps: {
    type: Array,
    required: true
  },
  currentStep: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.steps-container {
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-height: 100px;
}

.custom-steps {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  position: relative;
  gap: 20px;
  height: 60px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  min-width: 0;
  height: 100%;
  justify-content: flex-start;
  transition: all 0.3s ease;
}

.step-item:hover {
  transform: translateY(-2px);
}

.step-item .step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.step-icon-inner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.step-item .step-number {
  font-size: 20px;
  font-weight: 600;
  color: #64748b;
  transition: all 0.3s ease;
}

.step-item .step-label {
  font-size: 14px;
  color: #64748b;
  text-align: center;
  font-weight: 500;
  transition: all 0.3s ease;
  line-height: 1.3;
}

.step-item .step-connector {
  position: absolute;
  top: 20px;
  left: 50%;
  width: calc(100% - 40px);
  height: 2px;
  transform: translateX(-50%);
  z-index: -1;
}

.connector-line {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #e2e8f0 0%, #cbd5e1 100%);
  border-radius: 1px;
  transition: all 0.3s ease;
}

.step-item.completed .step-icon {
  background: linear-gradient(135deg, #67c23a 0%, #5daf34 100%);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

.step-item.completed .step-icon-inner {
  background: linear-gradient(135deg, #67c23a 0%, #5daf34 100%);
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.4);
}

.step-item.completed .check-icon {
  color: white;
  font-size: 22px;
  font-weight: bold;
}

.step-item.completed .step-label {
  color: #67c23a;
  font-weight: 600;
}

.step-item.completed .connector-line {
  background: linear-gradient(90deg, #67c23a 0%, #5daf34 100%);
}

.step-item.current .step-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.step-item.current .step-icon-inner {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

.step-item.current .step-number {
  color: white;
  font-weight: 700;
}

.step-item.current .step-label {
  color: #3b82f6;
  font-weight: 600;
}

.step-item.pending .step-icon {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.step-item.pending .step-icon-inner {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.step-item.pending .step-number {
  color: #94a3b8;
}

.step-item.pending .step-label {
  color: #94a3b8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .steps-container {
    padding: 20px 15px;
  }
  
  .custom-steps {
    flex-direction: column;
    gap: 15px;
  }
  
  .step-item {
    flex: none;
    width: 100%;
  }
  
  .step-connector {
    display: none;
  }
  
  .step-item .step-icon {
    width: 40px;
    height: 40px;
  }
  
  .step-icon-inner {
    width: 32px;
    height: 32px;
  }
  
  .step-item .step-number {
    font-size: 18px;
  }
  
  .step-item .step-label {
    font-size: 14px;
  }
}
</style> 