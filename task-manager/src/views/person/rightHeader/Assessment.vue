<template>
    <el-dialog v-model="dialogVisible" :title="`${loginUser.username}`" width="500px">
      <p style="color:red">满意度评分只作为对自己完成情况的总结、不体现在组长的绩效评价中...</p>
        <p style="color:red" v-if="selectUserEvaluateRef.id">此月已给出自评，再次自评视为修改~</p>
        <el-form ref="form" :model="selectUserEvaluateRef" label-width="80px">
            <el-form-item label="满意度">
                <el-rate v-model="selectUserEvaluateRef.score" :max="7" text-color="#ff9900" :texts="EvaluateList"
                    show-text>
                </el-rate>
            </el-form-item>
            <el-form-item label="自评：">
                <el-input type="textarea" v-model="selectUserEvaluateRef.comment" placeholder="请输入内容" :rows="5"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmEvalution">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
    <vxe-table ref="tableRef"  show-header auto-resize highlight-current-row
        :expand-config="{ trigger: '', accordion: true,height:500 }" :row-config="{ isHover: true, height: 45 }" :data="mergeData" >
        <vxe-column field="receiver_name" title="执行人" width="80"></vxe-column>
        <vxe-column field="project" title="项目" width="400" show-overflow></vxe-column>
        <vxe-column type="expand" width="60">
            <template #content="{ row }">
              <el-collapse  accordion  v-model="activeNames" >
                <el-collapse-item  v-for="item in row.tasks"  :name="item.id">
                  <template #title>
                    <div style="display:flex;align-items: center;">
                      <el-tag  type="primary"  effect="dark" style="width:200px;margin-left:20px;">{{ item.name }} </el-tag>
                      <el-tag  type="danger"  effect="dark" style="width:90px;margin-left:20px;">状态：{{ item.status_name }} </el-tag>
                      <el-tag  type="success" effect="dark" style="width:120px;margin-left:20px;">计划工时：{{ item.workload }}</el-tag>
                      <el-tag  type="warning" effect="dark" style="width:120px;margin-left:20px;">实际工时：{{ item.act_workload.toFixed(1) }}</el-tag>
                    </div>
                  </template>
                  <div style="background-color:#f1f3f6">
                    <div style="display: flex;flex-direction: column;gap:10px;margin-left:20px;">
                      <div class="task-info"><el-text type="primary">任务名：</el-text> <el-text type="info"> {{ item.name}}</el-text> </div>
                      <div class="task-info"><el-text type="primary">时间：</el-text> <el-text type="info"> 开始时间：{{item.start_time}} 截止时间： {{ item.deadline_time}}</el-text> </div>
                      <div class="task-info"><el-text type="primary">工作内容：</el-text> <el-text > <pre> {{ item.content}} </pre></el-text> </div>
                      <div class="task-info" v-if="item.challenge && item.challenge !== 'nan'"><el-text type="primary">挑战目标：</el-text> <el-text > <pre>{{ item.challenge}}</pre></el-text> </div>
                      <div class="task-info" v-if="item.feedback && item.feedback !== 'nan'"><el-text type="primary">任务反馈：</el-text> <el-text > <pre>{{ item.feedback }}</pre></el-text> </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>

            </template>
        </vxe-column>
        <vxe-column field="start_time" title="开始时间" show-overflow width="200" ></vxe-column>
        <vxe-column field="deadline_time" title="截止时间" show-overflow width="200"></vxe-column>
        <vxe-column field="workloads" title="计划工作量(天)" width="200"></vxe-column>
        <vxe-column field="act_workloads" title="实际工作量(天)" width="200">
          <template #default="{ row }">
            {{ row.act_workloads.toFixed(1)}}
          </template>
        </vxe-column>
        <vxe-column field="evaluation_comment" title="评语" >
        </vxe-column>
        <vxe-column field="evalution_score" title="满意度" width="150">
            <template #default="{ row }">
                <el-rate v-model="row.evaluation_score" :max="7" text-color="gray" disabled :texts="EvaluateList" show-text>
                </el-rate>
            </template>
        </vxe-column>
        <vxe-column title="操作" width="100" fixed="right">
            <template #default="{ row }">
                <el-button type="primary" size="small" @click="handleEvaluteClick(row.evaluation)">自评</el-button>
            </template>
        </vxe-column>
    </vxe-table>
</template>
  
<script setup>
import { ElForm,ElFormItem,ElButton,ElInput,ElRate,ElCollapse,ElCollapseItem,ElDialog,ElTag } from 'element-plus'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
const tableRef = ref(null)
import { VxeUI } from 'vxe-table'
import {compareDateStrings, mergeTasks} from '@/utils/tasksStat'


import {usePersonStore  } from '@/stores/person.js'
import { useUserStore } from '@/stores/user.js'
import { EvaluateList,EvaluteType } from '@/constants/public'

import {commitEvalution, getUserByUsername, updateEvalution} from '@/api/data/data.js'
const userStore = useUserStore();
const personStore = usePersonStore();
const { loginUser } = storeToRefs(userStore)
const { allTask,  curSeletMonthDate } = storeToRefs(personStore);

const mergeData = ref([])
const selectUserEvaluateRef = ref({})
const dialogVisible = ref(false)

const activeNames = ref([])
const handleEvaluteClick = (evaluation) => {
    selectUserEvaluateRef.value =  evaluation 
    dialogVisible.value = true
}
const confirmEvalution = async ()=>{
    let ret = null
    if(!selectUserEvaluateRef.value.id){
        ret = await commitEvalution({...selectUserEvaluateRef.value})

    }else{
        ret = await updateEvalution(selectUserEvaluateRef.value.id,selectUserEvaluateRef.value)
    }
    if(ret.id){
        VxeUI.modal.message({
                    content: `对${ret.evaluated_user_username} ${ret.evaluation_year_month} ${ret.project}项目 绩效评价成功！`,
                    status: 'success'
                })
    }else{
        VxeUI.modal.message({
                    content: `对${selectUserEvaluateRef.value.evaluated_user_username} ${selectUserEvaluateRef.value.evaluation_year_month} ${selectUserEvaluateRef.value.project}项目 绩效评价失败！`,
                    status: 'error'
                })
    }
    dialogVisible.value = false
    personStore.getPersonTasks()
}
watch([allTask,curSeletMonthDate], async () => {
    const groupLeaderInfo = await getUserByUsername(loginUser.value.group_leader)
    // const groupLeaderInfo = await getUserByUsername("陈成F")
    console.log('groupLeaderInfo ======>',groupLeaderInfo)
    const dateRange = groupLeaderInfo.config.group?.dateRangeConfig ? groupLeaderInfo.config.group?.dateRangeConfig : ''
    console.log('data range',dateRange)
  let tasks = []
    if(dateRange){
      tasks = allTask.value.filter(x=>{
        if(compareDateStrings(x.start_time,dateRange[0]) >= 0 && compareDateStrings(x.deadline_time,dateRange[1]) <= 0) return true
        return false
      })
    }else{
      tasks = allTask.value
    }

    mergeData.value = await mergeTasks(tasks, loginUser.value.id, [loginUser.value.username], curSeletMonthDate.value,EvaluteType.USER)

}, { immediate: true })


const exportEvent = () => {
    const $table = tableRef.value
    if ($table) {
        $table.exportData()
    }
}


</script>
<style></style>