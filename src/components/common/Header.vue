<template>
  <div class="horizontal page-header">
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
  align-items: baseline;
  border-radius: 16px;
  margin-bottom: 20px;

  .page-title {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-subtitle {
    font-size: 14px;
    color: #7f8c8d;
    margin: 0 0 0 20px;
    font-weight: 500;
  }
}
</style> 