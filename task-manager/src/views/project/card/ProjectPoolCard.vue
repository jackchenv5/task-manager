<template>
    <SelectProject :visible="isShowSelectProjectDialog" v-model="selectProjects" title="项目池选择"
    @update:modelValue="updateSelectProjects" @update:visible="updateVisible" @comfirm="SelectProjectConfirm">
  </SelectProject>

  <div class="project-panel">
    <el-row class="panel-header">
      <el-col :span="6">
        <div class="panel-title">关注项目</div>
      </el-col>
      <el-col :span="8" :offset="10">
        <el-button @click="isShowSelectProjectDialog = true" size="small">添加</el-button>
        <el-popconfirm title="确认清空项目池？" @confirm="projectStore.cleanFocus" placement="right">
          <template #reference>
            <el-button size="small">清空</el-button>
          </template>
        </el-popconfirm>
      </el-col>
    </el-row>
    <el-scrollbar class="project-scrollbar">
      <div class="project-tags">
        <el-tag v-for="item in projectFocusRef" :key="item"
          :class="['project-tag', { 'active': curSelectProjectRef === item }]" closable @click="handleProjectClick(item)" @close="handleDeleteProject(item)">
          <span class="project-name">{{ item }}</span>
        </el-tag>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>

import {ElRow,ElCol,ElScrollbar,ElTag,ElPopconfirm,ElButton} from 'element-plus'

import { ref } from 'vue'
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import SelectProject from "@/components/dialog/SelectProject.vue";
const projectStore = useProjectStore()
const { projectFocusRef, curSelectProjectRef } = storeToRefs(projectStore)


const isShowSelectProjectDialog = ref(false);


const handleProjectClick = (project) => {
  curSelectProjectRef.value = project
  projectStore.cleanSelectUser()
}

const handleDeleteProject = (proejct) => {
  projectStore.deleteProjectInFocus(proejct)
}

const updateVisible = (newValue) => {
  isShowSelectProjectDialog.value = newValue
}

const SelectProjectConfirm = (isConfirm, projects) => {
  if (!isConfirm) return
  if (!projects) return
  // 界面选择的用户，默认都加入用户池，如何是执行者对话框，则加入执行者池
  projects.forEach(x => {
    projectStore.addToProjectFocus(x)
  })
}




</script>

<style scoped>
.project-panel {
  height: 18vh;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 12px;
  transition: all 0.3s ease;
}

.project-panel:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.panel-header {
  margin-bottom: 8px;
}

.panel-title {
  padding: 6px 12px;
  color: white;
  background: linear-gradient(135deg, #2c3e50 0%, #1e293b 100%);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
}

.action-btn {
  padding: 6px 12px;
  background: #f5f7fa;
  border: none;
  color: #606266;
  float: right;
  margin-left: 8px;
}

.project-scrollbar {
  height: calc(18vh - 60px);
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px;
}

.project-tag {
  cursor: pointer;
  border-radius: 12px;
  padding: 6px 12px;
  transition: all 0.3s ease;
  background: #f5f7fa;
  color: #606266;
  border: 1px solid #e4e7ed;
}

.project-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.project-tag.active {
  background: linear-gradient(135deg, #4269E0 0%, #3b5bdb 100%);
  color: white;
  border: none;
}

.project-name {
  display: inline-block;
  width: 22vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>