<template>
  <div class="gantt-wrapper">
    <div style="display: flex;margin:10px">
      <div style="height:18vh;width: 23%;background-color: white;;border: 1px solid grey;border-radius: 5px;padding: 5px;margin: 0px 5px;display: flex;flex-direction: column;">
        <div class="member-panel">
          <el-row class="panel-header">
            <el-col :span="8">
              <h3 class="card-title">组员</h3>
            </el-col>
            <el-col :span="4" :offset="12">
              <el-button class="clear-btn" @click="selectedUser = ''">清空</el-button>
            </el-col>
          </el-row>
          <el-scrollbar class="user-scrollbar">
            <div class="user-tags">
              <el-tag
                  v-for="user in users"
                  :key="user.id"
                  :class="['user-tag', { 'active': user === selectedUser }]"
                  @click="handleSelectUser(user)"
              >
                {{ user }}
              </el-tag>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div style="height:18vh;width: 43%;background-color: white;border: 1px solid grey;border-radius: 5px;padding: 5px;margin: 0px 5px;display: flex;justify-content: space-between;gap: 10px;">
        <div
            v-for="(week, index) in weeks">
          <h3 class="card-title">{{ week.label }}</h3>
          <el-progress
              type="dashboard"
              :percentage=getSaturation(index)
              :color=getSaturationColor(index)
              :width="100"
          >
            <template #default>
              <div class="progress-content">
                <el-icon :size="20" :color="getSaturationColor(index)">
                  <component :is="getSaturationIcon(index)" />
                </el-icon>
                <span class="percentage-text" v-if="getSaturation(index)">
                            {{ getSaturation(index) }}%
                            </span>
              </div>
            </template>
          </el-progress>
        </div>
      </div>
      <div style="height:18vh;width: 23%">
        <el-button type="primary" style="float:right" @click="uploadChange">提交修改</el-button>
      </div>
    </div>

    <div class="gantt-container" ref="ganttContainer" style="height: 600px"></div>
  </div>
</template>

<script setup>
import { nextTick, ref, onMounted, computed, watch } from 'vue'
import { reverseDateStr, percentToDecimal, TaskStatus, getWeeksInMonth, isTaskInWeek, formatDate, calWorkdays, getWorkdaysInWeek } from '@/utils/public'
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import { Sunny, PartlyCloudy, Cloudy, Lightning, CircleClose } from '@element-plus/icons-vue'
import { useGroupStore } from '@/stores/group'
import { ElMessage,ElRow,ElProgress,ElScrollbar,ElCol,ElIcon,ElTag,ElButton } from 'element-plus'

ElProgress.props.percentage.validator = (value) => {
  return typeof value === 'number' && value >= 0; // 允许 >100
}

const myGroupStore = useGroupStore()
const selectedUser = ref('')

const filteredTasks = computed(() => {
  // 先根据 radio1 过滤状态
  let filtered = myGroupStore.curGanttData
  // 再根据 selectedUser 过滤
  if (selectedUser.value) {
    filtered = filtered.filter(event =>
        selectedUser.value == event.receiver_name
    )
  }
  return filtered
});

const props = defineProps({
  users: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedMonth: {
    type: Array,
    required: true,
    default: () => [new Date().getFullYear(), new Date().getMonth() + 1]
  }
})

// 计算当前月的周信息
const weeks = computed(() => {
  const [year, month] = props.selectedMonth
  return getWeeksInMonth(year, month)
})

const userTaskData = computed(() => {
  const result = {}

  props.users.forEach(userName => {
    result[userName] = {}
    weeks.value.forEach((week, index) => {

      let currentWeekWorkloads = 0
      let count = 0

      myGroupStore.curGanttData.forEach(task => {
        // 如果任务执行者不是当前选中的用户， 继续遍历下一个
        if (task.receiver_name !== userName) return

        if (!isTaskInWeek(week, task)) return
        // 计算当前任务在这一周内的总工作量: 当前任务每一天的工作量 * 这个任务在当前周需要工作的天数
        const taskDuration = calWorkdays(task.start_date, task.end_date)
        const peerDayWorkload = task.workload / taskDuration
        const workdaysInWeek = getWorkdaysInWeek(week, task)
        const weekWorkload = peerDayWorkload * workdaysInWeek


        currentWeekWorkloads += weekWorkload
        count += 1
      })

      // 计算饱和度，周内的总工作量 / 周内的总工作天数

      const saturation = week.workday > 0 ? (currentWeekWorkloads / week.workday) * 100 : 0
      // 根据饱和度设置背景颜色和icon
      let bgColor = '#eee'
      let icon = CircleClose
      if (saturation > 0 && saturation < 100) {
        bgColor = 'rgb(94, 94, 214)'
        icon = Sunny
      } else if (saturation >= 100 && saturation <= 110) {
        bgColor = 'green'
        icon = PartlyCloudy
      } else if (saturation > 110 && saturation <= 120) {
        bgColor = 'orange'
        icon = Cloudy
      } else if (saturation > 120) {
        bgColor = 'rgb(129, 9, 9)'
        icon = Lightning
      }
      result[userName][index] = {
        bgColor: bgColor,
        count: count,
        saturation: parseFloat(saturation.toFixed(2)),
        icon: icon
      }
      week[userName] = saturation.toFixed(2)
    })
  })

  return result
})

const handleSelectUser = (user) => {
  selectedUser.value = user
}

watch(selectedUser, (newVal) => {
  loadSampleData(ganttData.value)
})

const getSaturationColor = (index) => {
  return userTaskData.value[selectedUser.value] ? userTaskData.value[selectedUser.value][index]['bgColor'] : '#eee'
}

const getSaturationIcon = (index) => {
  return userTaskData.value[selectedUser.value] ? userTaskData.value[selectedUser.value][index]['icon'] : CircleClose
}

const getSaturation = (index) => {
  return userTaskData.value[selectedUser.value] ? userTaskData.value[selectedUser.value][index]['saturation'] : 0
}

// 容器引用
const ganttContainer = ref(null)

// 初始化 Gantt 配置
const initGantt = () => {
  // 基本配置
  gantt.config.scale_height = 60; // 例如设置为60像素
  gantt.config.scales = [
    { unit: "month", format: "%Y年 %F" },
    { unit: "week",     format: function(date) {
        // 获取当月第一天
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // 计算当前日期是该月的第几周
        const diff = date.getDate() + firstDay.getDay() - 1;
        const weekNumber = Math.ceil(diff / 7) ;

        return `第${weekNumber}周`;
      }
    },
    {
      unit: "day",
      step: 1,
      format: "%j号(周%D)" // 日格式，%j 是日期号，%D 是星期几
    }
  ]

  gantt.templates.scale_cell_class = function (date) {
    if (date.getDay() == 0 || date.getDay() == 6) {
      return "weekend";
    }
  };

  gantt.templates.timeline_cell_class = function (item, date) {
    if (date.getDay() == 0 || date.getDay() == 6) {
      return "weekend"
    }
  };

  gantt.config.details_on_dblclick = false
  gantt.i18n.setLocale("cn")
  gantt.config.date_format = "%Y-%m-%d"
  // gantt.templates.progress_text = function (start, end, task) { return `${task.progress * 100}%` }

  gantt.config.empty_text = "暂无任务数据"
  // gantt.config.auto_types = true

  gantt.config.columns = [
    { name: "text", label: "任务名", width: 120, tree: true },
    { name: "start_date", label: "开始时间", width: 100, align: "center" },
    { name: "duration", label: "持续时间", width: 60, align: "center" },
    { name: "workload", label: "工时(天)", width: 60, align: "center" },
    { name: "owner", label: "执行者", width: 60, align: "center" },
  ]

  gantt.config.drag_progress = false
  const [year, month] = props.selectedMonth
  const firstDay = new Date(year, month - 1, 1) // 当月第一天
  const lastDay = new Date(year, month, 0)     // 当月最后一天

  // 添加未来两周的日期范围
  const futureTwoWeeks = new Date(lastDay)
  futureTwoWeeks.setDate(futureTwoWeeks.getDate() + 14) // 加14天

  // 设置甘特图的时间范围（从当月第一天到未来两周）
  gantt.config.start_date = firstDay
  gantt.config.end_date = futureTwoWeeks
  gantt.templates.task_class = function(start, end, task) {
    switch(task.status) {
      case TaskStatus.PROGRESS:
        return "status-running";
      case TaskStatus.FINISH:
        return "status-completed";
      case TaskStatus.PEND:
        return "status-pending";
      default:
        return "";
    }
  };
  // 配置拖拽模式（官方推荐方式）
  // 配置拖拽模式（官方推荐方式）
  gantt.config.drag_move = true;
  gantt.config.drag_resize = true;
  gantt.config.drag_progress = true;
  // 官方推荐的事件控制方式
  gantt.attachEvent("onBeforeTaskDrag", function(id, mode, e) {
    const task = gantt.getTask(id);
    const modes = gantt.config.drag_mode;
    // 只有"待下发"状态的任务允许所有操作
    if (task.status == TaskStatus.PEND || task.status == TaskStatus.PROGRESS) {
      return true;
    }

    // 其他状态任务禁止所有拖拽操作
    switch (mode) {
      case modes.move:
      case modes.resize:
      case modes.progress:
        return false;
      default:
        return false;
    }
  });



}

const loadSampleData = (data) => {
  try {
    gantt.clearAll()
    if(!gantt || !ganttContainer.value) return

    // 确保数据格式正确
    const tasks = Array.isArray(data.data) ? data : { data: [] }
    gantt.parse(tasks)
    gantt.render()
  } catch (error) {
    console.error('Gantt数据加载失败:', error)
  }
}

const ganttData = computed(() => {

  return {
    data: filteredTasks.value.map(x => ({
      id: x.id,
      text: x.name,
      start_date: reverseDateStr(x.start_time),
      duration: x.diff_days,
      status:x.status,
      progress: percentToDecimal(x.progress),
      owner: x.receiver_name,
      workload: x.workload
    }))
  };
});

const recordChange = ref([])

const updateTaskInStore = (updatedTask) => {
  // 1. 找到 store 中对应的任务
  const index = myGroupStore.allTask.findIndex(t => t.id === updatedTask.id)

  if (index !== -1) {
    const newStartDate = formatDate(updatedTask.start_date)
    const endDate = new Date(updatedTask.start_date)
    endDate.setDate(endDate.getDate() + updatedTask.duration - 1)
    const newEndDate = formatDate(endDate)

    const newTask = {
      ...myGroupStore.allTask[index],
      start_time: newStartDate,
      deadline_time: newEndDate,
      start_date: newStartDate,
      end_date: newEndDate
    }
    // 3. 直接替换原任务项（关键修改点）
    myGroupStore.allTask[index] = newTask
    recordChange.value.push(index)
  }

};

const uploadChange = async () => {
  if (recordChange.value.length === 0) {
    ElMessage.warning('没有调整任何任务')
    return
  }
  const failMsg = await myGroupStore.uploadAllChange(recordChange.value)
  if (failMsg) {
    ElMessage.error(`提交失败： ${failMsg}`)
  } else {
    ElMessage.success('提交成功')
  }

}

watch(() => myGroupStore.allTask, (newVal) => {
  // 销毁当前甘特图实例
  destroyGantt();

  // 使用 nextTick 确保 DOM 更新完成后再重新初始化
  nextTick(() => {
    if (!ganttContainer.value) return;

    // 重新初始化甘特图
    gantt.init(ganttContainer.value);
    initGantt();
    loadSampleData(ganttData.value);

    // 重新添加事件监听
    // gantt.attachEvent("onAfterTaskDrag", (id, mode, e) => {
    //   const task = gantt.getTask(id);
    //   updateTaskInStore(task);
    //   return true;
    // });
  });
}, {deep: true});

// 修改 destroyGantt 函数
const destroyGantt = () => {
  if (ganttContainer.value && gantt.$events) {
    gantt.clearAll();
    gantt.detachAllEvents(); // 确保移除所有事件监听
    gantt.destructor();
  }
};

onMounted(() => {
  if (!ganttContainer.value) return

  gantt.init(ganttContainer.value)
  initGantt()

  loadSampleData(ganttData.value)
  // 添加任务拖拽完成事件监听
  gantt.attachEvent("onAfterTaskDrag", (id, mode, e) => {
    const task = gantt.getTask(id)
    updateTaskInStore(task) // 更新 store 中的数据
    return true // 允许默认行为
  })
})

</script>

<style>
html, body{
  height:100%;
}

.gantt-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.gantt-container {
  flex: 1;
  width: 100%;
  height: 100%;
}

.gantt_task_progress {
  text-align: start;
  color: #736c6c;
  z-index: 0;
  background-color: green !important;
}

/* 人员面板样式 */
.member-panel {
  flex: 2;
  min-width: 300px;
}

/* 繁忙度面板样式 */
.workload-panel {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
}

.workload-header {
  margin-bottom: 8px;
}

.workload-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

/* 共用标题样式 */
.card-title {
  font-size: 16px;
  color: #303133;
  margin: 0 0 8px 8px;
  font-weight: 600;
  border-left: 3px solid #409eff;
  padding-left: 8px;
}

/* 清空按钮 */
.clear-btn {
  float: right;
  padding: 6px 12px;
  background: #f5f7fa;
  border: none;
  color: #606266;
}

/* 人员标签样式 */
.user-scrollbar {
  height: 100px;
}

.user-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px;
}

.user-tag {
  cursor: pointer;
  border-radius: 12px;
  padding: 6px 12px;
  transition: all 0.3s ease;
  background: #f5f7fa;
  color: #606266;
  border: 1px solid #e4e7ed;
}

.user-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-tag.active {
  background: linear-gradient(135deg, #409EFF 0%, #3375B9 100%);
  color: white;
  border: none;
}

/* 确定按钮 */
.confirm-button {
  align-self: center;
  margin-left: auto;
  padding: 8px 20px;
}

.progress-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px; /* 图标和文字的间距 */
}

.percentage-text {
  font-size: 14px;
  font-weight: bold;
  color: var(--el-text-color-primary); /* 跟随主题色 */
}
.weekend {
  background-color: rgba(236, 220, 220, 0.3);
}

/* 状态样式 */
.status-running .gantt_task_content {
  background: #409EFF; /* 蓝色 - 运行中 */
}

.status-completed .gantt_task_content {
  background: #67C23A; /* 绿色 - 已完成 */
}

.status-pending .gantt_task_content {
  background: #E6A23C; /* 黄色 - 待下发 */
}

/* 禁止拖拽的样式 */
.gantt_drag_marker {
  display: none !important;
}

.gantt_task_move, .gantt_task_progress {
  cursor: not-allowed !important;
}

</style>
