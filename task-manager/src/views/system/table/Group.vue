<template>
  <div>
    <div style="display: flex;justify-content: space-between;">
      <p>
      <vxe-input v-model="filterName" type="search" placeholder="试试全表搜索" clearable @change="searchEvent" style="width: 500px;margin-left:10px"></vxe-input>
    </p>
    <vxe-toolbar :tools="toolbarTools" @tool-click="toolClickEvent" style="margin-right: 20px;"></vxe-toolbar>
    </div>

    <vxe-table ref=tableRef class="mylist-table" border
      :edit-config="{ mode: 'cell', trigger: 'dblclick', showStatus: true }" keep-source :data="list"
      @edit-closed="editClosedEvent">
      <vxe-column field="id" title="ID" min-width="60"></vxe-column>
      <vxe-column field="name" title="组名" width="300" :edit-render="{ name: 'VxeInput' }"></vxe-column>
      <vxe-column field="category" title="任务类型" width="300" :edit-render="categoryEditRender"></vxe-column>
      <vxe-column field="users" title="组员" min-width="600" :edit-render="userEditRender"></vxe-column>
      <vxe-column field="group_leader" title="组长" width="200" :edit-render="groupLeaderEditRender"></vxe-column>
      <vxe-column field="depart_leader" title="处长" width="200" :edit-render="departLeaderRender"> </vxe-column>
      <vxe-column title="操作" width="200" :cell-render="btnGroupCellRender"></vxe-column>
    </vxe-table>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive,watch } from 'vue'
import { useSystemStore } from '@/stores/system'

import { VxeUI } from 'vxe-table'

const systemStore = useSystemStore()

import { storeToRefs } from 'pinia'

const { groupTableDataRef, userListData } = storeToRefs(systemStore)

const tableRef = ref(null)
const filterName = ref('')
const list = ref([])

watch(groupTableDataRef,(newVal)=>{
  filterName.value = ''
  list.value = newVal
})



const handleSearch = () => {
  const filterVal = String(filterName.value).trim().toLowerCase()
  if (filterVal) {
    const filterRE = new RegExp(filterVal, 'gi')
    const searchProps = ['id', 'name', 'users', 'group_leader', 'depart_leader']
    const rest = groupTableDataRef.value.filter(item => searchProps.some(key => String(item[key]).toLowerCase().indexOf(filterVal) > -1))
    list.value = rest.map(row => {
      // 搜索为克隆数据，不会污染源数据
      const item = { ...row }
      searchProps.forEach(key => {
        item[key] = String(item[key]).replace(filterRE, match => match)
      })
      return item
    })
  } else {
    list.value = groupTableDataRef.value
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
    multiple: true
  },
  optionProps: {
    label: 'username',
    value: 'username'
  },
  options: []
})

const groupLeaderEditRender = reactive({
  name: 'VxeSelect',
  props: {
    filterable: true,
  },
  optionProps: {
    label: 'username',
    value: 'username'
  },
  options: []
})

const departLeaderRender = reactive({
  name: 'VxeSelect',
  props: {
    filterable: true,
  },
  optionProps: {
    label: 'username',
    value: 'username'
  },
  options: []
})

const categoryEditRender = reactive({
  name: 'VxeSelect',
  optionProps: {
    label: 'label',
    value: 'value'
  },
  options: [
    { label: '测试', value: '1' },
    { label: '开发', value: '2' }
  ]
})

const editClosedEvent = ({ row, column }) => {
  const $table = tableRef.value
  if ($table) {
    let field = column.field
    const cellValue = row[field]
    // 判断单元格值是否被修改
    let retValue = cellValue
    if ($table.isUpdateByRow(row, field)) {

      if(field === 'users'){
        const ids = cellValue.map(x=>{
          const item = userListData.value.find(y=>y.username===x)
          return item.id
        })
        retValue = ids
        field = 'user_list'
      }

      systemStore.modifyGroup(row.id, { [field]: retValue }).then(() => {
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
    { content: '复制', status: 'warning', name: 'copy' },
    { content: '删除', status: 'error', name: 'del' }
  ],
  events: {
    click(cellParams, params) {

      const { id, ...postData } = cellParams.row; // 提取 id 并保留其他属性
      if (params.name === 'copy') {
        systemStore.addGroup({
          ...postData,
          name: `复制组-${postData.name}`,
          user_list: postData.users.reduce((acc, name) => {
            const user = userListData.value.find(u => u.username === name);
            if (user) acc.push(user.id);
            return acc;
          }, [])

        }).then((ret) => {
          if(ret){
            VxeUI.modal.message({
            content: `复制组:${postData.name}成功,请直接编辑新增的组！`,
            status: 'success'
          })
          }else{
            VxeUI.modal.message({
            content: `复制组:${postData.name}失败！`,
            status: 'error'
          })
          }

        })
      } else if (params.name === 'del') {
        systemStore.deleteGroup(id).then(() => {
          VxeUI.modal.message({
            content: `删除组:${postData.name}成功！`,
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
const toolClickEvent = ({ code }) => {
  if(code === 'add'){
    systemStore.addGroup({name:'新增组-'}).then(() => {
          VxeUI.modal.message({
            content: `新增组成功,请直接编辑新增的组！`,
            status: 'success'
          })
        })
  }

}

onMounted(async () => {
  list.value = groupTableDataRef.value
  groupLeaderEditRender.options = userListData
  userEditRender.options = userListData
  departLeaderRender.options = userListData
})

</script>``

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
