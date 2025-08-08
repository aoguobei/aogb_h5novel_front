<template>
  <el-card 
    :class="['base-card', customClass]" 
    :shadow="shadow"
    v-bind="$attrs"
  >
    <template #header v-if="$slots.header">
      <slot name="header" />
    </template>
    
    <div class="card-content">
      <slot />
    </div>
    
    <template #footer v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </el-card>
</template>

<script setup>
defineProps({
  customClass: String,
  shadow: {
    type: String,
    default: 'hover'
  }
})
</script>

<style scoped>
.base-card {
  margin-bottom: 16px;
}

.card-content {
  min-height: 20px;
}
</style> 