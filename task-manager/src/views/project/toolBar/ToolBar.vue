<template>
    <div class="user-bar">
      <el-drawer  v-model="drawer" title="I am the title" :with-header="false" direction="ltr" size="65%">
        <template v-for="item in projectLogs" :key="item.id"  style="margin: 10px;">
          <div class="log-container" v-if="item.title">
            <span class="log-item">{{ item.timestamp }}</span>
            <span  class="log-item">{{ item.title }}</span>
          </div>
          <div v-else  class="log-container">
            <span class="log-item">{{ item.timestamp }}</span>
            <span class="log-item">{{ item.changed_fields.receiver_name }}</span>
            <span class="log-item">{{ item.action === 'created' ? "新增任务" : '修改任务' }}</span>
            <span class="log-item">{{ item.changed_fields.name }}</span>
<!--            <span class="log-item">创建人：{{ item.changed_fields.creator_name }}</span>-->
          </div>
          <div v-if="item.action === 'updated'">
            <ChangeView  :changed-fields="item.changed_fields"></ChangeView>
          </div>
        </template>

      </el-drawer>
      <div style="width:220px;margin-right: 20px;">
        <el-config-provider :locale="locale">
          <el-date-picker @change="projectStore.updateMonthRange" style="width:200px"
              v-model="monthRange"
              type="monthrange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
              :shortcuts="shortcuts"
          />
        </el-config-provider>
      </div>
      <el-select style="width:120px;margin-right: 20px;" placeholder="请选择"  v-model="taskType">
        <el-option label="全部" :value="0"></el-option>
        <el-option label="待下发" :value="TaskStatus.PEND"></el-option>
        <el-option label="进行中" :value="TaskStatus.PROGRESS"/>
        <el-option label="已完成" :value="TaskStatus.FINISH"/>
      </el-select>
      <el-badge :value="projectLogs.length" class="item">
        <el-button  @click="drawer = true">日志</el-button>
      </el-badge>
      <el-button  @click="reportTasks" type="warning" style="margin-left:10px;">周报</el-button>
    </div>

</template>

<script setup>
import {ElBadge, ElDrawer, ElButton, ElMessage,ElDatePicker,ElConfigProvider,ElSelect,ElOption} from "element-plus";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const locale = zhCn

import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import ChangeView from '@/components/changeDetail/ChangeDetail.vue'
const drawer = ref(false)

const projectStore = useProjectStore()
const { projectLogs,curSelectProjectRef,monthRange,taskType } = storeToRefs(projectStore)
import {taskReport} from '@/api/data/data'
import { TaskStatus } from '@/constants/public'
const reportTasks = async () => {
  taskReport({type:'项目报告',project:curSelectProjectRef.value}).then(
      ElMessage.success('项目报告已发送！')
  )
}
const shortcuts = [
  {
    text: '本月',
    value: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return [start, end];
    },
  },
  {
    text: '今年至今',
    value: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return [start, end];
    },
  },
  {
    text: '近6个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 5); // 包括当前月共6个月
      start.setDate(1); // 设置为开始月份的第一天
      return [start, end];
    },
  },
  {
    text: '未来3个月',
    value: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 3, 0);
      return [start, end];
    },
  }
]


</script>

<style scoped>
.user-bar  {
    border-left: 5px solid rgb(51, 53, 51);
    margin-top:5px;
    background:white;
    height:6vh;
    display: flex;
    align-items:center;
}

.log-container{ 
    font-size: 1rem;
    display: flex;
    width: 100%;
    align-items: center;
}
.log-item{
    margin: 10px 5px;
    /* padding: 0 10px; */
}
</style>