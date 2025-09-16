<template>
    <div class="gantt-container" ref="ganttContainer" @click="handleClick" @dblclick="handleDBClick"></div>
    <el-dialog v-model="dialogFormVisible" title="任务修改" width="800">
        <EditForm></EditForm>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="warning" @click="confirmCopyTask">复制</el-button>
                <el-button type="primary" @click="confirmModifyTask">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import {ElDialog,ElButton} from "element-plus";
import { ref, onMounted, watch } from 'vue'
const dialogFormVisible = ref(false)

//  gant
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';


import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'


import EditForm from '../form/EditForm.vue'

import { transToProjectGanttData, transToRecevierGanttData } from '@/utils/gantt'

import { taskDeleteApi } from '@/api/data/data'
const scheduleStore = useScheduleStore()
const { curPendGanttData, lastAddTasksRef } = storeToRefs(scheduleStore)

const ganttContainer = ref(null);


const props = defineProps({
    modelValue: {
        type: String
    },
    joinType: {
        type: String
    },
})

watch(
    [() => props.modelValue, () => props.joinType],
    ([newModelValue, newJoinType]) => {
        initGanttRender();
    }
);


const initGanttRender = () => {
    let orginData = [];

    if (props.modelValue === 'cur') {
        orginData = curPendGanttData.value

    } else {
        orginData = lastAddTasksRef.value
    }
    // 组织结构
    let joinData = []

    if (props.joinType === 'project') {
        joinData = transToProjectGanttData(orginData)
    } else if (props.joinType === 'recevier') {
        joinData = transToRecevierGanttData(orginData)
    } else {
        joinData = orginData
    }

    gantt.clearAll();
    gantt.init(ganttContainer.value); // 重新绑定DOM容器
    gantt.render(); // 强制重绘
    gantt.parse({
        tasks: joinData,
    });

}
const initGantt = () => {
    // 基本配置
    gantt.i18n.setLocale("cn");
    gantt.config.date_format = "%Y-%m-%d";
    gantt.plugins({
      quick_info: true
    });
    gantt.templates.quick_info_date = function (start, end, task) {
      return ""
    };
    gantt.templates.quick_info_content = function (start, end, task) {

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

    // 在initGanttRender函数中添加事件监听
    gantt.attachEvent("onBeforeTaskDrag", function (id, mode, e) {
        return false; // 拦截所有拖拽操作
    });

    gantt.config.scale_height = 60;
  gantt.config.scales = [
    { unit: "month", format: "%Y年 %F", css: ()=>"month-scale"},
    { unit: "week",     format: function(date) {
        // 获取当月第一天
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // 计算当前日期是该月的第几周
        const diff = date.getDate() + firstDay.getDay() - 1;
        const weekNumber = Math.ceil(diff / 7);

        return `第${weekNumber}周`;
      },
      css: ()=>"week-scale"
    },
    {
      unit: "day",
      step: 1,
      format: function(date) {
        const month = date.getMonth() + 1; // 月份 (1-12)
        const day = date.getDate();        // 日 (1-31)
        return `${month}.${day}`;          // 返回 "月.日" 格式
      },
      css: ()=>"day-scale"
    },
  ]
    gantt.config.drag_progress = false
    gantt.config.drag_move = true;  // 禁止任务拖动
    gantt.config.drag_resize = true; // 禁止调整任务时间
    gantt.attachEvent("onTaskDrag", function (id, mode, task, original, e) {
      gantt.attachEvent("onBeforeTaskDrag", function(id, mode, e){
        return false;
      });
    })

    gantt.config.columns = [
        { name: "text", label: "任务名", width: 170, tree: true,
          template: function(obj) {
            return "<div class='gantt-cell-content' title='" + (obj.text || "") + "'>" + (obj.text || "") + "</div>";
          }
          },
        { name: "start_date", label: "开始时间", width: 160, align: "center" },
        // { name: "duration", label: "持续/天", width: 50, align: "center" },
        { name: "workload", label: "工时/天", width: 50, align: "center" },
        { name: "receiver_name", label: "执行者", width: 60, align: "center" },
        {
            name: "btns", label: "操作", width: 60, align: "center",
            template: function (task) {

                if (task.type === "project") return ''
                return ` 
            <span> 
                <button class="material-symbols-light--delete-outline delete-task" data-id="${task.id}"></button>  
                <button class="mingcute--edit-line edit-task"  data-id="${task.id}"></button> 
            </span> 
                `
            }
        },
    ];



  gantt.templates.timeline_cell_class = function(item, date) {
    const classes = [];
    if (date.getDate() === 1) {
      classes.push("month-start");
    }
    // 为不同月份交替设置不同背景色
    if (date.getMonth() % 2 === 0) {
      classes.push("even-month");
    } else {
      classes.push("odd-month");
    }
    return classes.join(" ");
  };
    gantt.config.drag_progress = false;
};

import { VxeUI } from 'vxe-pc-ui'
import {calWorkdays, reverseDateStr} from "@/utils/public.js";
const clickTimeout = ref(null);

const handleClick = async (event) => {
    clearTimeout(clickTimeout.value);
  clickTimeout.value = setTimeout(() => {
    const target = event.target;
    if (target.matches('button.edit-task[data-id]')) {
      const taskId = target.dataset.id;
      // 执行编辑逻辑
      modifyTask(taskId)
    }

    if (target.matches('button.delete-task[data-id]')) {
      VxeUI.modal.message({
        zIndex: 9999,
        content: '请双击确认删除！！！',
        status: 'success'
      })
    }
    // 这里放置单击事件的处理逻辑
  }, 250); // 250ms延迟，可根据需要调整

}


const handleDBClick = async (event) => {
  clearTimeout(clickTimeout.value);
  const target = event.target;
  // 判断点击目标是否为删除按钮
  if (target.matches('button.delete-task[data-id]')) {
    const taskId = target.dataset.id;

    await taskDeleteApi(taskId)
    await scheduleStore.getTableData()
    gantt.deleteTask(taskId);
    VxeUI.modal.message({
      zIndex: 9999,
      content: `任务：${taskId} 已删除！`,
      status: 'success'
    })
    // 执行删除逻辑
  }

}

const modifyTask = async (id) => {
    const taskObj = gantt.getTask(id);
    await scheduleStore.updateCurTaskDetail({ ...taskObj, sender: taskObj.sender?.split(",") })
    dialogFormVisible.value = true
}

const confirmModifyTask = async () => {
    await scheduleStore.modifyCurTask()
    // initGanttRender()
    VxeUI.modal.message({
        zIndex: 9999,
        content: `任务修改成功！`,
        status: 'success'
    })
    dialogFormVisible.value = false
    // 执行删除逻辑
}

const confirmCopyTask = async () => {
  await scheduleStore.copyCurTask()
  // initGanttRender()
  VxeUI.modal.message({
    zIndex: 9999,
    content: `任务复制成功！`,
    status: 'success'
  })
  dialogFormVisible.value = false
  // 执行删除逻辑
}

onMounted(() => {
    if (!ganttContainer.value) return;
    gantt.init(ganttContainer.value);
    initGantt();
    initGanttRender();

});


</script>

<style>
.gantt-container {
    width: 100%;
    height: 95%;
}

.gantt_cal_qi_controls {
    display: none !important;
}

.mingcute--edit-line {
    display: inline-block;
    width: 18px;
    height: 18px;
    --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M13 3a1 1 0 0 1 .117 1.993L13 5H5v14h14v-8a1 1 0 0 1 1.993-.117L21 11v8a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3zm6.243.343a1 1 0 0 1 1.497 1.32l-.083.095l-9.9 9.899a1 1 0 0 1-1.497-1.32l.083-.094z'/%3E%3C/g%3E%3C/svg%3E");
    background-color: currentColor;
    -webkit-mask-image: var(--svg);
    mask-image: var(--svg);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
}

.material-symbols-light--delete-outline {
    display: inline-block;
    width: 20px;
    height: 20px;
    --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z'/%3E%3C/svg%3E");
    background-color: currentColor;
    -webkit-mask-image: var(--svg);
    mask-image: var(--svg);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
}

/* 月份交替背景色 */
.even-month {
  background-color: white;
}

.odd-month {
  background-color: rgba(236, 220, 220, 0.3);
}
.gantt-cell-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: inline-block;
}

.gantt_grid_data .gantt_row:hover .gantt-cell-content {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  z-index: 1000;
  position: relative;
}

.gantt_cal_quick_info{
  width: 800px;
}
.quick-info-content{
  width:750px;
  overflow-x: auto;
}

/* 月份刻度 - 浅蓝色 */
.month-scale {
  background-color: #e6f2ff !important;
  border-right: 1px solid #cce0ff;
}

/* 周刻度 - 浅绿色 */
.week-scale {
  background-color: #e6ffe6 !important;
  border-right: 1px solid rgb(29, 65, 103);
}

/* 天刻度 - 浅黄色 */
.day-scale {
  background-color: #fffae6 !important;
  border-right: 1px solid rgb(227, 230, 238);
}

</style>