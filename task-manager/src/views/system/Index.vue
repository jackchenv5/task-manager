<template>
  <div style="display: flex">
    <Sider style="width: 15vw; height: 93vh" v-model="SiderOption"></Sider>
    <div style="width: 85vw; height: 93vh">
      <GroupTable v-if="SelectMap.group === SiderOption"></GroupTable>
      <UserTable v-if="SelectMap.user === SiderOption"></UserTable>
      <ProjectTable v-if="SelectMap.project === SiderOption"></ProjectTable>
    </div>
  </div>
</template>
<script setup>
import Sider from "./sider/Sider.vue";
import GroupTable from "./table/Group.vue";
import UserTable from './table/User.vue'
import ProjectTable from "./table/Project.vue";
import { ref, watch,onMounted } from "vue";

import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

const SelectMap = {
  group: '1',
  user: '2',
  project: '3',
};
const SiderOption = ref("1");
watch(SiderOption, (newVal) => {
  SiderOption.value = newVal;
});

onMounted(async () => {
  systemStore.updateGroupTableData({})
  systemStore.updateUserData()
  systemStore.updateRoleList()
  systemStore.updateProjectList()
  
})
</script>
