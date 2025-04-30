<template>
  <div style="display: flex;height: 90vh;width: 100%;overflow: hidden;">
    <div class="left">
      <div style="display: flex;width: 100%;height: 20vh; justify-content: space-around;align-items: center;">
        <div style="height:14vh;width: 30%;border: 1px solid rgb(93, 168, 230);border-radius: 5px;padding: 5px;">
          <p>当前项目：
            <el-select v-model="value" placeholder="Select" size="small" style="width: 120px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </p>
          <p>参与人员：<span>8人</span></p>
          <p>已完成/总工作量：<span>50h/80h(80%)</span></p>
        </div>
        <div style="height:14vh;width: 65%;border: 1px solid rgb(93, 168, 230);border-radius: 5px;padding: 5px;">
          <el-form :model="form" label-width="auto" style="max-width: 600px">
            <el-row :gutter="20"> <!-- 列间距 -->
              <el-col :span="16">
                <el-form-item label="状态：">
                  <el-radio-group v-model="radio1" size="small">
                    <el-radio-button label="全部" value="New York" />
                    <el-radio-button label="待下发" value="Washington" />
                    <el-radio-button label="进行中" value="Washington" />
                    <el-radio-button label="已完成" value="Los Angeles" />
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="一键操作：">
                  <el-switch v-model="value3" inline-prompt active-text="全选" inactive-text="清空" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="人员：">
              <!-- <p> -->
              <el-checkbox-group v-model="checkedCities" size="small">
                <div style="width: 30vw; overflow-x: auto;">
                  <el-checkbox-button v-for="city in cities" :key="city" :value="city">
                    {{ city }}
                  </el-checkbox-button>
                </div>

              </el-checkbox-group>
              <!-- </p> -->
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div ref="schedulerContainer" style="width: 100%;height:70vh;"></div>
    </div>
    <div class="right">
      <el-card style="background: rgb(240, 238, 238);width:100%;margin-top:1px;">
        <el-row>
          <el-col :span="6">
            <el-statistic title="任务饱和度" value="80%" />
          </el-col>
          <el-col :span="6">
            <el-statistic :value="13">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  已完成任务数
                  <el-icon style="margin-left: 4px" :size="12">
                    <Male />
                  </el-icon>
                </div>
              </template>
              <template #suffix>/20</template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic title="总工时" value="100" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="剩余工时" :value="80">
              <template #suffix>
                <el-icon style="vertical-align: -0.125em">
                  <ChatLineRound />
                </el-icon>
              </template>
            </el-statistic>
          </el-col>
        </el-row>
      </el-card>
      <div style="margin-top: 20px;">
        <el-button size="small" type="primary" :icon="Plus">新增任务</el-button>
        <el-button size="small" type="primary" :icon="Edit">修改任务</el-button>
        <el-button size="small" type="primary" :icon="Download">下发任务</el-button>
        <el-button size="small" type="primary" :icon="Delete">删除任务</el-button>
        <el-button size="small" type="primary">
          导出Excel<el-icon class="el-icon--right">
            <Upload />
          </el-icon>
        </el-button>
        <el-button size="small" type="primary">
          从Excel导入<el-icon class="el-icon--right">
            <Download />
          </el-icon>
        </el-button>
      </div>
      <el-table :data="tableData" stripe style="width: 100%;height: 60vh;margin-top:10px;">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="name" label="任务名" width="180" />
        <el-table-column prop="address" label="项目" />
        <el-table-column fixed="right" label="Operations" min-width="120">
          <template #default>
            <el-button link type="primary" size="small" @click="handleClick">
              详情
            </el-button>
            <el-button link type="warning" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
 
<script setup>
import "dhtmlx-scheduler";
import { initSchedulerConfig } from '@/utils/scheduler'
import { onMounted, ref, watch, reactive } from 'vue';
import { Delete, Edit, Search, Share, Upload, Plus, Download } from '@element-plus/icons-vue'
// 定义 props
// 定义 props
const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
});

// 获取容器引用
const schedulerContainer = ref(null);
var myEvents0 = [
];
var myEvents = [
];
onMounted(() => {
  // 确保 scheduler 对象存在
  if (scheduler) {

    // 初始化 Scheduler
    scheduler = initSchedulerConfig(scheduler)
    // 将数据加载到调度器
    scheduler.parse(myEvents0, "json");
    // 获取特定日期范围内的所有事件
    var fromDate = new Date(2025, 1, 12); // 注意：月份是从0开始计数的，即1表示二月
    var toDate = new Date(2025, 1, 15);
    var events = scheduler.getEvents(fromDate, toDate);
    console.log(events); // 输出事件列表

  } else {
    console.error('Scheduler is not properly imported.');
  }
});

const tableData = [
  {
    date: '2016-05-03',
    name: 'Task1',
    address: 'No. 1',
  },
  {
    date: '2016-05-02',
    name: 'Task2',
    address: 'No. 2',
  },
  {
    date: '2016-05-04',
    name: 'Task3',
    address: 'No. 3',
  },
  {
    date: '2016-05-01',
    name: 'Task4',
    address: 'No. 4',
  },
  {
    date: '2016-05-02',
    name: 'Task5',
    address: 'No. 5',
  },
]

// 监听 events 的变化
watch(
  () => props.events,
  (newEvents) => {
    if (scheduler) {
      scheduler.parse(newEvents);
    }
  },
  { deep: true }
);

// do not use same name with ref
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const onSubmit = () => {
  console.log('submit!')
}
const value = ref(0)
const typeRadio = ref('merge')
const taskRadio = ref('all')

const groupName = ref('所有成员')

// 监听 events 的变化
watch(typeRadio, (type) => {
  console.log(type)
  scheduler.clearAll();
  if (type === 'merge') {
    console.log(1)
    // scheduler.init(schedulerContainer.value, new Date(2025, 1, 1), 'month');
    // 将数据加载到调度器
    scheduler.parse(myEvents0, "json");
  } else {
    console.log(2)
    // scheduler.init(schedulerContainer.value, new Date(2025, 1, 1), 'month');
    // 将数据加载到调度器
    scheduler.templates.month_date_class = function (date) {
      var dayOfMonth = date.getDate(); // 获取当月的第几天
      console.log("Day of Month: " + dayOfMonth); // 打印日志

      // 假设非工作日为周末（周六、周日）
      if (dayOfMonth > 3 && dayOfMonth < 7) { // 如果是周六或周日
        return "non_working_day";
      }
    };
    scheduler.parse(myEvents, "json");
  }
  scheduler.updateView();
}
);
const options = [
  {
    value: '所有成员',
    label: '所有成员',
  },
  {
    value: '陈成',
    label: '陈成',
  },
  {
    value: '王俊坤',
    label: '王俊坤',
  },
  {
    value: '张涛',
    label: '张涛',
  },
  {
    value: '张世伟',
    label: '张世伟',
  },
  {
    value: '乔志',
    label: '乔志',
  },
]

const checkAll1 = ref(false)
const checkAll = ref(false)
const isIndeterminate = ref(true)
const isIndeterminate1 = ref(true)
const checkedCities = ref(['张世伟', '乔志'])
const cities = ['张世伟', '乔志', '张涛', '王俊坤', '陈成', '张世伟', '乔志', '张涛']

const handleCheckAllChange = (val) => {
  checkedCities.value = val ? cities : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === cities.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length
}
const checkedCities1 = ref(['项目1', '项目2'])
const cities1 = ['项目1', '项目2', '项目3', '项目4', '项目5']
const value2 = ref('')

const handleCheckAllChange1 = (val) => {
  checkedCities1.value = val ? cities1 : []
  isIndeterminate1.value = false
}
const handleCheckedCitiesChange1 = (value) => {
  const checkedCount = value.length
  checkAll1.value = checkedCount === cities1.length
  isIndeterminate1.value = checkedCount > 0 && checkedCount < cities1.length
}
const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]


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
}

/* 默认事件样式 */
.custom-event {
  border-radius: 3px;
  color: #333;
  font-size: 12px;
  padding: 2px;
  background: #a5dc86;
  width: 50%;
}

/* 根据进度设置背景色 */
.progress-0 {
  background-color: #f0f0f0;
}

.progress-25 {
  background-color: #ffcc99;
}

.progress-50 {
  background-color: #76c7c0;
}

.progress-75 {
  background-color: #f5d4f9;
}

.progress-100 {
  background-color: #a5dc86;
}

/* 默认日期单元格样式 */
.custom-date-cell {
  border-radius: 3px;
}

/* 根据日期设置背景色 */
.highlight-date-1 {
  background-color: #ffcc99;
}

/* 浅橙色 */
.highlight-date-2 {
  background-color: #76c7c0;
}

/* 浅蓝色 */
.highlight-date-3 {
  background-color: #a5dc86;
}

/* 浅绿色 */

.non_working_day {
  background-color: rgb(204, 152, 169) !important;
}
</style>