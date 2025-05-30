<template>
  <!-- 对话框区 -->
  <SelectUserDialog :visible="isShowSelectUserDialog" v-model="selectUsers" title="用户池选择"
    @update:modelValue="updateSelectUsers" @update:visible="updateVisible" @comfirm="SelectUserConfirm">
  </SelectUserDialog>
  <!-- 对话框区 END -->
  <div class="pool-card">
    <div class="user-pool-card-header">
      <div style="color:black;border-radius: 5px;">人员池</div>
      <div>
        <el-button @click="addUserPool" size="small">添加</el-button>
        <el-popconfirm title="确认清空用户池？" @confirm="scheduleStore.clearUserPool" placement="right">
          <template #reference>
            <el-button size="small">清空</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <div class="pool-list">
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
  console.log('=====', isConfirm, users)
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
.pool-card {
  background-color: white;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #e0dbdb;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-shrink: 0
}


.user-pool-card-header {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  /* padding-top: 10px; */
  border-bottom: 1px solid rgb(243, 233, 233);
}

.pool-list {
  flex-grow: 1;
  padding:0 5px;
  /* border:1px solid; */
  /* height: 14vh; */
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}



</style>