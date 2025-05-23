<template>
  <div class="tool-container">
    <el-radio-group v-model="selectedStatus" size="small">
      <el-radio-button label="所有任务" value="all" style="margin-left:20px;" />
      <el-radio-button label="待下发" value="pending" />
      <el-radio-button label="进行中" value="running" />
      <el-radio-button label="已完成" value="done" />
    </el-radio-group>
    <el-button type="primary" >任务调整</el-button>
    <el-button type="primary" >下发</el-button>
    <el-button type="primary" >绩效考核</el-button>
    <el-button type="primary" >导出</el-button>
    <el-button type="primary" >日志</el-button>
  </div>
</template>
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