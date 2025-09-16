<template>
  <div class="gantt-container" ref="ganttContainer"></div>
</template>

<script setup>
import { nextTick, ref, onMounted, watch } from 'vue';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';


import { usePersonStore } from '@/stores/person'
import { storeToRefs } from 'pinia'

const personStore = usePersonStore()
const { curGanttData} = storeToRefs(personStore)

// 容器引用
const ganttContainer = ref(null);

const initGantt = () => {
    // 基本配置
    gantt.i18n.setLocale("cn");
    gantt.config.date_format = "%Y-%m-%d";
    gantt.plugins({
        quick_info: true
    });
    gantt.showLightbox = function () {
        // code of the custom form
        return false
    }

    gantt.config.scale_height = 60;
  gantt.config.scales = [
    { unit: "month", format: "%Y年 %F" },
    { unit: "week",     format: function(date) {
        // 获取当月第一天
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // 计算当前日期是该月的第几周
        const diff = date.getDate() + firstDay.getDay() - 1;
        const weekNumber = Math.ceil(diff / 7);

        return `第${weekNumber}周`;
      }
    },
    {
      unit: "day",
      step: 1,
      format: "%j号(周%D)" // 日格式，%j 是日期号，%D 是星期几
    }
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
  background-color: green !important;

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