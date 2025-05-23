<template>
    <div class="user-bar">
        <el-badge :value="projectLogs.length" class="item">
            <el-button  @click="drawer = true">查看日志</el-button>
        </el-badge>
        <el-drawer  v-model="drawer" title="I am the title" :with-header="false" direction="ltr" size="50%">
            <template v-for="item in projectLogs" :key="item.id"  style="margin: 10px; 0">
            <div class="log-container">
                <span class="log-item">{{ formatDateTime(item.timestamp) }}</span>
                <span  class="log-item">{{ item.title }}</span>
            </div>
            </template>
            <span></span>
        </el-drawer>
    </div>

</template>

<script setup>
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import {formatDateTime} from '@/utils/public'

const drawer = ref(false)
const projectStore = useProjectStore()
const { projectLogs } = storeToRefs(projectStore)

</script>

<style scoped>
.user-bar  {
    border-left: 5px solid rgb(51, 53, 51);
    margin-top:5px;
    background:white;
    height:6vh;
    display: flex;
    align-items:center;

}

.bar-item{
    margin:0 10px;
}
.log-container{ 
    font-size: 1rem;
    display: flex;
    width: 100%;
    align-items: center;
}
.log-item{
    margin: 10px 5px;
    /* padding: 0 10px; */
}
</style>