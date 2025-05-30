<template>
  <div class="query-container">
    <!-- 半屏详情面板 -->
        <el-drawer
          v-model="showDetailPanel"
          title="任务详情"
          direction="ltr"
          size="50%"
        >
          <div class="detail-grid">
            <!-- 任务名称和工作量 -->
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">任务名称</span>
                <el-input 
                  v-model="currentTask.name" 
                  readonly 
                  class="detail-input"
                  :title="currentTask.id"
                />
              </div>
              <div class="detail-item">
                <span class="detail-label">工作量</span>
                <el-input 
                  :value="currentTask.workload + ' 天'" 
                  readonly 
                  class="detail-input"
                />
              </div>
            </div>

            <!-- 邮件抄送 -->
            <div class="detail-row">
              <div class="detail-item full-width">
                <span class="detail-label">邮件抄送</span>
                <el-input
                  type="textarea"
                  :rows="3"
                  :value="currentTask.sender || '无'"
                  readonly
                  resize="none"
                  class="detail-textarea cc-textarea"
                />
              </div>
            </div>

            <!-- 开始时间和截止时间 -->
            <div class="detail-row">
              <div class="detail-item full-width">
                <span class="detail-label">开始时间 - 截止时间</span>
                <el-input 
                  :value="`${currentTask.start_time} 至 ${currentTask.deadline_time}`" 
                  readonly 
                  class="detail-input"
                />
              </div>
            </div>

            <!-- 项目 -->
            <div class="detail-row">
              <div class="detail-item full-width">
                <span class="detail-label">项目</span>
                <el-input 
                  :value="`${currentTask.project || '无'}`" 
                  readonly 
                  class="detail-input"
                />
              </div>
            </div>

            <!-- 关联任务 -->
            <div class="detail-row">
              <div class="detail-item full-width">
                <span class="detail-label">关联任务</span>
                <el-input 
                  :value="`${currentTask.related_task || '无'}`" 
                  readonly 
                  class="detail-input"
                />
              </div>
            </div>

            <!-- 任务内容 -->
            <div class="detail-row">
              <div class="detail-item full-width">
                <span class="detail-label">任务内容</span>
                <el-input
                  type="textarea"
                  :rows="3"
                  :value="`${currentTask.content || '无'}`"
                  readonly
                  resize="none"
                  class="detail-textarea"
                />
              </div>
            </div>

            <!-- 挑战目标 -->
            <div class="detail-row">
              <div class="detail-item full-width">
                <span class="detail-label">挑战目标</span>
                <el-input
                  type="textarea"
                  :rows="3"
                  :value="`${currentTask.challenge || '无'}`"
                  readonly
                  resize="none"
                  class="detail-textarea"
                />
              </div>
            </div>

            <!-- 描述信息 -->
            <div class="detail-row">
              <div class="detail-item full-width">
                <span class="detail-label">详细描述</span>
                <el-input
                  type="textarea"
                  :rows="4"
                  :value="currentTask.description || '无'"
                  readonly
                  resize="none"
                  class="detail-textarea"
                />
              </div>
            </div>

            <!-- 完成度和实际工作量 -->
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">完成度</span>
                <el-progress 
                  :percentage="parseInt(currentTask.progress || 0)" 
                  :status="getProgressStatus(currentTask.progress)"
                  style="width: 200px;"
                />
              </div>
              <div class="detail-item">
                <span class="detail-label">实际工作量</span>
                <el-input 
                  :value="(currentTask.act_workload || '0') + ' 天'" 
                  readonly 
                  class="detail-input"
                />
              </div>
            </div>

            <!-- 反馈信息 -->
            <div class="detail-row">
              <div class="detail-item full-width">
                <span class="detail-label">反馈记录</span>
                <el-input
                  type="textarea"
                  :rows="4"
                  :value="currentTask.feedback || '无反馈记录'"
                  readonly
                  resize="none"
                  class="detail-textarea"
                />
              </div>
            </div>
          </div>
        </el-drawer>
    <el-card shadow="never" class="filter-card">
      <el-form :model="queryForm" label-width="100px" label-position="left" class="uniform-form">
        <el-row :gutter="20">
          <!-- 第一行筛选条件 -->
          <el-col :span="8">
            <el-form-item label="组内人员">
              <Select
                v-model="queryForm.group"
                placeholder="请选择组"
                :api="getUserGroupApi"
                :params="{}"
                label-field="name"
                value-field="id"
                filterable
                :filter-field="['name']"
                clearable
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="执行人">
              <Select
                v-model="queryForm.receiver"
                placeholder="请选择执行人"
                :api="getUserApi"
                label-field="username"
                value-field="id"
                filterable
                :filter-field="['username']"
                clearable
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="创建人">
              <Select
                v-model="queryForm.creator"
                placeholder="请选择创建人"
                :api="getUserApi"
                label-field="username"
                value-field="id"
                filterable
                :filter-field="['username']"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <!-- 第二行筛选条件 -->
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select
                v-model="queryForm.status"
                placeholder="请选择状态"
                clearable
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="时间范围">
            <el-config-provider :locale="locale">
              <el-date-picker
                v-model="queryForm.timeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                clearable
              />
              </el-config-provider>
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="标定时间">
            <el-config-provider :locale="locale">
              <el-date-picker
                v-model="queryForm.flag_time"
                type="date"
                placeholder="选择标定时间"
                value-format="YYYY-MM-DD"
                clearable
              />
              </el-config-provider>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <!-- 第三行筛选条件 -->
          <el-col :span="8">
            <el-form-item label="项目">
              <Select
                v-model="queryForm.project"
                placeholder="请选择项目"
                :api="getProjectList"
                label-field="name"
                value-field="id"
                filterable
                :filter-field="['name']"
                clearable
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="关键字查询">
              <el-input
                v-model="queryForm.search_text"
                placeholder="请输入任务名称或描述"
                clearable
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8" class="button-group">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="resetQuery">清除条件</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    
    <el-card shadow="never" class="table-card">
      <!-- <vxe-toolbar>
        <template #buttons>
          <el-button type="primary" size="small" @click="exportData">
            <el-icon><Download /></el-icon>导出数据
          </el-button>
        </template>
      </vxe-toolbar> -->
      
      <vxe-table
        border
        :row-config="{ isHover: true }"
        :data="tableData"
        :loading="loading"
        :height="tableHeight"
      >
        <vxe-column type="seq" width="60" title="序号"></vxe-column>
        <vxe-column field="id" title="ID" width="100"></vxe-column>
        <vxe-column field="name" title="名称" min-width="150" show-overflow></vxe-column>
        
        <vxe-column field="status" title="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ row.status_name }}
            </el-tag>
          </template>
        </vxe-column>
        
        <vxe-column field="receiver_name" title="执行人" width="120"></vxe-column>
        <vxe-column field="start_time" title="开始时间" width="150"></vxe-column>
        <vxe-column field="deadline_time" title="截止时间" width="150"></vxe-column>
        <vxe-column field="workload" title="工作量(人天)" width="120"></vxe-column>
        <vxe-column field="project" title="项目" width="150" show-overflow></vxe-column>
        <vxe-column field="related_task" title="关联任务" width="150" show-overflow></vxe-column>
        <vxe-column field="creator_name" title="创建人" width="120"></vxe-column>
        
        <vxe-column title="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link size="small" @click="handleDetail(row)">详情</el-button>
          </template>
        </vxe-column>
      </vxe-table>
      
      <vxe-pager
        perfect
        v-model:current-page="page.currentPage"
        v-model:page-size="page.pageSize"
        :total="page.total"
        :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
        @page-change="handlePageChange"
      >
      </vxe-pager>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Select from '@/components/selects/MutiSelect.vue'
import { Download } from '@element-plus/icons-vue'
import {  getUserGroupApi, getUserApi, getProjectList, getTaskDataApi } from '@/api/data/data'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { TaskStatus, getProgressStatus } from '@/utils/public'

const locale = zhCn

// 表格高度
const tableHeight = ref(500)

function calculateTableHeight() {
  // 获取窗口总高度
  const windowHeight = window.innerHeight;
  // 获取el-header的高度
  const header = document.querySelector('.el-header.head');
  const headerHeight = header ? header.offsetHeight : 0;
  // 获取filter-card的高度
  const filterCard = document.querySelector('.filter-card');
  const filterHeight = filterCard ? filterCard.offsetHeight : 0;
  // 计算表格高度（减去20px的额外空间）
  tableHeight.value = windowHeight - headerHeight - filterHeight - 140;
  console.log(windowHeight, headerHeight, filterHeight, tableHeight.value)
}

// 筛选表单数据
const queryForm = reactive({
  group: '',
  receiver: '',
  creator: '',
  status: '',
  timeRange: [],
  flag_time: '',
  project: '',
  search_text: ''
})

// 分页数据
const page = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const tableData = ref([])
const loading = ref(false)
const queryItems = ref([])

const statusOptions = ref([
  { value: 'PEND', label: '待下发' },
  { value: 'PROGRESS', label: '进行中' },
  { value: 'FINISH', label: '已完成' }
])

// 获取状态标签类型
const getStatusTagType = (status) => {
  const map = {
    1: 'warning',
    4: 'primary',
    2: 'success'
  }
  return map[status] || ''
}

// 获取繁忙度颜色
const getBusyLevelColor = (percentage) => {
  if (percentage < 30) return '#67C23A'
  if (percentage < 70) return '#E6A23C'
  return '#F56C6C'
}

const taskStatus = {
    待下发: 1,
    进行中: 4,
    已完成: 2
}

// 查询方法
const handleQuery = async () => {
  loading.value = true
  page.currentPage = 1
  // 获取所有的筛选条件\
  console.log(queryForm)
  const params = {
    group: queryForm.group? queryForm.group : "",  // 组内人员（数组）
    receiver: queryForm.receiver? queryForm.receiver : "",          // 执行人
    creator: queryForm.creator? queryForm.creator : "",                     // 创建人
    status: TaskStatus[queryForm.status] ? TaskStatus[queryForm.status] : "",             // 状态
    start_time: queryForm.timeRange.length == 2? queryForm.timeRange[0] : "",  // 时间范围开始
    deadline_time: queryForm.timeRange.length == 2? queryForm.timeRange[1] : "",    // 时间范围结束
    flag_time: queryForm.flag_time, // 标定时间
    project: queryForm.project? queryForm.project : "",           // 项目
    search_text: queryForm.search_text             // 关键字
  }
  console.log(params);
  const response = await getTaskDataApi(params)
  console.log(response)
  queryItems.value = response.result.items
  tableData.value = queryItems.value.slice(0, page.pageSize)
  page.total = queryItems.value.length
  loading.value = false;
}

// 重置查询条件
const resetQuery = () => {
  Object.assign(queryForm, {
    group: '',
    receiver: '',
    creator: '',
    status: '',
    timeRange: [],
    flag_time: '',
    project: '',
    search_text: ''
  })
}

// 分页变化
const handlePageChange = () => {
  tableData.value = queryItems.value.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize)
}

// 导出数据
const exportData = () => {
  // 实现导出逻辑
  console.log('导出数据')
}

// 查看详情
const showDetailPanel = ref(false);
const currentTask = ref({});

const handleDetail = (row) => {
  console.log('查看详情', row)
  currentTask.value = row;
  showDetailPanel.value = true
  console.log(showDetailPanel.value)

}

// 初始化加载数据
onMounted(() => {
  calculateTableHeight()
  // window.addEventListener('resize', calculateTableHeight)
  // tableHeight.value = 600
})

// 侧面弹出框


</script>

<style scoped>
.query-container {
  padding: 20px;
}

.filter-card {
  height: 20vh;
  margin-bottom: 10px;
}

.table-card {
  margin-top: 10px;
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
