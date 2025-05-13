<template>
  <el-card style="width:100%;box-sizing: border-box;padding: 8px;background-color: rgb(243, 245, 247);" shadow="always">
    <div style="display: flex; width: 100%;">
      <!-- 四个统计卡片 -->
      <div v-for="stat in statsList" :key="stat.title" style="flex: 1; padding: 0 8px; min-width: 0;">
        <el-statistic :title="stat.title" :value="stat.value">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              {{ stat.title }}
              <el-tooltip :content="stat.tooltip" placement="top">
                <el-icon style="margin-left: 4px" :size="12">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
          <template v-if="stat.suffix" #suffix>{{ stat.suffix }}</template>
        </el-statistic>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: Object,
  filteredTasks: Array
})

const statsList = computed(() => [
  {
    title: '任务饱和度',
    value: `${props.stats.saturation}%`,
    tooltip: '任务饱和度 = (当前选中日期的所有工时 / 8 x 工作日天数) x 100%'
  },
  {
    title: '已完成任务数',
    value: props.stats.completed,
    suffix: `/${props.stats.totalTasks}`,
    tooltip: '已完成的任务数量 / 总任务数量'
  },
  {
    title: '总工作量',
    value: `${props.stats.total}h`,
    tooltip: '当前选中日期的总工时'
  },
  {
    title: '待完成工作量',
    value: `${props.stats.remaining}%`,
    tooltip: '当前选中日期待完成工作量'
  }
])
</script>