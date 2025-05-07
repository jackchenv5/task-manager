<template>
  <div class="query-container">
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
        
        <vxe-column field="receiver" title="执行者" width="120"></vxe-column>
        <vxe-column field="start_time" title="开始时间" width="150"></vxe-column>
        <vxe-column field="deadline_time" title="截止时间" width="150"></vxe-column>
        <vxe-column field="workload" title="工作量(人天)" width="120"></vxe-column>
        <vxe-column field="project" title="项目" width="150" show-overflow></vxe-column>
        <vxe-column field="related_task" title="关联任务" width="150" show-overflow></vxe-column>
        <vxe-column field="creator_name" title="创建人" width="120"></vxe-column>
        
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
import {  getUserGroupApi, getUserApi, getProjectApi, getTaskDataApi } from '@/api/data/data'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { TaskStatus } from '@/utils/public'

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
  const params = {
    group: queryForm.group.id? queryForm.group.id : "",  // 组内人员（数组）
    receiver: queryForm.receiver.id? queryForm.receiver.id : "",          // 执行人
    creator: queryForm.creator.id? queryForm.creator.id : "",                     // 创建人
    status: TaskStatus[queryForm.status] ? TaskStatus[queryForm.status] : "",             // 状态
    start_time: queryForm.timeRange.length == 2? queryForm.timeRange[0] : "",  // 时间范围开始
    deadline_time: queryForm.timeRange.length == 2? queryForm.timeRange[1] : "",    // 时间范围结束
    flag_time: queryForm.flag_time, // 标定时间
    project: queryForm.project.name? queryForm.project.name : "",           // 项目
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
  calculateTableHeight()
  // window.addEventListener('resize', calculateTableHeight)
  // tableHeight.value = 600
})


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

</style>
