<template>
  <!-- 对话框区 -->
  <SelectUserDialog
    :visible="isShowSelectUserDialog"
    v-model="selectUsers"
    title="选择执行人"
    @update:modelValue="updateSelectUsers"
    @update:visible="updateVisible"
    @comfirm="SelectUserConfirm"
  >
  </SelectUserDialog>
  <!-- 对话框区 END -->

  <div class="receiver-card">
    <div class="card-label">执行人员：</div>
    <div class="user-list">
      <el-scrollbar >
      <div class="rec-user-scrollbar">
        <el-tag
          v-for="tag in curReceivers"
          :key="tag.id"
          closable
          :type="tag.id === curSelectUser ? 'success' : 'warning'"
          style="cursor: pointer;margin-left: 1vw;"
          :disable-transitions="false"
          @close="handleDeleteReceiverUser(tag.id)"
          @click="handleSelectReceiverUser(tag.id)"
        >
          {{ tag.username }}
        </el-tag>
      </div>
      </el-scrollbar>
    </div>
    <div class="button-bar">
      <el-button @click="addReceiver" size="small">添加</el-button>
      <el-popconfirm
        title="确认清空执行者？"
        @confirm="scheduleStore.clearReceivers"
        placement="right"
      >
        <template #reference>
          <el-button size="small">清空</el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script setup>
// 添加執行者
import {ElPopconfirm,ElButton,ElTag} from "element-plus";
import { ref } from "vue";
import { useScheduleStore } from "@/stores/schedule";
import { getCurMonthStartAndEndStr } from "@/utils/public";

import SelectUserDialog from "@/components/dialog/SelectUser.vue";

const scheduleStore = useScheduleStore();
import { storeToRefs } from "pinia";

const {
  curReceivers,
  curSelectUser,
} = storeToRefs(scheduleStore);

const isShowSelectUserDialog = ref(false);

const updateVisible = (newValue) => {
  isShowSelectUserDialog.value = newValue;
};

const addReceiver = () => {
  isShowSelectUserDialog.value = true;
};

const selectUsers = ref();

const updateSelectUsers = (users) => {
  selectUsers.value = users;
};

// 执行人员 逻辑
// =======================================================================================================
const handleSelectReceiverUser = (id) => {
  curSelectUser.value = id;
  const [starDateStr, endDateStr] = getCurMonthStartAndEndStr(new Date());
  scheduleStore.getCurUserTasks(id, starDateStr, endDateStr);
};

const handleDeleteReceiverUser = (id) => {
  scheduleStore.deleteReceiverUser(id);
};

const SelectUserConfirm = (isConfirm, users) => {
  if (!isConfirm) return;
  if (!users) return;
  // 界面选择的用户，默认都加入用户池，如何是执行者对话框，则加入执行者池
  users.forEach((x) => {
    scheduleStore.addToReceivers(x);
    scheduleStore.addToUserPool(x);
  });
};
// =======================================================================================================
// 执行人员池 逻辑 END
</script>
<style scoped>
.receiver-card {
  flex-shrink: 0;
  white-space: nowrap;
  margin-top: 0.5vh;
  box-sizing: border-box;
  height: 7vh;
  width: 48.2vw;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-label {
  font-weight: bold;
}
.user-list {
  box-sizing: border-box;
 flex-grow: 1;
 min-width: 0px;
  border-radius: 1.2rem;
  display: flex;
  padding: 1vh 1vw;
}
.rec-user-scrollbar {
    padding: 0.8rem 0;
}
</style>
