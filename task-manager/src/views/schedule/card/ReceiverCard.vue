<template>
    <!-- 对话框区 -->
    <SelectUserDialog :visible="isShowSelectUserDialog" v-model="selectUsers" title="选择执行人"
        @update:modelValue="updateSelectUsers" @update:visible="updateVisible" @comfirm="SelectUserConfirm">
    </SelectUserDialog>
    <!-- 对话框区 END -->

    <div
        style="height:5vh;width:100%;background-color: white;border: 1px solid #eee;margin: 4px 0;border-radius: 5px;padding: 5px;display: flex;justify-content: start;">
        <div
            style="background-color: rgb(31, 28, 28);border: 1px solid #eee;border-radius: 5px;padding: 5px;color: white;width: 5vw;">
            执行人员：</div>
        <el-scrollbar style="width: 35vw;">
            <div
                style="display: flex;width:fit-content;border: 1px solid rgb(14, 43, 66);border-radius: 5px;padding: 5px 0px;margin-left: 8px;">

                <el-tag v-for="tag in curReceivers" :key="tag.id" closable
                    :type="tag.id === curSelectUser ? 'success' : 'warning'" style="cursor: pointer;"
                    :disable-transitions="false" @close="handleDeleteReceiverUser(tag.id)"
                    @click="handleSelectReceiverUser(tag.id)">
                    {{ tag.username }}
                </el-tag>
            </div>
        </el-scrollbar>
        <el-button @click="addReceiver">添加</el-button>
        <el-popconfirm title="确认清空执行者？" @confirm="scheduleStore.clearReceivers" placement="right">
            <template #reference>
                <el-button>清空</el-button>
            </template>
        </el-popconfirm>
    </div>
</template>

<script setup>
// 添加執行者
import { ref } from 'vue'
import { useScheduleStore } from '@/stores/schedule'
import { getCurMonthStartAndEndStr} from '@/utils/public'

import SelectUserDialog from '@/components/dialog/SelectUser.vue'

const scheduleStore = useScheduleStore()
import { storeToRefs } from 'pinia'

const { curReceivers, curReceiverIDs, curSelectUser, curSelectUserInfo, userPool, userPoolIds, curUserTasksRef, curUserTasksWorkloadsRef, curSelectDateStat, schduleTableData } = storeToRefs(scheduleStore)

const isShowSelectUserDialog = ref(false)

const updateVisible = (newValue) => {
    isShowSelectUserDialog.value = newValue
}

const addReceiver = () => {
    isShowSelectUserDialog.value = true
}

const selectUsers = ref()

const updateSelectUsers = (users) => {
    selectUsers.value = users
}


// 执行人员 逻辑
// =======================================================================================================
const handleSelectReceiverUser = (id) => {
    curSelectUser.value = id
    const [starDateStr, endDateStr] = getCurMonthStartAndEndStr(new Date())
    scheduleStore.getCurUserTasks(id, starDateStr, endDateStr)
}

const handleDeleteReceiverUser = (id) => {
    scheduleStore.deleteReceiverUser(id)
}

const SelectUserConfirm = (isConfirm, users) => {
    if (!isConfirm) return
    if (!users) return
    // 界面选择的用户，默认都加入用户池，如何是执行者对话框，则加入执行者池
    users.forEach(x => {
        scheduleStore.addToReceivers(x)
        scheduleStore.addToUserPool(x)
    })
}
// =======================================================================================================
// 执行人员池 逻辑 END
</script>