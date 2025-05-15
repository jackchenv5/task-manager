<template>
  <div>
    <div style="display: flex;justify-content: space-between;">
      <p>
      <vxe-input v-model="filterName" type="search" placeholder="试试全表搜索" clearable @change="searchEvent" style="width: 500px;margin-left:10px"></vxe-input>
    </p>
    </div>

    <vxe-table ref=tableRef class="mylist-table" border max-height="100%" height="500"
      :edit-config="{ mode: 'cell', trigger: 'dblclick', showStatus: true }" keep-source :data="list"
      @edit-closed="editClosedEvent">
      <vxe-column field="id" title="ID" min-width="60"></vxe-column>
      <vxe-column field="username" title="用户名" width="300" ></vxe-column>
      <vxe-column field="emp_num" title="工号" min-width="300"></vxe-column>
      <vxe-column field="role" title="角色" min-width="400" :edit-render="roleEditRender" :formatter="formatterRole"></vxe-column>
    </vxe-table>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive,watch } from 'vue'
import { useSystemStore } from '@/stores/system'

import { VxeUI } from 'vxe-table'

const systemStore = useSystemStore()

import { storeToRefs } from 'pinia'

const { userListData,roleListRef } = storeToRefs(systemStore)

const tableRef = ref(null)
const filterName = ref('')
const list = ref([])

watch(userListData,(newVal)=>{
  filterName.value = ''
  list.value = newVal
})


const formatterRole = ({ cellValue }) => {
  const item = roleListRef.value.find(item => item.id === cellValue)
  return item ? item.name : cellValue
}


const handleSearch = () => {
  const filterVal = String(filterName.value).trim().toLowerCase()
  if (filterVal) {
    const filterRE = new RegExp(filterVal, 'gi')
    const searchProps = ['id', 'username', 'emp_num']
    const rest = userListData.value.filter(item => searchProps.some(key => String(item[key]).toLowerCase().indexOf(filterVal) > -1))
    list.value = rest.map(row => {
      // 搜索为克隆数据，不会污染源数据
      const item = { ...row }
      searchProps.forEach(key => {
        item[key] = String(item[key]).replace(filterRE, match => match)
      })
      return item
    })
  } else {
    list.value = userListData.value
  }
}
// 节流函数,间隔500毫秒触发搜索
const searchEvent = function () {
  handleSearch()
}

const roleEditRender = reactive({
  name: 'VxeSelect',
  props: {
    filterable: true,
  },
  optionProps: {
    label: 'name',
    value: 'id'
  },
  options: roleListRef.value
})

const editClosedEvent = ({ row, column }) => {
  console.log(row, column)
  const $table = tableRef.value
  if ($table) {
    const field = column.field
    const cellValue = row[field]
    // 判断单元格值是否被修改
    if ($table.isUpdateByRow(row, field)) {
      systemStore.modifyUser(row.id, { [field]: cellValue }).then(() => {
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

onMounted(async () => {
  list.value = userListData.value
})

</script>

<style  scoped>
.mylist-table {
  ::v-deep(.keyword-highlight) {
    background-color: #FFFF00;
  }
}
</style>
