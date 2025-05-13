<template>
  <div 
    ref="schedulerContainer" 
    style="width: 100%;height:86vh ;"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  ></div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import "dhtmlx-scheduler"
import { initSchedulerConfig } from '@/utils/scheduler'
import { formatDate, isWorkday } from '@/utils/public'

const props = defineProps({
  tasks: Array
})

const emit = defineEmits(['dateSelected', 'updateStats'])

const schedulerContainer = ref(null)
let scheduler = null

// 拖拽选择相关状态
const dragSelectState = reactive({
  isSelecting: false,
  justEndedSelection: false,
  startDate: null
})

// 初始化日历配置
const initScheduler = () => {
  scheduler = initSchedulerConfig(scheduler)
  scheduler.config.dblclick_create = false
  scheduler.config.header = ['month', 'date', 'prev', 'today', 'next']
  scheduler.config.row_height = 80
  scheduler.init(schedulerContainer.value, new Date(), 'month')
  scheduler.templates.month_day = getInitViewTemplate
  scheduler.parse(props.tasks)
  scheduler.updateView()

  scheduler.attachEvent('onViewChange', handleViewChange)
  scheduler.attachEvent('onEmptyClick', handleEmptyClick)
}

// 其他日历相关方法...
// (包括 handleMouseDown, handleMouseMove, handleMouseUp, getDateRange 等方法)
// 日历div中处理鼠标按下事件
const handleMouseDown = (event) => {
  if (event.button !== 0) return;
  
  const cell = event.target.closest('.dhx_cal_month_cell [data-date]');
  if (!cell) return;
  
  const dateStr = cell.dataset.date;
  if (!isWorkday(new Date(dateStr))) return;
  
  dragSelectState.isSelecting = true;
  dragSelectState.startDate = new Date(dateStr);
  selectedDates.value.clear();
  selectedDates.value.add(dateStr);
  
  clearHighlightedDates();
  cell.closest('.dhx_cal_month_cell').classList.add('highlighted');
  
  event.preventDefault();
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
};

// 获取日期范围内的所有日期
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

// 日历div中处理鼠标松开事件
const handleMouseUp = () => {
  if (dragSelectState.isSelecting) {
    // 标记刚刚结束拖拽选择
    dragSelectState.justEndedSelection = true;
    
    // 小延迟清除标记，避免快速连续操作的问题
    setTimeout(() => {
      dragSelectState.justEndedSelection = false;
    }, 100);
    
    dragSelectState.isSelecting = false;
    updateStatsForSelectedDates();
  }
};

// 为选中的多个日期更新统计
const updateStatsForSelectedDates = () => {
  selectedRow.value = null;
  selectedRowIndex.value = -1;
  if (selectedDates.value.size === 0) return;
  
  let totalHours = 0;
  let completed = 0;
  let totalTasks = 0;
  let totalRemain = 0;
  let tmpSelectedTask = [];
  let totalWorkdays = 0;
  selectedDates.value.forEach(dateStr => {
    const date = new Date(dateStr);
    const events = scheduler.getEvents(date, scheduler.date.add(date, 1, "day"));
    
    events.forEach(e => {
      const taskId = e.id;
      if (tmpSelectedTask.includes(taskId)) return;
      tmpSelectedTask.push(taskId);
      const taskStatus = e.status_name;
      const taskHours = e.workload * 8;
      const taskRemain = taskHours * (1 - parseFloat(e.progress) / 100);
      const taskWorkdays = e.workload
      
      if (taskStatus === "已完成") completed += 1;
      totalHours += taskHours;
      totalRemain += taskRemain;
      totalTasks += 1;
      totalWorkdays += e.workload
    });
  });
  stats.saturation = `${Math.min(100, Math.round((totalHours / (8 * totalWorkdays)) * 100))}%`;
  stats.completed = completed;
  stats.totalTasks = totalTasks;
  stats.total = `${totalHours.toFixed(1)}小时`;
  stats.remaining = `${totalRemain.toFixed(1)}小时`;
 
  updatemyTotalTasks();
};

// 更新选中的任务列表
const updatemyTotalTasks = () => {
  const allEvents = [];
  selectedDates.value.forEach(dateStr => {
    const date = new Date(dateStr);
    const events = scheduler.getEvents(date, scheduler.date.add(date, 1, "day"));
    allEvents.push(...events);
  });
  
  myPersonStore.allTask = Array.from(new Map(allEvents.map(event => [event.id, event])).values());
};

// 处理日期点击事件
const handleDateClick = (date) => {
  const dateStr = formatDate(date);
  selectedDates.value.clear();
  selectedDates.value.add(dateStr);
  clearHighlightedDates();

  updateStatsForSelectedDates();
};


onMounted(() => {
  initScheduler()
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