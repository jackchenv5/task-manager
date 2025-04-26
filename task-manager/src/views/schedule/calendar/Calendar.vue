<template>
  <div ref="schedulerContainer" style="width: 100%; height: 100vh"></div>
</template>

<script setup>
import "dhtmlx-scheduler";
import { initSchedulerConfig } from '@/utils/scheduler'
import {ref,onMounted} from 'vue'
const schedulerContainer = ref(null);
// 获取容器引用
var myEvents0 = [
];

onMounted(() => {
  // 确保 scheduler 对象存在
  if (scheduler) {
    // 初始化 Scheduler
    scheduler = initSchedulerConfig(schedulerContainer, scheduler)
    // 将数据加载到调度器
    scheduler.parse(myEvents0, "json");
  } else {
    console.error('Scheduler is not properly imported.');
  }
});
 
</script>
<style>
@import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";
    /* the background color for the whole container and its border*/
    .my_event {
        background: #add8e6;
        color: black;
        border: 1px solid #778899;
        overflow: hidden;
        display: block;
    }
 
    .dhx_cal_event_clear.my_event {
        height: 22px;
    }
 
    /* styles for the event content */
    .dhx_cal_event.my_event .my_event_body {
        padding-top: 3px;
        padding-left: 5px;
    }
    /* event's date information */
    .my_event .event_date {
        font-weight: bold;
        padding-right: 5px;
    }
    /* event's resizing section */
    .my_event_resize {
        height: 3px;
        position: absolute;
        bottom: -1px;
    }
    /* event's move section */
    .my_event_move {
        position: absolute;
        top: 0;
        height: 10px;
        cursor: pointer;
    }
</style> 