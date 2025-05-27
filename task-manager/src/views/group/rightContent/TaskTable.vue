<template>
  <!-- 半屏详情面板 -->
  <el-drawer v-model="showDetailPanel" title="任务详情" direction="ltr" size="50%">
      <div class="detail-grid">
        <!-- 任务名称和工作量 -->
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">任务名称</span>
            <el-input v-model="currentTask.name" readonly class="detail-input" :title="currentTask.id" />
          </div>
          <div class="detail-item">
            <span class="detail-label">工作量(天)</span>
            <el-input-number v-model="currentTask.workload" :min="0" :step="0.5" :precision="1"
              controls-position="right" />
          </div>
        </div>

        <!-- 邮件抄送 -->
        <div class="detail-row">
          <div class="detail-item full-width">
            <span class="detail-label">邮件抄送</span>
            <Select v-model="currentTask.sender" placeholder="发送人" :api="getUserApi" label-field="username"
              value-field="username" filterable multiple :filter-field="['username', 'emp_num', 'email']" clearable />
          </div>
        </div>

        <!-- 开始时间和截止时间 -->
        <div class="detail-row">
          <el-form-item label="起止时间">
            <el-config-provider :locale="locale">
              <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" value-format="YYYY-MM-DD" clearable />
            </el-config-provider>
          </el-form-item>
        </div>

        <!-- 执行人 -->
        <div class="detail-row">
          <div class="detail-item full-width">
            <span class="detail-label">执行人</span>
            <Select v-model="currentTask.receiver" placeholder="发送人" :api="getUserApi" label-field="username"
              value-field="id" filterable :filter-field="['username', 'emp_num', 'email']" clearable />
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="detail-row" style="justify-content: flex-end;">
          <el-button type="primary" @click="handleConfirm">
            确定修改
          </el-button>
          <el-button type="text" :icon="showDetails ? 'ArrowUp' : 'ArrowDown'" @click="toggleDetails">
            {{ showDetails ? '收起详情' : '展开详情' }}
          </el-button>
        </div>

        <!-- 可折叠内容 -->
        <div v-show="showDetails">
          <!-- 项目 -->
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">项目</span>
              <el-input :value="currentTask.project || '无'" readonly class="detail-input" />
            </div>
          </div>

          <!-- 关联任务 -->
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">关联任务</span>
              <el-input :value="currentTask.related_task || '无'" readonly class="detail-input" />
            </div>
          </div>

          <!-- 任务内容 -->
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">任务内容</span>
              <el-input type="textarea" :rows="3" :value="currentTask.content || '无'" readonly resize="none"
                class="detail-textarea" />
            </div>
          </div>

          <!-- 挑战目标 -->
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">挑战目标</span>
              <el-input type="textarea" :rows="3" :value="currentTask.challenge || '无'" readonly resize="none"
                class="detail-textarea" />
            </div>
          </div>

          <!-- 描述信息 -->
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">详细描述</span>
              <el-input type="textarea" :rows="4" :value="currentTask.description || '无'" readonly resize="none"
                class="detail-textarea" />
            </div>
          </div>

          <!-- 完成度和实际工作量 -->
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">完成度</span>
              <el-progress :percentage="parseInt(currentTask.progress || 0)"
                :status="getProgressStatus(currentTask.progress)" style="width: 200px;" />
            </div>
            <div class="detail-item">
              <span class="detail-label">实际工作量</span>
              <el-input :value="(currentTask.act_workload || '0') + ' 天'" readonly class="detail-input" />
            </div>
          </div>

          <!-- 反馈信息 -->
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">反馈记录</span>
              <el-input type="textarea" :rows="4" :value="currentTask.feedback || '无反馈记录'" readonly resize="none"
                class="detail-textarea" />
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  <div class="table-container">
    <vxe-table ref="taskTable" border :max-height="tableMaxHeight" show-header stripe auto-resize w
      :row-config="{ isHover: true }" :data="curSelectUserFilterTasks" @checkbox-all="selectAllChangeEvent" @checkbox-change="selectChangeEvent">
      <vxe-column type="checkbox" width="40"></vxe-column>
      <vxe-column field="name" title="任务名" width="120" show-overflow></vxe-column>
      <vxe-column field="status_name" title="状态" width="80"></vxe-column>
      <vxe-column field="receiver_name" title="执行人" width="80"></vxe-column>
      <vxe-column field="start_time" title="开始时间" width="100" show-overflow></vxe-column>
      <vxe-column field="deadline_time" title="截止时间" width="100" show-overflow></vxe-column>
      <vxe-column field="workload" title="工时(天)" width="100"></vxe-column>
      <vxe-column field="project" title="项目" width="130" show-overflow></vxe-column>
      <vxe-column field="creator_name" title="创建人" width="110"></vxe-column>
      <vxe-column title="操作" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEditClick(row)">编辑</el-button>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { VxeUI } from 'vxe-table'
import { getProgressStatus, isTaskInWeek } from '@/utils/public'
import { ElMessage } from 'element-plus';
import { useGroupStore } from '@/stores/group'
import { useUserStore } from '@/stores/user'
import Select from '@/components/selects/MutiSelect.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { getUserApi, taskModifyApi } from '@/api/data/data'

import { storeToRefs } from 'pinia'
const groupStore = useGroupStore();
const { curSelectUserFilterTasks, selectWeek } = storeToRefs(groupStore);

// 日历选择器中文显示
const locale = zhCn

const myGroupStore = useGroupStore()
const myUserStore = useUserStore()

const tableMaxHeight = computed(() => window.innerHeight * 0.72)

const showDetailPanel = ref(false)
const currentTask = ref(null)
const dateRange = computed({
  get: () => [currentTask.value.start_time, currentTask.value.deadline_time],
  set: (newValue) => {
    if (newValue) {
      currentTask.value.start_time = newValue[0]
      currentTask.value.deadline_time = newValue[1]
    } else {
      currentTask.value.start_time = ''
      currentTask.value.deadline_time = ''
    }
  }
})
const handleEditClick = (row) => {
  // currentTask.value = row
  currentTask.value = { ...row, sender: row.sender.split(",") }
  showDetailPanel.value = true
}

const taskTable = ref()

const selectAllChangeEvent = ({ checked }) => {
  updateSelectedIDs()
}
const selectChangeEvent = ({ checked }) => {
  updateSelectedIDs()
}

const updateSelectedIDs = ()=>{
  const $table = taskTable.value
  const selectedRows = taskTable.value.getCheckboxRecords()
  myGroupStore.changeCurTableSelectedIDs(selectedRows.map(row => row.id))
  console.log("selectedRows",selectedRows.map(row => row.id))
}
// ---*--- 处理下发任务事件 ---*---
const dispatchTasks = async () => {
  // 如果当前用户不是所选组的leader， 则不允许下发
  const group = props.groups.find(g => g.id === props.selectedGroupId)
  if (myUserStore.loginUser.username !== group.group_leader) {
    ElMessage.warning("您不是当前组的leader， 无法下发任务");
    return
  }
  if (taskTable.value) {
    const selectedRows = taskTable.value.getCheckboxRecords()

    if (selectedRows.length === 0) {
      ElMessage.warning('请至少选择一条任务')
      return
    }

    const ids = selectedRows
      .map(row => row.id)  // 提取每个 Proxy 对象的 id  
      .join(',');
    const params = { 'ids': ids, 'publisher': myUserStore.loginUser.id, }
    try {
      const res = await myGroupStore.dispatchTask(params)
      console.log(res)  // 根据后端返回值判断修改是否成功 TODO
      ElMessage.success('下发任务成功！')
    } catch (err) {
      ElMessage.error(`下发任务失败: ${err}`)
    }

  } else {
    ElMessage.warning('请至少选择一条任务')
  }
}

const adjustTasks = () => {
  const group = props.groups.find(g => g.id === props.selectedGroupId)
  if (myUserStore.loginUser.username !== group.group_leader) {
    ElMessage.warning("您不是当前组的leader， 无法调整任务");
    return
  }
}

// 是否显示详情
const showDetails = ref(false)

// 切换详情显示
const toggleDetails = () => {
  showDetails.value = !showDetails.value
}
const handleConfirm = async () => {
  const sender = currentTask.value.sender.join(',')
  const params = {
    workload: currentTask.value.workload,
    sender: sender,
    start_time: currentTask.value.start_time,
    deadline_time: currentTask.value.deadline_time,
    receiver: currentTask.value.receiver
  }
  try {
    const res = await taskModifyApi(currentTask.value.id, params)
    ElMessage.success(`修改任务成功`)
  } catch (err) {
    ElMessage.error(`修改任务失败: ${err}`)
  }
  showDetailPanel.value = false
}

</script>

<style>
.table-container {
  width: 50vw;
  height: 60vh;
}

/* 半屏详情面板样式 */
.halfscreen-detail-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2000;
  display: flex;
}

.detail-content-wrapper {
  width: 50%;
  height: 100%;
  background: white;
  padding: 30px;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 1;
}

.detail-title {
  margin: 0 0 20px 0;
  color: #303133;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-row {
  display: flex;
  gap: 20px;
}

.detail-item {
  flex: 1;
}

.detail-item.full-width {
  min-width: 100%;
}

.detail-label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #606266;
}

.detail-input {
  width: 100%;
}

.detail-input .el-input__inner {
  background-color: #f5f7fa;
  color: #606266;
  cursor: default;
}

.detail-textarea {
  width: 100%;
}

.detail-textarea .el-textarea__inner {
  background-color: #f5f7fa;
  color: #606266;
  cursor: default;
  font-family: inherit;
}

.cc-textarea .el-textarea__inner {
  height: 80px;
  overflow-y: auto;
}
</style>