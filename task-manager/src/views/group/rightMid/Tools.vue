<template>
  <div class="tool-container">
    <el-radio-group v-model="selectedStatus" size="small">
      <el-radio-button v-for="item in taskStatusArray" :label="item.label" :value="item.value"  />
    </el-radio-group>
    <el-button type="primary" >任务调整</el-button>
    <el-button type="primary" >下发</el-button>
    <el-button type="primary" >绩效考核</el-button>
    <el-button type="primary" >导出</el-button>
    <el-button type="primary" >日志</el-button>
  </div>
</template>
<script setup>
import {taskStatusArray} from "@/constants/public"
</script>
<style scoped>
.tool-container {
  width: 100%;
  display: flex;
  align-items: center;
  height: 7vh;
  background: white;
  margin-top: 1vh;
  gap: 10px;
}
</style>
<script>
</script>