export const initSchedulerConfig = (schedulerContainer, scheduler) => {
  // 中文汉化
  scheduler.i18n.setLocale({
    date: {
      format_date: "%Y-%m-%d", // 例如：2025-02-12
      format_time: "%H:%i", // 例如：10:24
      month_full: ["一月", "二月", "三月", "四月", "五月", "六月",
        "七月", "八月", "九月", "十月", "十一月", "十二月"],
      month_short: ["1月", "2月", "3月", "4月", "5月", "6月",
        "7月", "8月", "9月", "10月", "11月", "12月"],
      day_full: ["星期日", "星期一", "星期二", "星期三", "星期四",
        "星期五", "星期六"],
      day_short: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    },
    labels: {
      dhx_cal_today_button: "今天",
      day_tab: "日视图",
      week_tab: "周视图",
      month_tab: "月视图",
      new_event: "新建任务",
      icon_save: "保存",
      icon_cancel: "取消",
      icon_details: "详情",
      icon_edit: "编辑",
      icon_delete: "删除",
      confirm_closing: "",// 您的更改将会丢失，确定吗？
      confirm_deleting: "该任务将被永久删除，确定吗？",
      section_description: "描述",
      section_time: "时间段",
      full_day: "整天",

      /*重复发生的事件*/
      confirm_recurring: "您是否要编辑整个系列的重复事件？",
      section_recurring: "重复事件",
      button_recurring: "禁用",
      button_recurring_open: "启用",
      button_edit_series: "编辑系列",
      button_edit_occurrence: "编辑发生实例",

      /*议程视图扩展*/
      agenda_tab: "议程",
      date: "日期",
      description: "描述",

      /*年视图扩展*/
      year_tab: "年",

      /* 周议程扩展 */
      week_agenda_tab: "议程",

      /*网格视图扩展*/
      grid_tab: "网格",

      /*触摸提示*/
      drag_to_create: "拖动以创建",
      drag_to_move: "拖动以移动",

      /* dhtmlx 消息默认按钮 */
      message_ok: "确定",
      message_cancel: "取消",

      /* 非文本控件的 WAI-ARIA 标签 */
      next: "下一个",
      prev: "上一个",
      year: "年",
      month: "月",
      day: "日",
      hour: "时",
      minute: "分"
    }
  });

  scheduler.plugins({
    // tooltip: true
  });

  scheduler.config.header = [
    // 'week',
    'month',
    'date',
    'prev',
    'today',
    'next',
  ];
  scheduler.xy.scale_height = 10; //sets the height of the X-Axis  
  //
  scheduler.templates.event_class = function (start, end, event) {
    return "my_event";
  };

  scheduler.renderEvent = function (container, ev) {
    var container_width = container.style.width; // e.g. "105px"

    // move section
    var html = "<div class='dhx_event_move my_event_move' style='width: " +
      container_width + "'></div>";

    // a container for the event's content
    html += "<div class='my_event_body'>";
    html += "<span class='event_date'>";
    //two options here:show only start date for short events or start+end for long ones
    if ((ev.end_date - ev.start_date) / 60000 > 40) {//if an event is longer than 40 minutes
      html += scheduler.templates.event_header(ev.start_date, ev.end_date, ev);
      html += "</span><br/>";
    } else {
      html += scheduler.templates.event_date(ev.start_date) + "</span>";
    }
    // displaying the event's text
    html += "<span>" + scheduler.templates.event_text(ev.start_date, ev.end_date, ev) +
      "</span>" + "</div>";

    // the resize section
    html += "<div class='dhx_event_resize my_event_resize' style='width: " +
      container_width + "'></div>";

    container.innerHTML = html;
    return true; //required, true - to display a custom form, false - the default form
  };


  // 日历单击事件处理
  //定制弹出框
  scheduler.showLightbox = function (id) {
    console.log('show lightbox', id)
    // var ev = scheduler.getEvent(id);
    // scheduler.startLightbox(id, custom_form );
    //document.getElementById("some_input").value = ev.text;
  }
  //needs to be attached to the 'save' button
  scheduler.attachEvent("onLightbox", function (id) {
    console.log('light box')
    //any custom logic here
  });
  function save_form() {
    var ev = scheduler.getEvent(scheduler.getState().lightbox_id);
    // ...'here you need to retrieve values from the form'...
    //ev.text = document.getElementById("some_input").value;
    scheduler.endLightbox(true, custom_form);
  }
  //needs to be attached to the 'cancel' button
  function close_form(argument) {
    scheduler.endLightbox(false, custom_form);
  }

  scheduler.attachEvent("onBeforeDrag", function (id, mode, e){
    //any custom logic here
    console.log('before drag')
    return false;
});
scheduler.attachEvent("onDragEnd", function(id, mode, e){
    console.log('drag end')
  // your custom logic
  return false
});
//关闭双击创建
scheduler.config.dblclick_create = false;

scheduler.attachEvent("onBeforeEventCreated", function (e){
  //any custom logic here
  console.log(e='before create',e)
  return false;
});

// scheduler.attachEvent("onMouseMove", function (id, e){
//   //any custom logic here
//   console.log('mouse move',e)
// });
scheduler.attachEvent("onMouseDown", function(className){
  //any custom logic here
  console.log(className,'mouse down')
});

scheduler.attachEvent("onClick", function (id, e){
  //any custom logic here
  console.log('event click')
  return false;
});
scheduler.attachEvent("onDblClick", function (id, e){
  //any custom logic here
  console.log('double click')
  return false;
})
scheduler.attachEvent("onEmptyClick", function (date, e){
  //any custom logic here
  console.log('empty click')
  return false
});
  scheduler.init(schedulerContainer.value, new Date(), 'month');

  return scheduler
}