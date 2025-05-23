<template>
  <div style="height: 92vh;width: 100%;overflow: hidden;background-color: #ddd;">
    <div style="display: flex;width: 100%;height: 20vh; justify-content: space-around;align-items: center;">
      <div
        style="height:18vh;width: 27%; background-color: white;border: 1px solid #eee;border-radius: 5px;padding: 5px;margin: 0px 5px; display: flex;flex-direction: column;">
        <ProjectPoolCard></ProjectPoolCard>
      </div>
      <div
        style="height:18vh;width: 23%;background-color: white;;border: 1px solid white;border-radius: 5px;padding: 5px;margin: 0px 5px;display: flex;flex-direction: column;">
        <UserPoolCard></UserPoolCard>
      </div>
      <div
        style="height:18vh;width: 49%;background-color: white;;border: 1px solid white;border-radius: 5px;padding: 5px;margin: 0px 5px;display: flex;flex-direction: column;">
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
  background-color: #f1f3f6;
}

/* 默认事件样式 */
.custom-event {
  border-radius: 3px;
  color: #333;
  font-size: 12px;
  padding: 2px;
  background: #a5dc86;
  width: 50%;
}

/* 根据进度设置背景色 */
.progress-0 {
  background-color: #f0f0f0;
}

.progress-25 {
  background-color: #ffcc99;
}

.progress-50 {
  background-color: #76c7c0;
}

.progress-75 {
  background-color: #f5d4f9;
}

.progress-100 {
  background-color: #a5dc86;
}

/* 默认日期单元格样式 */
.custom-date-cell {
  border-radius: 3px;
}

/* 根据日期设置背景色 */
.highlight-date-1 {
  background-color: #ffcc99;
}

/* 浅橙色 */
.highlight-date-2 {
  background-color: #76c7c0;
}

/* 浅蓝色 */
.highlight-date-3 {
  background-color: #a5dc86;
}

/* 浅绿色 */

.non_working_day {
  background-color: rgb(204, 152, 169) !important;
}
</style>