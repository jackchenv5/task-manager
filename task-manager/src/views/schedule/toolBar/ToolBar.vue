<template>
  <div style="display: flex;align-items: center;height:100%;background-color:white;border-radius: 10px;">
    <div class="tool-class">
      <el-badge :value="lastPendTasksLength" class="item" type="info">
        <el-button color="orange" @click="updateType('last')">最近添加</el-button>
      </el-badge>
    </div>

    <div class="tool-class">
      <el-badge :value="curPendTasksLength" class="item" type="primary">
        <el-button color="green" @click="updateType('cur')">待下发</el-button>
      </el-badge>
    </div>
    <div class="tool-class">
      <el-button type="info" @click="exportTemplateUrl">Excel 模版下载</el-button>
    </div>
    <div >
      <el-upload ref="upload"  :action="importTask(loginUser.id)" :limit="1" :on-success="uploadedTasks">
        <template #trigger>
          <el-button type="primary">导入任务</el-button>
        </template>
      </el-upload>
    </div>
  </div>
  <el-drawer v-model="drawer" title="任务调整" direction="btt" size="90%" :with-header="false">
    <div style="display: flex; justify-content: space-between;">
      <div style="font-size: 1.2rem; font-weight: bolder">任务调整</div>
      <div style="display: flex; align-items: center">
        <span>任务组织形式：</span>
        <el-radio-group v-model="joinType">
          <el-radio-button label="项目" value="project" />
          <el-radio-button label="执行人" value="recevier" />
          <el-radio-button label="全部任务" value="all" />
        </el-radio-group>
        <el-button style="margin-left:20px" @click="refreshGantt" type="warning">刷新Gantt图</el-button>
      </div>
      <el-button class="material-symbols--close" @click="drawer = false"></el-button>
    </div>

    <Gantt v-model="taskType" :join-type="joinType"></Gantt>
  </el-drawer>
</template>

<script setup>
import {ElDrawer,ElRadioGroup,ElRadioButton,ElButton,ElBadge,ElUpload} from "element-plus";
import { ref } from "vue";
const drawer = ref(false);
const joinType = ref("all");
import Gantt from "./Gantt.vue";
import { useScheduleStore } from "@/stores/schedule";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import {exportTemplateUrl,importTask} from '@/api/data/data'
const userStore = useUserStore();
const {loginUser} = storeToRefs(userStore);

const scheduleStore = useScheduleStore();
const { curPendTasksLength, lastPendTasksLength } = storeToRefs(scheduleStore);
const taskType = ref("");
import { ElNotification } from 'element-plus'


const updateType = (type) => {
  drawer.value = true;
  taskType.value = type;
};

const uploadedTasks = (response) => {
  if(!response.status){
    ElNotification({
      title: '任务添加失败，请根据错误信息调整后重新导入！',
      type: 'error',
      position: 'top-left',
      dangerouslyUseHTMLString: true,
      message: response.message,
      duration: 0,
    })
    return
  }

  if(response.status && response.message.fail?.length > 0){
    ElNotification({
      title: '告警：',
      type: 'error',
      position: 'top-left',
      dangerouslyUseHTMLString: true,
      message: response.message.fail.map(x=>`<p>${x.info}</p>`).join(''),
      duration: 0,
    })
  }else {
    ElNotification({
      title: '任务添加成功！',
      type: 'success',
      position: 'top-left',
      dangerouslyUseHTMLString: true,
      message: response.message.success.map(x=>`<p>${x.info}</p>`).join(''),
    })
  }

  scheduleStore.getTableData()
}

const refreshGantt = async ()=>{
  await scheduleStore.getTableData()
  joinType.value = 'recevier'
  //TODO 用常规方式解决加载的问题
  setTimeout(()=>{
    joinType.value = 'all'
  },200)



}
</script>

<style scoped>
.tool-class {
  margin: 0px 10px;
}

.material-symbols--close {
  display: inline-block;
  width: 12px;
  height: 12px;
  --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z'/%3E%3C/svg%3E");
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
</style>
