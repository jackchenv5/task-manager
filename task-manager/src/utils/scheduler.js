export const initSchedulerConfig = (schedulerContainer,scheduler) => {
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
      <div style="width: 100%; background: #afa9a9; border-radius: 1px; position: relative;border:1px solid;">
          <div style="width: ${progress}%; background: #dfe5e4; height: 100%; border-radius: 3px; position: absolute; top: 0; left: 0;"></div>
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

   scheduler.init(schedulerContainer.value, new Date(2025, 1, 1), 'month');
  return scheduler
}