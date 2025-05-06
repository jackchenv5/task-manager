
import { log } from 'vxe-pc-ui';
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
            <el-col :span="10">
                <el-button @click="addUserPool">添加</el-button>
                <el-popconfirm title="确认清空用户池？" @confirm="scheduleStore.clearUserPool" placement="right">
                    <template #reference>
                        <el-button>清空</el-button>
                    </template>
                </el-popconfirm>

            </el-col>
            <el-col :span="10">
                发送到：
                <el-switch v-model="value" class="ml-2" inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="执行人员"
                    inactive-text="抄送人员" />
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
const { curReceivers, curReceiverIDs, curSelectUser, curSelectUserInfo, userPool, userPoolIds, curUserTasksRef, curUserTasksWorkloadsRef, curSelectDateStat, schduleTableData } = storeToRefs(scheduleStore)

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