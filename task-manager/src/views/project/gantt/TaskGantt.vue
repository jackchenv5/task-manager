<template>
  <div class="gantt-container" ref="ganttContainer"></div>
</template>

<script setup>
import { nextTick, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import project from '@/router/modules/project';

const projectStore = useProjectStore()
const { projectFocusRef, curSelectProjectRef, curGanttData, selectUser, curProjectReceiverMap } = storeToRefs(projectStore)

// 容器引用
const ganttContainer = ref(null);

// 初始化 Gantt 配置
const initGantt = () => {
  // 基本配置
  // gantt.config.date_scale = "%d %M";
  gantt.config.scale_unit = "day";
  gantt.i18n.setLocale("cn");
  gantt.config.date_format = "%Y-%m-%d";
  gantt.templates.progress_text=function(start, end, task){return `${task.progress*100}%`;};

  gantt.config.empty_text = "暂无任务数据";  // [4](@ref)空数据提示
  gantt.config.auto_types = true;  // [1](@ref)自动推断任务类型

  gantt.config.columns = [
    { name: "text",       label: "任务名",  width: 120, tree: true },
    { name: "start_date", label: "开始时间", width: 100,align: "center" },
    { name: "duration",   label: "持续时间", width: 50,  align: "center" },
    { name: "receiver_name",   label: "执行者", width: 50,  align: "center" },
];

  gantt.config.drag_progress = false;
};

const loadSampleData = (data) => {
  try {
    gantt.clearAll();  // [4,1](@ref)切换数据前先清空
    const tasks = { data: Array.isArray(data) ? data : [] };
    gantt.parse(tasks);
    nextTick(() => gantt.render());  // [7](@ref)确保DOM更新后渲染
  } catch (error) {
    console.error('Gantt数据加载失败:', error);
  }
};

// 深度监听数据结构变化
watch(curGanttData, (newVal) => {
  if (newVal?.length && !selectUser.value) {
    loadSampleData(newVal);
  }
}, { deep: true,immediate: true });  // [6](@ref)深度监听嵌套数据变化


// 用户切换时强制更新
watch(selectUser, (newVal) => {
  const validData = newVal ? curProjectReceiverMap.value[newVal] : curGanttData.value;
  loadSampleData(validData || []);
});
const isGanttInitialized = ref(false);

onMounted(() => {
  if (!ganttContainer.value) return;
  
  gantt.init(ganttContainer.value);
  initGantt();
  isGanttInitialized.value = true;
  
  // [2](@ref)延迟加载初始数据
  setTimeout(() => loadSampleData(curGanttData.value), 100);
});

// [4](@ref)确保销毁时释放资源
onBeforeUnmount(() => {
  if (isGanttInitialized.value) {
    gantt.destructor();
    isGanttInitialized.value = false;
  }
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
</style>