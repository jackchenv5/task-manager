<template>
  <el-card style="width: 100%; height: 20vh">
    <div style="display: flex;width: 100%; justify-content: space-around;align-items: center;">
        <div class="group-summary" style="height:15vh;width: 30%;border: 1px solid rgb(93, 168, 230);border-radius: 5px;padding: 5px;">
          <p>当前组：
            <el-select
              v-model="selectedGroupId"
              filterable
              clearable
              placeholder="请选择"
              size="small"
              style="width: 120px"
            >
              <el-option
                v-for="item in groups"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </p>
          <p style="margin:0">人员：<span>{{ groupMembers }}人</span></p>
          <p style="margin:0">总工作量：<span>{{ groupWorkDays }}天</span></p>
          <p style="margin:0">饱和度：<span>{{ groupSaturation }}%</span></p>
        </div>
        <div style="height:15vh;width: 65%;border: 1px solid rgb(93, 168, 230);border-radius: 5px;padding: 5px;">
          <div style="text-align:center">
              <el-radio-group 
                v-model="selectedStatus"
                size="small" 
                style="flex-grow: 1; justify-content: center;" 
              >
                <el-radio-button label="所有任务" value="all" />
                <el-radio-button label="待下发" value="pending" />
                <el-radio-button label="进行中" value="running" />
                <el-radio-button label="已完成" value="done" />
              </el-radio-group>
            </div>
            <div style="text-align:right;margin:10px">
              <el-button class="export-excel-el-button" type="warning" :icon="Promotion" @click="exportTasks">导出Excel</el-button>
            </div>
        </div>
        
      </div>
  </el-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGroupStore } from '@/stores/group'
import { getWorkdaysInMonth } from '@/utils/public'
import { ElMessage } from 'element-plus'
import { Promotion } from '@element-plus/icons-vue'

const myGroupStore = useGroupStore()

const emit = defineEmits(['update:selectedGroupId', 'update:selectedStatus', 'update:groupSaturation'])

// const emit = defineEmits(['update:selectedGroup'])
const props = defineProps({
  groups: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedGroupId: {
    type: Number,
    required: true,
    default: () => -1
  },
  selectedStatus: {
    type: String,
    required: true,
    default: () => ""
  },
  selectedMonth: {
    type: Array,
    required: true,
    default: () => [new Date().getFullYear(), new Date().getMonth() + 1]
  }
})
const selectedGroupId = computed({
  get() {
    return props.selectedGroupId
  },
  set(value) {
    emit('update:selectedGroupId', value)
  }
})

const selectedStatus = computed({
  get() {
    return props.selectedStatus
  },
  set(value) {
    emit('update:selectedStatus', value)
  }
})

const groups = computed(() => props.groups)

const selectedMonth = computed(() => props.selectedMonth)

const groupMembers = computed(() => {
  const group = groups.value.find(g => g.id === selectedGroupId.value)
  return group ? group.users.length : 0
})

const groupWorkDays = computed(() => {
  const totalDays = myGroupStore.allTask.reduce((sum, task) => sum + (task.workload), 0)
  return totalDays.toFixed(2);
})

// 饱和度计算规则： (总工作量 / (所有人员 * 当月工作日)) * 100
const groupSaturation = computed(() => {
  const saturation = (groupWorkDays.value / (groupMembers.value * getWorkdaysInMonth(selectedMonth))) * 100;
  const result = saturation.toFixed(2);
  emit('update:groupSaturation', result); // 主动触发事件
  return result;
});

const exportTasks = () => {
  ElMessage.warning('暂未实现')
}

</script>