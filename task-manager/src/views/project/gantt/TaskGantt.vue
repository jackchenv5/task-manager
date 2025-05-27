<template>
  <div class="gantt-container" ref="ganttContainer"></div>
</template>

<script setup>
import { nextTick, ref, onMounted, watch } from 'vue';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'

const projectStore = useProjectStore()
const { curGanttData, selectUser, curProjectReceiverMap } = storeToRefs(projectStore)

// 容器引用
const ganttContainer = ref(null);

const initGantt = () => {
    // 基本配置
    gantt.i18n.setLocale("cn");
    gantt.config.date_format = "%Y-%m-%d";
    // 在initGanttRender函数中添加以下配置
    gantt.config.drag_move = false;  // 禁止任务拖动
    gantt.config.drag_resize = false; // 禁止调整任务时间
    gantt.config.drag_progress = false; // 禁止拖动进度条

    gantt.plugins({
        quick_info: true
    });
//     gantt.templates.quick_info_title = function(start, end, task){ 
//        return ""; 
// };
// gantt.templates.progress_text=function(start, end, task){return `${task.progress *100} %` || 0;};
gantt.templates.quick_info_date = function(start, end, task){
       return ""
};
    gantt.templates.quick_info_content = function(start, end, task) {

    return `
        <div class="quick-info-content">
            <p>开始时间: ${gantt.templates.tooltip_date_format(start)}</p>
            <p>结束时间: ${gantt.templates.tooltip_date_format(end)}</p>
            <p>进度: ${task.progress * 100}%</p>
            <p>任务内容:</p>
            <pre>${task.content || ''}</pre> 
        </div>
    `;
};



    gantt.showLightbox = function () {
        // code of the custom form
        return false
    }

    gantt.config.scale_height = 60;
    gantt.config.scales = [
        { unit: "month", format: "%Y年 %F" },
        { unit: "week", format: "第 %W 周" },
    ]

  gantt.config.columns = [
    { name: "text", label: "任务名", width: 120, tree: true },
    { name: "start_date", label: "开始时间", width: 100, align: "center" },
    { name: "duration", label: "持续时间", width: 60, align: "center" },
    { name: "workload", label: "工时(天)", width: 60, align: "center" },
    { name: "receiver_name", label: "执行者", width: 60, align: "center" },
  ];
};

const loadSampleData = (data) => {
  try {
    // 检查服务是否就绪
    gantt.clearAll();  // [4,1](@ref)切换数据前先清空
    const tasks = { data: Array.isArray(data) ? data : [] };
    if (!gantt) return
    gantt.parse(tasks);
    nextTick(() => gantt.render());  // [7](@ref)确保DOM更新后渲染
  } catch (error) {
    console.error('Gantt数据加载失败:', error);
  }
};


watch(curGanttData, (newVal) => {
  if (newVal?.length) {
    loadSampleData(newVal);
  }
});


// 用户切换时强制更新
watch(selectUser, (newVal) => {
  const validData = newVal ? curProjectReceiverMap.value[newVal.username] : curGanttData.value;
  loadSampleData(validData || []);
});
const isGanttInitialized = ref(false);

onMounted(() => {
  if (!ganttContainer.value) return;
  if (!gantt) return
  gantt.init(ganttContainer.value);
  initGantt();
  isGanttInitialized.value = true;

  loadSampleData(curGanttData.value)
});


</script>

<style>
.gantt-container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.gantt_task_progress {
  text-align: start;
  color: white;
  z-index: 0;
  background: #0c192e;

}

.weekend-scale {
  background-color: rgb(236, 236, 229) !important;
  ;
}

.weekend-cell {
  background-color: rgba(223, 229, 231, 0.788) !important;
  ;
}

.gantt_cal_qi_controls {
    display: none !important;
}

</style>