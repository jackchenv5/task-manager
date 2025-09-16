<template>
    <el-dialog v-model="dialogVisible" :title="`${selectUserEvaluateRef.evaluated_user_username} | ${selectUserEvaluateRef.project}`" width="700px">
        <p style="color:#aaa">此评分和评语只会展示给TL，作为项目投入参考参考~</p>
        <p style="color:red" v-if="selectUserEvaluateRef.id">此人此月已给出评价，再次评价视为修改~</p>
        <el-form ref="form" :model="selectUserEvaluateRef" label-width="80px">

            <el-form-item label="满意度：">
                <el-rate v-model="selectUserEvaluateRef.score" :max="7" text-color="#ff9900" :texts="EvaluateList"
                    show-text>
                </el-rate>
            </el-form-item>
            <el-form-item label="评语：">
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
  <span>任务范围：</span>
  <el-config-provider :locale="locale">
    <el-date-picker v-model="dateRange" @change="groupStore.updateDateRange"  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" clearable />
  </el-config-provider>
  <el-button @click="exportEvent" type="primary" style="margin-left:20px">直接导出EXCEL文件</el-button>
  <vxe-table ref="tableRef"  show-header auto-resize highlight-current-row
             :expand-config="{ trigger: '', accordion: true }" :row-config="{ isHover: true }" :data="mergeData" >
    <vxe-column field="receiver_name" title="执行人" width="80"></vxe-column>
    <vxe-column type="expand" width="60" title="详情">
      <template #content="{ row }">
        <el-collapse  accordion  v-model="activeNames" >
          <el-collapse-item  v-for="item in row.tasks"  :name="item.id">
            <template #title>
              <div style="display:flex;gap:10px;align-items: center;">
                <el-tag  type="primary"  effect="dark" style="width:200px">{{ item.name }} </el-tag>
                <el-tag  type="danger"  effect="dark" style="width:90px">状态：{{ item.status_name }} </el-tag>
                <el-tag  type="success" effect="dark" style="width:120px">计划工时：{{ item.workload }}</el-tag>
                <el-tag  type="warning" effect="dark" style="width:120px">实际工时：{{ item.act_workload }}</el-tag>
              </div>
            </template>
            <div style="background-color:#f1f3f6">
              <div style="display: flex;flex-direction: column;gap:10px;margin-left:20px;">
                <div class="task-info"><el-text type="primary">任务名：</el-text> <el-text type="info"> {{ item.name}}</el-text> </div>
                <div class="task-info"><el-text type="primary">时间：</el-text> <el-text type="info"> 开始时间：{{item.start_time}} 截止时间： {{ item.deadline_time}}</el-text> </div>
                <div class="task-info"><el-text type="primary">工作内容：</el-text> <el-text > <pre> {{ item.content}} </pre></el-text> </div>
                <div  class="task-info"v-if="item.challenge && item.challenge !== 'nan'"><el-text type="primary">挑战目标：</el-text> <el-text > <pre>{{ item.challenge}}</pre></el-text> </div>
                <div class="task-info" v-if="item.challenge && item.challenge !== 'nan'"><el-text type="primary">任务反馈：</el-text> <el-text > <pre>{{ item.feedback }}</pre></el-text> </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>

      </template>
    </vxe-column>
    <vxe-column field="project" title="项目" show-overflow></vxe-column>
    <vxe-column field="creator" title="测试负责人"  show-overflow></vxe-column>
    <vxe-column field="taskNames" title="任务名"  >
      <template #default="{ row }">
        <template v-for="item in getTaskNames(row.tasks)" >
        <div style="display:flex;">
            <div> {{ item }}</div>
        </div>
      </template>
      </template>
    </vxe-column>
    <vxe-column field="content" title="任务内容"   >
      <template #default="{ row }">
        <template v-for="item in row.tasks" >
          <div>
            <div><el-text type="info"> 开始时间：{{item.start_time}}</el-text> </div>
            <div><pre> {{ item.content}} </pre></div>
            <div v-if="item.challenge && item.challenge !== 'nan'"><el-text type="primary">任务反馈：</el-text> <el-text > <pre>{{ item.feedback }}</pre></el-text> </div>
          </div>
        </template>
      </template>
    </vxe-column>

    <vxe-column field="workloads" title="计划工作量(天)"></vxe-column>
    <vxe-column field="act_workloads" title="实际工作量(天)"></vxe-column>
    <vxe-column field="evaluation_user_commnet" title="组员自评"  ></vxe-column>
    <vxe-column field="evaluation_comment" title="组长评价"  ></vxe-column>

    <vxe-column title="操作" width="130" fixed="center">
      <template #default="{ row }">
        <el-button type="primary" size="small" @click="handleEvaluteClick(row.evaluation)">绩效评价</el-button>
      </template>
    </vxe-column>
  </vxe-table>
</template>
  
<script setup>
import {ElDialog,ElCollapseItem,ElTag,ElButton,ElFormItem,ElForm,ElRate,ElConfigProvider,ElDatePicker} from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const locale = zhCn
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
const tableRef = ref(null)
import { VxeUI } from 'vxe-table'
import {compareDateStrings, mergeTasks} from '@/utils/tasksStat'


import { useGroupStore } from '@/stores/group.js'
import { useUserStore } from '@/stores/user.js'
import { EvaluateList } from '@/constants/public'

import {commitEvalution,updateEvalution} from '@/api/data/data.js'
const groupStore = useGroupStore();
const userStore = useUserStore();
const { loginUser } = storeToRefs(userStore)
const { allTask, selectGroupUsers, curSeletMonthDate,dateRange } = storeToRefs(groupStore);

const mergeData = ref([])
const selectUserEvaluateRef = ref({})
const dialogVisible = ref(false)

const getTaskNames = (tasks) =>{
  return tasks.reduce((acc,item) =>{
    return acc.includes(item.name) ? acc : [...acc,item.name]
  },[])
}

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
    groupStore.initAllTask()
}

watch([allTask,curSeletMonthDate,dateRange], async () => {
    let tasks = []
    if(dateRange.value){
      tasks = allTask.value.filter(x=>{
        if(compareDateStrings(x.start_time,dateRange.value[0]) >= 0 && compareDateStrings(x.deadline_time,dateRange.value[1]) <= 0) return true
        return false
      })
    }else{
      tasks = allTask.value
    }
    console.log(' all tasks ====>',tasks)
    mergeData.value = await mergeTasks(tasks, loginUser.value.id, selectGroupUsers.value, curSeletMonthDate.value)

}, { immediate: true })

const exportEvent = () => {
    const $table = tableRef.value
  if ($table) {
    $table.exportData({
      type: 'xlsx'
    });
  }
}

</script>

<style>
/* 确保展开内容不限制高度 */
.vxe-table--expand-content {
  height: auto !important;
  padding: 10px; /* 可选：增加内边距 */
}

.task-info{
  border-bottom: 1px solid #dcdfe5;
}
</style>