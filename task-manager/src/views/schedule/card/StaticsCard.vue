<template>
          <div
        style="height:18vh;width: 98%;border: 1px solid #eee;background-color: white;border-radius: 5px;padding: 5px;display: flex;flex-direction: row;justify-content: space-between;">
        <div style="width: 25%;height:15vh;border:1px solid #9e9fa0;background-color: white;">
          <div style="font-weight:600;font-size:18px;margin-top: 5px;margin-left: 15px;">当前用户</div>
          <div style="display:flex;justify-content: space-around;padding: 10px;">
            <div style="display:flex;flex-direction:column;justify-content: space-around;align-items: center;">
              <div>{{ curSelectUserInfo.username }}</div>
              <div style="font-size: 12px;">工作强度</div>
            </div>
            <div style="display:flex;flex-direction:column;justify-content: start;align-items: center;">
              <el-progress type="dashboard" :percentage="curSelectDateStat.per" :stroke-width="15" :width="70"
                striped-flow />
            </div>
          </div>

        </div>
        <div style="width: 30%;height:15vh;border:1px solid #9e9fa0;background-color: white;">
          <div style="font-weight:600;font-size:18px;margin-top: 5px;margin-left: 15px;">统计数据</div>
          <div style="display: flex;flex-direction: column;justify-content: space-around;height: 70%;margin-left: 15px;">
            <div>时间：{{ curSelectDateStat.startDate }}~{{ curSelectDateStat.endDate }}</div>
            <div>任务数：{{ curSelectDateStat.workNum }}</div>
            <div>任务工时：{{ curSelectDateStat.workloads }}H</div>
          </div>

        </div>
        <el-scrollbar style="width: 45%;height:15vh;border:1px solid #9e9fa0;background-color: white;">
          <template v-for="item in curUserTasksRef">
            <div style="display: flex;flex-direction: row;">
              <el-text truncated style="width: 20%;">{{ item.name }}</el-text>
              <div style="width: 80%;">
                <el-progress :stroke-width="20" :percentage="100 * item.workload / curUserTasksWorkloadsRef"
                  style="margin-top:5px;">
                  <span style="font-size:15px;">{{ `${item.workload}天(${100 * item.workload / curUserTasksWorkloadsRef |
                    0}%)` }}</span>
                </el-progress>
              </div>

            </div>

          </template>

        </el-scrollbar>
      </div>
</template>
<script setup>
import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'

const scheduleStore = useScheduleStore()
const { curReceivers, curReceiverIDs, curSelectUser, curSelectUserInfo, userPool, userPoolIds, curUserTasksRef, curUserTasksWorkloadsRef, curSelectDateStat, schduleTableData } = storeToRefs(scheduleStore)

</script>