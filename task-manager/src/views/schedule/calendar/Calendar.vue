<template>
    <div ref="schedulerContainer" style="width: 100%; height: 100vh" @mousedown="handleMouseDown" @click="handleClick"
        @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseUp"></div>
</template>

<script setup>
import "dhtmlx-scheduler";
import { initSchedulerConfig } from '@/utils/scheduler'
import { ref, watch, onMounted, reactive } from 'vue'

import { isWorkday, formatDate, getDayTotalWorkHours,getCurMonthStartAndEndStr,getWeekBoundaries } from '@/utils/public'
// 获取容器引用
const schedulerContainer = ref()

import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'

const scheduleStore = useScheduleStore()
const { curUserScheduleTasksRef, curSelectUser } = storeToRefs(scheduleStore)

// 拖拽选择相关状态
const dragSelectState = reactive({
    isSelecting: false,
    justEndedSelection: false,
    startDate: null
});

const selectedDates = ref(new Set());

watch(()=>selectedDates.value.size,(newValue)=>{
    console.log('change...',selectedDates.value)

    const dateSize = selectedDates.value.size
    console.log('dateSize',dateSize)
    if(dateSize === 0) return

    const selectedDatesList = [...selectedDates.value]
    const startDateStr = selectedDatesList[0]
    const endDateStr = selectedDatesList[dateSize-1]
    console.log(startDateStr,endDateStr)
    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)

    console.log(startDate,endDate)
    // 计算有效工作日的任务数量以及任务饱和度

    //任务数
    const eventCount = scheduler.getEvents(startDate, endDate).length;

    let totalHours = 0

    selectedDatesList.forEach(x=>{
        const date = new Date(x)
        const events = scheduler.getEvents(date, scheduler.date.add(date, 1, "day"));
        totalHours += getDayTotalWorkHours(events,false)
    })
    console.log(totalHours)
    // 饱和度
    const workLoadPer = Math.floor(100*totalHours/(dateSize*8))
    console.log(workLoadPer)
    scheduleStore.updateSelectDateStat(startDateStr,endDateStr,totalHours,eventCount,workLoadPer)

})

const clearHighlightedDates = () => {
    document.querySelectorAll('.highlighted').forEach(el => {
        el.classList.remove('highlighted');
    });
};
const handleMouseDown = (event) => {
    if (event.button !== 0) return;

    const cell = event.target.closest('.dhx_cal_month_cell [data-date]');
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

const handleClick = (event) =>{
    console.log('in handle click')
    if (event.button !== 0) return;

    const cell = event.target.closest('.dhx_cal_month_cell [data-date]');
    if (!cell) return;

    const dateStr = cell.dataset.date;
    if (!isWorkday(new Date(dateStr))) return;

    if(dragSelectState.isSelecting) return;
    handleDateClick(new Date(dateStr))

    event.preventDefault();
}
// 日历div中处理鼠标松开事件
const handleMouseUp = () => {
    if (dragSelectState.isSelecting) {
        // 标记刚刚结束拖拽选择
        dragSelectState.justEndedSelection = true;

        // 小延迟清除标记，避免快速连续操作的问题
        setTimeout(() => {
            dragSelectState.justEndedSelection = false;
        }, 1000);

        dragSelectState.isSelecting = false;
    }
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
    console.log('in data check date')
    const weekBoundaries = getWeekBoundaries(date);
    dragSelectState.startDate = weekBoundaries.monday
    updateDragSelection(formatDate(weekBoundaries.friday))
    
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
        const [startDate,endDate] = getCurMonthStartAndEndStr(date);
        if (!curSelectUser.value) return
        scheduleStore.getCurUserTasks(curSelectUser.value, startDate, endDate)

    }
});
watch(curUserScheduleTasksRef, () => {
    if (scheduler) {
        console.log('cur task change')
        console.log(curUserScheduleTasksRef.value)
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
    return `<div class="other-month-cell"></div>`;
  }

  if (!isWorkday(date)) {
    return `
      <div class="non-workday-cell">
        <div class="day-number">${date.getDate()}</div>
      </div>
    `;
  }

  const events = scheduler.getEvents(date, scheduler.date.add(date, 1, "day"));
  const totalHours = getDayTotalWorkHours(events);
  
  // 根据工时范围确定样式类
  const workloadClass = 
    totalHours < 4 ? "workload-low" :
    totalHours <= 8 ? "workload-medium" : "workload-high";

  return `
    <div class="month_day_total ${workloadClass}" data-date="${formatDate(date)}">
      <div class="day-number">${date.getDate()}</div>
      <div class="month_day_events" title="当天任务数量-当天任务需要的总工时">
        ${events.length || '0'}-${totalHours}
      </div>
    </div>
  `;
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


/* 选中状态 */
.highlighted {
  /* 基础样式 */
  border: 1px solid rgba(12, 14, 15, 0.6) !important; /* 浅蓝色半透明边框 */
  background: rgba(144, 202, 249, 0.1); /* 极浅背景 */
  border-radius: 6px; /* 匹配现代UI圆角 */
  /* transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); */

  /* 激活状态 */
  &.active {
    border-color: #64B5F6; /* 中等浅蓝 */
    background: rgba(100, 181, 246, 0.15);
    /* box-shadow: 0 1px 3px rgba(100, 181, 246, 0.2); */
  }

  /* 悬停交互 */
  &:hover {
    border-color: #42A5F5; /* 标准浅蓝 */
    background: rgba(66, 165, 245, 0.12);
  }

  /* 点击反馈 */
  &:active {
    /* transform: scale(0.97); */
    background: rgba(66, 165, 245, 0.18);
  }
}

/* 月视图的单元格显示 */

/* 基础单元格 */
.month_day_total {
  height: 100%;
  width: 100%;
  position: relative;
  background: #F8F9FA; /* iOS系统背景色 */
  border-radius: 8px; /* iOS圆角规范 */
  /* transition: all 0.25s cubic-bezier(0.4,0,0.2,1); */
}

/* 工时区间重构配色方案 */
.workload-low { 
  background: #B3E5FC;  /* 强化后的浅蓝 */
}

.workload-medium {
  background: #E1BEE7;  /* 提亮后的浅紫 */
}

.workload-high {
  background: #FFCDD2;  /* 加深后的浅红 */
}

/* 日期数字 (iOS时间组件风格) */
.day-number {
  position: absolute;
  top: 8px;
  right: 8px;
  font: 500 15px/-apple-system; /* SF Pro字体 */
  color: rgba(28,28,30,0.5); /* 50%透明 */
  padding: 2px 6px;
  transition: color 0.2s ease;
}

/* 任务信息 (iOS通知标记风格) */
.month_day_events {
  position: absolute;
  bottom: 8px;
  left: 50%;
  /* transform: translateX(-50%); */
  font: 500 13px/-apple-system;
  color: rgba(28,28,30,1); /* 70%透明 */
  white-space: nowrap;
}

/* 状态交互 */
.month_day_total:focus-within, 
.month_day_total.active {
  background: rgba(255,255,255,0.9); /* 毛玻璃效果 */
  backdrop-filter: blur(4px);
  
  .day-number { color: rgba(28,28,30,0.9) } /* 文字高对比 */
  .month_day_events { color: rgba(28,28,30,0.9) }
}

/* 非工作日样式 */
.non-workday-cell {
  background: rgba(242,242,247,0.5) !important; /* iOS系统灰色 */
  .day-number { color: rgba(142,142,147,0.7) } /* 系统灰 */
}

/* 其他月份单元格 */
.other-month-cell {
  background: rgba(242,242,247,0.3); /* 更浅灰 */
  opacity: 0.5;
}

/* 悬停反馈 (参考网页7的微交互) */
@media (hover: hover) {
  .month_day_total:hover {
    /* transform: translateY(-2px); */
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
  }
}

</style>