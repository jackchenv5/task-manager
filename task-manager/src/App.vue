<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* 在 App.vue 或全局样式文件中 */
:root {
  --el-color-primary: #143e4b; 
  --el-color-success: #00FF00; 
  --el-color-warning: #FFA500; 
  --el-color-danger: #FF4500;  
}
</style>
