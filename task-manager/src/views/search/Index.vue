<template>
  <div class="query-container">
    <el-card shadow="never" class="filter-card">
      <el-form :model="queryForm" label-width="100px" label-position="left" class="uniform-form">
        <el-row :gutter="20">
          <!-- 第一行筛选条件 -->
          <el-col :span="8">
            <el-form-item label="组内人员">
              <Select
                v-model="queryForm.groupMembers"
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
                v-model="queryForm.executor"
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
                v-model="queryForm.tl"
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
              <el-date-picker
                v-model="queryForm.timeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                clearable
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="标定时间">
              <el-date-picker
                v-model="queryForm.calibrationTime"
                type="date"
                placeholder="选择标定时间"
                value-format="YYYY-MM-DD"
                clearable
              />
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
                :api="getProjectApi"
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
                v-model="queryForm.keyword"
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
      <vxe-toolbar>
        <template #buttons>
          <el-button type="primary" size="small" @click="exportData">
            <el-icon><Download /></el-icon>导出数据
          </el-button>
        </template>
      </vxe-toolbar>
      
      <vxe-table
        border
        resizable
        highlight-current-row
        :data="tableData"
        :loading="loading"
        height="600"
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
        
        <vxe-column field="executor" title="执行者" width="120"></vxe-column>
        <vxe-column field="startTime" title="开始时间" width="150"></vxe-column>
        <vxe-column field="endTime" title="截止时间" width="150"></vxe-column>
        <vxe-column field="workload" title="工作量(人天)" width="120"></vxe-column>
        <vxe-column field="project" title="项目" width="150" show-overflow></vxe-column>
        <vxe-column field="relatedTask" title="关联任务" width="150" show-overflow></vxe-column>
        <vxe-column field="tl" title="创建人" width="120"></vxe-column>
        
        <vxe-column title="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="handleDetail(row)">详情</el-button>
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
import {  getUserGroupApi, getUserApi, getProjectApi } from '@/api/data/data'


// 筛选表单数据
const queryForm = reactive({
  groupMembers: [],
  executor: '',
  tl: '',
  status: '',
  timeRange: [],
  calibrationTime: '',
  project: '',
  keyword: ''
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

const statusOptions = ref([
  { value: 'pending', label: '待开始' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' }
])

// 获取状态标签类型
const getStatusTagType = (status) => {
  const map = {
    0: 'warning',
    1: '',
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

// 查询方法
const handleQuery = () => {
  loading.value = true
  page.currentPage = 1
  fetchData()
}

// 重置查询条件
const resetQuery = () => {
  Object.assign(queryForm, {
    groupMembers: [],
    executor: '',
    tl: '',
    status: '',
    timeRange: [],
    calibrationTime: '',
    project: '',
    keyword: ''
  })
  handleQuery()
}

// 分页变化
const handlePageChange = () => {
  fetchData()
}

// 获取表格数据
const fetchData = () => {
  // 模拟API请求
  setTimeout(() => {
    tableData.value = [
      {
        id: 'T1001',
        name: '用户登录功能开发',
        busyLevel: 65,
        status_name: '进行中',
        status: 1,
        executor: '张三',
        startTime: '2023-05-10',
        endTime: '2023-05-20',
        workload: 5,
        project: '项目A',
        relatedTask: 'T1002,T1003',
        tl: '张TL'
      },
      // 更多模拟数据...
      {
        id: 'T1002',
        name: '订单管理模块优化',
        busyLevel: 30,
        status_name: '待下发',
        status: 0,
        executor: '李四',
        startTime: '2023-05-15',
        endTime: '2023-05-25',
        workload: 3,
        project: '项目B',
        relatedTask: 'T1001',
        tl: '李TL'
      }
    ]
    page.total = 25
    loading.value = false
  }, 500)
}

// 导出数据
const exportData = () => {
  // 实现导出逻辑
  console.log('导出数据')
}

// 查看详情
const handleDetail = (row) => {
  console.log('查看详情', row)
}

// 初始化加载数据
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.query-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.table-card {
  margin-top: 20px;
}

.button-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}



</style>
