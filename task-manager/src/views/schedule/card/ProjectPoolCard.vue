<template>
    <div style="height: 4vh;">
        <el-row>
            <el-col :span="4" >
                <div style="margin-top: 5px;color:white;background-color: black;border-radius: 5px;">项目池</div>
            </el-col>
            <el-col :span="8" :offset="12">
                <el-button>添加</el-button>
                <el-button>清空</el-button>
            </el-col>
        </el-row>
        <el-scrollbar style="height: 14vh;">
            <el-tag v-for="item in projectPool" :key="item" 
            :type="curSelectProjectRef === item ? 'success' : '' " 
            :color="curSelectProjectRef === item ? '#4269E0' : '' " 
            class="my-tag" closable @click="handleProjectClick(item)">
                <el-text truncated :style='{width:"400px",color: curSelectProjectRef === item ?  "white" : "black" }' >{{ item }}</el-text>
            </el-tag>
        </el-scrollbar>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import SelectUserDialog from '@/components/dialog/SelectUser.vue'
import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'
import project from '@/router/modules/project';

const scheduleStore = useScheduleStore()
const { projectPool,curSelectProjectRef } = storeToRefs(scheduleStore)

const handleProjectClick = (project)=>{
    curSelectProjectRef.value = project
}

</script>

<style scoped>
.my-tag {
    margin: 3px;
    cursor: pointer;
    
}

.tag-content {
    max-width: 100%;
    /* /* vertical-align: middle; */
}

/* .el-tag .el-tag__close {
    margin-left: 8px;
    border: 1px solid;
    border-radius: 3px;

} */
</style>