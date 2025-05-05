<template>
  <!-- 对话框区 -->
  <SelectUserDialog :visible="isShowSelectUserDialog" v-model="selectUsers" :title="userDialogTitle"
    @update:modelValue="updateSelectUsers" @update:visible="updateVisible" @comfirm="SelectUserConfirm">
  </SelectUserDialog>
  <!-- 对话框区 END -->
  <div style="display: flex;height: 94vh;width: 100%;overflow: hidden;">
    <div class="left">
      <div style="display: flex;width: 100%;height: 20vh; justify-content: space-around;align-items: center;">
        <div
          style="height:18vh;width: 45%;background-color: white;;border: 1px solid white;border-radius: 5px;padding: 5px;display: flex;flex-direction: column;">
          <div style="height: 4vh;">
            <el-row>
              <el-col :span="4">
                <div style="margin-top:5px;color:white;background-color: black;border-radius: 5px;">人员池</div>
              </el-col>
              <el-col :span="10">
                <el-button @click="addUserPool">添加</el-button>
                <el-popconfirm title="确认清空用户池？" @confirm="scheduleStore.clearUserPool" placement="right">
                  <template #reference>
                    <el-button>清空</el-button>
                  </template>
                </el-popconfirm>

              </el-col>
              <el-col :span="10">
                发送到：
                <el-switch v-model="value" class="ml-2" inline-prompt
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="执行人员"
                  inactive-text="抄送人员" />
              </el-col>
            </el-row>
            <div
              style="height: 14vh;display: flex;justify-content: start;flex-wrap: wrap;align-items: center;gap: 6px;">
              <el-tag v-for="tag in userPool" :key="tag.id" closable
                :type="tag.id === curSelectUser ? 'success' : (curReceiverIDs.includes(tag.id) ? 'warning' : 'primary')"
                style="cursor: pointer;" :disable-transitions="false" @close="handleDeleteUser(tag.id)"
                @click="handleSelectUser(tag.id)">
                {{ tag.username }}
              </el-tag>
            </div>
          </div>
        </div>
        <div
          style="height:18vh;width: 50%;background-color: white;border: 1px solid #eee;border-radius: 5px;padding: 5px;display: flex;flex-direction: column;">
          <div style="height: 4vh;">
            <el-row>
              <el-col :span="12">
                <div style="margin-top: 5px;color:white;background-color: black;border-radius: 5px;">项目池</div>
              </el-col>
              <el-col :span="8" :offset="3">
                <el-button>添加</el-button>
                <el-button>清空</el-button>
              </el-col>
            </el-row>
            <el-scrollbar style="height: 14vh;">
              <el-tag v-for="item in projectPool" :key="item" type="warning" style="width: 95%;margin-bottom: 3px;"
                closable>{{
                  item }}</el-tag>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div
        style="height:5vh;width:100%;background-color: white;border: 1px solid #eee;margin: 4px 0;border-radius: 5px;padding: 5px;display: flex;justify-content: start;">
        <div
          style="background-color: rgb(31, 28, 28);border: 1px solid #eee;border-radius: 5px;padding: 5px;color: white;width: 5vw;">
          执行人员：</div>
        <el-scrollbar style="width: 35vw;">
          <div
            style="display: flex;width:fit-content;border: 1px solid rgb(14, 43, 66);border-radius: 5px;padding: 5px 0px;margin-left: 8px;">

            <el-tag v-for="tag in curReceivers" :key="tag.id" closable
              :type="tag.id === curSelectUser ? 'success' : 'warning'" style="cursor: pointer;"
              :disable-transitions="false" @close="handleDeleteReceiverUser(tag.id)"
              @click="handleSelectReceiverUser(tag.id)">
              {{ tag.username }}
            </el-tag>
          </div>
        </el-scrollbar>
        <el-button @click="addReceiver">添加</el-button>
        <el-popconfirm title="确认清空执行者？" @confirm="scheduleStore.clearReceivers" placement="right">
          <template #reference>
            <el-button>清空</el-button>
          </template>
        </el-popconfirm>
      </div>
      <div
        style="height:18vh;width: 98%;border: 1px solid #eee;background-color: white;border-radius: 5px;padding: 5px;display: flex;flex-direction: row;justify-content: space-between;">
        <div style="width: 25%;height:15vh;border:1px solid #9e9fa0;background-color: white;">
          <div style="font-weight:600;font-size:18px;margin-top: 5px;margin-left: 15px;">当前用户</div>
          <div style="display:flex;justify-content: space-around;padding: 10px;">
            <div style="display:flex;flex-direction:column;justify-content: space-around;align-items: center;">
              <div>{{ curSelectUserInfo.username }}</div>
              <div style="font-size: 12px;">工作强度</div>
            </div>
            <div style="display:flex;flex-direction:column;justify-content: start;align-items: center;">
              <el-progress type="dashboard" :percentage="curSelectDateStat.per" :stroke-width="15" :width="70"
                striped-flow />
            </div>
          </div>

        </div>
        <div style="width: 30%;height:15vh;border:1px solid #9e9fa0;background-color: white;">
          <div style="font-weight:600;font-size:18px;margin-top: 5px;margin-left: 15px;">统计数据</div>
          <div
            style="display: flex;flex-direction: column;justify-content: space-around;height: 70%;margin-left: 15px;">
            <div>时间：{{ curSelectDateStat.startDate }}~{{ curSelectDateStat.endDate }}</div>
            <div>任务数：{{ curSelectDateStat.workNum }}</div>
            <div>任务工时：{{ curSelectDateStat.workloads }}H</div>
          </div>

        </div>
        <el-scrollbar style="width: 45%;height:15vh;border:1px solid #9e9fa0;background-color: white;">
          <template v-for="item in curUserTasksRef">
            <div style="display: flex;flex-direction: row;">
              <el-text truncated style="width: 20%;">{{ item.name }}</el-text>
              <div style="width: 80%;">
                <el-progress :stroke-width="20" :percentage="100 * item.workload / curUserTasksWorkloadsRef"
                  style="margin-top:5px;">
                  <span style="font-size:15px;">{{ `${item.workload}天(${100 * item.workload / curUserTasksWorkloadsRef |
                    0}%)` }}</span>
                </el-progress>
              </div>

            </div>

          </template>

        </el-scrollbar>
      </div>
      <Calendar style="width: 100%;height:70vh;"></Calendar>
    </div>
    <div class="right">
      <div style="width: 100%;height:64vh;background-color: white;border:1px solid #aaa;">
        <el-form ref="formRef" :rules="formRules" style="padding: 10px;" label-position="top">
          <el-row>
            <el-col :span="12">
              <el-form-item label="名称:" prop="name" required>
                <el-input v-model="formData.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="项目:">
                <el-input v-model="formData.project"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="执行人:" prop="receiver">
                <Select style="width: 95%;" v-model="formData.receiver" :api="getUserApi" label-field="username"
                  value-field="id" filterable multiple :filter-field="['username', 'emp_num', 'email']"></Select>

              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="抄送:">
                <Select style="width: 95%;" v-model="formData.sender" :api="getUserApi" label-field="username"
                  value-field="id" filterable multiple :filter-field="['username', 'emp_num', 'email']"></Select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="时间范围:" required>
                <el-date-picker v-model="formData.start_time" type="date" placeholder="Pick a day" size="default"
                  style="width: 11vw;" />
                <span>~</span>
                <el-date-picker v-model="formData.deadline_time" type="date" placeholder="Pick a day" size="default"
                  style="width: 11vw;" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="工作量:" prop="workload">
                <el-input-number v-model="formData.workload" :precision="1" :step="0.5" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-scrollbar style="height: 26vh;">

            <el-row>
              <el-col :span="12">
                <el-form-item label="任务内容:" prop="content">
                  <el-input type="textarea" :rows="4" v-model="formData.content"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="挑战目标:">
                  <el-input type="textarea" :rows="4" v-model="formData.challenge"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="任务描述:">
              <el-input type="textarea" :rows="1" v-model="formData.description"></el-input>
            </el-form-item>
            <el-form-item label="关联任务:">
              <el-input type="text" v-model="formData.related_task"></el-input>
            </el-form-item>
          </el-scrollbar>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="resetForm">清空</el-button>
          </el-form-item>

        </el-form>
      </div>
      <div style="width: 49.8vw;height:30vh;border: 1px solid white;">
        <vxe-table :data="schduleTableData" border show-header stripe auto-resize max-height="220"
          :row-config="{ isHover: true }">
          <vxe-column type="checkbox" width="5%"></vxe-column>
          <vxe-column field="name" title="任务名" width="12%" show-overflow></vxe-column>
          <vxe-column field="status_name" title="状态" width="10%"></vxe-column>
          <vxe-column field="start_time" title="开始时间" width="15%"></vxe-column>
          <vxe-column field="deadline_time" title="截止时间" width="15%" show-overflow></vxe-column>
          <vxe-column field="workload" title="量(天)" width="10%"></vxe-column>
          <vxe-column field="receiver_name" title="执行人" width="11%"></vxe-column>
          <vxe-column title="按钮组" width="200" :cell-render="btnGroupCellRender"></vxe-column>
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from 'vue';
import Calendar from './calendar/Calendar.vue'
import { useUserStore } from '@/stores/user'
import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'
import { getCurMonthStartAndEndStr, formatDate, TaskStatus } from '@/utils/public'
import Select from '@/components/selects/MutiSelect.vue'
import { getUserApi, taskAddApi } from '@/api/data/data'

const userStore = useUserStore()
const scheduleStore = useScheduleStore()
const { loginUser } = storeToRefs(userStore)
const { curReceivers, curReceiverIDs, curSelectUser, curSelectUserInfo, userPool, userPoolIds, curUserTasksRef, curUserTasksWorkloadsRef, curSelectDateStat, schduleTableData } = storeToRefs(scheduleStore)

//人员池逻辑
//===================================================================================================

import SelectUserDialog from '@/components/dialog/SelectUser.vue'

const userDialogTitle = ref()
// 添加人员池
const isShowSelectUserDialog = ref(false)
const addUserPool = () => {
  isShowSelectUserDialog.value = true
  userDialogTitle.value = 'user pool'
}

// 添加執行者
const addReceiver = () => {
  isShowSelectUserDialog.value = true
  userDialogTitle.value = 'user receiver'
}

const updateVisible = (newValue) => {
  isShowSelectUserDialog.value = newValue
}
const selectUsers = ref()

const updateSelectUsers = (users) => {
  selectUsers.value = users
}
const SelectUserConfirm = (isConfirm, users) => {

  if (!isConfirm) return
  if (!users) return
  // 界面选择的用户，默认都加入用户池，如何是执行者对话框，则加入执行者池
  users.forEach(x => {
    if (userDialogTitle.value === 'user receiver') {
      scheduleStore.addToReceivers(x)
    }
    scheduleStore.addToUserPool(x)
  })
}

//用户选择框逻辑 END
//=======================================================================================================

// 人员池 tag 逻辑
//=======================================================================================================
const handleDeleteUser = (id) => {
  scheduleStore.deleteUserofPool(id)
}

// 选中人员
const handleSelectUser = (id) => {
  const idPoolIndex = userPoolIds.value.indexOf(id)
  const idReceiverIndex = curReceiverIDs.value.indexOf(id)
  if (idReceiverIndex === -1) {
    scheduleStore.addToReceivers(userPool.value[idPoolIndex])
  }
}

//=======================================================================================================
// 人员池 tag 逻辑 END


// 执行人员 逻辑
// =======================================================================================================
const handleSelectReceiverUser = (id) => {
  console.log(id, '选中')
  curSelectUser.value = id
  const [starDateStr, endDateStr] = getCurMonthStartAndEndStr(new Date())
  scheduleStore.getCurUserTasks(id, starDateStr, endDateStr)
}

const handleDeleteReceiverUser = (id) => {
  console.log(id, '删除')
  scheduleStore.deleteReceiverUser(id)
}


// =======================================================================================================
// 执行人员池 逻辑 END

// 提交form 表单功能
const formRef = ref()
const initFormData = ref({
  name: null,
  content: null,
  challenge: null,
  creator: loginUser.value.id,
  receiver: curReceivers.value,
  start_time: null,
  deadline_time: null,
  description: null,
  sender: null,
  workload: null,
  status: TaskStatus.PEND,
  project: null,
  related_task: null,
})
const formData = reactive({ ...initFormData.value })
watch(formData, (newVal) => {
  curReceivers.value = formData.receiver
})
const formRules = reactive({
  name: [
    {
      required: true,
      message: '请输入任务名',
      validator: (rule, value, callback) => {
        console.log(rule)
        console.log(value)
        //TODO 实现真正的验证
        callback()
      }
    }],
  receiver: [
    {
      required: true,
      message: '请输入执行者',
      validator: (rule, value, callback) => {
        console.log(rule)
        console.log(value)
        //TODO 实现真正的验证
        callback()
      }
    }],
  content: [
    {
      required: true,
      message: '请输入任务内容',
      validator: (rule, value, callback) => {
        console.log(rule)
        console.log(value)
        //TODO 实现真正的验证
        callback()
      }
    }],
  start_time: [
    {
      required: true,
      message: '请输入任务开始时间',
      validator: (rule, value, callback) => {
        console.log(rule)
        console.log(value)
        //TODO 实现真正的验证
        callback()
      }
    }],
  deadline_time: [
    {
      required: true,
      message: '请输入任务截止时间',
      validator: (rule, value, callback) => {
        console.log(rule)
        console.log(value)
        //TODO 实现真正的验证
        callback()
      }
    }],
  workload: [
    {
      required: true,
      message: '请输入任务工时',
      validator: (rule, value, callback) => {
        console.log(rule)
        console.log(value)
        //TODO 实现真正的验证
        callback()
      }
    }],
})

const onSubmit = async () => {
  console.log('form =====>', formData)
  //TODO 提交前验证！
  // 准备所有请求的Promise数组
  const addTaskPromises = formData.receiver.map(receiver => {
    const tmpFormData = {
      ...formData,
      receiver: receiver.id,
      start_time: formatDate(formData.start_time),
      deadline_time: formatDate(formData.deadline_time),
      sender: formData.sender ? formData.sender.map(s => s.id).join(",") : ""
    };
    console.log('Submitting task:', tmpFormData);
    return taskAddApi(tmpFormData); // 假设taskAddApi返回的是axios Promise
  });
  // 等待所有任务添加完成
  const responses = await Promise.all(addTaskPromises);
  scheduleStore.getTableData()
}

const resetForm = () => {
  for (let key in formData) {
    if (formData.hasOwnProperty(key)) {
      formData[key] = initFormData.value[key]; // 将每个值乘以2
    }
  }
}
// 提交form 表单功能 END

// table 表
import { VxeUI } from 'vxe-pc-ui'

const btnGroupCellRender = reactive({
  name: 'VxeButtonGroup',
  props: {
    mode: 'text'
  },
  options: [
    { content: '编辑', name: 'view' },
    { content: '删除', status: 'error', name: 'del' }
  ],
  events: {
    click(cellParams, params) {
      VxeUI.modal.message({
        content: `点击了 ${params.name}`,
        status: 'success'
      })
    }
  }
})
onMounted(() => {
  scheduleStore.getTableData()
})
// table 表 END


const value = ref(true)

</script>

<style>
/* 左侧和右侧 div 的样式 */
.left,
.right {
  flex: 1;
  /* 平均分配剩余空间 */
  display: flex;
  flex-direction: column;
  justify-content: start;
  /* 内容水平居中 */
  align-items: start;
  width: 49vw;
  /* 内容垂直居中 */
  background-color: #f1f3f6;
}

/* 默认事件样式 */
.custom-event {
  border-radius: 3px;
  color: #333;
  font-size: 12px;
  padding: 2px;
  background: #a5dc86;
  width: 50%;
}

/* 根据进度设置背景色 */
.progress-0 {
  background-color: #f0f0f0;
}

.progress-25 {
  background-color: #ffcc99;
}

.progress-50 {
  background-color: #76c7c0;
}

.progress-75 {
  background-color: #f5d4f9;
}

.progress-100 {
  background-color: #a5dc86;
}

/* 默认日期单元格样式 */
.custom-date-cell {
  border-radius: 3px;
}

/* 根据日期设置背景色 */
.highlight-date-1 {
  background-color: #ffcc99;
}

/* 浅橙色 */
.highlight-date-2 {
  background-color: #76c7c0;
}

/* 浅蓝色 */
.highlight-date-3 {
  background-color: #a5dc86;
}

/* 浅绿色 */

.non_working_day {
  background-color: rgb(204, 152, 169) !important;
}
</style>