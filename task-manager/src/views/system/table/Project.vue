<template>
  <div>
    <div style="display: flex;justify-content: space-between;">
      <p>
      <vxe-input v-model="filterName" type="search" placeholder="试试全表搜索" clearable @change="searchEvent" style="width: 500px;margin-left:10px"></vxe-input>
    </p>
    <vxe-toolbar :tools="toolbarTools" @tool-click="dialogFormVisible = true" style="margin-right: 20px;"></vxe-toolbar>
    </div>

    <vxe-table ref=tableRef class="mylist-table" border height="500"
      :edit-config="{ mode: 'cell', trigger: 'dblclick', showStatus: true }" keep-source :data="list"
      @edit-closed="editClosedEvent">
      <vxe-column field="name" title="项目" min-width="600" ></vxe-column>
      <vxe-column field="owner" title="属主"  :edit-render="userEditRender" :formatter="ownerFormatter"></vxe-column>
      <vxe-column field="project_type" title="项目类型"  :edit-render="typeEditRender"></vxe-column>
      <vxe-column title="操作" width="200" :cell-render="btnGroupCellRender"></vxe-column>
    </vxe-table>
  </div>
  <el-dialog v-model="dialogFormVisible" title="项目增加" width="500">
    <el-form :model="form">
      <el-form-item label="项目名  :" >
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="属主 :">
        <Select style="width: 95%;" v-model="form.owner" :api="getUserApi" label-field="username"
        value-field="id" filterable  :filter-field="['username', 'emp_num', 'email']"></Select>
      </el-form-item>
      <el-form-item label="项目类型:">
        <el-select v-model="form.project_type" placeholder="请输入项目类型">
          <el-option label="项目" value="项目" />
          <el-option label="非项目" value="非项目" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handlerProject">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ElDialog,ElForm,ElButton,ElSelect,ElFormItem,ElInput,ElOption} from "element-plus";
import { onMounted, ref, reactive,watch } from 'vue'
import { useSystemStore } from '@/stores/system'
import  Select  from '@/components/selects/MutiSelect.vue'
import { getUserApi } from '@/api/data/data' 

import { VxeUI } from 'vxe-table'

const systemStore = useSystemStore()

import { storeToRefs } from 'pinia'

const { projectListRef, userListData } = storeToRefs(systemStore)

const tableRef = ref(null)
const filterName = ref('')
const list = ref([])
const dialogFormVisible = ref(false)

const form = reactive({
  name: '',
  owner: '',
  project_type:''
})


watch(projectListRef,(newVal)=>{
  filterName.value = ''
  list.value = newVal
})


const ownerFormatter = ({cellValue}) =>{
  const item = userListData.value.find(item=> item.id == cellValue) 
  return item.username
}
const handleSearch = () => {
  const filterVal = String(filterName.value).trim().toLowerCase()
  if (filterVal) {
    const filterRE = new RegExp(filterVal, 'gi')
    const searchProps = ['name']
    const rest = projectListRef.value.filter(item => searchProps.some(key => String(item[key]).toLowerCase().indexOf(filterVal) > -1))
    list.value = rest.map(row => {
      // 搜索为克隆数据，不会污染源数据
      const item = { ...row }
      searchProps.forEach(key => {
        item[key] = String(item[key]).replace(filterRE, match => match)
      })
      return item
    })
  } else {
    list.value = projectListRef.value
  }
}
// 节流函数,间隔500毫秒触发搜索
const searchEvent = function () {
  handleSearch()
}

const userEditRender = reactive({
  name: 'VxeSelect',
  props: {
    filterable: true,
  },
  optionProps: {
    label: 'username',
    value: 'id'
  },
  options: []
})
const typeEditRender = reactive({
  name: 'VxeSelect',
  options:[{label:'项目',value:'项目'},{label:'非项目',value:'非项目'}]
})

const editClosedEvent = ({ row, column }) => {

  const $table = tableRef.value
  if ($table) {
    const field = column.field
    const cellValue = row[field]
    // 判断单元格值是否被修改
    if ($table.isUpdateByRow(row, field)) {
      systemStore.modifyP(row.name, { [field]: cellValue }).then(() => {
        VxeUI.modal.message({
          content: `局部保存成功！ ${column.title} ==> ${cellValue}`,
          status: 'success'
        }).then(() => {
          // 局部更新单元格为已保存状态
          $table.reloadRow(row, null, field)
        })
      })
    }
  }
}

const btnGroupCellRender = reactive({
  name: 'VxeButtonGroup',
  props: {
    mode: 'text'
  },
  options: [
    { content: '删除', status: 'error', name: 'del' }
  ],
  events: {
    click(cellParams, params) {
      if (params.name === 'del') {
        systemStore.delProject(cellParams.row.name).then(() => {
          VxeUI.modal.message({
            content: `删除组:${cellParams.row.name}成功！`,
            status: 'success'
          })
        })
      } else {

      }

    }
  }
})

const toolbarTools = ref([
  { name: '新增', code: 'add', status: 'primary' },
])
const handlerProject = () =>{
    dialogFormVisible.value = false
    systemStore.addP(form).then(() => {
         form.name = ""
         form.owner = ""
         form.project_type = ""
          VxeUI.modal.message({
            content: `新增项目成功！`,
            status: 'success'
          })
        })
}

onMounted(async () => {
  list.value = projectListRef.value
  userEditRender.options = userListData
})

</script>

<style  scoped>
.vxe-toolbar{
    background-color: unset!important;;
  }
  
.mylist-table {
  ::v-deep(.keyword-highlight) {
    background-color: #FFFF00;
  }
}
</style>
