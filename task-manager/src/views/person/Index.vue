<template>
  <div style="display: flex; height: 90vh; width: 100%;">
    <div class="left">
      <UserHeader></UserHeader>
      <Calendar></Calendar>
    </div>
    
    <div class="right">
      <ToolBar></ToolBar>
      <TaskTable></TaskTable>
    </div>
  </div>
</template>

<script setup>
import UserHeader from './leftHeader/UserHeader.vue';
import Calendar from './leftContent/Calendar.vue';
import ToolBar from './rightHeader/Tools.vue';
import TaskTable  from './rightContent/Tasks.vue';
import { usePersonStore } from '@/stores/person'
const myPersonStore = usePersonStore()
myPersonStore.init()
</script>

<style>
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

.left, .right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  border: 1px solid #ccc;
  background-color: white;
}

</style>