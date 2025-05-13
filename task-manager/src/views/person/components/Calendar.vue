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

const myPersonStore = usePersonStore()

const emit = defineEmits(['date-selected'])

const schedulerContainer = ref(null)

const getInitViewTemplate = (date) => {
  const currentMonth = scheduler.getState().date.getMonth()
  if (date.getMonth() !== currentMonth) {
    return `<div style="height:100%; background:#f9f9f9"></div>`
  }

  if (!isWorkday(date)) {
    return `
      <div style="height: 100%; width: 100%; position: relative;">
        <div style="position: absolute; top: 5px; right: 5px; font-weight: bold;">
          ${date.getDate()}
        </div>
      </div>
    `
  }

  const events = scheduler.getEvents(date, scheduler.date.add(date, 1, "day"))
  const totalHours = getDayTotalWorkHours(events)
  const bgColor = 
    totalHours < 0 ? "#ffffff" :
    totalHours < 8 ? "#add8e6" : // 蓝色
    totalHours < 8.8 ? "#90ee90" : // 绿色
    totalHours < 9.6 ? "#ffa500" : // 橙色
    "#ff0000"; // 红色

  return `
    <div class="month_day_total" data-date="${formatDate(date)}" 
         style="height: 100%; width: 100%; position: relative; cursor: pointer; background-color: ${bgColor}">
      <div style="position: absolute; top: 5px; right: 5px; font-weight: bold;">
        ${date.getDate()}
      </div>
      <div class="month_day_events" title="当天任务数量-当天任务需要的总工时">
        ${events.length || '0'}-${totalHours}
      </div>
    </div>
  `
}

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

onMounted(async () => {
  await myPersonStore.getPersonTasks();
  scheduler = initSchedulerConfig(scheduler)
  scheduler.config.dblclick_create = false

  scheduler.config.select = true;
  scheduler.config.multi_day = true; // 允许多日选择
  scheduler.config.drag_select = true; // 启用拖拽选择

  scheduler.config.header = ['month', 'date', 'prev', 'today', 'next']
  scheduler.config.row_height = 80
  scheduler.init(schedulerContainer.value, new Date(), 'month')
  scheduler.templates.month_day = getInitViewTemplate
  scheduler.parse(myPersonStore.allTask);
  scheduler.updateView();

})


scheduler.attachEvent('onViewChange', async (view, date) => {
      // 计算这一天的第一天和最后一天
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      
      const startDate = formatDate(firstDay);
      const endDate = formatDate(lastDay);
      
      await myPersonStore.getPersonTasks(startDate, endDate);
      scheduler.clearAll();
      scheduler.parse(myPersonStore.allTask);
      scheduler.updateView();
  })

onUnmounted(() => {
  if (scheduler) {
    scheduler.destructor()
  }
})

defineExpose({
  updateView: () => scheduler?.updateView(),
  parse: (data) => scheduler?.parse(data)
})
</script>