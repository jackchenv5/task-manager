<template>
  <div class="not-found">
    <h1>404 - 页面未找到</h1>
    <p>您访问的页面可能已被删除或暂时不可用</p>
    <el-button type="primary" @click="goHome">
      返回首页
    </el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 100px 20px;
  min-height: calc(100vh - 160px);
}

h1 {
  color: #f56c6c;
  margin-bottom: 20px;
}

p {
  color: #909399;
  margin-bottom: 40px;
}
</style>