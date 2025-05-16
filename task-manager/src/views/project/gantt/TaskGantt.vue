<template>
  <div class="gantt-container" ref="ganttContainer"></div>
</template>

<script setup>
import { nextTick, ref, onMounted, watch } from 'vue';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import project from '@/router/modules/project';

const projectStore = useProjectStore()
const { curGanttData, selectUser, curProjectReceiverMap } = storeToRefs(projectStore)

// 容器引用
const ganttContainer = ref(null);

// 初始化 Gantt 配置
const initGantt = () => {
  // 基本配置
  // gantt.config.scale_unit = "week";


  // gantt.config.grid_width = 400;
  // gantt.setSkin("material");
  gantt.i18n.setLocale("cn");
  gantt.config.date_format = "%Y-%m-%d";
  gantt.templates.progress_text = function (start, end, task) { return `${task.progress * 100}%`; };


  function getWeekOfMonthNumber(date) {
    let adjustedDate = date.getDate() + date.getDay();
    let prefixes = ['0', '1', '2', '3', '4', '5'];
    return (parseInt(prefixes[0 | adjustedDate / 7]) + 1);
  }

  gantt.config.scale_height = 60;
  gantt.config.scales = [
    { unit: "month", step: 1, format: "%Y年 %F" },
    {
      unit: "week", step: 1, format: function (date) {
        return "第" + getWeekOfMonthNumber(date) + "周";
      }
    },
    {
      unit: "day", step: 1, format: "%j %D"
    }
  ];


  gantt.templates.scale_cell_class = function (date) {
		return "weekend-scale";
	};

  gantt.templates.timeline_cell_class = function (item, date) {
		if (date.getDay() == 0 || date.getDay() == 6) {
			return "weekend-cell"
		}
	};

  var weekScaleTemplate = function (date) {
    var dateToStr = gantt.date.date_to_str("%d %M");
    var endDate = gantt.date.add(date, 7 - date.getDay(), "day");
    return dateToStr(date) + " - " + dateToStr(endDate);
  };

  gantt.config.empty_text = "暂无任务数据";
  gantt.config.auto_types = true;

  gantt.config.columns = [
    { name: "text", label: "任务名", width: 120, tree: true },
    { name: "start_date", label: "开始时间", width: 100, align: "center" },
    { name: "duration", label: "持续时间", width: 60, align: "center" },
    { name: "workload", label: "工时(天)", width: 60, align: "center" },
    { name: "receiver_name", label: "执行者", width: 60, align: "center" },
  ];

  gantt.config.drag_progress = false;
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
  if (newVal?.length && !selectUser.value) {
    loadSampleData(newVal);
  }
});


// 用户切换时强制更新
watch(selectUser, (newVal) => {
  const validData = newVal ? curProjectReceiverMap.value[newVal] : curGanttData.value;
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

</style>