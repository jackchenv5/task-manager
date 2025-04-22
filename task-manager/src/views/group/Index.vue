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
                v-for="item in groupOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </p>
          <p>人员：<span>{{ currentMemberCount }}人</span></p>
          <p>总工作量：<span>{{ currentTotalHours }}h</span></p>
        </div>
        <div style="height:14vh;width: 65%;border: 1px solid rgb(93, 168, 230);border-radius: 5px;padding: 5px;">
          <el-form :model="form" label-width="auto" style="max-width: 600px">
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
                <div style="overflow-x: auto;padding:2px">
                  <el-checkbox-button 
                    v-for="member in currentGroupMembers" 
                    :key="member" 
                    :label="member"
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
          filterable
          placeholder="参与项目"
          :disabled="checkedMembers.length === 0"
          @visible-change="handleDropdownOpen"
          @click="handleProjectSelectClick"
        >
          <!-- 全选选项（固定在顶部） -->
          <el-option
            v-if="filteredProjects.length > 0"
            class="select-all-option"
            label="全选"
            value="SELECT_ALL"
            @click="toggleSelectAll"
          >
            <span style="font-weight: bold">全选</span>
          </el-option>

          <!-- 搜索框（通过 filterable 自动启用，此处为样式优化） -->
          <template #prefix>
            <el-icon :size="14" style="margin-top: 5px">
              <Search />
            </el-icon>
          </template>

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
                      v-model="currentTask.row.text" 
                      readonly 
                      class="detail-input"
                      :title="currentTask.row.id"
                    />
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">工作量</span>
                    <el-input 
                      :value="currentTask.row.hours + ' 天'" 
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
                      :value="currentTask.row.cc || '无'"
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

                <!-- 项目和关联任务 -->
                <div class="detail-row">
                  <div class="detail-item full-width">
                    <span class="detail-label">项目信息</span>
                    <el-input 
                      :value="`${currentTask.row.project || '无'} ${currentTask.row.relatedTasks ? '(关联任务: ' + currentTask.row.relatedTasks.map(t => t.text).join(', ') + ')' : ''}`" 
                      readonly 
                      class="detail-input"
                    />
                  </div>
                </div>

                <!-- 任务内容和挑战目标 -->
                <div class="detail-row">
                  <div class="detail-item full-width">
                    <span class="detail-label">内容与目标</span>
                    <el-input
                      type="textarea"
                      :rows="3"
                      :value="`任务内容: ${currentTask.row.detail || '无'}\n挑战目标: ${currentTask.row.challenge || '无'}`"
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
                      :percentage="parseInt(currentTask.row.process || 0)" 
                      :status="getProgressStatus(currentTask.row.process)"
                      style="width: 200px;"
                    />
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">实际工作量</span>
                    <el-input 
                      :value="(currentTask.row.actualHours || '0') + ' 天'" 
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
      <el-card style="background: rgb(240, 238, 238);width:100%;margin-top:1px;">
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
      <div style="margin: 10px; text-align: center;width:100%">
        <el-button size="small" type="primary" :icon="Promotion">下发任务</el-button>
      </div>
      <div style="overflow:auto;height: 70vh;width: 100%">
        <vxe-table
            border
            highlight-hover-row
            :data="filteredTasks"
            @cell-dblclick="handleRowDblClick"  
            @checkbox-all="selectAllChangeEvent"
            @checkbox-change="selectChangeEvent">
            <vxe-column type="checkbox" width="5%"></vxe-column>
            <vxe-column field="text" title="任务名" width="12%" show-overflow></vxe-column>
            <vxe-column field="status" title="状态" width="10%"></vxe-column>
            <vxe-column field="start_date" title="开始时间" width="15%"></vxe-column>
            <vxe-column field="end_date" title="截止时间" width="15%"></vxe-column>
            <vxe-column field="hours" title="工作量(h)" width="10%"></vxe-column>
            <vxe-column field="project" title="项目" width="12%" show-overflow></vxe-column>
            <vxe-column field="tl" title="TL" width="10%"></vxe-column>
            <vxe-column field="worker" title="执行人" width="11%"></vxe-column>
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

const tableRef = ref()
const myTotalTasks = ref([
  { id: 10001, text: 'Test1xxxxx', status: '进行中', start_date: '2025-02-01', end_date: '2025-02-03', hours: 28, project: '项目1xxxxxxx', tl: '朱元璋', worker: '张三', process: '30%', workdays: 1},
  { id: 10002, text: 'Test2', status: '进行中', start_date: '2025-02-03', end_date: '2025-02-05', hours: 21, project: '项目2', tl: '朱标', worker: '李四', process: '0%', workdays: 3 },
  { id: 10003, text: 'Test3', status: '待下发', start_date: '2025-02-05', end_date: '2025-02-08', hours: 30, project: '项目3', tl: '朱允炆', worker: '王五', process: '0%', workdays: 3 },
  { id: 10004, text: 'Test4', status: '已完成', start_date: '2025-02-08', end_date: '2025-02-15', hours: 42, project: '项目4', tl: '朱厚熜', worker: '诸葛亮', process: '100%', workdays: 6 },
  { id: 10005, text: 'Test5', status: '已完成', start_date: '2025-02-15', end_date: '2025-02-28', hours: 80, project: '项目5', tl: '朱由检', worker: '孙权', process: '100%', workdays: 10 }
])
const selectAllChangeEvent = ({ checked }) => {
  const $table = tableRef.value
  if ($table) {
    const records = $table.getCheckboxRecords()
  }
}
const selectChangeEvent = ({ checked }) => {
  const $table = tableRef.value
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
      if (radio1.value === 'pending') return event.status === '待下发';
      if (radio1.value === 'running') return event.status === '进行中';
      if (radio1.value === 'done') return event.status === '已完成';
      return true;
    });
  }

  // 再根据 checkedMembers 过滤 worker（不检查 tl）
  filtered = filtered.filter(event => 
    checkedMembers.value.includes(event.worker)
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
    start_date: task.start_date instanceof Date 
      ? formatVxeDate(task.start_date) 
      : task.start_date,
    end_date: task.end_date instanceof Date 
      ? formatVxeDate(task.end_date) 
      : task.end_date,
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
    const events = scheduler.getEvents(date, scheduler.date.add(date, 1, "day"));
    const totalHours = getDayTotalWorkHours(events)
    const currSaturation = Math.round( totalHours / 8 * 100) + "%";

    // 单元狂背景色
    const bgColor = totalHours > 8 ? "#ffdddd" : 
                        totalHours === 8 ? "#ddffdd" : "#fff3dd";

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
onMounted(() => {
  // 确保 scheduler 对象存在
  if (scheduler) {

    // 初始化 Scheduler
    scheduler = initSchedulerConfig(schedulerContainer, scheduler);
    scheduler.config.dblclick_create = false;
    scheduler.config.header = [
      'month',
      'date',
      'prev',
      'today',
      'next',
    ];
    scheduler.init(schedulerContainer.value, new Date(2025, 1, 1), 'month');
    // scheduler.templates.event_bar_text = function() { return ""; };
    // scheduler.templates.event_text = function() { return ""; };
    scheduler.templates.month_day = getInitViewTemplate;
    scheduler.parse(toRaw(myTotalTasks.value));
    scheduler.updateView();

  } else {
    console.error('Scheduler is not properly imported.');
  }

  // 这里需要根据后端返回的配置来确定当前是否是第一次操作
  switchButtonValue.value = true;
  handleToggleAll(true);
});

// ---*--- 组员变化相关方法 ---*---
// 处理组选择变化
const handleGroupChange = (value) => {
  selectedGroup.value = value
}

// 计算当前组成员数
const currentMemberCount = computed(() => {
  const group = groupOptions.value.find(g => g.value === selectedGroup.value)
  return group ? group.members.length : 0
})

// 计算当前组总工作量
const currentTotalHours = computed(() => {
  const group = groupOptions.value.find(g => g.value === selectedGroup.value)
  return group ? group.hours : 0
})

// 这个数据也需要从后端传过来
const groupOptions = ref([
  {
    value: '60',
    label: '业务组有线团队',
    members: ['张三', '李四', '王五', '诸葛亮', '许攸', '孙权', '李连杰', '周星驰', '刘亦菲'],
    hours: 80
  },
  {
    value: '59',
    label: '业务组无线团队',
    members: ['张三', '李四', '王五', '诸葛亮', '许攸', '孙权', '李连杰', '周星驰', '刘亦菲'],
    hours: 60
  },
  {
    value: '26',
    label: '业务测试出-基础测试组',
    members: ['张三', '李四', '王五', '诸葛亮', '许攸', '孙权', '李连杰', '周星驰', '刘亦菲'],
    hours: 70
  },
  {
    value: '25',
    label: '武汉测试处-产品组',
    members: ['张三', '李四', '王五', '诸葛亮', '许攸', '孙权', '李连杰', '周星驰', '刘亦菲'],
    hours: 90
  },
  {
    value: '24',
    label: '武汉测试处-安全组',
    members: ['张三', '李四', '王五', '诸葛亮', '许攸', '孙权', '李连杰', '周星驰', '刘亦菲'],
    hours: 120
  },
  {
    value: '23',
    label: '业务测试处-业务测试组',
    members: ['张三', '李四', '王五', '诸葛亮', '许攸', '孙权', '李连杰', '周星驰', '刘亦菲'],
    hours: 60
  },
  {
    value: '22',
    label: '系统处-数据中心组',
    members: ['张三', '李四', '王五', '诸葛亮', '许攸', '孙权', '李连杰', '周星驰', '刘亦菲'],
    hours: 10
  },
  {
    value: '20',
    label: '效能处自动化组',
    members: ['张三', '李四', '王五', '诸葛亮', '许攸', '孙权', '李连杰', '周星驰', '刘亦菲'],
    hours: 50
  },
  {
    value: '6',
    label: '业务测试处-协议测试组',
    members: ['张三', '李四', '王五', '诸葛亮', '许攸', '孙权', '李连杰', '周星驰', '刘亦菲'],
    hours: 90
  },
  {
    value: '1',
    label: '效能处工具组',
    members: ['张涛', '张世伟', '王俊坤', '乔志', '陈成'],
    hours: 180
  },
])

// 这个数据需要从后端传过来
const selectedGroup = ref(groupOptions.value[0]?.value || '')

// 当前选中的人员
const checkedMembers = ref([])

// 计算当前组的成员列表
const currentGroupMembers = computed(() => {
  const group = groupOptions.value.find(g => g.value === selectedGroup.value)

  // 初始化状态和人员选择
  radio1.value = "all";
  switchButtonValue.value = false;
  checkedMembers.value = []; // 清空选中成员
  return group ? group.members : []
})

// ---*--- 状态人员变化相关方法 ---*---
const radio1 = ref("all")
const switchButtonValue = ref(false)

// 处理状态单选变化
const handleStatusChange = (val) => {
  console.log("当前选中状态:", val);
};

// 处理全选/清空切换
const handleToggleAll = (isChecked) => {
  if (isChecked) {
    // 全选操作
    radio1.value = "all";
    checkedMembers.value = [...currentGroupMembers.value]; // 选中所有成员
    // 获取当前选中成员对应的所有项目（去重）
    const projectsForMembers = myTotalTasks.value
      .filter(task => checkedMembers.value.includes(task.worker))
      .map(task => task.project);
    selectedProjects.value = [...new Set(projectsForMembers)]; // 去重后赋值
  } else {
    // 清空操作
    radio1.value = "all";
    checkedMembers.value = []; // 清空选中成员
    selectedProjects.value = []; // 同时清空项目选择
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
    checkedMembers.value.includes(task.worker)
  );
  
  // 2. 提取不重复的 project 列表
  const uniqueProjects = [...new Set(
    tasksForMembers.map(task => task.project)
  )];
  return uniqueProjects;
});

// 全选/取消全选逻辑
const toggleSelectAll = () => {
  if (selectedProjects.value.length === filteredProjects.value.length) {
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

// 监听人员变化时清空已选项目
watch(checkedMembers, (newVal) => {
  if (newVal.length === 0) selectedProjects.value = []
})

// 处理项目选择框点击事件
const handleProjectSelectClick = () => {
  if (checkedMembers.value.length === 0) {
    ElMessage.warning('请先选择人员');
  }
};

// ---*--- 计算任务统计信息 ---*---
const stats = computed(() => {
  const filtered = filteredTasks.value; // 获取筛选后的任务
  
  // 1. 计算基础数据
  const totalTasks = filtered.length;
  const completedTasks = filtered.filter(t => t.status === '已完成').length;
  
  // 2. 计算总工作量（所有任务的hours之和）
  const totalHours = filtered.reduce((sum, task) => sum + task.hours, 0);
  
  // 3. 计算任务饱和度
  const totalWorkdays = filtered.reduce((sum, task) => sum + task.workdays, 0);
  const saturation = (totalHours / (totalWorkdays * 8)) * 100; // 转为百分比
  
  // 4. 计算待完成工作量
  const remainingHours = filtered.reduce((sum, task) => {
    if (task.status === '进行中') {
      const completed = task.hours * (parseFloat(task.process) / 100);
      return sum + (task.hours - completed);
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
      const taskStatus = e.status;
      const taskHours = e.hours;
      const taskRemain = taskHours * (1 - parseFloat(e.process) / 100);
      const taskWorkdays = e.workdays
      
      if (taskStatus === "已完成") completed += 1;
      totalHours += taskHours;
      totalRemain += taskRemain;
      totalTasks += 1;
      totalWorkdays += e.workdays
    });
  });
  stats.saturation = `${(totalHours / (8 * totalWorkdays)) * 100}%`;
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

// ---*--- 处理表格双击事件 ---*---
const showDetailPanel = ref(false);
const currentTask = ref({});

const handleRowDblClick = (row) => {
  currentTask.value = row;
  showDetailPanel.value = true;
};

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
  font-size: 1.4em; 
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