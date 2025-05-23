
<template>
  <!-- 整个周视图容器 -->
  <div style="display: flex;margin:10px">
    <!-- 用户信息容器 -->
    <div style="width:20%;border-left: 3px solid #409eff;padding:10px;">cc</div>
    <!-- 用户信息容器 END -->

<!-- 四周视图 -->
    <Week v-for="i in 4" style="width: 20%;"></Week>
<!-- 四周视图END -->
  </div>
  <!-- 整个周视图容器 END -->
</template>
<script setup>
import Week from './Week.vue'
</script>
