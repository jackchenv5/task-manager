<template>
    <el-header class="head">
      <el-link target="_blank"  href="/person" class="active">我的任务</el-link>
      <el-link target="_blank"  href="/group" >小组视图</el-link>
      <el-link target="_blank"  href="/project" >项目视图</el-link>
      <el-link target="_blank"  href="/schedule" >任务编排</el-link>
      <el-link target="_blank" href="/system">系统配置</el-link>
    </el-header>  
    <div style="display: flex;height: 90vh;width: 100%;">
    <div class="left">
      <div style="display: flex;margin-top: 5px;">
        <div style="display: flex;margin-top: 5px;margin-right: 10px;">陈成</div>
        <el-radio-group v-model="splitRadio" size="small">
            <el-radio-button label="拆分任务" value="split"></el-radio-button>
            <el-radio-button label="合并任务" value="merge"></el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="typeRadio" size="small" style="margin-left: 20px;">
            <el-radio-button label="所有任务" value="all"></el-radio-button>
            <el-radio-button label="待下发" value="pending"></el-radio-button>
            <el-radio-button label="进行中" value="running"></el-radio-button>
            <el-radio-button label="已完成" value="done"></el-radio-button>
        </el-radio-group>
      <el-button type="warning" @click="onSubmit" style="margin-left:20px">同步到日志平台</el-button>
      </div>
        <div ref="schedulerContainer" style="width: 100%;height:85vh ;"></div>
    </div>
    <div class="right">
      <el-card style="width:100%;padding: 8px;background-color: rgb(243, 245, 247);" shadow="always">
          <el-row>
    <el-col :span="6">
      <el-statistic title="任务饱和度" value="70%" />
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
      <el-statistic title="总工作量" value="100小时" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="待完成工作量" value="56小时">
        <template #suffix>
          <el-icon style="vertical-align: -0.125em">
            <ChatLineRound />
          </el-icon>
        </template>
      </el-statistic>
    </el-col>
  </el-row>
</el-card>
  <!-- <el-table :data="tableData" stripe style="width: 100%;height: 40vh;">
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column prop="name" label="任务名" width="180" />
    <el-table-column prop="address" label="项目" />
  </el-table> -->
  <el-card shadow="hover" style="width:100%;height: 30vh;">
  <el-descriptions title="任务信息" column="2">
    <el-descriptions-item label="任务名">测试任务1</el-descriptions-item>
    <el-descriptions-item label="项目">XXX项目市场发布版本测试项目</el-descriptions-item>
    <el-descriptions-item label="任务内容" span="2">
      <el-tag size="small">完成测试任务，并及时反馈</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="挑战目标" span="2">
      <el-tag size="small">完成挑战目标，并超过预期效果</el-tag>
    </el-descriptions-item>
  </el-descriptions>
  </el-card>
  <div style="width:100%">
   <el-form :model="form" label-width="auto" style="width: 100%;margin-top:10px" >
    <el-form-item label="任务反馈:">
      <el-text style="margin-left:20px">实际工作量</el-text><el-input-number style="margin-left:10px" v-model="num" :min="1" :max="30" />
    </el-form-item>
    <el-form-item label="进度:">
      <el-slider v-model="value" show-input :step="10" show-stops />
    </el-form-item>
    <el-form-item label="反馈信息：">
      <el-input v-model="form.desc" type="textarea" rows="10" />
    </el-form-item>
    <el-form-item>
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

    var myEvents = [
    {id:1, text:"任务 1 | 任务内容：测试任务1 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-03 9:00", end_date:"2025-02-09 18:00"},
    {id:2, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-10 9:00", end_date:"2025-02-16 18:00"},
    {id:3, text:"任务 3 | 任务内容：测试任务3 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-17 9:00", end_date:"2025-02-23 18:00"},
    {id:4, text:"任务 4 | 任务内容：测试任务4 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-03 9:00", end_date:"2025-02-09 18:00"},
    {id:5, text:"任务 5 | 任务内容：测试任务5 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-24 9:00", end_date:"2025-03-02 18:00"},
];

    var myEvents1 = [
    {id:11, text:"任务 1 | 任务内容：测试任务1 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-03 9:00", end_date:"2025-02-03 18:00"},
    {id:12, text:"任务 1 | 任务内容：测试任务1 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-04 9:00", end_date:"2025-02-04 18:00"},
    {id:13, text:"任务 1 | 任务内容：测试任务1 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-05 9:00", end_date:"2025-02-05 18:00"},
    {id:14, text:"任务 1 | 任务内容：测试任务1 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-06 9:00", end_date:"2025-02-06 18:00"},
    {id:15, text:"任务 1 | 任务内容：测试任务1 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-07 9:00", end_date:"2025-02-07 18:00"},
    {id:16, text:"任务 1 | 任务内容：测试任务1 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-08 9:00", end_date:"2025-02-08 18:00"},
    {id:17, text:"任务 1 | 任务内容：测试任务1 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-09 9:00", end_date:"2025-02-09 18:00"},

    {id:111, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-03 9:00", end_date:"2025-02-03 18:00"},
    {id:112, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-04 9:00", end_date:"2025-02-04 18:00"},
    {id:113, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-05 9:00", end_date:"2025-02-05 18:00"},
    {id:114, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-06 9:00", end_date:"2025-02-06 18:00"},
    {id:115, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-07 9:00", end_date:"2025-02-07 18:00"},
    {id:116, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-08 9:00", end_date:"2025-02-08 18:00"},
    {id:117, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-09 9:00", end_date:"2025-02-09 18:00"},

    {id:22, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-10 9:00", end_date:"2025-02-10 18:00"},
    {id:23, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-11 9:00", end_date:"2025-02-11 18:00"},
    {id:24, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-12 9:00", end_date:"2025-02-12 18:00"},
    {id:25, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-13 9:00", end_date:"2025-02-13 18:00"},
    {id:26, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-14 9:00", end_date:"2025-02-14 18:00"},
    {id:27, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-15 9:00", end_date:"2025-02-15 18:00"},
    {id:28, text:"任务 2 | 任务内容：测试任务2 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-16 9:00", end_date:"2025-02-16 18:00"},

    {id:33, text:"任务 3 | 任务内容：测试任务3 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-17 9:00", end_date:"2025-02-17 18:00"},
    {id:34, text:"任务 3 | 任务内容：测试任务3 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-18 9:00", end_date:"2025-02-18 18:00"},
    {id:35, text:"任务 3 | 任务内容：测试任务3 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-19 9:00", end_date:"2025-02-19 18:00"},
    {id:36, text:"任务 3 | 任务内容：测试任务3 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-20 9:00", end_date:"2025-02-20 18:00"},
    {id:37, text:"任务 3 | 任务内容：测试任务3 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-21 9:00", end_date:"2025-02-21 18:00"},
    {id:38, text:"任务 3 | 任务内容：测试任务3 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-22 9:00", end_date:"2025-02-22 18:00"},
    {id:39, text:"任务 3 | 任务内容：测试任务3 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-23 9:00", end_date:"2025-02-23 18:00"},

    {id:45, text:"任务 5 | 任务内容：测试任务5 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-24 9:00", end_date:"2025-02-24 18:00"},
    {id:46, text:"任务 5 | 任务内容：测试任务5 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-25 9:00", end_date:"2025-02-25 18:00"},
    {id:47, text:"任务 5 | 任务内容：测试任务5 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-26 9:00", end_date:"2025-02-26 18:00"},
    {id:48, text:"任务 5 | 任务内容：测试任务5 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-27 9:00", end_date:"2025-02-27 18:00"},
    {id:49, text:"任务 5 | 任务内容：测试任务5 | 任务目标：提前完成并及时反馈！", start_date:"2025-02-28 9:00", end_date:"2025-02-28 18:00"},
    {id:50, text:"任务 5 | 任务内容：测试任务5 | 任务目标：提前完成并及时反馈！", start_date:"2025-03-01 9:00", end_date:"2025-03-01 18:00"},
    {id:51, text:"任务 5 | 任务内容：测试任务5 | 任务目标：提前完成并及时反馈！", start_date:"2025-03-02 9:00", end_date:"2025-03-02 18:00"},
];
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
const num = ref(0)
const typeRadio = ref('all')
const splitRadio = ref('merge')

watch(splitRadio,(type) => {
    console.log(type)
    scheduler.clearAll();
    if (type === 'merge') {
      console.log(1)
    // scheduler.init(schedulerContainer.value, new Date(2025, 1, 1), 'month');
    // 将数据加载到调度器
    scheduler.parse(myEvents, "json");
    }else{
      console.log(2)
    // scheduler.init(schedulerContainer.value, new Date(2025, 1, 1), 'month');
    // 将数据加载到调度器
    scheduler.parse(myEvents1, "json");
    }
    scheduler.updateView();
  }
);
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
</style>