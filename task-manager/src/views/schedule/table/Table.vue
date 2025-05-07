<template>
    <EditDrawer v-model="drawerVisible" title="任务编辑" @confirm="handleConfirm" @cancel="handleCancel">
        <el-form :mode="curTaskDetailRef" label-width="auto" :disabled="disabled" label-position="top">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="名称:" prop="name">
                        <el-input v-model="curTaskDetailRef.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目:">
                        <el-input v-model="curTaskDetailRef.project"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="执行人:" prop="receiver">
                        <Select style="width: 95%;" v-model="curTaskDetailRef.receiver" :api="getUserApi"
                            label-field="username" value-field="id" filterable
                            :filter-field="['username', 'emp_num', 'email']"></Select>

                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="抄送:">
                        <Select style="width: 95%;" v-model="curTaskDetailRef.sender" :api="getUserApi"
                            label-field="username" value-field="id" filterable multiple
                            :filter-field="['username', 'emp_num', 'email']"></Select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="时间范围:">
                        <el-date-picker v-model="curTaskDetailRef.start_time" type="date" placeholder="Pick a day"
                            size="default" style="width: 7vw;" />
                        <span>~</span>
                        <el-date-picker v-model="curTaskDetailRef.deadline_time" type="date" placeholder="Pick a day"
                            size="default" style="width:7vw;" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="工作量:" prop="workload">
                        <el-input-number v-model="curTaskDetailRef.workload" :precision="1" :step="0.5"
                            style="width: 95%" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="任务内容:" prop="content">
                        <el-input type="textarea" :rows="5" v-model="curTaskDetailRef.content"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="挑战目标:">
                        <el-input type="textarea" :rows="5" v-model="curTaskDetailRef.challenge"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="任务描述:">
                <el-input type="textarea" :rows="2" v-model="curTaskDetailRef.description"></el-input>
            </el-form-item>
            <el-form-item label="关联任务:">
                <el-input type="text" v-model="curTaskDetailRef.related_task"></el-input>
            </el-form-item>
        </el-form>
    </EditDrawer>
    <vxe-table :data="schduleTableData" border show-header stripe auto-resize max-height="220"
        :row-config="{ isHover: true }" @cell-dblclick="handleRowDblClick">
        <vxe-column type="checkbox" width="5%"></vxe-column>
        <vxe-column field="name" title="任务名" width="12%" show-overflow></vxe-column>
        <vxe-column field="status_name" title="状态" width="10%"></vxe-column>
        <vxe-column field="start_time" title="开始时间" width="15%"></vxe-column>
        <vxe-column field="deadline_time" title="截止时间" width="15%" show-overflow></vxe-column>
        <vxe-column field="workload" title="量(天)" width="10%"></vxe-column>
        <vxe-column field="receiver_name" title="执行人" width="11%"></vxe-column>
        <vxe-column title="按钮组" width="200" :cell-render="btnGroupCellRender"></vxe-column>
    </vxe-table>
</template>
<script setup>
import { useScheduleStore } from '@/stores/schedule'
import { ref, reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import EditDrawer from './EditDrawer.vue'
import Select from '@/components/selects/MutiSelect.vue'
import { getUserApi, taskDeleteApi,taskModifyApi } from '@/api/data/data'

const scheduleStore = useScheduleStore()
const { schduleTableData, curTaskDetailRef } = storeToRefs(scheduleStore)
// Form 表单处理代码

// Form 表单处理代码 END

// table 表
import { VxeUI } from 'vxe-pc-ui'
const disabled = ref(true)
const btnGroupCellRender = reactive({
    name: 'VxeButtonGroup',
    props: {
        mode: 'text'
    },
    options: [
        { content: '编辑', name: 'edit' },
        { content: '删除', status: 'error', name: 'del' }
    ],
    events: {
        click(cellParams, params) {
            console.log('==============>params', params)
            if (params.name === 'edit') {
                disabled.value = false
                console.log('=========================', cellParams.row)
                scheduleStore.updateCurTaskDetail({ ...cellParams.row })
                openDrawer()
            } else if (params.name === 'del') {
                console.log('========================del=', cellParams.row.id)
                taskDeleteApi(cellParams.row.id).then(() => {
                    scheduleStore.getTableData()
                    VxeUI.modal.message({
                        content: `任务：${cellParams.row.name} 已删除！`,
                        status: 'success'
                    })
                })
            }

        }
    }
})


const handleRowDblClick = (cellParams) => {
    disabled.value = true
    scheduleStore.updateCurTaskDetail({ ...cellParams.row })
    openDrawer()
}


//弹出编辑抽屉
const drawerVisible = ref(false)

const openDrawer = () => {
    drawerVisible.value = true
}

const closeDrawer = () => {
    drawerVisible.value = false
}


const handleConfirm = () => {
    console.log('确认按钮点击')
    console.log("modify data====>", curTaskDetailRef.value)
    taskModifyApi(curTaskDetailRef.value.id, curTaskDetailRef.value).then((data) => {

        console.log('data====>',data)
        VxeUI.modal.message({
            content: `任务：${curTaskDetailRef.value.name} 已修改！`,
            status: 'success'
        })
        scheduleStore.getTableData()
    })
    // 处理确认逻辑
}

const handleCancel = () => {
    console.log('取消按钮点击')
    // 处理取消逻辑
}
// table 表 END

onMounted(() => {
    scheduleStore.getTableData()
})
</script>