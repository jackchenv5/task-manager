<template>
  <div class="main-layout">
    <!-- 固定头部 -->
    <el-header class="head">
      <el-link 
        v-for="item in navItems" 
        :key="item.path"
        :href="item.path"
        :class="{ active: $route.path.startsWith(item.path) }"
      >
        {{ item.title }}
      </el-link>
    </el-header>

    <!-- 动态内容区域 -->
    <div class="content-container">
      <router-view />
    </div>
  </div>
</template>

<script setup>
const navItems = [
  { path: '/person', title: '我的任务' },
  { path: '/group', title: '小组视图' },
  { path: '/project', title: '项目视图' },
  { path: '/schedule', title: '任务编排' },
  { path: '/system', title: '系统配置' }
]
</script>
<style>

  .head {
    display: flex;
    justify-content: start;
    border-bottom: 2px solid #d6dfdf;
    border-top: 1px solid #f5f9f9;
    background: #ffffff;
  }
  
  .el-link {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
    color:black;
    padding:10px;
  }
  .active{
    color: white;
    background: black;
  }
</style>
