<template>
  <div style="display: flex;justify-content: space-around; height: 90vh;width: 100vw;">
    <div class="left">
      <GroupHeader></GroupHeader>
      <Weeks></Weeks>
    </div>
    
    <div class="right">
      <UserHeader></UserHeader>
      <div class="right-content">
        <Tools></Tools>
        <TaskTable></TaskTable>
      </div>
      

    </div>
  </div>
</template>

<script setup>
import GroupHeader from './leftHeader/GroupHeader.vue';
import UserHeader from './rightHeader/UserHeader.vue';
import Weeks from './leftContent/Weeks.vue';
import Tools from './rightMid/Tools.vue';
import TaskTable from './rightContent/TaskTable.vue';

import { onMounted, ref, watch } from 'vue';

import {useGroupStore  } from '@/stores/group.js'
import { storeToRefs } from 'pinia';

const groupStore = useGroupStore();

// const {allGroup, selectGroup, groupMembers} = storeToRefs(groupStore);

onMounted(() => {
  groupStore.init()
});

</script>

<style scoped>
.right-content {
  padding: 5px 10px;
}
.el-link {
  font-size: 18px;
  margin-right: 20px;
  padding: 10px;
}


.active {
  color: white;
  background: #5d6d96;
}

.left,
.right {
  width: 50vw;
  display: inline-block;
  flex-direction: column;
  /* flex: 1; */
  align-items: start;
  /* border-left: 2px solid ; */
  /* border: 1px solid #ccc; */
}

:deep(.el-drawer__header) {
  margin-bottom: 0 !important;
}
</style>