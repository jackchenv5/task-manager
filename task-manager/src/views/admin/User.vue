<template>
  <div ref="schedulerContainer" style="border:red;width: 1000px;height: 100vh;"></div>
</template>
 
<script setup>
import "dhtmlx-scheduler";
import { onMounted, ref,watch } from 'vue';
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

    return true; // return false to prevent the lightbox from opening
});

scheduler.attachEvent("onAfterLightbox", function () {

});

scheduler.config.lightbox.sections = [
    { name: "description", height: 50, map_to: "text", type: "textarea", focus: true },
    { name: "custom", height: 50, type: "custom_block", map_to: "custom_field" },
    { name: "time", height: 72, type: "time", map_to: "auto" }
];

    scheduler.config.header = [
      'day',
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
    scheduler.init(schedulerContainer.value, new Date(2025, 2, 11), 'month');
    scheduler.parse(props.events);
  } else {
    console.error('Scheduler is not properly imported.');
  }
});

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
</script>

<style>
  @import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";
</style>