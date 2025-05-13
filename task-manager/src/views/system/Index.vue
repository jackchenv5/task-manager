<template>
  <div style="display: flex">
    <Sider style="width: 15vw; height: 93vh" v-model="SiderOption"></Sider>
    <div style="width: 85vw; height: 93vh">
      <GroupTable v-if="SelectMap.group === SiderOption"></GroupTable>
      <UserTable v-if="SelectMap.user === SiderOption"></UserTable>
      <RoleTable v-if="SelectMap.role === SiderOption"></RoleTable>
    </div>
  </div>
</template>
<script setup>
import Sider from "./sider/Sider.vue";
import GroupTable from "./table/Group.vue";
import UserTable from './table/User.vue'
import RoleTable from './table/Role.vue'
import { ref, watch } from "vue";

const SelectMap = {
  group: '1',
  user: '2',
  role: '3',
};
const SiderOption = ref("1");
watch(SiderOption, (newVal) => {
  SiderOption.value = newVal;
});
</script>
