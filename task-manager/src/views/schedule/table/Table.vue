<template>
    <EditDrawer v-model="drawerVisible" title="任务编辑"  @confirm="handleConfirm" @cancel="handleCancel">
        <el-form :mode="curTaskDetailRef" label-width="auto" :disabled="disabled">
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
      
    </el-form>
    </EditDrawer>
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
</template>
<script setup>
import { useScheduleStore } from '@/stores/schedule'
import { ref, reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import EditDrawer from './EditDrawer.vue'

const scheduleStore = useScheduleStore()
const { schduleTableData,curTaskDetailRef } = storeToRefs(scheduleStore)
// Form 表单处理代码

// Form 表单处理代码 END

// table 表
const disabled = ref(true)
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
            disabled.value = false
            scheduleStore.updateCurTaskDetail(cellParams.row)
            openDrawer()
        }
    }
})



//弹出编辑抽屉
const drawerVisible = ref(false)

const openDrawer = () => {
    drawerVisible.value = true
}

const handleConfirm = () => {
    console.log('确认按钮点击')
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