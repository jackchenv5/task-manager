<template>
          <div
        style="height:18vh;width: 98%;border: 1px solid #eee;background-color: white;border-radius: 5px;padding: 5px;display: flex;flex-direction: row;justify-content: space-between;">
        <div style="width: 25%;height:15vh;border:1px solid #9e9fa0;background-color: white;">
          <div style="font-weight:600;font-size:18px;margin-top: 5px;margin-left: 15px;">完成度</div>
          <div style="display:flex;justify-content: space-around;padding: 10px;">
            <div style="display:flex;flex-direction:column;justify-content: space-around;align-items: center;">
              <div style="font-size: 12px;">80H/100H</div>
            </div>
            <div style="display:flex;flex-direction:column;justify-content: start;align-items: center;">
              <el-progress type="dashboard" :percentage="80" :stroke-width="15" :width="70"
                striped-flow />
            </div>
          </div>

        </div>
        <div style="width: 30%;height:15vh;border:1px solid #9e9fa0;background-color: white;">
          <div style="font-weight:600;font-size:18px;margin-top: 5px;margin-left: 15px;">工作强度</div>
          <div style="display:flex;justify-content: space-around;padding: 10px;">
            <div style="display:flex;flex-direction:column;justify-content: space-around;align-items: center;">
              <div>50H/800H</div>
            </div>
            <div style="display:flex;flex-direction:column;justify-content: start;align-items: center;">
              <el-progress type="dashboard" :percentage="80" :stroke-width="15" :width="70"
                striped-flow />
            </div>
          </div>
        </div>
        <el-scrollbar style="width: 45%;height:15vh;border:1px solid #9e9fa0;background-color: white;">
          <div style="font-weight:600;font-size:18px;margin-top: 5px;margin-left: 15px;">本项目统计数据</div>
          <div style="display: flex;flex-direction: column;justify-content: space-around;height: 70%;margin-left: 15px;">
            <div>项目时间：{{ curSelectDateStat.startDate }}~{{ curSelectDateStat.endDate }}</div>
            <div>总参与人员数：{{ curSelectDateStat.workNum }}</div>
            <div>总任务工时：{{ curSelectDateStat.workloads.toFixed(1) }}H</div>
          </div>


        </el-scrollbar>
      </div>
</template>
<script setup>
import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'

const scheduleStore = useScheduleStore()
const { curReceivers, curReceiverIDs, curSelectUser, curSelectUserInfo, userPool, userPoolIds, curUserTasksRef, curUserTasksWorkloadsRef, curSelectDateStat, schduleTableData } = storeToRefs(scheduleStore)

</script>