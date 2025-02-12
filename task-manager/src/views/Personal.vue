<template>
    <el-header class="head">
      <el-link target="_blank" type="info" href="/person">我的任务</el-link>
      <el-link target="_blank" type="success" href="/button">小组视图</el-link>
      <el-link target="_blank" type="primary" href="/icon">项目视图</el-link>
      <el-link target="_blank" type="warning" href="/feedback">任务编排</el-link>
      <el-link target="_blank" type="danger" href="/echart-pie">系统配置</el-link>
    </el-header>  
    <div style="display: flex;height: 90vh;width: 100%;">
    <div class="left">
        <div ref="schedulerContainer" style="width: 100%;height:85vh ;"></div>
    </div>
    <div class="right">
      <div style="background: white;border:3px solid rgb(252, 252, 253);width:100%;padding: 8px;">
          <el-row>
    <el-col :span="6">
      <el-statistic title="任务饱和度" value="100%" />
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
      <el-statistic title="剩余工时" :value="56">
        <template #suffix>
          <el-icon style="vertical-align: -0.125em">
            <ChatLineRound />
          </el-icon>
        </template>
      </el-statistic>
    </el-col>
  </el-row>
      </div>
        <el-table :data="tableData" stripe style="width: 100%;height: 40vh;">
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column prop="name" label="任务名" width="180" />
    <el-table-column prop="address" label="项目" />
  </el-table>
  <div style="width:100%;margin-top:10px;">
   <el-form :model="form" label-width="auto" style="width: 100%;" >
    <el-form-item label="当前选中任务:">
      <el-text>测试任务1</el-text>
    </el-form-item>
    <el-form-item label="进度:">
      <el-slider v-model="value" show-input />
    </el-form-item>
    <el-form-item label="反馈信息：">
      <el-input v-model="form.desc" type="textarea" rows="10" />
    </el-form-item>
    <el-form-item>
      <el-button type="warning" @click="onSubmit">同步到日志平台</el-button>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </el-form-item>
  </el-form>
  </div>
    </div>
    </div>
</template>
 
<script setup>
import "dhtmlx-scheduler";
import { onMounted, ref,watch,reactive } from 'vue';
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

onMounted(() => {
  // 确保 scheduler 对象存在
  if (scheduler) {
    // 设置皮肤和配置
    // scheduler.skin = 'material';
    // scheduler.config.first_hour = 8;
    // scheduler.config.last_hour = 17;
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

    scheduler.templates.event_text = function(start,end,ev){
        return '我的任务: ' + ev.text + '';
     };

     scheduler.xy.scale_height = 10; //sets the height of the X-Axis  
    // 初始化 Scheduler
    scheduler.init(schedulerContainer.value, new Date(2025, 1, 1), 'month');
    var myEvents = [
    {id:1, text:"任务 1", start_date:"2025-02-12 10:00", end_date:"2025-02-13 12:00"},
    {id:2, text:"任务 2", start_date:"2025-02-13 14:00", end_date:"2025-02-13 16:00"}
];
    // 将数据加载到调度器
    scheduler.parse(myEvents, "json");
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
</script>

<style>
  @import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";
  .el-link {
    font-size: 18px;
    margin-right: 20px;
  }

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
</style>