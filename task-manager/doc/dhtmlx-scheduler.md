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
scheduler.templates.event_text = function(start,end,ev){
   return 'Subject: ' + ev.text + '';
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