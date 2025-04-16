<template>
    <div style="display: flex;height: 10vh;width: 100%;">
      <div style="display: flex;margin-top: 5px;">
        <el-text style="margin-right: 10px;font-size:12px;border: 1px solid rgb(34, 34, 14);padding:10px;background: rgba(27, 27, 27, 0.904);color: white;">测试部 | 效能小组</el-text>
        <el-radio-group v-model="typeRadio" size="small" >
            <el-radio-button label="拆分任务" value="split" ></el-radio-button>
            <el-radio-button label="合并任务" value="merge" ></el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="taskRadio" size="small" style="margin-left: 10px;">
            <el-radio-button  label="所有任务" value="all"></el-radio-button>
            <el-radio-button label="已下发" value="running"></el-radio-button>
            <el-radio-button label="待下发" value="pend"></el-radio-button>
        </el-radio-group>
     <div style="display: flex;flex-direction: column;width:25vw;">
      <div style="display: flex;flex-direction: row;width: 100%;margin-top: 10px;">
      <el-checkbox style="margin-left: 10px;" size="small"
    v-model="checkAll"
    :indeterminate="isIndeterminate"
    @change="handleCheckAllChange"
  >
    全选
  </el-checkbox>
  <el-checkbox-group
    v-model="checkedCities"
    @change="handleCheckedCitiesChange" style="margin-left: 10px;" size="small" 
  >
    <el-checkbox-button v-for="city in cities" :key="city" :label="city" :value="city">
      {{ city }}
    </el-checkbox-button>
  </el-checkbox-group>
      </div>
      <div style="display: flex;flex-direction: row;margin-top: 5px;width: 100%;">
      <el-checkbox style="margin-left: 10px;" size="small"
    v-model="checkAll1"
    :indeterminate="isIndeterminate1"
    @change="handleCheckAllChange1"
  >
    全选
  </el-checkbox>
  <el-checkbox-group
    v-model="checkedCities1"
    @change="handleCheckedCitiesChange1" style="margin-left: 10px;" size="small" 
  >
    <el-checkbox-button v-for="city in cities1" :key="city" :label="city" :value="city">
      {{ city }}
    </el-checkbox-button>
  </el-checkbox-group>
      </div>
        </div>

  <el-date-picker style="margin-top: 18px;margin-left: 10px;" size="small" 
        v-model="value2"
        type="daterange"
        unlink-panels
        range-separator="到"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :shortcuts="shortcuts"
        :size="size"
      />
      </div>
    </div>
    <div style="display: flex;height: 80vh;width: 100%;">
    <div class="left">
      <div ref="schedulerContainer" style="width: 100%;height:80vh ;"></div>
    </div>
    <div class="right">
     <div>

     </div>
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
    <el-button size="small" type="primary" :icon="Plus" >新增任务</el-button>
    <el-button size="small" type="primary" :icon="Edit" >修改任务</el-button>
    <el-button size="small" type="primary" :icon="Download" >下发任务</el-button>
    <el-button size="small" type="primary" :icon="Delete" >删除任务</el-button>
    <el-button size="small" type="primary">
      导出Excel<el-icon class="el-icon--right"><Upload /></el-icon>
    </el-button>
    <el-button size="small" type="primary">
      从Excel导入<el-icon class="el-icon--right"><Download/></el-icon>
    </el-button>
  </div>
        <el-table :data="tableData"  stripe style="width: 100%;height: 60vh;margin-top:10px;">
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
import {initSchedulerConfig} from '@/utils/scheduler'
import { onMounted, ref,watch,reactive } from 'vue';
import { Delete, Edit, Search, Share, Upload,Plus,Download } from '@element-plus/icons-vue'
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
    {id:1, text:"任务 1:执行者：陈成", start_date:"2025-02-03 09:00", end_date:"2025-02-09 12:00"},
    {id:11, text:"任务 2:执行者：乔志", start_date:"2025-02-04 09:00", end_date:"2025-02-09 12:00"},
    {id:12, text:"任务 3:执行者：王俊坤", start_date:"2025-02-05 09:00", end_date:"2025-02-09 12:00"},
    {id:13, text:"任务 4:执行者：熊德江", start_date:"2025-02-03 09:00", end_date:"2025-02-09 12:00"},
    {id:14, text:"任务 5:执行者：张世伟", start_date:"2025-02-03 09:00", end_date:"2025-02-09 12:00"},
    {id:15, text:"任务 6:执行者：张涛", start_date:"2025-02-03 09:00", end_date:"2025-02-09 12:00"},
    {id:2, text:"任务 7:执行者：陈成", start_date:"2025-02-10 09:00", end_date:"2025-02-16 16:00"},
    {id:3, text:"任务 8:执行者：张涛", start_date:"2025-02-17 09:00", end_date:"2025-02-23 16:00"},
    {id:4, text:"任务 9：执行者：王俊坤", start_date:"2025-02-24 09:00", end_date:"2025-03-02 16:00"},
];
    var myEvents = [
    {id:1, text:"任务 1:执行者：陈成", start_date:"2025-02-03 09:00", end_date:"2025-02-03 12:00"},
    {id:2, text:"任务 1:执行者：陈成", start_date:"2025-02-04 09:00", end_date:"2025-02-04 12:00"},
    {id:3, text:"任务 1:执行者：陈成", start_date:"2025-02-05 09:00", end_date:"2025-02-05 12:00"},
    {id:4, text:"任务 1:执行者：陈成", start_date:"2025-02-06 09:00", end_date:"2025-02-06 12:00"},
    {id:5, text:"任务 1:执行者：陈成", start_date:"2025-02-07 09:00", end_date:"2025-02-07 12:00"},
    {id:6, text:"任务 2:执行者：乔志", start_date:"2025-02-03 09:00", end_date:"2025-02-03 12:00"},
    {id:7, text:"任务 2:执行者：乔志", start_date:"2025-02-04 09:00", end_date:"2025-02-04 12:00"},
    {id:8, text:"任务 2:执行者：乔志", start_date:"2025-02-05 09:00", end_date:"2025-02-05 12:00"},
    {id:9, text:"任务 2:执行者：乔志", start_date:"2025-02-06 09:00", end_date:"2025-02-06 12:00"},
    {id:16, text:"任务 3:执行者：王俊坤", start_date:"2025-02-03 09:00", end_date:"2025-02-03 12:00"},
    {id:17, text:"任务 3:执行者：王俊坤", start_date:"2025-02-04 09:00", end_date:"2025-02-04 12:00"},
    {id:18, text:"任务 3:执行者：王俊坤", start_date:"2025-02-05 09:00", end_date:"2025-02-05 12:00"},
    {id:19, text:"任务 3:执行者：王俊坤", start_date:"2025-02-06 09:00", end_date:"2025-02-06 12:00"},
    {id:20, text:"任务 3:执行者：王俊坤", start_date:"2025-02-07 09:00", end_date:"2025-02-07 12:00"},
];
onMounted(() => {
  // 确保 scheduler 对象存在
  if (scheduler) {

    // 初始化 Scheduler
    scheduler = initSchedulerConfig(schedulerContainer,scheduler)
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
watch(typeRadio,(type) => {
    console.log(type)
    scheduler.clearAll();
    if (type === 'merge') {
      console.log(1)
    // scheduler.init(schedulerContainer.value, new Date(2025, 1, 1), 'month');
    // 将数据加载到调度器
    scheduler.parse(myEvents0, "json");
    }else{
      console.log(2)
    // scheduler.init(schedulerContainer.value, new Date(2025, 1, 1), 'month');
    // 将数据加载到调度器
    scheduler.templates.month_date_class = function(date){
      var dayOfMonth = date.getDate(); // 获取当月的第几天
    console.log("Day of Month: " + dayOfMonth); // 打印日志

    // 假设非工作日为周末（周六、周日）
    if(dayOfMonth > 3 && dayOfMonth < 7){ // 如果是周六或周日
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
const cities = ['张世伟', '乔志', '张涛', '王俊坤','陈成']

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
const cities1 = ['项目1', '项目2', '项目3', '项目4','项目5']
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

  .head {
    display: flex;
    justify-content: start;
    border-bottom: 2px solid #d6dfdf;
    border-top: 1px solid #f5f9f9;
    background: #ffffff;
  }

/* 左侧和右侧 div 的样式 */
.left, .right {
  flex: 1; /* 平均分配剩余空间 */
  display: flex;
  flex-direction: column;
  justify-content: start; /* 内容水平居中 */
  align-items: start; /* 内容垂直居中 */
  border: 1px solid #ccc; /* 边框（可选） */
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
.progress-0 { background-color: #f0f0f0; }
.progress-25 { background-color: #ffcc99; }
.progress-50 { background-color: #76c7c0; }
.progress-75 { background-color: #f5d4f9;}
.progress-100 { background-color: #a5dc86; }

/* 默认日期单元格样式 */
.custom-date-cell {
    border-radius: 3px;
}

/* 根据日期设置背景色 */
.highlight-date-1 { background-color: #ffcc99; } /* 浅橙色 */
.highlight-date-2 { background-color: #76c7c0; } /* 浅蓝色 */
.highlight-date-3 { background-color: #a5dc86; } /* 浅绿色 */

.non_working_day {
    background-color: rgb(204, 152, 169) !important;
}
</style>