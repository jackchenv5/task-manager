<template>
      <div class="header">
        <div class="group-info">
          <el-avatar :size="50" fit="full" style="font-size: 1.2rem;background-color: rgb(24, 43, 104);">{{ selectGroup?.name[0] }}</el-avatar>
          <div style="display: flex;flex-direction:column;height: 6vh;justify-content: space-around">
            <el-dropdown placement="bottom-end" @command="handleCommand">
              <h1 style="font-size: 1.125rem;font-weight: 500;color: black;"> {{ selectGroup?.name }}</h1>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="item in allGroup" :command="item.id">{{ item.name }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <div style="color:#00000073">小组成员：{{selectGroup?.users?.length}}人</div>
          </div>

        </div>
        <div style="display:flex;width: 30vw;justify-content: space-around;">
          <div class="group-info-item">
            <div class="group-info-item-title">工作量</div>
            <div class="group-info-item-content">{{ groupStat.total }} 天</div>
          </div>
          <div class="group-info-item">
            <div class="group-info-item-title">饱和度</div>
            <div class="group-info-item-content">{{groupWorkloadSaturationRef}}%</div>
          </div>
          <div class="group-info-item">
            <div class="group-info-item-title">项目</div>
            <div class="group-info-item-content">{{  groupStat.projects.length }}个</div>
          </div>
          <div class="group-info-item">
            <div class="group-info-item-title">待下发</div>
            <div class="group-info-item-content">{{groupStat.pendCount}}/{{ groupStat.allCount }}</div>
          </div>
        </div>
      </div>

</template>


<script setup>
import {useGroupStore  } from '@/stores/group.js'
import {  storeToRefs } from 'pinia'
const groupStore = useGroupStore();
const {allGroup, selectGroup,selectGroupID,groupStat,groupWorkloadSaturationRef} = storeToRefs(groupStore);

const handleCommand = (command) => {
  groupStore.updateGroupID(command)
}

</script>


<style scoped>

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #fafcff;
  height: 10vh;
  background-color: white;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}


.group-info {
  width: 12vw;
  display: flex;
  height: 5vh;
  align-items: center;
  justify-content: space-around;
}

.group-info-item{
  display: flex;
  flex-direction: column;
  height: 5vh;
  justify-content: space-between;
  align-items: center;
}
.group-info-item-title{ 
  font-size: 0.8rem;
  color: #00000073;
}
.group-info-item-content{ 
  font-size: 1.2rem;
  color: black;
}
</style>