
<template>
      <!-- 对话框区 -->
  <SelectUserDialog :visible="isShowSelectUserDialog" v-model="selectUsers" title="用户池选择"
    @update:modelValue="updateSelectUsers" @update:visible="updateVisible" @comfirm="SelectUserConfirm">
  </SelectUserDialog>
  <!-- 对话框区 END -->
    <div style="height: 4vh;">
        <el-row>
            <el-col :span="4">
                <div style="margin-top:5px;color:white;background-color: black;border-radius: 5px;">人员池</div>
            </el-col>
            <el-col :span="8" :offset="12">
                <el-button @click="addUserPool"  size="small">添加</el-button>
                <el-popconfirm title="确认清空用户池？" @confirm="scheduleStore.clearUserPool" placement="right">
                    <template #reference>
                        <el-button  size="small">清空</el-button>
                    </template>
                </el-popconfirm>

            </el-col>
        </el-row>
        <div style="height: 14vh;display: flex;justify-content: start;flex-wrap: wrap;align-items: center;gap: 6px;">
            <el-tag v-for="tag in userPool" :key="tag.id" closable
                :type="tag.id === curSelectUser ? 'success' : (curReceiverIDs.includes(tag.id) ? 'warning' : 'primary')"
                style="cursor: pointer;" :disable-transitions="false" @close="handleDeleteUser(tag.id)"
                @click="handleSelectUser(tag.id)">
                {{ tag.username }}
            </el-tag>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import SelectUserDialog from '@/components/dialog/SelectUser.vue'
import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'

const scheduleStore = useScheduleStore()
const { curReceivers, curReceiverIDs, curSelectUser, userPool, userPoolIds } = storeToRefs(scheduleStore)

//人员池逻辑
//===================================================================================================

const userDialogTitle = ref()
// 添加人员池
const isShowSelectUserDialog = ref(false)

const addUserPool = () => {
  isShowSelectUserDialog.value = true
}

const updateVisible = (newValue) => {
  isShowSelectUserDialog.value = newValue
}

const SelectUserConfirm = (isConfirm, users) => {
console.log('=====',isConfirm,users)
if (!isConfirm) return
if (!users) return
// 界面选择的用户，默认都加入用户池，如何是执行者对话框，则加入执行者池
users.forEach(x => {
  scheduleStore.addToUserPool(x)
})
}

const handleDeleteUser = (id) => {
  scheduleStore.deleteUserofPool(id)
}

// 选中人员
const handleSelectUser = (id) => {
  const idPoolIndex = userPoolIds.value.indexOf(id)
  const idReceiverIndex = curReceiverIDs.value.indexOf(id)
  if (idReceiverIndex === -1) {
    scheduleStore.addToReceivers(userPool.value[idPoolIndex])
  }
}

</script>

<style scoped>
.flat-tag {
  border: none !important;
  background: #F2F2F7 !important;
  color: rgba(0,0,0,0.8) !important;
  border-radius: 6px !important;
  font-size: 13px !important;
  
  &.active {
    background: rgba(52,199,89,0.15) !important;
    color: #34C759 !important;
  }
  
  &.selected {
    background: rgba(255,204,0,0.15) !important;
    color: #FFCC00 !important;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  }
}

</style>