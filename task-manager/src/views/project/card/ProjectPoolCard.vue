<template>
    <div class="project-panel">
      <el-row class="panel-header">
        <el-col :span="8">
          <div class="panel-title">关注项目</div>
        </el-col>
        <el-col :span="8" :offset="8">
          <el-button class="action-btn">添加</el-button>
          <el-button class="action-btn">清空</el-button>
        </el-col>
      </el-row>
      <el-scrollbar class="project-scrollbar">
        <div class="project-tags">
          <el-tag 
            v-for="item in projectFocusRef"
            :key="item"
            :class="['project-tag', { 'active': curSelectProjectRef === item }]"
            closable
            @click="handleProjectClick(item)">
            <span class="project-name">{{ item }}</span>
          </el-tag>
        </div>
      </el-scrollbar>
    </div>
  </template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import project from '@/router/modules/project';

const projectStore = useProjectStore()
const { projectFocusRef,curSelectProjectRef,selectUser } = storeToRefs(projectStore)

const handleProjectClick = (project)=>{
    curSelectProjectRef.value = project
    selectUser.value = ''
}

</script>

<style scoped>
.project-panel {
  height: 18vh;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 12px;
  transition: all 0.3s ease;
}

.project-panel:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
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