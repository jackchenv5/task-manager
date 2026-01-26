<template>
  <div class="query-container">
    <!-- 半屏详情面板 -->
    <el-drawer
        v-model="showEditDrawer"
        title="任务编辑"
        direction="ltr"
        size="50%"

    >
      <el-form
          ref="formRef"
          :rules="formRules"
          style="padding: 10px"
          label-position="top"
          :model="formData"
      >
        <el-form-item>
          <el-button type="primary" @click="onCopy(formRef)">复制</el-button>
          <el-button type="primary" @click="onSubmit(formRef)">提交</el-button>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目:" >
              <Select style="width: 95%" v-model="formData.project" :api="getProjectList" label-field="name" value-field="name" filterable  :filter-field="['name']"></Select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称:" prop="name">
              <el-input v-model="formData.name" style="width: 95%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="执行人:" prop="receiver">
              <Select
                  style="width: 95%"
                  v-model="formData.receiver"
                  :api="getUserApi"
                  label-field="username"
                  value-field="id"
                  filterable
                  :filter-field="['username', 'emp_num', 'email']"
              ></Select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建人:" prop="creator">
              <Select
                  style="width: 95%"
                  v-model="formData.creator"
                  :api="getUserApi"
                  label-field="username"
                  value-field="id"
                  filterable
                  :filter-field="['username', 'emp_num', 'email']"
              ></Select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="抄送:">
              <Select
                  style="width: 95%"
                  v-model="formData.sender"
                  :api="getUserApi"
                  label-field="username"
                  value-field="username"
                  filterable
                  multiple
                  :filter-field="['username', 'emp_num', 'email']"
              ></Select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="时间范围:" required>
              <el-config-provider :locale="locale">
                <el-date-picker style="max-width:150px"
                                v-model="formData.start_time"
                                type="date"
                                placeholder="开始日期"
                                value-format="YYYY-MM-DD"
                                clearable
                />
                <span>~</span>

                <el-date-picker style="max-width:150px"
                                v-model="formData.deadline_time"
                                type="date"
                                placeholder="截止日期"
                                value-format="YYYY-MM-DD"
                                clearable
                />
              </el-config-provider>

            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="工作量:" prop="workload">
              <el-input-number v-model="formData.workload" :precision="1" :step="0.5" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-scrollbar style="height: 45vh">
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务内容:" prop="content">
                <el-input type="textarea" :rows="12" v-model="formData.content"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="挑战目标:">
                <el-input
                    type="textarea"
                    :rows="12"
                    v-model="formData.challenge"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="任务描述:">
            <el-input type="textarea" :rows="4" v-model="formData.description"></el-input>
          </el-form-item>
        </el-scrollbar>

      </el-form>
    </el-drawer>
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
                <span class="detail-label">创建时间</span>
                <el-input
                    :value="`${currentTask.create_time} `"
                    readonly
                    class="detail-input"
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
          <el-col :span="4">
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
          <el-col :span="4">
            <el-form-item label="任务类型">
              <el-select
                v-model="queryForm.category"
                placeholder="请选择任务类型"
                clearable
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
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
              <Select style="width: 95%;" v-model="queryForm.project" :api="getProjectList" label-field="name"
                      value-field="name" filterable  :filter-field="['name']"></Select>
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
            <el-button @click="exportExcel" style="margin-left:10px;">导出Excel</el-button>
            <el-radio-group v-model="exportType" style="margin-left:10px; border:1px solid ;border-radius:10px;padding:0px 5px;">
              <el-radio value="export">标准</el-radio>
              <el-radio value="export_test">测试</el-radio>
            </el-radio-group>
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
        :edit-config="{trigger:'dblclick',mode:'cell'}"
        :height="tableHeight"
      >
        <vxe-column type="seq" width="60" title="序号"></vxe-column>
        <vxe-column field="id" title="ID" width="100"></vxe-column>
        <vxe-column field="name" title="名称" min-width="150" show-overflow></vxe-column>
        <vxe-column field="category_name" title="任务类型" min-width="150" show-overflow></vxe-column>
        <vxe-column field="status" title="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ row.status_name }}
            </el-tag>
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
        <vxe-column field="receiver_name" title="执行人" width="120"></vxe-column>
        <vxe-column field="start_time" title="开始时间" sortable width="180" :edit-render="{}">
          <template #default="{row}">
            <el-text type="info">{{row.start_time}}</el-text>
          </template>
          <template #edit="{row}" v-if="loginUser.perm.schedule">

            <el-date-picker style="max-width:150px"
                            v-model="row.start_time"
                            type="date"
                            placeholder="开始日期"
                            value-format="YYYY-MM-DD"
                            clearable
                            @blur="changeDate(row,'start')"
            />
          </template>
        </vxe-column>
        <vxe-column field="deadline_time" title="截止时间" width="180" :edit-render="{}">
          <template #default="{row}">
            <el-text type="info">{{row.deadline_time}}</el-text>
          </template>
          <template #edit="{row}" v-if="loginUser.perm.schedule">
            <el-date-picker style="max-width:150px"
                            v-model="row.deadline_time"
                            type="date"
                            placeholder="截止时间"
                            value-format="YYYY-MM-DD"
                            clearable
                            @blur="changeDate(row,'end')"
            />
          </template>
        </vxe-column>
        <vxe-column field="workload" title="工作量(天)" width="180" v-if="loginUser.perm.schedule" :edit-render="{}">
          <template #default="{row}">
            <el-text type="warning">{{row.workload}}</el-text>
          </template>
          <template #edit="{row}">
            <el-input v-model="row.workload"  @change="changeWorkLoad(row)"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="project" title="项目" width="150" show-overflow></vxe-column>
        <vxe-column field="related_task" title="关联任务" width="150" show-overflow></vxe-column>
        <vxe-column field="creator_name" title="创建人" width="120"></vxe-column>
        
        <vxe-column title="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleDetail(row)" type="info">详情</el-button>
            <el-button  size="small" @click="handleEdit(row)" type="primary"  v-if="loginUser.perm.schedule">编辑</el-button>
            <el-button  size="small" @dblclick="handleDelete(row)" type="warning"  v-if="loginUser.perm.schedule">删除</el-button>
          </template>
        </vxe-column>
      </vxe-table>
      
      <vxe-pager
        perfect
        v-model:current-page="page.currentPage"
        :total="page.total"
        :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'FullJump', 'Total']"
        @page-change="handlePageChange"
      >
      </vxe-pager>
    </el-card>
  </div>
</template>

<script setup>
import {ElDrawer,ElForm,ElFormItem,ElConfigProvider,ElDatePicker,ElCol,ElRow,ElButton,ElInput,ElSelect,ElRadioGroup,ElRadio,ElTag,ElOption,ElProgress,ElText,ElMessage,ElInputNumber} from "element-plus";
import { ref, reactive, onMounted } from 'vue'
import Select from '@/components/selects/MutiSelect.vue'
import {
  getUserGroupApi,
  getUserApi,
  getProjectList,
  getTaskDataPaginatedApi,
  exportUrl,
  taskModifyApi,
  taskAddApi, taskDeleteApi
} from '@/api/data/data'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { TaskStatus, getProgressStatus } from '@/utils/public'
const locale = zhCn

import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)

// 查看详情
const showDetailPanel = ref(false);
const showEditDrawer = ref(false);

const currentTask = ref({});
// 提交form 表单功能
const formRef = ref();
const formData = reactive({
  id:null,
  name: null,
  content: null,
  challenge: null,
  creator: null,
  receiver: null,
  start_time: null,
  deadline_time: null,
  description: null,
  sender: null,
  workload: null,
  status: null,
  project: null,
});

const formRules = reactive({
  name: [
    {
      required: true,
      message: "请输入任务名",
    },
  ],
  receiver: [
    {
      required: true,
      message: "请输入执行者",
    },
  ],
  content: [
    {
      required: true,
      message: "请输入任务内容",
    },
  ],
  start_time: [
    {
      required: true,
      message: "请输入任务开始时间",
    },
  ],
  deadline_time: [
    {
      required: true,
      message: "请输入任务截止时间",
    },
  ],
  workload: [
    {
      required: true,
      message: "请输入任务工时",
    },
  ],
});

const onSubmit = async (formRef) => {
  //TODO 提交前验证！
  // 准备所有请求的Promise数组
  const isValid = await formRef.validate((valid, fields) => {
    if (!valid) return false;
    return true;
  });
  if (!isValid) return;
  const data = await taskModifyApi(formData.id, {...formData,sender: formData.sender ? formData.sender.join(",") : ''})
  if(data?.id){
    ElMessage.success(`任务修改成功！`)
  }else {
    ElMessage.error(`任务修改失败！`)
  }
  showEditDrawer.value = false
  handleQuery()
}

const onCopy = async (formRef) => {
  //TODO 提交前验证！
  // 准备所有请求的Promise数组
  const isValid = await formRef.validate((valid, fields) => {
    if (!valid) return false;
    return true;
  });
  if (!isValid) return;
  delete formData.id;
  const data = await taskAddApi({...formData,sender: formData.sender ? formData.sender.join(",") : '',status:TaskStatus.PEND,creator:loginUser.value.id})
  if(data?.id){
    ElMessage.success(`任务添加成功！`)
  }else {
    ElMessage.error(`任务添加失败！`)
  }
  showEditDrawer.value = false
  handleQuery()
}

const exportType = ref('export')
// 表格高度
const tableHeight = ref(500)

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
  category: loginUser.value.group_category,
  search_text: ''
})

// 分页数据
const page = reactive({
  currentPage: 1,
  pageSize: 100,
  total: 0
})

// 表格数据
const tableData = ref([])
const loading = ref(false)

const statusOptions = ref([
  { value: 'PEND', label: '待下发' },
  { value: 'PROGRESS', label: '进行中' },
  { value: 'FINISH', label: '已完成' }
])

const categoryOptions = ref([
  { id: 1, name: '测试' },
  { id: 2, name: '研发' },
  { id: 3, name: '未知' }
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
  
  const params = {
    group: queryForm.group? queryForm.group : "",  // 组内人员（数组）
    receiver: queryForm.receiver? queryForm.receiver : "",          // 执行人
    creator: queryForm.creator? queryForm.creator : "",                     // 创建人
    status: TaskStatus[queryForm.status] ? TaskStatus[queryForm.status] : "",             // 状态
    start_time: queryForm.timeRange.length == 2? queryForm.timeRange[0] : "",  // 时间范围开始
    deadline_time: queryForm.timeRange.length == 2? queryForm.timeRange[1] : "",    // 时间范围结束
    flag_time: queryForm.flag_time ? queryForm.flag_time : "", // 标定时间
    project: queryForm.project? queryForm.project : "",           // 项目
    category: queryForm.category? queryForm.category : "",       // 任务类型
    search_text: queryForm.search_text,             // 关键字
    page: page.currentPage  // 添加分页参数
  }

  const response = await getTaskDataPaginatedApi(params)
  tableData.value = response.results || []
  page.total = response.count || 0
  loading.value = false;
}

const exportExcel = () => {
  const params = {
    group: queryForm.group? queryForm.group : "",  // 组内人员（数组）
    receiver: queryForm.receiver? queryForm.receiver : "",          // 执行人
    creator: queryForm.creator? queryForm.creator : "",                     // 创建人
    status: TaskStatus[queryForm.status] ? TaskStatus[queryForm.status] : "",             // 状态
    start_time: queryForm.timeRange.length == 2? queryForm.timeRange[0] : "",  // 时间范围开始
    deadline_time: queryForm.timeRange.length == 2? queryForm.timeRange[1] : "",    // 时间范围结束
    flag_time: queryForm.flag_time ? queryForm.flag_time : "", // 标定时间
    project: queryForm.project? queryForm.project : "",           // 项目
    category: queryForm.category? queryForm.category : "",     // 任务类型
    search_text: queryForm.search_text             // 关键字
  }
  exportUrl(params,exportType.value)
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
    category: 1,
    search_text: ''
  })
}

// 分页变化
const handlePageChange = () => {
  handleQuery()
}

// 导出数据
const exportData = () => {
  // 实现导出逻辑

}


const handleDetail = (row) => {

  currentTask.value = row;
  showDetailPanel.value = true


}
const handleEdit = (row) => {
  formData.id = row.id
  formData.name = row.name
  formData.content = row.content
  formData.challenge = row.challenge
  formData.receiver = row.receiver
  formData.creator = row.creator
  formData.start_time = row.start_time
  formData.deadline_time = row.deadline_time
  formData.description = row.description
  formData.sender = row.sender?.split(",")
  formData.workload = row.workload
  formData.status = row.status
  formData.project = row.project

  showEditDrawer.value = true


}

const handleDelete = async (row) => {

  await taskDeleteApi(row.id)
  handleQuery()
  // if(data?.id){
  //   ElMessage.success(`任务修改成功！`)
  // }else {
  //   ElMessage.error(`任务修改失败！`)
  // }


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
