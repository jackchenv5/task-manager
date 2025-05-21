<template>
  <el-form ref="formRef" :rules="formRules" style="padding: 10px;" label-position="top" :model="formData">
    <el-row>
      <el-col :span="12">
        <el-form-item label="名称:" prop="name">
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
          <Select style="width: 95%;" v-model="formData.receiver" :api="getUserApi" label-field="username" filterable
            multiple :filter-field="['username', 'emp_num', 'email']"></Select>
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item label="抄送:">
          <Select style="width: 95%;" v-model="formData.sender" :api="getUserApi" label-field="username"
            value-field="username" filterable multiple :filter-field="['username', 'emp_num', 'email']"></Select>
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
    <el-scrollbar style="height: 50vh;">

      <el-row>
        <el-col :span="12">
          <el-form-item label="任务内容:" prop="content">
            <el-input type="textarea" :rows="12" v-model="formData.content"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="挑战目标:">
            <el-input type="textarea" :rows="12" v-model="formData.challenge"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="任务描述:">
        <el-input type="textarea" :rows="4" v-model="formData.description"></el-input>
      </el-form-item>
      <!-- <el-form-item label="关联任务:">
        <Select style="width: 95%;" v-model="formData.related_task" :api="getTaskDataApi({project:formData.project})" label-field="name" data-filed="result"
            value-field="id" filterable :filter-field="['name']" clearable></Select>
      </el-form-item> -->
    </el-scrollbar>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(formRef)">提交</el-button>
      <el-button @click="resetForm">清空</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { getUserApi, taskAddApi,getTaskDataApi } from '@/api/data/data'
import { formatDate, TaskStatus } from '@/utils/public'
import Select from '@/components/selects/MutiSelect.vue'
import { useScheduleStore } from '@/stores/schedule'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const scheduleStore = useScheduleStore()

const { loginUser } = storeToRefs(userStore)

const { curReceivers, curSelectProjectRef, curSelectDateStat } = storeToRefs(scheduleStore)


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
  workload: 1,
  status: TaskStatus.PEND,
  project: curSelectProjectRef.value,
  related_task: null,
})
const formData = reactive({ ...initFormData.value, receiver: curReceivers.value })

watch(curSelectDateStat, (newVal) => {
  // console.log('curSelectDateStat====================================================>')
  // console(curSelectDateStat)
  formData.start_time = curSelectDateStat.value.startDate
  formData.deadline_time = curSelectDateStat.value.endDate
}, { deep: true })


watch(formData, (newVal) => {
  curReceivers.value = formData.receiver
  console.log('newValue formData', newVal)
})



watch(curSelectProjectRef, (newVal) => {
  formData.project = curSelectProjectRef.value
})


watch(curReceivers, (newVal) => {
  formData.receiver = curReceivers.value
})
const formRules = reactive({
  name: [
    {
      required: true,
      message: '请输入任务名',
    }],
  receiver: [
    {
      required: true,
      message: '请输入执行者',
    }],
  content: [
    {
      required: true,
      message: '请输入任务内容',
    }],
  start_time: [
    {
      required: true,
      message: '请输入任务开始时间',
    }],
  deadline_time: [
    {
      required: true,
      message: '请输入任务截止时间',
    }],
  workload: [
    {
      required: true,
      message: '请输入任务工时',
    }],
})


import { VxeUI } from 'vxe-pc-ui'
import { notificationEmits } from 'element-plus';
const onSubmit = async (formRef) => {
  //TODO 提交前验证！
  // 准备所有请求的Promise数组
  const isValid = await formRef.validate((valid, fields) => {
    if (!valid) return false
    return true
  })
  if (!isValid) return
  const addTaskPromises = formData.receiver.map(receiver => {
    const tmpFormData = {
      ...formData,
      receiver: receiver.id,
      start_time: formData.start_time instanceof Date ? formatDate(formData.start_time) : formData.start_time,
      deadline_time: formData.deadline_time instanceof Date ? formatDate(formData.deadline_time) : formData.deadline_time,
      sender: formData.sender ? formData.sender.join(",") : ""
    };
    return taskAddApi(tmpFormData); // 假设taskAddApi返回的是axios Promise
  });
  // 等待所有任务添加完成
  const data = await Promise.all(addTaskPromises);
  scheduleStore.updateLastAddTaks(data)
  VxeUI.modal.message({
    content: `任务：${formData.name},执行者：${formData.receiver.map(x => x.username).join(',')} 已添加！`,
    status: 'success'
  })
  scheduleStore.getTableData()
}

const resetForm = () => {
  for (let key in formData) {
    if (['receiver', 'project'].includes(key)) continue
    if (formData.hasOwnProperty(key)) {
      formData[key] = initFormData.value[key];
    }
  }
}
// 提交form 表单功能 END
</script>