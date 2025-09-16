<template>
  <div style="display: flex;justify-content: space-around; height: 92vh; width: 100%;overflow: hidden;">
    <div class="left">
      <div class="card-layout-container">
        <div class="card-container">
          <UserPoolCard></UserPoolCard>
        </div>

        <div class="card-container">
          <ProjectPoolCard></ProjectPoolCard>
        </div>
      </div>
      <ReceiverCard></ReceiverCard>
      <StaticsCard></StaticsCard>

      <Calendar style="width: 48vw;border-radius: 10px; height: 70vh"></Calendar>
    </div>
    <div class="right" >
      <div
        style="
          width: 100%;
          height: 8vh;
          margin-top:1vh;
        "
      >
        <ToolBar></ToolBar>
      </div>
      <div
        style="
        margin-top:1vh;
        border-radius: 10px;
        min-height: 0;
          width: 100%;
          background-color: white;
          flex-grow: 1;
        "
      >
        <AddForm></AddForm>
      </div>
    </div>
  </div>
</template>

<script setup>
import Calendar from "./calendar/Calendar.vue";
import AddForm from "./form/AddForm.vue";
import UserPoolCard from "./card/UserPoolCard.vue";
import ProjectPoolCard from "./card/ProjectPoolCard.vue";
import ReceiverCard from "./card/ReceiverCard.vue";
import StaticsCard from "./card/StaticsCard.vue";
import ToolBar from "./toolBar/ToolBar.vue";

import { onUnmounted, onMounted } from "vue";

import { useScheduleStore } from "@/stores/schedule";
const scheduleStore = useScheduleStore();
onMounted(() => {
  scheduleStore.getTableData();
  scheduleStore.initScheduleConfig();
});

onUnmounted(() => {
  scheduleStore.saveScheduleConfig();
});

// 处理页面关闭/刷新
window.addEventListener("beforeunload", scheduleStore.saveScheduleConfig);
</script>

<style>
/* 左侧和右侧 div 的样式 */
.left,
.right {
  /* 平均分配剩余空间 */
  display: flex;
  flex-direction: column;
  justify-content: start;
  /* 内容水平居中 */
  align-items: center;
  width: 49vw;
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
}
</style>
