<template>
  <div class="page-header">
    <div class="page-title">{{ title }}</div>
    <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<style lang="less" scoped>
.page-header {
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
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

  .page-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-subtitle {
    font-size: 14px;
    color: #7f8c8d;
    margin: 0;
    font-weight: 500;
  }
}
</style> 