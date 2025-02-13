<template>
    <el-header class="head">
      <el-link target="_blank" type="info" href="/person">我的任务</el-link>
      <el-link target="_blank" type="success" href="/group" class="active">小组视图</el-link>
      <el-link target="_blank" type="primary" href="/icon">项目视图</el-link>
      <el-link target="_blank" type="warning" href="/feedback">任务编排</el-link>
      <el-link target="_blank" type="danger" href="/echart-pie">系统配置</el-link>
    </el-header>  
    <div style="display: flex;height: 90vh;width: 100%;">
    <div class="left">
      <div style="display: flex;margin-top: 5px;">
        <el-text style="margin-right: 10px;border: 1px solid rgb(34, 34, 14);padding:10px;background: rgba(53, 90, 139, 0.904);color: white;">测试部 | 效能小组</el-text>
        <el-select
      v-model="groupName"
      placeholder="请选择组员"
      style="width: 150px;margin-top:5px;margin-right: 5px;"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
        <el-radio-group v-model="typeRadio" size="large">
            <el-radio-button label="拆分任务" value="split"></el-radio-button>
            <el-radio-button label="合并任务" value="merge"></el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="taskRadio" size="large" style="margin-left: 10px;">
            <el-radio-button  label="所有任务" value="all"></el-radio-button>
            <el-radio-button label="已下发" value="running"></el-radio-button>
            <el-radio-button label="待下发" value="pend"></el-radio-button>
        </el-radio-group>
      </div>
      <div ref="schedulerContainer" style="width: 100%;height:80vh ;"></div>
    </div>
    <div class="right">
     <div>
      <el-checkbox
    v-model="checkAll"
    :indeterminate="isIndeterminate"
    @change="handleCheckAllChange"
  >
    全选
  </el-checkbox>
  <el-checkbox-group
    v-model="checkedCities"
    @change="handleCheckedCitiesChange"
  >
    <el-checkbox v-for="city in cities" :key="city" :label="city" :value="city">
      {{ city }}
    </el-checkbox>
  </el-checkbox-group>

     </div>
      <div style="background: white;border:3px solid rgb(252, 252, 253);width:100%;padding: 8px;margin-top:20px;">
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
      </div>
      <div style="margin-top: 20px;">
    <el-button type="primary" :icon="Plus" >新增任务</el-button>
    <el-button type="primary" :icon="Edit" >修改任务</el-button>
    <el-button type="primary" :icon="Download" >下发任务</el-button>
    <el-button type="primary" :icon="Delete" >删除任务</el-button>
    <el-button type="primary">
      导出Excel<el-icon class="el-icon--right"><Upload /></el-icon>
    </el-button>
    <el-button type="primary">
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
          修改
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
    // 设置皮肤和配置
    // scheduler.skin = 'material';
    scheduler.config.first_hour = 9;
    scheduler.config.last_hour = 22;
    // scheduler.config.readonly = true; // 设置为只读模式
    scheduler.config.dblclick_create = false; // 禁用双击添加事件
scheduler.i18n.setLocale({
    date:{
        format_date: "%Y-%m-%d", // 例如：2025-02-12
        format_time: "%H:%i", // 例如：10:24
        month_full:["一月", "二月", "三月", "四月", "五月", "六月", 
            "七月", "八月", "九月", "十月", "十一月", "十二月"],
        month_short:["1月", "2月", "3月", "4月", "5月", "6月", 
            "7月", "8月", "9月", "10月", "11月", "12月"],
        day_full:["星期日", "星期一", "星期二", "星期三", "星期四", 
            "星期五", "星期六"],
        day_short:["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    },
    labels:{
        dhx_cal_today_button:"今天",
        day_tab:"日视图",
        week_tab:"周视图",
        month_tab:"月视图",
        new_event:"新建任务",
        icon_save:"保存",
        icon_cancel:"取消",
        icon_details:"详情",
        icon_edit:"编辑",
        icon_delete:"删除",
        confirm_closing:"",// 您的更改将会丢失，确定吗？
        confirm_deleting:"该任务将被永久删除，确定吗？",
        section_description:"描述",
        section_time:"时间段",
        full_day:"整天",

        /*重复发生的事件*/
        confirm_recurring:"您是否要编辑整个系列的重复事件？",
        section_recurring:"重复事件",
        button_recurring:"禁用",
        button_recurring_open:"启用",
        button_edit_series:"编辑系列",
        button_edit_occurrence:"编辑发生实例",

        /*议程视图扩展*/
        agenda_tab:"议程",
        date:"日期",
        description:"描述",

        /*年视图扩展*/
        year_tab:"年",

        /* 周议程扩展 */
        week_agenda_tab:"议程",

        /*网格视图扩展*/
        grid_tab:"网格",

        /*触摸提示*/
        drag_to_create:"拖动以创建",
        drag_to_move:"拖动以移动",

        /* dhtmlx 消息默认按钮 */
        message_ok:"确定",
        message_cancel:"取消",

        /* 非文本控件的 WAI-ARIA 标签 */
        next:"下一个",
        prev:"上一个",
        year:"年",
        month:"月",
        day:"日",
        hour:"时",
        minute:"分"
    }
});
scheduler.plugins({
    tooltip: true
});

scheduler.templates.event_class = function(start, end, event) {
    // 获取进度值，默认为 0
    var progress = event.progress || 80;

    // 根据进度值返回对应的 CSS 类名
    if (progress <= 25) {
        return "custom-event progress-0";
    } else if (progress <= 50) {
        return "custom-event progress-25";
    } else if (progress <= 75) {
        return "custom-event progress-50";
    } else if (progress < 100) {
        return "custom-event progress-75";
    } else {
        return "custom-event progress-100";
    }
};


scheduler.templates.event_bar_text = function(start, end, event) {
    // 获取进度值，默认为 0
    var progress = event.progress || 50;

    // 创建进度条
    var progressBar = `
        <div style="width: 100%; background: #6bb900; border-radius: 2px;border:1px solid ; position: relative;">
            <div style="width: ${progress}%; background: #76c7c0; height: 100%; border-radius: 3px; position: absolute; top: 0; left: 0;"></div>
            <div style="position: relative; z-index: 1; padding: 2px; color: #333; font-size: 12px;">
                ${event.text} (${progress}%)
            </div>
        </div>
    `;

    return progressBar;
};

scheduler.templates.lightbox_header = function (start, end, ev) {
    return "Custom Event Header: " + (ev ? ev.text : "");
};
scheduler.templates.lightbox_footer = function (start, end, ev) {
    return "<div class='custom_footer'>Custom Footer Content</div>";
};
scheduler.attachEvent("onLightbox", function (id) {
    console.log("Lightbox opened for event: " + id);
    return true; // return false to prevent the lightbox from opening
});

scheduler.attachEvent("onAfterLightbox", function () {
    console.log("Lightbox closed");
});

scheduler.form_blocks["custom_block"] = {
    render: function (sns) {
        return "<div class='custom_block'><label>Custom Field:</label><input type='text' name='custom_field'></div>";
    },
    set_value: function (node, value, ev, section) {
        node.querySelector("input[name='custom_field']").value = value || "";
    },
    get_value: function (node, ev, section) {
        return node.querySelector("input[name='custom_field']").value;
    },
    focus: function (node) {
        node.querySelector("input[name='custom_field']").focus();
    }
};

scheduler.config.lightbox.sections = [
    { name: "description", height: 50, map_to: "text", type: "textarea", focus: true },
    { name: "custom", height: 50, type: "custom_block", map_to: "custom_field" },
    { name: "time", height: 72, type: "time", map_to: "auto" }
];

    scheduler.config.header = [
      'week',
      'month',
      'date',
      'prev',
      'today',
      'next',
    ];


     scheduler.xy.scale_height = 10; //sets the height of the X-Axis  
    // 初始化 Scheduler
    scheduler.init(schedulerContainer.value, new Date(2025, 1, 1), 'month');
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
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
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
const checkAll = ref(false)
const isIndeterminate = ref(true)
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
.progress-75 { background-color: #6bb9f0;}
.progress-100 { background-color: #a5dc86; }

/* 默认日期单元格样式 */
.custom-date-cell {
    border-radius: 3px;
}

/* 根据日期设置背景色 */
.highlight-date-1 { background-color: #ffcc99; } /* 浅橙色 */
.highlight-date-2 { background-color: #76c7c0; } /* 浅蓝色 */
.highlight-date-3 { background-color: #a5dc86; } /* 浅绿色 */

</style>