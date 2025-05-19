<template>
  <div style="display: flex;height: 92vh;width: 100%;overflow: hidden;">
    <div class="left">
      <div style="display: flex;width: 100%;height: 20vh; justify-content: space-around;align-items: center;">
        <div
          style="height:18vh;width: 45%;background-color: white;;border: 1px solid white;border-radius: 5px;padding: 5px;display: flex;flex-direction: column;">
          <UserPoolCard></UserPoolCard>
        </div>

        <div
          style="height:18vh;width: 50%;background-color: white;border: 1px solid #eee;border-radius: 5px;padding: 5px;display: flex;flex-direction: column;">
          <ProjectPoolCard></ProjectPoolCard>
        </div>
      </div>
      <ReceiverCard></ReceiverCard>
      <StaticsCard></StaticsCard>
      <Calendar style="width: 100%;height:70vh;"></Calendar>
    </div>
    <div class="right">
      <div style="width: 100%;height:8vh;background-color: white;border: 1px solid black;display: flex;align-items: center;">
        <ToolBar></ToolBar>
      </div>
      <div style="width: 100%;min-height:82vh;background-color: white;border:1px solid #aaa;flex-grow: 1;">
        <AddForm></AddForm>
      </div>
      <!-- <div style="width: 49.8vw;height:30vh;border: 1px solid white;">
        <AddTable></AddTable>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import Calendar from './calendar/Calendar.vue'
import AddForm from './form/AddForm.vue'
import AddTable from './table/Table.vue'
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
  myUserStore.initUser(608).then(()=>{
    scheduleStore.initScheduleConfig()
  })
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