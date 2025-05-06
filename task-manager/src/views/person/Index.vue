<template>
    <!-- <el-header class="head">
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <div>
          <el-link target="_blank" href="/person" class="active">我的任务</el-link>
          <el-link target="_blank" href="/group">小组视图</el-link>
          <el-link target="_blank" href="/project">项目视图</el-link>
          <el-link target="_blank" href="/schedule">任务编排</el-link>
          <el-link target="_blank" href="/system">系统配置</el-link>
        </div>
        <div style="margin-left: auto;">您好，张涛D</div>
      </div>
    </el-header>   -->
    <div style="display: flex; height: 90vh; width: 100%;">
      <div class="left">
        <div style="display: flex; justify-content: center; width: 100%; margin-top: 5px;">
          <div style="display: flex; align-items: center; width: 100%; max-width: 800px; position: relative;">
            <el-radio-group v-model="typeRadio" size="small" style="flex-grow: 1; justify-content: center;" @change="handleRadioChange">
              <el-radio-button label="所有任务" value="all"></el-radio-button>
              <el-radio-button label="待下发" value="pending"></el-radio-button>
              <el-radio-button label="进行中" value="running"></el-radio-button>
              <el-radio-button label="已完成" value="done"></el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div ref="schedulerContainer" 
             style="width: 100%;height:86vh ;"
             @mousedown="handleMouseDown"
             @mousemove="handleMouseMove"
             @mouseup="handleMouseUp"
             @mouseleave="handleMouseUp"></div>
        <!-- 半屏详情面板 -->
        <transition name="slide-left">
          <div 
            v-if="showDetailPanel" 
            class="halfscreen-detail-panel"
            @click.self="showDetailPanel = false"
          >
            <div class="detail-content-wrapper">
              <!-- 关闭按钮 -->
              <el-button 
                class="close-btn"
                type="danger" 
                @click="showDetailPanel = false"
                circle
                size="small"
              >
                <el-icon><Close /></el-icon>
              </el-button>

              <h2 class="detail-title">任务详情</h2>

              <div class="detail-grid">
                <!-- 任务名称和工作量 -->
                <div class="detail-row">
                  <div class="detail-item">
                    <span class="detail-label">任务名称</span>
                    <el-input 
                      v-model="currentTask.row.name" 
                      readonly 
                      class="detail-input"
                      :title="currentTask.row.id"
                    />
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">工作量</span>
                    <el-input 
                      :value="currentTask.row.workload + ' 天'" 
                      readonly 
                      class="detail-input"
                    />
                  </div>
                </div>

                <!-- 邮件抄送 -->
                <div class="detail-row">
                  <div class="detail-item full-width">
                    <span class="detail-label">邮件抄送</span>
                    <el-input
                      type="textarea"
                      :rows=3
                      :value="currentTask.row.sender || '无'"
                      readonly
                      resize="none"
                      class="detail-textarea cc-textarea"
                    />
                  </div>
                </div>

                <!-- 开始时间和截止时间 -->
                <div class="detail-row">
                  <div class="detail-item full-width">
                    <span class="detail-label">开始时间 - 截止时间</span>
                    <el-input 
                      :value="`${formatDate(currentTask.row.start_date)} 至 ${formatDate(currentTask.row.end_date)}`" 
                      readonly 
                      class="detail-input"
                    />
                  </div>
                </div>

                <!-- 项目 -->
                <div class="detail-row">
                  <div class="detail-item full-width">
                    <span class="detail-label">项目</span>
                    <el-input 
                      :value="`${currentTask.row.project || '无'}`" 
                      readonly 
                      class="detail-input"
                    />
                  </div>
                </div>

                <!-- 关联任务 -->
                <div class="detail-row">
                  <div class="detail-item full-width">
                    <span class="detail-label">关联任务</span>
                    <el-input 
                      :value="`${currentTask.row.related_task || '无'}`" 
                      readonly 
                      class="detail-input"
                    />
                  </div>
                </div>

                <!-- 任务内容 -->
                <div class="detail-row">
                  <div class="detail-item full-width">
                    <span class="detail-label">任务内容</span>
                    <el-input
                      type="textarea"
                      :rows=3
                      :value="`${currentTask.row.content || '无'}`"
                      readonly
                      resize="none"
                      class="detail-textarea"
                    />
                  </div>
                </div>

                <!-- 挑战目标 -->
                <div class="detail-row">
                  <div class="detail-item full-width">
                    <span class="detail-label">挑战目标</span>
                    <el-input
                      type="textarea"
                      :rows=3
                      :value="`${currentTask.row.challenge || '无'}`"
                      readonly
                      resize="none"
                      class="detail-textarea"
                    />
                  </div>
                </div>

                <!-- 描述信息 -->
                <div class="detail-row">
                  <div class="detail-item full-width">
                    <span class="detail-label">详细描述</span>
                    <el-input
                      type="textarea"
                      :rows=4
                      :value="currentTask.row.description || '无'"
                      readonly
                      resize="none"
                      class="detail-textarea"
                    />
                  </div>
                </div>

                <!-- 完成度和实际工作量 -->
                <div class="detail-row">
                  <div class="detail-item">
                    <span class="detail-label">完成度</span>
                    <el-progress 
                      :percentage="parseInt(currentTask.row.progress || 0)" 
                      :status="getProgressStatus(currentTask.row.progress)"
                      style="width: 200px;"
                    />
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">实际工作量</span>
                    <el-input 
                      :value="(currentTask.row.act_workload || '0') + ' 天'" 
                      readonly 
                      class="detail-input"
                    />
                  </div>
                </div>

                <!-- 反馈信息 -->
                <div class="detail-row">
                  <div class="detail-item full-width">
                    <span class="detail-label">反馈记录</span>
                    <el-input
                      type="textarea"
                      :rows="4"
                      :value="currentTask.row.feedback || '无反馈记录'"
                      readonly
                      resize="none"
                      class="detail-textarea"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
    </div>
    
    <div class="right">
      <el-card style="width:100%;box-sizing: border-box;padding: 8px;background-color: rgb(243, 245, 247);" shadow="always">
      <div style="display: flex; width: 100%;">
        <div style="flex: 1; padding: 0 8px; min-width: 0;">
          <el-statistic :title="'任务饱和度'" :value="stats.saturation">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                任务饱和度
                <el-tooltip content="任务饱和度 = (当前选中日期的所有工时 / 8 x 工作日天数) x 100%" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
        
        <div style="flex: 1; padding: 0 8px; min-width: 0;">
          <el-statistic :value="stats.completed">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                已完成任务数
                <el-tooltip content="已完成的任务数量 / 总任务数量" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
            <template #suffix>/{{ stats.totalTasks }}</template>
          </el-statistic>
        </div>
        
        <div style="flex: 1; padding: 0 8px; min-width: 0;">
          <el-statistic :title="'总工作量'" :value="stats.total">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                总工作量
                <el-tooltip content="当前选中日期的总工时" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
        
        <div style="flex: 1; padding: 0 8px; min-width: 0;">
          <el-statistic :title="'待完成工作量'" :value="stats.remaining">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                待完成工作量
                <el-tooltip content="当前选中日期待完成工作量" placement="top">
                  <el-icon style="margin-left: 4px" :size="12">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </div>
</el-card>
    <div style="
      width: 50vw;
      overflow: auto;
      position: relative;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    ">
      <div style="min-width: 100%; display: inline-block">
        <vxe-table
          border
          :data="filteredTasks"
          @cell-click="handleRowClick"  
          @cell-dblclick="handleRowDblClick"  
          :row-config="{ isHover: true }"
          :row-class-name="tableRowClassName">
          <vxe-column field="name" title="任务名" width="18%" show-overflow></vxe-column>
          <vxe-column field="status_name" title="状态" width="10%"></vxe-column>
          <vxe-column field="start_date" title="开始时间" width="15%" show-overflow></vxe-column>
          <vxe-column field="end_date" title="截止时间" width="15%" show-overflow></vxe-column>
          <vxe-column field="workload" title="工作量(天)" width="12%"></vxe-column>
          <vxe-column field="project" title="项目" width="18%" show-overflow></vxe-column>
          <vxe-column field="creator_name" title="创建人" width="11%"></vxe-column>
        </vxe-table>
      </div>
    </div>
    
    <div v-if="selectedRow" style="width:100%;">
      <el-form label-width="auto" style="width: 100%;margin-top:10px">
        <el-form-item label="任务反馈:" style="margin-bottom: 10px;">
          <el-text type="primary" style="margin-left: 10px;">{{ selectedRow ? selectedRow.row.name : '未选择任务' }}</el-text>
        </el-form-item>
        
        <el-form-item style="margin-bottom: 22px;">
          <div style="display: flex; align-items: center;">
            <div style="display: flex; align-items: center; margin-right: 40px;margin-left: 20px;">
              <el-text style="margin-right: 10px;">实际工作量:</el-text>
              <el-input-number v-model="feedback_act_workload" :min="1" :max="30" />
            </div>
            <div style="display: flex; align-items: center;">
              <el-text style="margin-right: 20px;">进度:</el-text>
              <el-slider v-model="feedback_progress" show-input :step="10" show-stops style="width: 350px;" />
            </div>
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-input
            v-model="feedback_info" 
            type="textarea" 
            :rows="10"
            placeholder="请输入反馈信息..."
          />
        </el-form-item>
        
        <el-form-item style="margin-left: 40%">
          <el-button type="primary" @click="onSubmit" style="width: 120px;">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    </div>
    </div>
</template>

<script setup>
import "dhtmlx-scheduler";
import { initSchedulerConfig } from '@/utils/scheduler';
import { Close } from '@element-plus/icons-vue';
import { onMounted, ref, watch, reactive, computed, onUnmounted, toRaw } from 'vue';
import { VXETable } from 'vxe-table';
import { VxeTable, VxeColumn } from 'vxe-table'
import 'vxe-table/lib/style.css';
import { isWorkday, formatDate, formatVxeDate, getDayTotalWorkHours, getProgressStatus } from '@/utils/public'
import { usePersonStore } from '@/stores/person'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus';
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

// 获取容器引用
const schedulerContainer = ref(null);

// 从 usePersonStore 缓存中获取当前用户的数据
const myPersonStore = usePersonStore()
const myTotalTasks = computed(() => myPersonStore.allTask)

const myUserStore = useUserStore()
const personCfg = ref({});

// 根据用户选择过滤当前需要显示的任务
const filteredTasks = computed(() => {
  let filtered = myTotalTasks.value;
  if (typeRadio.value !== 'all') {
    filtered = filtered.filter(event => {
      if (typeRadio.value === 'pending') return event.status_name === '待下发';
      if (typeRadio.value === 'running') return event.status_name === '进行中';
      if (typeRadio.value === 'done') return event.status_name === '已完成';
      return true;
    });
  }
  return filtered.map(task => ({
    ...task,
    start_date: formatVxeDate(task.start_date),
    end_date: formatVxeDate(task.end_date),
  }));
});

// ---*--- 计算任务统计信息 ---*---
const stats = computed(() => {
  const filtered = filteredTasks.value; // 获取筛选后的任务
  
  // 1. 计算基础数据
  const totalTasks = filtered.length;
  const completedTasks = filtered.filter(t => t.status_name === '已完成').length;
  
  // 2. 计算总工作量（所有任务的hours之和）
  const totalHours = filtered.reduce((sum, task) => sum + (task.workload*8), 0);
  
  // 3. 计算任务饱和度
  const totalWorkdays = filtered.reduce((sum, task) => sum + task.diff_days, 0);
  const saturation = (totalHours / (totalWorkdays * 8)) * 100; // 转为百分比
  
  // 4. 计算待完成工作量
  const remainingHours = filtered.reduce((sum, task) => {
    if (task.status_name === '进行中') {
      const completed = task.workloads * (parseFloat(task.progress) / 100);
      return sum + (task.workloads - completed);
    }
    return sum;
  }, 0);
  
  return {
    totalTasks,
    completed: completedTasks,
    total: totalHours,
    remaining: Math.max(0, remainingHours), // 确保不小于0
    saturation: saturation
  };
});

// 拖拽选择相关状态
const dragSelectState = reactive({
  isSelecting: false,
  justEndedSelection: false,
  startDate: null
});

const selectedDates = ref(new Set());
const selectedRow = ref(null);
const selectedRowIndex = ref(-1);
const value = ref(0);
const num = ref(0);
const typeRadio = ref('all');

// 设置日历初始渲染方式
const getInitViewTemplate = (date) => {
    const currentMonth = scheduler.getState().date.getMonth();
    if (date.getMonth() !== currentMonth) {
        return `<div style="height:100%; background:#f9f9f9"></div>`;
    }

    // 如果不是有效工作日，仅显示日期
    if (!isWorkday(date)) {
        return `
            <div style="height: 100%; width: 100%; position: relative;">
                <div style="position: absolute; top: 5px; right: 5px; font-weight: bold;">
                    ${date.getDate()}
                </div>
            </div>
        `;
    }

    // 计算有效工作日的任务数量以及任务饱和度
    const events = scheduler.getEvents(date, scheduler.date.add(date, 1, "day"));
    const totalHours = getDayTotalWorkHours(events);
    // 单元框背景色
    const bgColor = totalHours > 8 ? "#ff0000" : 
                        totalHours === 8 ? "#00ff00" : "#FFEE58";

    return `
        <div class="month_day_total" data-date="${formatDate(date)}" style="height: 100%; width: 100%; position: relative; cursor: pointer;background-color: ${bgColor}">
          <div style="position: absolute; top: 5px; right: 5px; font-weight: bold;">
            ${date.getDate()}
          </div>
          <div class="month_day_events" title="当天任务数量-当天任务需要的总工时">
            ${events.length || '0'}-${totalHours}
          </div>
        </div>
    `;
};

// 监听视图变化
scheduler.attachEvent('onViewChange', async (view, date) => {
  if (view === 'month') {
    selectedRow.value = null;
    selectedRowIndex.value = -1;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    const startDate = formatDate(firstDay);
    const endDate = formatDate(lastDay);
    
    await myPersonStore.getPersonTasks(startDate, endDate);
    scheduler.clearAll();
    scheduler.parse(toRaw(myTotalTasks.value));
    scheduler.updateView();
    selectedDates.value.clear();
  }
});

// 处理表格行点击
const handleRowClick = (row) => {
  //  if (event.detail > 1) return; // 双击时直接返回
  if (row.row.status_name !== "进行中") {
    ElMessage.warning(`无法反馈该状态（${row.row.status_name}）的任务`);
    return;
  }
   selectedRow.value = row;
   selectedRowIndex.value = filteredTasks.value.findIndex(item => item.id === row.id);
};

// 动态行类名
const tableRowClassName = ({ row }) => {
  if (selectedRow.value && row.id === selectedRow.value.id) {
    return 'highlight-row'
  }
  return ''
}

// 清除所有高亮日期
const clearHighlightedDates = () => {
  document.querySelectorAll('.highlighted').forEach(el => {
    el.classList.remove('highlighted');
  });
};

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

// 侧面弹出框
const showDetailPanel = ref(false);
const currentTask = ref({});

// 表格双击事件处理
const handleRowDblClick = (row) => {
  currentTask.value = row;
  showDetailPanel.value = true;
};

// 反馈进度
const feedback_act_workload = ref(-1);
const feedback_progress = ref(-1);
const feedback_info = ref('');
const onSubmit = async () => {
  console.log(selectedRow.value.row.id);
  console.log(feedback_act_workload.value, feedback_progress.value, feedback_info.value);
  console.log(feedback_progress.vlaue === 0, feedback_info.vlaue === '');
  if (feedback_progress.value === 0) {
    ElMessage.warning("进度不能为0");
    return;
  }
  if (feedback_info.value === '') {
    ElMessage.warning("反馈信息不能为空");
    return;
  }
  const feedInfo = {"act_workload": feedback_act_workload.value, "progress": feedback_progress.value, "feedback": feedback_info.value};
  try {
    await myPersonStore.feedbackTask(selectedRow.value.row.id, feedInfo);
    ElMessage.success("反馈成功！！！")
  } catch (err) {
    ElMessage.error(`反馈失败：${err}`)
  }
  
}

onMounted(async () => {
  // 初始化加载数据
  await myUserStore.initUser(1001); // 测试用
  await myPersonStore.getPersonTasks();
  personCfg.value = myUserStore.loginUser.config["person"] ? myUserStore.loginUser.config["person"] : {};
  console.log(personCfg.value);
  
  typeRadio.value = personCfg.value["typeRadio"] ? personCfg.value["typeRadio"] : "all";
  console.log(typeRadio.value);

  // 初始化 Scheduler
  scheduler = initSchedulerConfig(scheduler)
  scheduler.config.dblclick_create = false;
  scheduler.config.header = [
    'month',
    'date',
    'prev',
    'today',
    'next',
  ];
  scheduler.config.row_height = 80;
  scheduler.init(schedulerContainer.value, new Date(), 'month');
  scheduler.templates.month_day = getInitViewTemplate;
  scheduler.parse(toRaw(myTotalTasks));
  scheduler.updateView();

  scheduler.attachEvent("onEmptyClick", function(date, event){  
    // 如果是拖拽结束时的点击，忽略这次事件
    if (dragSelectState.justEndedSelection) {
      dragSelectState.justEndedSelection = false;
      return;
    }
    
    // 如果正在拖拽选择中，忽略点击
    if (dragSelectState.isSelecting) return;
    const currentMonth = scheduler.getState().date.getMonth();
    if (date.getMonth() !== currentMonth) return;
    if (!isWorkday(date)) return;
    handleDateClick(date);
    clearHighlightedDates();
    
    const cell = event.target.closest('.dhx_cal_month_cell');
    if (cell) {
      cell.classList.add('highlighted');
    }
  });

  // 启动引导程序
  // console.log(personCfg.value.tutorialComplete);
  if (!personCfg.value.personTutorialComplete) {
    driverObj.drive();
  }
  
});

onUnmounted(() => {
  document.removeEventListener('mouseup', handleMouseUp);
});

const handleRadioChange = (val) => {
  personCfg.value['typeRadio'] = val;
  console.log(personCfg.value);
  myUserStore.setUserConfig("person", personCfg.value);
};

const driverObj = driver({
  showProgress: true,
  steps: [
    { element: '.el-radio-group', popover: { title: '选择任务类型', description: '右边的任务列表会根据选择的任务类型过滤任务', side: "left", align: 'start' }},
    { element: '.dhx_cal_nav_button', popover: { title: '切换日历月份', description: '切换月份会重新渲染日历和更新右边的任务列表', side: "left", align: 'start' }},
    { element: '.dhx_cal_data', popover: { title: '任务总览', description: '显示当前月中每一天的任务情况， 可以点击或者拖拽多选某一段时间的任务情况', side: "left", align: 'start' }},
    { element: '.month_day_total', popover: { title: '具体某一天的任务情况', description: '当天的任务数量 -- 当天任务总工时(单位小时)', side: "left", align: 'start' }},
    { element: '.is-always-shadow', popover: { title: '任务详情', description: '显示下面列表中所有任务的情况', side: "left", align: 'start' }},
    { element: '.vxe-table', popover: { title: '任务列表', description: '根据状态和日历过滤显示任务', side: "left", align: 'start' }},
    { element: '.vxe-body--row', popover: { title: '具体任务信息', description: '单击表格中的任务反馈任务进度、双击查看任务详情', side: "left", align: 'start' }},
    { popover: { title: '恭喜', description: '您已完成当前页面所有引导，欢迎使用任务管理系统！', onNextClick: () => { handleTutorialComplete() } } }
  ]
});

const handleTutorialComplete = () => {
  console.log(111111)
  personCfg.value.personTutorialComplete = true
  myUserStore.setUserConfig("person", personCfg.value)
  driverObj.destroy()
}

</script>

<style>
  @import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";
  .el-link {
    font-size: 18px;
    margin-right: 20px;
    padding:10px;
  }

  .head {
    display: flex;
    justify-content: start;
    border-bottom: 2px solid #d6dfdf;
    border-top: 1px solid #f5f9f9;
    background: #ffffff;
  }

  .active{
    color: white;
    background: #5d6d96;
  }

.left, .right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  border: 1px solid #ccc;
}

.left {
  background-color: white;
}

.right {
  background-color: white;
}

.dhx_cal_data .dhx_month_body, 
.dhx_cal_data .dhx_month_head {
    height: 100% !important;
}

.dhx_cal_month_row {
  height: 100px !important;
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

.dhx_cal_event_line {
  display: none !important;
}

.highlighted {
    border: 2px solid #409EFF !important;
}

.highlight-row {
  background-color: #f0f7ff !important;
}

.highlight-row:hover > td {
  background-color: #e1f0ff !important;
}

.dhx_cal_month_cell {
  user-select: none;
}
/* 半屏详情面板样式 */
.halfscreen-detail-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2000;
  display: flex;
}

.detail-content-wrapper {
  width: 50%;
  height: 100%;
  background: white;
  padding: 30px;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 1;
}

.detail-title {
  margin: 0 0 20px 0;
  color: #303133;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-row {
  display: flex;
  gap: 20px;
}

.detail-item {
  flex: 1;
}

.detail-item.full-width {
  min-width: 100%;
}

.detail-label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #606266;
}

.detail-input {
  width: 100%;
}

.detail-input .el-input__inner {
  background-color: #f5f7fa;
  color: #606266;
  cursor: default;
}

.detail-textarea {
  width: 100%;
}

.detail-textarea .el-textarea__inner {
  background-color: #f5f7fa;
  color: #606266;
  cursor: default;
  font-family: inherit;
}

.cc-textarea .el-textarea__inner {
  height: 80px;
  overflow-y: auto;
}

/* 动画效果 */
.slide-left-enter-active {
  transition: all 0.3s ease-out;
}

.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
