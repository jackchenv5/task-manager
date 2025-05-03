<template>
    <div ref="schedulerContainer" style="width: 100%; height: 100vh" @mousedown="handleMouseDown"
        @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseUp"></div>
</template>
<script setup>
import "dhtmlx-scheduler";
import { initSchedulerConfig } from '@/utils/scheduler'
import { ref, watch, onMounted, reactive } from 'vue'

import { isWorkday, formatDate, formatVxeDate, getDayTotalWorkHours, getProgressStatus } from '@/utils/public'
// 获取容器引用
const schedulerContainer = ref()

import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'

const scheduleStore = useScheduleStore()
const { curUserScheduleTasksRef,curSelectUser } = storeToRefs(scheduleStore)

// 拖拽选择相关状态
const dragSelectState = reactive({
    isSelecting: false,
    justEndedSelection: false,
    startDate: null
});

const selectedDates = ref(new Set());
const clearHighlightedDates = () => {
    document.querySelectorAll('.highlighted').forEach(el => {
        el.classList.remove('highlighted');
    });
};
const handleMouseDown = (event) => {
    console.log('mouse down')
    if (event.button !== 0) return;

    const cell = event.target.closest('.dhx_cal_month_cell [data-date]');
    console.log('cell', cell)
    if (!cell) return;

    const dateStr = cell.dataset.date;
    if (!isWorkday(new Date(dateStr))) return;

    dragSelectState.isSelecting = true;
    dragSelectState.startDate = new Date(dateStr);
    selectedDates.value.clear();
    clearHighlightedDates();
    selectedDates.value.add(dateStr);

    cell.closest('.dhx_cal_month_cell').classList.add('highlighted');

    event.preventDefault();
};

// 日历div中处理鼠标松开事件
const handleMouseUp = () => {
    if (dragSelectState.isSelecting) {
        // 标记刚刚结束拖拽选择
        dragSelectState.justEndedSelection = true;

        // 小延迟清除标记，避免快速连续操作的问题
        setTimeout(() => {
            dragSelectState.justEndedSelection = false;
        }, 500);

        dragSelectState.isSelecting = false;
    }
};

const getDateRange = (startDate, endDate) => {
    const range = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
        range.push(formatDate(new Date(current)));
        current.setDate(current.getDate() + 1);
    }

    return range;
};


scheduler.attachEvent('onViewChange', async (view, date) => {
    if (view === 'month') {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);

        const startDate = formatDate(firstDay);
        const endDate = formatDate(lastDay);
        console.log('in view change',curSelectUser.value)
        if(!curSelectUser.value) return
        scheduleStore.getCurUserTasks(curSelectUser.value, startDate, endDate)
        console.log(startDate, endDate)

    }
});
watch(curUserScheduleTasksRef, () => {
    console.log('tasks change...', curUserScheduleTasksRef.value)
    if (scheduler) {
        console.log('in change ...')
        scheduler.clearAll();
        scheduler.parse(curUserScheduleTasksRef.value);
        scheduler.updateView();
        selectedDates.value.clear();
    }
})
// 设置日历初始渲染方式
const getInitViewTemplate = (date) => {
    const currentMonth = scheduler.getState().date.getMonth();
    if (date.getMonth() !== currentMonth) {
        return `<div style="height:100%; background:#f9f9f9"></div>`;
    }

    // 如果不是有效工作日，仅显示日期
    if (!isWorkday(date)) {
        return `
            <div style="height: 100%; width: 100%; position: relative;">
                <div style="position: absolute; top: 5px; right: 5px; font-weight: bold;">
                    ${date.getDate()}
                </div>
            </div>
        `;
    }

    // 计算有效工作日的任务数量以及任务饱和度
    const events = scheduler.getEvents(date, scheduler.date.add(date, 1, "day"));
    const totalHours = getDayTotalWorkHours(events);
    // 单元框背景色
    const bgColor = totalHours > 8 ? "#ff0000" :
        totalHours === 8 ? "#00ff00" : "#FFEE58";

    return `
        <div class="month_day_total" data-date="${formatDate(date)}" style="height: 100%; width: 100%; position: relative; cursor: pointer;background-color: ${bgColor}">
          <div style="position: absolute; top: 5px; right: 5px; font-weight: bold;">
            ${date.getDate()}
          </div>
          <div class="month_day_events" title="当天任务数量-当天任务需要的总工时">
            ${events.length || '0'}-${totalHours}
          </div>
        </div>
    `;
};

// 日历div中处理鼠标移动事件
const handleMouseMove = (event) => {
    if (!dragSelectState.isSelecting) return;
    const cell = event.target.closest('.dhx_cal_month_cell [data-date]');
    if (!cell) return;

    const endDateStr = cell.dataset.date;
    updateDragSelection(endDateStr);
};

// 更新拖拽选区
const updateDragSelection = (endDateStr) => {
    const startDate = dragSelectState.startDate;
    if (!startDate) return;

    const endDate = new Date(endDateStr);
    const dateRange = getDateRange(startDate, endDate);

    clearHighlightedDates();

    dateRange.forEach(dateStr => {
        if (isWorkday(new Date(dateStr))) {
            const cell = document.querySelector(`[data-date="${dateStr}"]`);
            if (cell) {
                cell.closest('.dhx_cal_month_cell').classList.add('highlighted');
                selectedDates.value.add(dateStr);
            }
        }
    });
}
// 处理日期点击事件
const handleDateClick = (date) => {
    const dateStr = formatDate(date);
    selectedDates.value.clear();
    selectedDates.value.add(dateStr);
    clearHighlightedDates();
};
onMounted(() => {
    // 确保 scheduler 对象存在
    if (scheduler) {
        // 初始化 Scheduler
        initSchedulerConfig(scheduler)
        // 将数据加载到调度器
        scheduler.init(schedulerContainer.value, new Date(), 'month');
        scheduler.parse(curUserScheduleTasksRef.value)
        scheduler.templates.month_day = getInitViewTemplate;
        // scheduler.parse(myEvents0, "json");
        scheduler.attachEvent("onEmptyClick", function (date, event) {
            // 如果是拖拽结束时的点击，忽略这次事件
            console.log(dragSelectState.justEndedSelection)
            if (dragSelectState.justEndedSelection) {
                dragSelectState.justEndedSelection = false;
                return;
            }
            console.log('============return')

            // 如果正在拖拽选择中，忽略点击
            if (dragSelectState.isSelecting) return;
            const currentMonth = scheduler.getState().date.getMonth();
            if (date.getMonth() !== currentMonth) return;
            if (!isWorkday(date)) return;
            handleDateClick(date);

            const cell = event.target.closest('.dhx_cal_month_cell');
            if (cell) {
                cell.classList.add('highlighted');
            }
        });
    } else {
        console.error('Scheduler is not properly imported.');
    }
});

</script>
<style>
@import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";

.dhx_month_link {
    display: none !important;
}

.dhx_month_head {
    padding: unset;
}

.hide_event {
    display: none !important;
}

.my-month-day-red {
    background-color: red;
}

/* .dhx_cal_month_cell {
    background-color: azure;
} */

.dhx_month_head {
    height: 100% !important;
}

.month_day_events {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.4em;
    font-weight: bold;
    width: max-content;
}

.highlighted {
    border: 2px solid #409EFF !important;
}

/* the background color for the whole container and its border*/
</style>