<template>
  <div style="display: flex;height: 92vh;width: 100%;">
    <div class="left">
      <div class="card-layout-container">
        <div class="card-container">
          <UserPoolCard></UserPoolCard>
        </div>

        <div class="card-container">
          <ProjectPoolCard></ProjectPoolCard>
        </div>
      </div>
      <div>
        <ReceiverCard></ReceiverCard>
        <StaticsCard></StaticsCard>
      </div>
      
      <Calendar style="width: 100%;height:70vh;"></Calendar>
    </div>
    <div class="right">
      <div
        style="width: 100%;height:8vh;background-color: white;border: 1px solid black;display: flex;align-items: center;">
        <ToolBar></ToolBar>
      </div>
      <div style="width: 100%;min-height:82vh;background-color: white;border:1px solid #aaa;flex-grow: 1;">
        <AddForm></AddForm>
      </div>
    </div>
  </div>
</template>

<script setup>
import Calendar from './calendar/Calendar.vue'
import AddForm from './form/AddForm.vue'
import UserPoolCard from './card/UserPoolCard.vue'
import ProjectPoolCard from './card/ProjectPoolCard.vue'
import ReceiverCard from './card/ReceiverCard.vue'
import StaticsCard from './card/StaticsCard.vue'
import ToolBar from './toolBar/ToolBar.vue'

import { onUnmounted, onMounted } from 'vue';

import { useScheduleStore } from '@/stores/schedule'
const scheduleStore = useScheduleStore()

import { useUserStore } from '@/stores/user'
const myUserStore = useUserStore()
onMounted(() => {
  scheduleStore.getTableData()
  scheduleStore.initScheduleConfig()
});

onUnmounted(() => {
  scheduleStore.saveScheduleConfig()

});

// 处理页面关闭/刷新
window.addEventListener('beforeunload', scheduleStore.saveScheduleConfig);

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

.card-layout-container {
  display: flex;
  width: 100%;
  height: 20vh;
  justify-content: space-between;
  align-items: center;
}

.card-container {
  height: 18vh;
  padding: 5px;
  width: 50%;


}</style>