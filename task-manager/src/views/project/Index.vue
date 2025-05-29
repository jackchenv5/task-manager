<template>
  <div style="height: 92vh;width: 100%;overflow: hidden;">
    <div style="display: flex;width: 100%;height: 20vh; justify-content: space-around;align-items: center;">
      <div
        style="height:18vh;width: 27%; display: flex;flex-direction: column;">
        <ProjectPoolCard></ProjectPoolCard>
      </div>
      <div
        style="height:18vh;width: 23%;display: flex;flex-direction: column;">
        <UserPoolCard></UserPoolCard>
      </div>
      <div
        style="height:18vh;width: 49%;display: flex;flex-direction: column;">
        <StaticsCard></StaticsCard>
      </div>

      
    </div>
    <div style="height: 6vh;display: flex;justify-content: space-around;">
      <UserBar style="width: 60%;border-radius: 5px;"></UserBar>
      <ToolBar style="width: 39%;border-radius: 5px;"></ToolBar>
    </div>
    <div style="height: 65vh;margin-top: 10px;">
      <TaskGantt></TaskGantt>
    </div>
  </div>
</template>

<script setup>
import UserPoolCard from './card/UserPoolCard.vue'
import ProjectPoolCard from './card/ProjectPoolCard.vue'
import StaticsCard from './card/StaticsCard.vue'
import TaskGantt from './gantt/TaskGantt.vue'
import UserBar from './userBar/UserBar.vue'
import ToolBar from './toolBar/ToolBar.vue'

import {onMounted } from 'vue';

import { useProjectStore } from '@/stores/project'
import { useUserStore } from '@/stores/user'
const myUserStore = useUserStore()

const projectStore = useProjectStore()

onMounted(() => {
  projectStore.init()
});
</script>

<style>
/* 左侧和右侧 div 的样式 */
.left,
.right {
  flex: 1;
  /* 平均分配剩余空间 */
  display: flex;
  flex-direction: column;
  justify-content: start;
  /* 内容水平居中 */
  align-items: start;
  width: 49vw;
  /* 内容垂直居中 */

}
</style>