<template>
  <div>
    <!-- 任务表格 -->
    <div style="width: 50vw; overflow: auto; position: relative; border: 1px solid #ebeef5; border-radius: 4px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);">
      <vxe-table
        border
        max-height=600
        :data="filteredTasks"
        :row-config="{ isHover: true }"
        :row-class-name="tableRowClassName"
        @cell-click="handleRowClick"
      >
        <!-- 表格列定义 -->
      </vxe-table>
    </div>

    <!-- 反馈表单 -->
    <div v-if="selectedRow" style="width:100%;">
      <el-form label-width="auto" style="width: 100%;margin-top:10px">
        <!-- 表单内容 -->
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VXETable } from 'vxe-table'
import { ElMessage } from 'element-plus'

const props = defineProps({
  filteredTasks: Array
})

const emit = defineEmits(['feedback'])

const selectedRow = ref(null)

// 表格行点击处理
const handleRowClick = ({ row }) => {
  if (row.status_name !== "进行中") {
    ElMessage.warning(`无法反馈该状态（${row.status_name}）的任务`)
    return
  }
  selectedRow.value = row
}

// 提交反馈
const onSubmit = async () => {
  emit('feedback', {
    taskId: selectedRow.value.id,
    actWorkload: feedback_act_workload.value,
    progress: feedback_progress.value,
    info: feedback_info.value
  })
}
</script>