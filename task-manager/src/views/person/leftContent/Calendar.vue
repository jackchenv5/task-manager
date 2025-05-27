<template>
  <div 
    ref="schedulerContainer" 
    style="width: 100%; height: 86vh;"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove" 
    @mouseup="handleMouseUp" 
  ></div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { usePersonStore } from '@/stores/person'
import "dhtmlx-scheduler"
import { initSchedulerConfig } from '@/utils/scheduler'
import { formatDate, isWorkday, getDayTotalWorkHours } from '@/utils/public'

import { storeToRefs } from 'pinia'
const myPersonStore = usePersonStore()

const {allTask} = storeToRefs(myPersonStore)

const emit = defineEmits(['date-selected'])

const schedulerContainer = ref(null)

const getInitViewTemplate = (date) => {
  const currentMonth = scheduler.getState().date.getMonth();
  if (date.getMonth() !== currentMonth) {
    return `<div class="month_day_total">
      <div class="day-number">${date.getDate()}</div>
      </div>
    `;
  }

  if (!isWorkday(date)) {
    return `
      <div class="month_day_total">
        <div class="day-number">${date.getDate()}</div>
      </div>
    `;
  }

  const events = scheduler.getEvents(date, scheduler.date.add(date, 1, "day"));
  const totalHours = getDayTotalWorkHours(events);
  let workloadClass = "workload-0"
  // 根据工时范围确定样式类
  if(totalHours > 0  && totalHours <= 8){
    workloadClass =  "workload-low"
  }else if( totalHours > 8 && totalHours <= 8.8 ){
    workloadClass =  "workload-medium"
  }else if ( totalHours > 8.8 && totalHours <= 9.6){
    workloadClass =  "workload-high"
  }else if (totalHours >9.6){
    workloadClass =  "workload-extra-high"
  }else{
    workloadClass = "workload-0"
  }

  return `
    <div class="month_day_total ${workloadClass}" data-date="${formatDate(date)}">
      <div class="day-number">${date.getDate()}</div>
      <div class="month_day_events" title="当天任务数量-当天任务需要的总工时">
        ${events.length || '0'}-${totalHours}
      </div>
    </div>
  `;
};

// 日历多选拖拽效果
let dragSelectState = false
const DRAG_THRESHOLD = 5; // 像素阈值，移动超过5px才认为是有效拖动
let startX = 0;
let startY = 0;
const selectedDates = ref([])

const clearHighlightedDates = () => {
  document.querySelectorAll('.highlighted').forEach(el => {
    el.classList.remove('highlighted');
  });
};

const handleMouseDown = (event) => {
    if (event.button !== 0) return

    const cell = event.target.closest('.dhx_cal_month_cell [data-date]')
    if (!cell) return

    const dateStr = cell.dataset.date;
    if (!isWorkday(new Date(dateStr))) return

    dragSelectState = true
    startX = event.clientX;
    startY = event.clientY;
    selectedDates.value = [dateStr]
    clearHighlightedDates()

    cell.closest('.dhx_cal_month_cell').classList.add('highlighted')
    event.preventDefault()
};

// 日历div中处理鼠标移动事件
const handleMouseMove = (event) => {
    if (!dragSelectState) return

    // 计算移动距离
    const deltaX = Math.abs(event.clientX - startX);
    const deltaY = Math.abs(event.clientY - startY);
    
    // 只有移动距离超过阈值才处理
    if (deltaX < DRAG_THRESHOLD && deltaY < DRAG_THRESHOLD) return;

    const cell = event.target.closest('.dhx_cal_month_cell [data-date]')
    if (!cell) return

    const endDateStr = cell.dataset.date
    updateDragSelection(endDateStr)
}

// 日历div中处理鼠标松开事件
const handleMouseUp = () => {
    dragSelectState = false
    emit('date-selected', selectedDates)
}

// 更新拖拽选区
const updateDragSelection = (endDateStr) => {
    const startDateStr = selectedDates.value[0]
    if (!startDateStr) return

    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)
    const dateRange = getDateRange(startDate, endDate)

    dateRange.forEach(dateStr => {
        if (isWorkday(new Date(dateStr))) {
            const cell = document.querySelector(`[data-date="${dateStr}"]`)
            if (cell) {
                cell.closest('.dhx_cal_month_cell').classList.add('highlighted')
                if (!selectedDates.value.includes(dateStr)) {
                    selectedDates.value.push(dateStr)
                }
            }
        }
    });
}

const getDateRange = (startDate, endDate) => {
    const range = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // 判断是递增还是递减
    const step = start <= end ? 1 : -1;
    
    let current = new Date(start);
    
    while (step === 1 ? current <= end : current >= end) {
        range.push(formatDate(new Date(current)));
        current.setDate(current.getDate() + step);
    }
    
    return range;
};
const initGantConfig = () => {
  scheduler = initSchedulerConfig(scheduler)
  scheduler.config.dblclick_create = false

  scheduler.config.select = true;
  scheduler.config.multi_day = true; // 允许多日选择
  scheduler.config.drag_select = true; // 启用拖拽选择

  scheduler.config.header = ['month', 'date', 'prev', 'today', 'next']
  scheduler.config.row_height = 80
  scheduler.init(schedulerContainer.value, new Date(), 'month')
  scheduler.templates.month_day = getInitViewTemplate
};

const initCanderView  = () => { 
      scheduler.clearAll();
      scheduler.parse(allTask.value);
      scheduler.updateView();
}


onMounted(async () => {
  initGantConfig()
  scheduler.parse(allTask.value);
  scheduler.updateView();
  initCanderView()
})

watch(allTask, () => {
  initCanderView()
})

scheduler.attachEvent('onViewChange', async (view, date) => {
      // 计算这一天的第一天和最后一天
      // const year = date.getFullYear();
      // const month = date.getMonth() + 1;
      
      // const firstDay = new Date(year, month - 1, 1);
      // const lastDay = new Date(year, month, 0);
      
      // const startDate = formatDate(firstDay);
      // const endDate = formatDate(lastDay);
      myPersonStore.changeMonthDate(date)
      // await myPersonStore.getPersonTasks(startDate, endDate);
      // scheduler.clearAll();
      // scheduler.parse(myPersonStore.allTask);
      // scheduler.updateView();
  })




defineExpose({
  updateView: () => scheduler?.updateView(),
  parse: (data) => scheduler?.parse(data)
})
</script>

<style>
@import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";

.dhx_month_link {
    display: none !important;
}

.dhx_month_head {
    padding: 5px;
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
    color: white;
    width: max-content;
}


/* 选中状态 */
.highlighted {
  /* 基础样式 */
  border: 1px solid rgb(136, 27, 27) !important;
  opacity: 0.6;
  border-radius: 10px; /* 匹配现代UI圆角 */
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

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
  border-radius: 10px; /* iOS圆角规范 */
  cursor: pointer;
}

/* 工时区间重构配色方案 */
.workload-0 { 
  background: #eee;  /* 强化后的浅蓝 */
}

/* 工时区间重构配色方案 */
.workload-low { 
  background: rgb(94, 94, 214);  /* 强化后的浅蓝 */
}

.workload-medium {
  background: green;  /* 提亮后的浅紫 */
}

.workload-high {
  background: orange!important;  /* 加深后的浅红 */
}

.workload-extra-high {
  background: rgb(129, 9, 9)!important;  /* 加深后的浅红 */
}

/* 日期数字 (iOS时间组件风格) */
.day-number {
  position: absolute;
  /* top: 8px;
  right: 8px; */
  font: 500 15px/-apple-system; /* SF Pro字体 */
  color: black; /* 50%透明 */
  padding: 2px 6px;
  transition: color 0.2s ease;
}


/* 状态交互 */
.month_day_total:focus-within, 
.month_day_total.active {
  background: rgba(255,255,255,0.9); /* 毛玻璃效果 */
  backdrop-filter: blur(4px);
  
  .day-number { color: white} /* 文字高对比 */
  .month_day_events { color: rgba(28,28,30,0.9) }
}

/* 悬停反馈 (参考网页7的微交互) */
@media (hover: hover) {
  .month_day_total:hover {
    /* transform: translateY(-2px); */
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
  }
}

</style>