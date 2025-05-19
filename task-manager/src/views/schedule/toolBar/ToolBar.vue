<template>
        <div class="tool-class">
        <el-badge :value="1" class="item" type="info">
            <el-button color="orange" @click="drawer = true">最近添加</el-button>
        </el-badge>
    </div>

    <div class="tool-class">
        <el-badge :value="1" class="item" type="primary">
            <el-button color="green" @click="drawer = true">待下发</el-button>
        </el-badge>
    </div>
    <div class="tool-class">
        <el-button type="info">Excel 模版下载</el-button>
    </div>
    <div class="tool-class">
        <el-button type="warning">Excel 导入任务</el-button>
    </div>
    <!-- <el-drawer v-model="drawer" title="任务调整"  direction="btt" :close-on-click-modal="false" size="80%" :with-header="true" > -->
        <el-drawer v-model="drawer" title="任务调整"  direction="btt" size="80%" :with-header="true" >
        
    <Gantt></Gantt>
  </el-drawer>
</template>


<script setup>
import { ref,onMounted } from 'vue' 
 const drawer = ref(false)

 import Gantt from './Gantt.vue'
</script>

<style scoped>
.tool-class {
    margin:0px 10px;
}


</style>