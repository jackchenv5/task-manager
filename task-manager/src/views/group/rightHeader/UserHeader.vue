<template>
      <div class="header">
        <div class="group-info">
          <el-avatar :size="50" fit="full" style="font-size: 1.2rem;background-color: rgb(16, 136, 116);" shape="square">{{ curSelectUserName[0] }}</el-avatar>
          <div style="display: flex;flex-direction:column;justify-content: space-around">
            <div style="font-size: 1.125rem;font-weight: 500;color: black;"> {{ curSelectUserName || "所有编排人员" }}</div>
            <div style="color:#00000073">当前选择： {{ selectWeek.label || '月' }}</div>
          </div>

        </div>
        <div style="display:flex;width: 30vw;justify-content: space-around;">
          <div class="group-info-item">
            <div class="group-info-item-title">已完成/工作量(本月)</div>
            <div class="group-info-item-content">{{curSelectUserStat.completed.toFixed(1)}}/{{ curSelectUserStat?.total.toFixed(1) }}</div>
          </div>
          <div class="group-info-item">
            <div class="group-info-item-title">饱和度/修正值（%）</div>
            <div class="group-info-item-content">{{ curSelectUserWorkloadSaturationRef }}/{{ curSelectUserWorkloadSaturationFixRef }}</div>
          </div>
          <div class="group-info-item">
            <div class="group-info-item-title">项目</div>
            <div class="group-info-item-content">{{curSelectUserStat.projects?.length}}个</div>
          </div>
          <div class="group-info-item">
            <div class="group-info-item-title">待办(本月)</div>
            <div class="group-info-item-content">{{curSelectUserStat?.pendCount}}/{{ curSelectUserStat?.allCount }}</div>
          </div>
        </div>
      </div>

</template>


<script setup>
import {ElAvatar} from 'element-plus'
import {useGroupStore  } from '@/stores/group.js'
import {  storeToRefs } from 'pinia'
const groupStore = useGroupStore();
const {selectWeek,curSelectUserStat,curSelectUserName,curSelectUserWorkloadSaturationRef,curSelectUserWorkloadSaturationFixRef} = storeToRefs(groupStore);
</script>


<style scoped>

.header {
  border:  1px solid rgb(144 156 181);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10vh;
  background-color: white;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}


.group-info {
  width: 15vw;
  display: flex;
  gap:10px;
  align-items: center;
  justify-content: center;
}

.group-info-item{
  display: flex;
  flex-direction: column;
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