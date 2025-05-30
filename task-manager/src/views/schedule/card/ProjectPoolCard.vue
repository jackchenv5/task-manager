<template>
  <!-- 对话框区 -->
  <SelectProject :visible="isShowSelectProjectDialog" v-model="selectProjects" title="项目池选择"
    @update:modelValue="updateSelectProjects" @update:visible="updateVisible" @comfirm="SelectProjectConfirm">
  </SelectProject>
  <!-- 对话框区 END -->
  <div class="pool-card">
    <div class="user-pool-card-header">
      <div style="color:black;border-radius: 5px;">项目池</div>
      <div>
        <el-button @click="isShowSelectProjectDialog = true" size="small">添加</el-button>
        <el-popconfirm title="确认清空项目池？" @confirm="scheduleStore.cleanProjectPool" placement="right">
          <template #reference>
            <el-button size="small">清空</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <div class="pool-list">
      <el-scrollbar>
        <el-tag v-for="item in projectPool" :key="item" :type="curSelectProjectRef === item ? 'success' : ''"
          :color="curSelectProjectRef === item ? '#4269E0' : ''" class="my-tag" closable @click="handleProjectClick(item)"
          @close="handleDeleteProject(item)">
          <el-text truncated :style="{ width: '20vw', color: curSelectProjectRef === item ? 'white' : 'black', }">{{ item
          }}</el-text>
        </el-tag>
      </el-scrollbar>
    </div>

  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import SelectProject from "@/components/dialog/SelectProject.vue";
import { useScheduleStore } from "@/stores/schedule";
import { storeToRefs } from "pinia";
import project from "@/router/modules/project";

const scheduleStore = useScheduleStore();
const isShowSelectProjectDialog = ref(false);
const { projectPool, curSelectProjectRef } = storeToRefs(scheduleStore);

const handleProjectClick = (project) => {
  curSelectProjectRef.value = project;
};


const handleDeleteProject = (proejct) => {
  scheduleStore.deleteProjectInPool(proejct)
}

const updateVisible = (newValue) => {
  isShowSelectProjectDialog.value = newValue
}

const SelectProjectConfirm = (isConfirm, projects) => {
  console.log('=====', isConfirm, projects)
  if (!isConfirm) return
  if (!projects) return
  // 界面选择的用户，默认都加入用户池，如何是执行者对话框，则加入执行者池
  projects.forEach(x => {
    scheduleStore.addToProjectPool(x)
  })
}

</script>

<style scoped>
.pool-card {
  background-color: white;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #e0dbdb;
  display: flex;
  flex-direction: column;
  height: 100%;
  /* height: 18vh; */
  /* flex-shrink: 0 */
}


.user-pool-card-header {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  /* height: 5vh; */
  /* padding-top: 10px; */
  border-bottom: 1px solid rgb(243, 233, 233);
}

.pool-list {
  min-height: 0px;
  flex: 1; 
  /* border: 1px solid red; */
}

.my-tag {
  margin: 3px;
  cursor: pointer;
}

.tag-content {
  max-width: 100%;
}
</style>
