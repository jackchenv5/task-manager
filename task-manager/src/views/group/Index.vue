<template>
  <!-- 左右布局 左侧为组员信息，右侧为任务信息 -->
  <div style="display: flex">
    <!-- 组员信息  -->
    <div style="width: 40%; border: 2px solid blue; height: 93vh; min-width: 600px">
      <!-- 组基础信息，组  组员人数  本月总工时 完成/已完成  本月繁忙度  -->
      <div style="width: 100%; height: 8vh; border: 1px solid">
        <GroupHeader></GroupHeader>
      </div>
      <!-- 组基础信息，组  组员人数  本月总工时 完成/已完成  本月繁忙度 END  -->

      <!-- 功能区域，一组按键 导出当前任务列表等等 -->
      <div style="width: 100%; height: 8vh; border: 1px solid">
       <GroupFunc></GroupFunc>    
      </div>
      <!-- 功能区域 END-->

      <!-- 组员繁忙度展示区域（按周） -->
      <div style="width: 100%; height: 76vh; border: 1px solid green">
      <GroupMember></GroupMember>
      
      </div>
      <!-- 组员繁忙度展示区域（按周）END -->
    </div>
    <!-- 组员信息 END -->

    <!-- 选中组员的gantt图 -->
    <div style="width: 60%; border: 2px solid blue; height: 93vh; min-width: 400px">
     <MemberGantt></MemberGantt>
    </div>
    <!-- 选中组员的gantt图 END -->
  </div>
</template>

<script setup>

// 此为Group视图index 页面，用于组织各个子模块
// 注意事项
// 1. group 全局数据定义在group store 中
// 2. 子模块 更新store 数据需要遵守同源原则， 也就是子模块更新store数据 需调用 store中的对应的 update方法
// 子模块可以自行继续拆分子模块
// 每个子模块尽量不要超过300行代码

import GroupHeader from "./header/Index.vue";
import GroupFunc from "./func/Index.vue"
import GroupMember from "./members/Index.vue"
import MemberGantt from "./gantt/Index.vue"

</script>
