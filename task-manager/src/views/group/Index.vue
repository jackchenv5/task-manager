<template>
  <div style="display: flex;height: 90vh;width: 100%;">
    <div class="left">
      <div style="display: flex;width: 100%;height: 20vh; justify-content: space-around;align-items: center;">
        <div style="height:14vh;width: 30%;border: 1px solid rgb(93, 168, 230);border-radius: 5px;padding: 5px;">
          <p>当前组：
            <el-select
              v-model="selectedGroup"
              filterable
              clearable
              placeholder="请选择"
              size="small"
              style="width: 120px"
              @change="handleGroupChange"
            >
              <el-option
                v-for="item in groups"
                :key="item.id"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </p>
          <p>人员：<span>{{ currentMemberCount }}人</span></p>
          <p>总工作量：<span>{{ currentTotalHours }}h</span></p>
        </div>
        <div style="height:14vh;width: 65%;border: 1px solid rgb(93, 168, 230);border-radius: 5px;padding: 5px;">
          <el-form label-width="auto" style="max-width: 600px">
            <el-row :gutter="20"> <!-- 列间距 -->
              <el-col :span="16">
                <el-form-item label="状态：">
                  <el-radio-group v-model="radio1" size="small" @change="handleStatusChange">
                    <el-radio-button label="所有任务" value="all"></el-radio-button>
                    <el-radio-button label="待下发" value="pending"></el-radio-button>
                    <el-radio-button label="进行中" value="running"></el-radio-button>
                    <el-radio-button label="已完成" value="done"></el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item >
                  <el-switch
                   v-model="switchButtonValue" 
                   inline-prompt 
                   active-text="全选" 
                   inactive-text="清空" 
                   @change="handleToggleAll"
                   />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="人员：">
              <el-checkbox-group v-model="checkedMembers" size="small">
                <div style="overflow: auto;padding:2px; height: 8vh">
                  <el-checkbox-button 
                    v-for="member in currentGroupMembers" 
                    :key="member" 
                    :value="member"
                    style="margin:3px"
                  >
                    {{ member }}
                  </el-checkbox-button>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-select
          v-model="selectedProjects"
          multiple
          collapse-tags  
          collapse-tags-tooltip  
          style="max-height: 100px; overflow-y: auto;" 
          filterable
          placeholder="参与项目"
          :disabled="checkedMembers.length === 0"
          @visible-change="handleDropdownOpen"
          @click="handleProjectSelectClick"
        >
          <!-- 全选选项 -->
          <el-option
            v-if="filteredProjects.length > 0"
            class="select-all-option"
            style="position: sticky; top: 0; background: white; z-index: 1;"
            label="全选"
            value="SELECT_ALL"
            @click="toggleSelectAll"
          >
            <span style="font-weight: bold">
              {{ selectedProjects.length > 0 ? '全不选' : '全选' }}
            </span>
          </el-option>

          <!-- 项目列表 -->
          <el-option
            v-for="item in filteredProjects"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      <div 
      ref="schedulerContainer" 
      style="width: 100%;height:70vh;"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp">
      </div>
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
                      :rows="3"
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
                      :rows="3"
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
                      :rows="3"
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
                      :rows="4"
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
      <el-card style="background: rgb(240, 238, 238);width:100%;margin-top:10px;height:10vh">
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
      <div style="margin: 10px; text-align: center;width:100%; height: 5vh">
        <el-button size="small" type="primary" :icon="Promotion" @click="dispatchTasks">下发任务</el-button>
      </div>
      <div style="overflow:auto;width: 100%; height: calc(90vh - 15vh - 20px)">
        <vxe-table
            ref="taskTable"
            border
            max-height=565
            show-header
            stripe
            auto-resize
            :row-config="{ isHover: true }"
            :data="filteredTasks"
            @cell-dblclick="handleRowDblClick"  
            @checkbox-all="selectAllChangeEvent"
            @checkbox-change="selectChangeEvent">
            <vxe-column type="checkbox" width="5%"></vxe-column>
            <vxe-column field="name" title="任务名" width="12%" show-overflow></vxe-column>
            <vxe-column field="status_name" title="状态" width="10%"></vxe-column>
            <vxe-column field="start_date" title="开始时间" width="15%"></vxe-column>
            <vxe-column field="end_date" title="截止时间" width="15%" show-overflow></vxe-column>
            <vxe-column field="workload" title="工作量(天)" width="10%"></vxe-column>
            <vxe-column field="project" title="项目" width="12%" show-overflow></vxe-column>
            <vxe-column field="creator_name" title="创建人" width="10%"></vxe-column>
            <vxe-column field="receiver_name" title="执行人" width="11%"></vxe-column>
          </vxe-table>
        </div>
    </div>
  </div>
</template>
 
<script setup>
import "dhtmlx-scheduler";
import { initSchedulerConfig } from '@/utils/scheduler'
import { onMounted, ref, watch, reactive, computed, toRaw } from 'vue';
import { Delete, Edit, Search, Share, Upload, Plus, Promotion } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { VxeUI } from 'vxe-table'
import { isWorkday, formatDate, formatVxeDate, getDayTotalWorkHours, getProgressStatus } from '@/utils/public'
import { useGroupStore } from '@/stores/group'
import { useUserStore } from '@/stores/user'
import { taskPublishApi } from '@/api/data/data'

const myGroupStore = useGroupStore()
const myUserStore = useUserStore()
const myTotalTasks = computed(() => myGroupStore.allTask)
const groups = computed(() => myGroupStore.allGroup)

const taskTable = ref()
const selectAllChangeEvent = ({ checked }) => {
  const $table = taskTable.value
  if ($table) {
    const records = $table.getCheckboxRecords()
  }
}
const selectChangeEvent = ({ checked }) => {
  const $table = taskTable.value
  if ($table) {
    const records = $table.getCheckboxRecords()
  }
}

const filteredTasks = computed(() => {
  // 如果 checkedMembers 或 selectedProjects 为空数组，直接返回空数组
  if (checkedMembers.value.length === 0 || selectedProjects.value.length === 0) {
    return [];
  }

  // 先根据 radio1 过滤状态
  let filtered = myTotalTasks.value;
  if (radio1.value !== 'all') {
    filtered = filtered.filter(event => {
      if (radio1.value === 'pending') return event.status_name === '待下发';
      if (radio1.value === 'running') return event.status_name === '进行中';
      if (radio1.value === 'done') return event.status_name === '已完成';
      return true;
    });
  }

  // 再根据 checkedMembers 过滤 worker（不检查 tl）
  filtered = filtered.filter(event => 
    checkedMembers.value.includes(event.receiver_name)
  );

  // 最后根据 selectedProjects 过滤项目
  filtered = filtered.filter(event =>
    selectedProjects.value.includes(event.project)
  );

   // 如果 selectedDates 有值，再根据日期过滤
  if (selectedDates.value.size > 0) {
    filtered = filtered.filter(event => {
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      
      // 检查任务时间范围内是否包含任何选中的日期
      return Array.from(selectedDates.value).some(selectedDate => {
        const date = new Date(selectedDate);
        return date >= startDate && date <= endDate;
      });
    });
  }

  return filtered.map(task => ({
    ...task,
    start_date: formatVxeDate(task.start_date),
    end_date: formatVxeDate(task.end_date),
  }));
});

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

    // const events = scheduler.getEvents(date, scheduler.date.add(date, 1, "day"));
    const events = scheduler.getEvents(date, scheduler.date.add(date, 1, "day"));
    const totalHours = getDayTotalWorkHours(events);
    const saturation = Math.round( totalHours / (8 * currentGroupMembers.value.length) ) * 100
    const currSaturation = saturation  + "%";

    // 单元狂背景色
    const bgColor = saturation > 100  ? "#ff0000" : 
                        saturation === 100 ? "#00ff00" : "#FFEE58";

    return `
        <div data-date="${formatDate(date)}" style="height: 100%; width: 100%; position: relative; cursor: pointer;background-color: ${bgColor}">
          <div style="position: absolute; top: 5px; right: 5px; font-weight: bold;">
            ${date.getDate()}
          </div>
          <div class="month_day_events" title="任务数量-任务饱和度">
            ${events.length || '0'}-${currSaturation}
          </div>
        </div>
    `;
};

// 获取容器引用
const schedulerContainer = ref(null);
onMounted(async () => {
  // 根据userStores中存储的数据确定加载哪个组的数据
  // 初始化加载数据
  await myUserStore.initUser(427);
  await myGroupStore.getAllTask(myGroupStore.groupId);
  await myGroupStore.getAllGroup();
  await myGroupStore.getGroupCfg();
  console.log(myGroupStore.groupCfg['selectedProjects']);
  selectedGroup.value = myGroupStore.groupCfg['selectedGroup'];
  radio1.value = myGroupStore.groupCfg['radio'];
  checkedMembers.value = myGroupStore.groupCfg['checkedMembers'];
  selectedProjects.value = myGroupStore.groupCfg['selectedProjects'];
  switchButtonValue.value = myGroupStore.groupCfg['switchButtonValue'];

  // 监听选择项目变化的处理操作
  watch(selectedProjects, (newVal) => {
    // 记录操作
    console.log('changed....')
    myGroupStore.setGroupCfg('selectedProjects', [...newVal]);
  }
  )

  // 监听人员变化时， 根据人员的选择重新计算已选项目
  watch(checkedMembers, (newVal) => {
    if (newVal.length === 0) {
      selectedProjects.value = [];
    } else {
      const projectsForMembers = myTotalTasks.value
          .filter(task => newVal.includes(task.receiver_name))
          .map(task => task.project);
      selectedProjects.value = [...new Set(projectsForMembers)]
    }
    // 记录操作
    myGroupStore.setGroupCfg('checkedMembers', [...newVal]);
  }
  )

  // 初始化 Scheduler
  scheduler = initSchedulerConfig(scheduler);
  scheduler.config.dblclick_create = false;
  scheduler.config.header = [
    'month',
    'date',
    'prev',
    'today',
    'next',
  ];
  scheduler.init(schedulerContainer.value, new Date(), 'month');
  scheduler.templates.month_day = getInitViewTemplate;
  scheduler.parse(toRaw(myTotalTasks.value));
  scheduler.updateView();

});

// ---*--- 组员变化相关方法 ---*---
// 处理组选择变化
const handleGroupChange = async (group) => {
  selectedGroup.value = group.name;
  // 更新任务信息
  // 获取当前视图状态
  var state = scheduler.getState();
  var currentMonth = state.date.getMonth() + 1; // 月份从0开始，所以要+1
  var currentYear = state.date.getFullYear();
  const firstDay = new Date(currentYear, currentMonth - 1, 1);
  const lastDay = new Date(currentYear, currentMonth, 0);
    
  const startDate = formatDate(firstDay);
  const endDate = formatDate(lastDay);

  // 重新获取组的数据
  await myGroupStore.getAllTask(group.id, startDate, endDate);
  myGroupStore.groupCfg.selectedGroupId = group.id;
  myGroupStore.groupCfg.selectedGroup = group.name;
  myGroupStore.groupCfg.radio = 'all';
  myGroupStore.groupCfg.checkedMembers = group.users;
  const projectsForMembers = myGroupStore.allTask
        .filter(task => group.users.includes(task.receiver_name))
        .map(task => task.project);
  myGroupStore.groupCfg.selectedProjects = [...new Set(projectsForMembers)];
  myGroupStore.groupCfg.switchButtonValue = true;
  selectedGroup.value = myGroupStore.groupCfg['selectedGroup'];
  radio1.value = myGroupStore.groupCfg['radio'];
  checkedMembers.value = myGroupStore.groupCfg['checkedMembers'];
  selectedProjects.value = myGroupStore.groupCfg['selectedProjects'];
  switchButtonValue.value = myGroupStore.groupCfg['switchButtonValue'];
  // 重新渲染日历视图
  scheduler.clearAll();
  scheduler.parse(toRaw(myTotalTasks.value));
  scheduler.updateView();
  selectedDates.value.clear();
  // 记录当前操作
  myGroupStore.setGroupCfg('selectedGroupId', group.id);
  myGroupStore.setGroupCfg('selectedGroup', group.name);
}

// 计算当前组成员数
const currentMemberCount = computed(() => {
  const group = groups.value.find(g => g.name === selectedGroup.value);
  return group ? group.users.length : 0
})

// 计算当前组总工作量 
const currentTotalHours = computed(() => {
  // 计算总工作量（所有任务的工作天数*8之和）
  const totalHours = myGroupStore.allTask.reduce((sum, task) => sum + (task.diff_days*8), 0);
  return totalHours.toFixed(2);
})

// 这个数据需要从后端传过来
const selectedGroup = ref('')

// 当前选中的人员
const checkedMembers = ref([])

// 计算当前组的成员列表
const currentGroupMembers = computed(() => {
  const group = groups.value.find(g => g.name === selectedGroup.value)
  return group ? group.users : []
})

// ---*--- 状态人员变化相关方法 ---*---
const radio1 = ref("all")
const switchButtonValue = ref(false)

// 处理状态单选变化
const handleStatusChange = (val) => {
  myGroupStore.setGroupCfg('radio', val);
};

// 处理全选/清空切换
const handleToggleAll = (isChecked) => {
  if (isChecked) {
    // 全选操作
    radio1.value = "all";
    checkedMembers.value = [...currentGroupMembers.value]; // 选中所有成员
    // 获取当前选中成员对应的所有项目（去重）
    const projectsForMembers = myTotalTasks.value
      .filter(task => checkedMembers.value.includes(task.receiver_name))
      .map(task => task.project);
    selectedProjects.value = [...new Set(projectsForMembers)]; // 去重后赋值
    // 记录操作
    myGroupStore.setGroupCfg('radio', 'all');
    myGroupStore.setGroupCfg('switchButtonValue', true);
  } else {
    // 清空操作
    radio1.value = "all";
    checkedMembers.value = []; // 清空选中成员
    selectedProjects.value = []; // 同时清空项目选择
    // 记录操作
    myGroupStore.setGroupCfg('radio', 'all');
    myGroupStore.setGroupCfg('switchButtonValue', false);
  }
};

// ---*--- 处理参与项目的选择 ---*---
const selectedProjects = ref([])
const isDropdownOpen = ref(false)

// 计算可选择的项目（基于选中人员）
const filteredProjects = computed(() => {
  if (checkedMembers.value.length === 0) return [];
  
  // 1. 先筛选出 worker 在 checkedMembers 中的任务
  const tasksForMembers = myTotalTasks.value.filter(task => 
    checkedMembers.value.includes(task.receiver_name)
  );
  
  // 2. 提取不重复的 project 列表
  const uniqueProjects = [...new Set(
    tasksForMembers.map(task => task.project)
  )];
  return uniqueProjects;
});

// 全选/取消全选逻辑
const toggleSelectAll = () => {
  if (selectedProjects.value.length > 1) {
    selectedProjects.value = []
  } else {
    selectedProjects.value = [...filteredProjects.value]
  }
}

// 当下拉框打开时，如果当前无选中项且项目列表非空，自动全选（可选）
const handleDropdownOpen = (open) => {
  isDropdownOpen.value = open
  if (open && selectedProjects.value.length === 0 && filteredProjects.value.length > 0) {
    // selectedProjects.value = [...filteredProjects.value] // 取消注释启用自动全选
  }
}

// 处理项目选择框点击事件
const handleProjectSelectClick = () => {
  if (checkedMembers.value.length === 0) {
    ElMessage.warning('请先选择人员');
  }
};


// ---*--- 计算任务统计信息 ---*---
const stats = computed(() => {
  const filtered = filteredTasks.value // 获取筛选后的任务
  
  // 1. 计算基础数据
  const totalTasks = filtered.length;
  const completedTasks = filtered.filter(t => t.status_name === '已完成').length;
  
  // 2. 计算总工作量（所有任务的工作天数*8之和）
  const totalHours = filtered.reduce((sum, task) => sum + (task.diff_days*8), 0);
  
  // 3. 计算任务饱和度
  const totalWorkdays = filtered.reduce((sum, task) => sum + task.workload, 0);
  const saturation = (totalHours / (totalWorkdays * 8)) * 100; // 转为百分比
  
  // 4. 计算待完成工作量
  const remainingHours = filtered.reduce((sum, task) => {
    if (task.status_name === '进行中') {
      const completed = task.workload*8 * (parseFloat(task.progress) / 100);
      return sum + (task.workload * 8 - completed);
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

// ---*--- 处理单击日历事件 ---*---
// 拖拽选择相关状态
const dragSelectState = reactive({
  isSelecting: false,
  justEndedSelection: false,
  startDate: null
});
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

// 清除所有高亮日期
const clearHighlightedDates = () => {
  document.querySelectorAll('.highlighted').forEach(el => {
    el.classList.remove('highlighted');
  });
};

const selectedDates = ref(new Set());

// 处理日期点击事件
const handleDateClick = (date) => {
  const dateStr = formatDate(date);
  selectedDates.value.clear();
  selectedDates.value.add(dateStr);

  updateStatsForSelectedDates();
};

// 为选中的多个日期更新统计
const updateStatsForSelectedDates = () => {
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
 
};

// ---*--- 处理多选日期事件 ---*---
// 处理鼠标按下事件
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

// 处理鼠标移动事件
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
  
  // if (current > end) {
  //   [current, end] = [end, current];
  // }
  
  while (current <= end) {
    range.push(formatDate(new Date(current)));
    current.setDate(current.getDate() + 1);
  }
  
  return range;
};

// 处理鼠标松开事件
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

// ---*--- 处理日历视图切换事件 ---*---
// 监听视图变化
scheduler.attachEvent('onViewChange', async (view, date) => {
  if (view === 'month') {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    const startDate = formatDate(firstDay);
    const endDate = formatDate(lastDay);
    
    await myGroupStore.getAllTask(myGroupStore.groupCfg['selectedGroupId'], startDate, endDate);
    scheduler.clearAll();
    scheduler.parse(toRaw(myTotalTasks.value));
    scheduler.updateView();
    selectedDates.value.clear();
  }
});

// ---*--- 处理表格双击事件 ---*---
const showDetailPanel = ref(false);
const currentTask = ref({});

const handleRowDblClick = (row) => {
  currentTask.value = row;
  showDetailPanel.value = true;
};

// ---*--- 处理下发任务事件 ---*---
const dispatchTasks = () => {
  // 如果当前用户不是所选组的leader， 则不允许下发
  const group = groups.value.find(g => g.name === selectedGroup.value)
  if (myUserStore.loginUser.username !== group.group_leader) {
    ElMessage.warning("您不是当前组的leader， 无法下发任务");
    return
  }

  if (taskTable.value) {
    const selectedRows = taskTable.value.getCheckboxRecords()
    
    if (selectedRows.length === 0) {
      ElMessage.warning('请至少选择一条任务')
      return
    }
    
    const ids = selectedRows
      .map(row => row.id)  // 提取每个 Proxy 对象的 id
      .join(',');    
    const params = {'ids': ids, 'publisher': myUserStore.loginUser.id,}
    try {
      myGroupStore.dispatchTask(params);
      // 修改数据的状态
      myGroupStore.allTask.forEach(task => {
        if (selectedRows.some(row => row.id === task.id)) {
          task.status_name = '进行中';
          task.status = 4;
        }
      });
      ElMessage.success('下发任务成功！');
      
    } catch (err) {
      ElMessage.error(`下发任务失败: ${err}`)
    }
    
  }
}

</script>

<style>
@import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";


/* 左侧和右侧 div 的样式 */
.left,
.right {
  flex: 1;
  /* 平均分配剩余空间 */
  display: flex;
  flex-direction: column;
  justify-content: start;
  /* 内容水平居中 */
  align-items: start;
  /* 内容垂直居中 */
}

/* 左侧 div 的背景色 */
.left {
  background-color: white;
}

/* 右侧 div 的背景色 */
.right {
  background-color: white;
  overflow: hidden;
}
.dhx_cal_data .dhx_month_body, 
.dhx_cal_data .dhx_month_head {
    height: 100% !important;
}

.dhx_cal_month_row {
  height: 90px !important;
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

.month_day_events {
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%); 
  font-size: 1.2em; 
  font-weight: bold;
  width: max-content;
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