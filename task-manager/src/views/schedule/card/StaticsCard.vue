<template>
  <div class="card">
    <div class="user-card">
      <div class="card-label">当前用户</div>
      <div class="user-content">
        <div class="content-label">
          <div>{{ curSelectUserInfo.username }}</div>
          <div style="font-size: 12px">工作强度</div>
        </div>
        <div class="content-progress">
          <el-progress
            type="dashboard"
            :percentage="curSelectDateStat.per"
            :stroke-width="15"
            :width="70"
            striped-flow
          />
        </div>
      </div>
    </div>
    <div class="stat-card">
      <div class="card-label">统计数据</div>
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 70%;
          margin-left: 15px;
        "
      >
        <div>时间：{{ curSelectDateStat.startDate }}~{{ curSelectDateStat.endDate }}</div>
        <div>任务数：{{ curSelectDateStat.workNum }}</div>
        <div>任务工时：{{ curSelectDateStat.workloads.toFixed(1) }}H</div>
      </div>
    </div>
    <el-scrollbar class="scroll-bar">
      <template v-for="item in curUserTasksRef">
        <div style="display: flex; flex-direction: row">
          <el-text truncated style="width: 20%">{{ item.name }}</el-text>
          <div style="width: 80%">
            <el-progress
              :stroke-width="20"
              :percentage="(100 * item.workload) / curUserTasksWorkloadsRef"
              style="margin-top: 5px"
            >
              <span style="font-size: 15px">{{
                `${item.workload}天(${
                  ((100 * item.workload) / curUserTasksWorkloadsRef) | 0
                }%)`
              }}</span>
            </el-progress>
          </div>
        </div>
      </template>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { useScheduleStore } from "@/stores/schedule";
import { storeToRefs } from "pinia";

const scheduleStore = useScheduleStore();
const {
  curSelectUserInfo,
  curUserTasksRef,
  curUserTasksWorkloadsRef,
  curSelectDateStat,
} = storeToRefs(scheduleStore);
</script>
<style scoped>
.card {
  margin-top: 0.5vh;
  height: 18vh;
  width: 48.2vw;
  border-radius: 10px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
}
.user-card {
  width: 25%;
  height: 15vh;
  border: 1px solid #afb3b8;
  border-radius: 10px 0px 0px 10px;
  background-color: white;
}
.card-label {
  font-weight: bold;
  font-size: 18px;
  margin-top: 5px;
  margin-left: 15px;
}
.user-content {
  display: flex;
  justify-content: space-around;
  padding: 10px;
}
.content-label {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.conten-progress {
  display: flex;
  justify-content: center;
  align-items: center;
}
.stat-card {
  width: 30%;
  height: 15vh;
  border-top: 1px solid #afb3b8;
  border-bottom: 1px solid #afb3b8;
  background-color: white;
}
.scroll-bar {
  width: 45%;
  height: 15vh;
  border: 1px solid #afb3b8;
  border-radius: 0px 10px 10px 0px;
  background-color: white;
}
</style>
