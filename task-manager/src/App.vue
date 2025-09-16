<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- 缓存所有路由组件 -->
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style>
/* 全局样式 */
:root {
  --el-color-primary: #143e4b;
  --el-color-success: #16a116;
  --el-color-warning: #FFA500;
  --el-color-danger: #FF4500;
}

/* 基础样式重置 */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>