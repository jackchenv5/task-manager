<template>
  <!-- 半屏详情面板 -->
  <el-drawer v-model="showDetailPanel" title="任务详情" direction="ltr" size="50%">
      <div class="detail-grid">
        <!-- 任务名称和工作量 -->
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">任务名称</span>
            <el-input v-model="currentTask.name"   :title="currentTask.id" />
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
          <el-button type="primary" @click="handleConfirm(false)">
            确定修改
          </el-button>
          <el-button type="success" @click="handleConfirm(true)">
            复制任务
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
              <Select style="width: 95%;"  v-model="currentTask.project" :api="getProjectList" label-field="name" value-field="name" filterable :filter-field="['name']"></Select>
            </div>
          </div>

          <!-- 任务内容 -->
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">任务内容</span>
              <el-input type="textarea" :rows="3" :value="currentTask.content || '无'" v-model="currentTask.content"  resize="none" />
            </div>
          </div>

          <!-- 挑战目标 -->
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">挑战目标</span>
              <el-input type="textarea" :rows="3" :value="currentTask.challenge || '无'" v-model="currentTask.challenge" resize="none"  />
            </div>
          </div>

          <!-- 描述信息 -->
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">详细描述</span>
              <el-input type="textarea" :rows="4" :value="currentTask.description || '无'"  resize="none"
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
    <vxe-table ref="taskTable" border  height="100%" show-header stripe auto-resize  align="center" :edit-config="{trigger:'dblclick',mode:'cell'}"
      :row-config="{ isHover: true }" :data="curSelectUserFilterTasks" @checkbox-all="selectAllChangeEvent" @checkbox-change="selectChangeEvent">
      <vxe-column type="checkbox" width="40"></vxe-column>
      <vxe-column field="name" title="任务名" width="120" show-overflow></vxe-column>
      <vxe-column field="receiver_name" title="执行人" width="80"></vxe-column>
      <vxe-column field="status_name" title="状态" width="80">
        <template #default="{ row }">
          <template v-if="TaskStatus.PROGRESS === row.status" >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48"><g fill="#052360"><path d="M30.5 13a4.5 4.5 0 1 0 0-9a4.5 4.5 0 0 0 0 9m-9.04 4.282c-1.247.31-2.098.776-2.785 1.354c-1.03.868-1.862 2.12-2.986 4.088a2 2 0 1 1-3.473-1.985c1.119-1.957 2.25-3.788 3.883-5.162c1.704-1.436 3.79-2.248 6.603-2.561c1.176-.13 2.47-.104 3.683.437c1.273.569 2.203 1.588 2.837 2.95c.854 1.833 1.489 2.924 1.997 3.557c.245.303.416.444.513.507c.077.05.11.054.122.056h.001c.087.01.369 0 1.197-.367c.361-.16.755-.352 1.237-.587l.115-.056a54 54 0 0 1 1.784-.84a2 2 0 0 1 1.625 3.655a49 49 0 0 0-1.653.779l-.131.064c-.461.225-.925.452-1.36.644c-.9.398-2.05.83-3.297.679c-1.316-.16-2.33-.903-3.165-1.9l-2.733 5.273l3.78 4.918a2 2 0 0 1 .403 1.012l.832 7.996a2 2 0 1 1-3.978.414l-.774-7.433l-2.296-2.988l-.02.037l-.084-.172l-4.242-5.52a2 2 0 0 1-.282-1.934z"/><path d="m18.432 29.007l-1.472 3.96l-5.8-.46a2 2 0 1 0-.318 3.987l7.308.58a2 2 0 0 0 2.033-1.296l1.125-3.028z"/></g></svg>
          </template>
          <template v-if="TaskStatus.PEND === row.status" >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" style="color:#1d4167;" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8"/><path fill="currentColor" d="M12.5 7H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/></svg>
          </template>
          <template v-if="TaskStatus.FINISH === row.status" >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"  viewBox="0 0 16 16"><path fill="none" stroke="currentColor" stroke-linejoin="round" d="M5.5 2.5h-2v12h9v-12h-2m-5 6l2 2L11 7M5.5 1.5h5l-.625 2h-3.75z" stroke-width="1"/></svg>
          </template>

        </template>
      </vxe-column>
      <vxe-column title="进度" width="70">
        <template #default="{ row }">
          <el-progress
              type="circle"
              :percentage="parseInt(row.progress || 0)"
              :stroke-width="5"
              show-text="false"
              :status="parseInt(row.progress || 0) === 100 ? 'success' : 'primary' "
              :width="25"
          ><span></span></el-progress>
        </template>
      </vxe-column>

      <vxe-column field="start_time" title="开始时间" sortable width="150" :edit-render="{}">
        <template #default="{row}">
          <el-text type="info">{{row.start_time}}</el-text>
        </template>
        <template #edit="{row}" v-if="loginUser.perm.schedule">

          <el-date-picker style="max-width:130px"
                          v-model="row.start_time"
                          type="date"
                          placeholder="开始日期"
                          value-format="YYYY-MM-DD"
                          clearable
                          @blur="changeDate(row,'start')"
          />
        </template>
      </vxe-column>
      <vxe-column field="deadline_time" title="截止时间" width="150" :edit-render="{}">
        <template #default="{row}">
          <el-text type="info">{{row.deadline_time}}</el-text>
        </template>
        <template #edit="{row}" v-if="loginUser.perm.schedule">
          <el-date-picker style="max-width:130px"
                          v-model="row.deadline_time"
                          type="date"
                          placeholder="截止时间"
                          value-format="YYYY-MM-DD"
                          clearable
                          @blur="changeDate(row,'end')"
          />
        </template>
      </vxe-column>
      <vxe-column field="workload" title="工作量(天)" width="120" v-if="loginUser.perm.schedule" :edit-render="{}">
        <template #default="{row}">
          <el-text type="warning">{{row.workload}}</el-text>
        </template>
        <template #edit="{row}">
          <el-input v-model="row.workload"  @change="changeWorkLoad(row)"></el-input>
        </template>
      </vxe-column>
      <vxe-column field="project" title="项目" width="130" show-overflow></vxe-column>
      <vxe-column field="creator_name" title="创建人" width="110"></vxe-column>
      <vxe-column title="操作" fixed="right" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEditClick(row)" :icon="Edit" style="width:30px" ></el-button>
          <el-popconfirm
              title="确认删除？"
              placement="left"
              @confirm="groupStore.deleteTask(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" :icon="Delete" style="width:30px"/>
            </template>
          </el-popconfirm>

        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script setup>
import { ElButton,ElInput, ElDatePicker,ElDrawer,ElPopconfirm,ElProgress,ElConfigProvider,ElInputNumber,ElMessage } from 'element-plus'
import { ref, computed } from 'vue'
import { VxeUI } from 'vxe-table'
import { getProgressStatus, TaskStatus } from '@/utils/public'
import { useGroupStore } from '@/stores/group'
import { useUserStore } from '@/stores/user'
import Select from '@/components/selects/MutiSelect.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { getUserApi, taskModifyApi,taskAddApi,getProjectList } from '@/api/data/data'

import { storeToRefs } from 'pinia'
const groupStore = useGroupStore();
const { curSelectUserFilterTasks } = storeToRefs(groupStore);
import {
  Delete,
  Edit
} from '@element-plus/icons-vue'
// 日历选择器中文显示

const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)

function isNumberOrNumericString(value) {
  // 如果是数字类型
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  // 如果是字符串类型
  if (typeof value === 'string') {
    // 检查字符串是否为非空且可以转换为数字
    return value.trim() !== '' && !isNaN(Number(value));
  }
  return false;
}

const  changeDate = async (row,type) =>{
  let data = null
  if(type === 'start'){
    data = await taskModifyApi(row.id,{start_time:row.start_time})
  }else{
    data = await taskModifyApi(row.id,{deadline_time:row.deadline_time})
  }
  if(data?.id){
    ElMessage.success(`修改任务时间成功！`)
  }else {
    ElMessage.error(`修改任务时间失败！`)
  }
}


const  changeWorkLoad = async (row) =>{
  if(!isNumberOrNumericString(row.workload)){
    ElMessage.error(`请输入数字!`)
    return
  }
  const data = await taskModifyApi(row.id,{workload:row.workload})
  if(data?.id){
    ElMessage.success(`修改任务工作量成功`)
  }else {
    ElMessage.error(`修改任务工作量失败!`)
  }
}



const locale = zhCn

const myGroupStore = useGroupStore()
const myUserStore = useUserStore()

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
  currentTask.value = { ...row, sender: row.sender ? row.sender.split(',') : [] }
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

}


// 是否显示详情
const showDetails = ref(false)

// 切换详情显示
const toggleDetails = () => {
  showDetails.value = !showDetails.value
}
const handleConfirm = async (isCopy=false) => {
  const params = {
    name: currentTask.value.name,
    workload: currentTask.value.workload,
    project:currentTask.value.project,
    sender: currentTask.value.sender ? currentTask.value.sender.join(",") : "",
    start_time: currentTask.value.start_time,
    deadline_time: currentTask.value.deadline_time,
    receiver: currentTask.value.receiver,
    content: currentTask.value.content,
    challenge: currentTask.value.challenge
  }
  try {
    let res = null
    if(isCopy){
      res = await taskAddApi({...params,status:TaskStatus.PEND})
      ElMessage.success(`复制任务成功`)
    }else{
      res = await taskModifyApi(currentTask.value.id, params)
      ElMessage.success(`修改任务成功`)
    }

  } catch (err) {
    ElMessage.error(`修改任务失败: ${err}`)
  }

  myGroupStore.initAllTask()
  showDetailPanel.value = false
}

</script>

<style>
.table-container {
  padding: 5px;
  margin-top: 1vh;
  height: 69vh;
  background-color: white;
  border-radius: 10px;
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

.el-icon {
  margin-right: 0px;
}
</style>