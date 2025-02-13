# 配置
## 显示日期配置
scheduler.config.first_hour = 8;
scheduler.config.last_hour = 17;
scheduler.config.start_on_monday = true;
scheduler.init('scheduler_here',null,"week");

## 只读模式
scheduler.config.readonly = true; // 设置为只读模式
scheduler.config.dblclick_create = false; // 禁用双击添加事件

# Templates
##  事件bar的样式

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
/* 默认事件样式 */
.custom-event {
    border-radius: 3px;
    color: #333;
    font-size: 12px;
    padding: 2px;
    background: #a5dc86;
}

/* 根据进度设置背景色 */
.progress-0 { background-color: #f0f0f0; }
.progress-25 { background-color: #ffcc99; }
.progress-50 { background-color: #76c7c0; }
.progress-75 { background-color: #6bb9f0; }
.progress-100 { background-color: #a5dc86; }

##  日历框的样式

scheduler.templates.month_date_class = function(date) {
    // 获取日期的天数
    var day = date.getDate();

    // 根据日期的天数返回对应的 CSS 类名
    if (day === 10) {
        return "custom-date-cell highlight-date-1"; // 10 号显示浅橙色
    } else if (day === 20) {
        return "custom-date-cell highlight-date-2"; // 20 号显示浅蓝色
    } else if (day === 30) {
        return "custom-date-cell highlight-date-3"; // 30 号显示浅绿色
    }

    // 默认样式
    return "custom-date-cell";
};

/* 默认日期单元格样式 */
.custom-date-cell {
    border-radius: 3px;
}

/* 根据日期设置背景色 */
.highlight-date-1 { background-color: #ffcc99; } /* 浅橙色 */
.highlight-date-2 { background-color: #76c7c0; } /* 浅蓝色 */
.highlight-date-3 { background-color: #a5dc86; } /* 浅绿色 */

## 事件框内的文本
scheduler.templates.event_bar_text = function(start, end, event) {
    // 获取进度值，默认为 0
    var progress = event.progress || 50;

    // 创建进度条
    var progressBar = `
        <div style="width: 100%; background: #e0e0e0; border-radius: 3px; position: relative;">
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
# 宽高
scheduler.xy.scale_height = 40; //sets the height of the X-Axis  
# 本地化
scheduler.i18n.setLocale({
    date:{
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
        new_event:"新建事件",
        icon_save:"保存",
        icon_cancel:"取消",
        icon_details:"详情",
        icon_edit:"编辑",
        icon_delete:"删除",
        confirm_closing:"",// 您的更改将会丢失，确定吗？
        confirm_deleting:"该事件将被永久删除，确定吗？",
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
# 获取事件
const events = scheduler.getEvents();
console.log(events);

## 特定事件
const start_date = new Date(2023, 10, 1); // 2023-11-01
const end_date = new Date(2023, 10, 3); // 2023-11-03

const events = scheduler.getEvents(start_date, end_date);
console.log(events);

## 单个事件
const event = scheduler.getEvent(1); // 传入事件的 id
console.log(event);

# 开启tooltips
scheduler.plugins({
    tooltip: true
});
