<template>

    <div style="height: 4vh;">
        <el-row>
            <el-col :span="4">
                <div style="margin-top:5px;color:white;background-color: black;border-radius: 5px;">参与人员</div>
            </el-col>
            <el-col :span="4" :offset="16">
                <el-button @click="selectUser = ''"> 清空 </el-button>
            </el-col>
        </el-row>
        <div style="height: 14vh;display: flex;justify-content: start;flex-wrap: wrap;align-items: center;gap: 6px;">
            <el-tag v-for="tag in joinUsers" :key="tag.id" 
                :type="tag === selectUser ? 'success' : 'primary'"
                style="cursor: pointer;" :disable-transitions="false" @click="handleSelectUser(tag)">
                {{ tag }}
            </el-tag>
        </div>
    </div>
</template>

<script setup>
// 选中人员

import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import project from '@/router/modules/project';

const projectStore = useProjectStore()
const { selectUser,joinUsers}  = storeToRefs(projectStore)


const handleSelectUser = (username) => {
  selectUser.value = username

}

</script>