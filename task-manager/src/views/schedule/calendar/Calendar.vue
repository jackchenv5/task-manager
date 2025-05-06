<template>
    <div ref="schedulerContainer" style="width: 100%; height: 100vh"></div>
</template>
<script setup>
import "dhtmlx-scheduler";
import { initSchedulerConfig } from '@/utils/scheduler'
import { ref, watch, onMounted } from 'vue'
// 获取容器引用
const schedulerContainer = ref()

import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'

const scheduleStore = useScheduleStore()
const { curUserScheduleTasksRef } = storeToRefs(scheduleStore)

watch(curUserScheduleTasksRef, () => {
    console.log('tasks change...', curUserScheduleTasksRef.value)
    if (scheduler) {
        scheduler.parse(curUserScheduleTasksRef.value)
    }
})

onMounted(() => {
    // 确保 scheduler 对象存在
    if (scheduler) {
        // 初始化 Scheduler
        initSchedulerConfig(scheduler)
        // 将数据加载到调度器
        scheduler.init(schedulerContainer.value, new Date(), 'month');
        scheduler.templates.event_class = function (start, end, ev) {
            // return "";
            return "hide_event";
        };
        scheduler.templates.event_bar_text = function (start, end, event) {
            return "";
        };
        scheduler.templates.month_date_class = function (date) {
            return "my-month-day";
        };
        // scheduler.parse(myEvents0, "json");
    } else {
        console.error('Scheduler is not properly imported.');
    }
});

</script>
<style>
@import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";


.hide_event {
    display: none!important;
}
.my-month-day-waring{
    border: 1px solid red;
    background-color:blue;
}
/* .dhx_cal_month_cell{
    background-color: unset;
} */
/* the background color for the whole container and its border*/
</style>