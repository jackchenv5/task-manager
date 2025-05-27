<template>
    <el-dialog v-model="dialogVisible" :title="`${selectUserEvaluateRef.evaluated_user_username} | ${selectUserEvaluateRef.project}`" width="700px">
        <p style="color:#aaa">此评分和评语只会展示给TL，作为项目投入参考参考~</p>
        <p style="color:red" v-if="selectUserEvaluateRef.id">此人此月已给出评价，再次评价视为修改~</p>
        <el-form ref="form" :model="selectUserEvaluateRef" label-width="80px">

            <el-form-item label="评价：">
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
    <vxe-button @click="exportEvent">直接导出EXCEL文件</vxe-button>
    <vxe-table ref="tableRef"  show-header auto-resize highlight-current-row show-overflow
        :expand-config="{ trigger: '', accordion: true }" :row-config="{ isHover: true, height: 45 }" keep-source
        @edit-closed="editClosedEvent" :data="mergeData">
        <vxe-column field="receiver_name" title="执行人" width="80" fixed="left"></vxe-column>
        <vxe-column field="project" title="项目" width="400" fixed="left"></vxe-column>
        <vxe-column type="expand" width="60">
            <template #content="{ row }">
                <h3>任务详情</h3>
                <template v-for="item in row.tasks">
                    <div style="border: 1px solid #eee;display: flex;flex-direction: column;gap:10px;">
                        <div>任务名：{{ item.name }}</div>
                        <div>计划工时：{{ item.workload }}</div>
                        <div>实际工时：{{ item.act_workload }}</div>
                        <div>任务内容：
                            <pre>{{ item.content }}</pre>
                        </div>
                        <div>挑战目标：
                            <pre>{{ item.challenge }}</pre>
                        </div>
                        <div>任务反馈：
                            <pre>{{ item.feedback }}</pre>
                        </div>
                    </div>
                </template>

            </template>
        </vxe-column>
        <vxe-column field="start_time" title="开始时间" width="100"></vxe-column>
        <vxe-column field="deadline_time" title="截止时间" width="100"></vxe-column>
        <vxe-column field="workloads" title="计划工作量(天)" width="120"></vxe-column>
        <vxe-column field="act_workloads" title="实际工作量(天)" width="120"></vxe-column>
        <vxe-column field="evaluation_user_commnet" title="组员自评"  ></vxe-column>
        <vxe-column field="evaluation__user_score" title="组员评级"   width="250">
            <template #default="{ row }">
                <el-rate v-model="row.evaluation__user_score" :max="7" text-color="blue" disabled :texts="EvaluateList" show-text>
                </el-rate>
            </template>
        </vxe-column>
        <vxe-column field="evaluation_comment" title="组长评价"  ></vxe-column>
        <vxe-column field="evalution_score" title="组长评级" width="250">
            <template #default="{ row }">
                <el-rate v-model="row.evaluation_score" :max="7" text-color="red" disabled :texts="EvaluateList" show-text>
                </el-rate>
            </template>
        </vxe-column>
        <vxe-column title="操作" width="130" fixed="center">
            <template #default="{ row }">
                <el-button type="primary" size="small" @click="handleEvaluteClick(row.evaluation)">绩效评价</el-button>
            </template>
        </vxe-column>
    </vxe-table>
</template>
  
<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
const tableRef = ref(null)
import { VxeUI } from 'vxe-table'
import { mergeTasks } from '@/utils/tasksStat'


import { useGroupStore } from '@/stores/group.js'
import { useUserStore } from '@/stores/user.js'
import { EvaluateList } from '@/constants/public'

import {commitEvalution,updateEvalution} from '@/api/data/data.js'
const groupStore = useGroupStore();
const userStore = useUserStore();
const { loginUser } = storeToRefs(userStore)
const { allTask, selectGroupUsers, curSeletMonthDate } = storeToRefs(groupStore);

const mergeData = ref([])
const selectUserEvaluateRef = ref({})
const dialogVisible = ref(false)
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
watch([allTask,curSeletMonthDate], async () => {
    
    mergeData.value = await mergeTasks(allTask.value, loginUser.value.id, selectGroupUsers.value, curSeletMonthDate.value)
    console.log(mergeData.value)
}, { immediate: true })


const exportEvent = () => {
    const $table = tableRef.value
    if ($table) {
        $table.exportData({type: 'xlsx'})
    }
}

</script>