<template>
  <el-card class="task-filter">
    <div class="filter-row">
      <el-radio-group v-model="selectedTaskStatus">
        <el-radio-button label="所有任务" />
        <el-radio-button label="待下发" />
        <el-radio-button label="进行中" />
        <el-radio-button label="已完成" />
      </el-radio-group>
      
      <div class="switch-container">
        <span class="switch-label">全选/清空</span>
        <el-switch v-model="selectAll" @change="handleSelectAllChange" />
      </div>
    </div>
    
    <div class="user-checkbox-group">
      <el-checkbox-group v-model="selectedUsers">
        <el-checkbox 
          v-for="user in users" 
          :key="user.id" 
          :label="user.id"
          border
        >
          {{ user.name }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    
    <div class="project-select">
      <el-select
        v-model="selectedProjects"
        multiple
        filterable
        placeholder="选择相关项目"
        style="width: 100%"
      >
        <el-option
          v-for="project in projects"
          :key="project.id"
          :label="project.name"
          :value="project.id"
        />
      </el-select>
    </div>
  </el-card>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const users = ref([
  { id: 1, name: '张三', groupId: 1, projects: [1, 2] },
  { id: 2, name: '李四', groupId: 1, projects: [1] },
  { id: 3, name: '王五', groupId: 2, projects: [2] },
  { id: 4, name: '赵六', groupId: 3, projects: [1, 2] }
])

const projects = ref([
  { id: 1, name: '电商平台升级' },
  { id: 2, name: '客户管理系统' }
])

const selectedTaskStatus = ref('所有任务')
const selectedUsers = ref([])
const selectedProjects = ref([])
const selectAll = ref(false)

const handleSelectAllChange = (val) => {
  selectedUsers.value = val ? users.value.map(user => user.id) : []
}

watch(selectedUsers, (newVal) => {
  selectAll.value = newVal.length === users.value.length
})
</script>

<style scoped>
.task-filter {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.switch-container {
  display: flex;
  align-items: center;
}

.switch-label {
  margin-right: 10px;
  font-size: 14px;
  color: #606266;
}

.user-checkbox-group {
  margin-bottom: 15px;
}

.el-checkbox {
  margin-right: 10px;
  margin-bottom: 10px;
}

.project-select {
  margin-top: 10px;
}
</style>