<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* 在 App.vue 或全局样式文件中 */
:root {
  --el-color-primary: #143e4b; /* 将 primary 颜色改为红色 */
  --el-color-success: #00FF00; /* 将 success 颜色改为绿色 */
  --el-color-warning: #FFA500; /* 将 warning 颜色改为橙色 */
  --el-color-danger: #FF4500;  /* 将 danger 颜色改为橙红色 */
}
</style>
