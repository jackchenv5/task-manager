<template>
    <el-form ref="formRef" :rules="formRules" style="padding: 10px;" label-position="top" :model="formData">
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
                    <Select style="width: 95%;" v-model="formData.receiver" :api="getUserApi" label-field="username" filterable multiple :filter-field="['username', 'emp_num', 'email']"></Select>
                </el-form-item>
            </el-col>
            <el-col :span="11">
                <el-form-item label="抄送:">
                    <Select style="width: 95%;" v-model="formData.sender" :api="getUserApi" label-field="username"  filterable multiple :filter-field="['username', 'emp_num', 'email']"></Select>
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
</template>

<script setup>
import { onMounted, ref, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { getUserApi, taskAddApi } from '@/api/data/data'
import {formatDate, TaskStatus } from '@/utils/public'
import Select from '@/components/selects/MutiSelect.vue'
import { useScheduleStore } from '@/stores/schedule'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const scheduleStore = useScheduleStore()

const { loginUser } = storeToRefs(userStore)

const { curReceivers,curSelectProjectRef } = storeToRefs(scheduleStore)


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
  project: curSelectProjectRef.value,
  related_task: null,
})
const formData = reactive({ ...initFormData.value,receiver:curReceivers.value })
watch(formData, (newVal) => {
  curReceivers.value = formData.receiver
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
      // validator: (rule, value, callback) => {
      //   console.log(rule)
      //   console.log(value)
      //   //TODO 实现真正的验证
      //   callback()
      // }
    }],
  receiver: [
    {
      required: true,
      message: '请输入执行者',
      // validator: (rule, value, callback) => {
      //   console.log(rule)
      //   console.log(value)
      //   //TODO 实现真正的验证
      //   callback()
      // }
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
    if(['receiver','project'].includes(key)) continue
    if (formData.hasOwnProperty(key)) {
      formData[key] = initFormData.value[key];
    }
  }
}
// 提交form 表单功能 END
</script>