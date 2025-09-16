<template>
  <div class="user-panel">
    <el-row class="panel-header">
      <el-col :span="8">
        <h3 class="card-title">参与人员</h3>
      </el-col>
      <el-col :span="4" :offset="10">
        <el-button class="clear-btn" @click="projectStore.cleanSelectUser">清空</el-button>
      </el-col>
    </el-row>
    <el-scrollbar class="user-scrollbar">
      <div class="user-tags">
        <el-tag v-for="tag in joinUsers" :key="tag.id" :class="['user-tag', { 'active': tag.username === selectUser.username }]"
          @click="handleSelectUser(tag)">
          {{ tag.username }}
        </el-tag>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import {ElRow,ElCol,ElScrollbar,ElTag,ElButton} from 'element-plus'
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'

const projectStore = useProjectStore()
const { selectUser, joinUsers } = storeToRefs(projectStore)


const handleSelectUser = (userObj) => {
  selectUser.value = userObj

}

</script>

<style scoped>
.user-panel {
  height: 18vh;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 12px;
}

.panel-header {
  margin-bottom: 8px;
}

/* 标题样式优化 [6](@ref) */
.card-title {
  font-size: 16px;
  color: #303133;
  margin: 0 0 8px 8px;
  font-weight: 600;
  border-left: 3px solid #409eff;
  padding-left: 8px;
}

.clear-btn {
  float: right;
  padding: 6px 12px;
  background: #f5f7fa;
  border: none;
  color: #606266;
}

.user-scrollbar {
  height: calc(18vh - 60px);
}

.user-tags {
  display: flex;
  flex-wrap: wrap;
  /*gap: 8px;*/

  padding: 4px;
}

.user-tag {
  cursor: pointer;
  border-radius: 12px;
  padding: 6px 12px;
  transition: all 0.3s ease;
  background: #f5f7fa;
  color: #606266;
  border: 1px solid #e4e7ed;
  margin:2px 2px;
}

.user-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-tag.active {
  background: linear-gradient(135deg, #67C23A 0%, #5DAF34 100%);
  color: white;
  border: none;
}
</style>