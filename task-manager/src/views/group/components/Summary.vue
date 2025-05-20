<template>
  <el-card style="width:100%; box-sizing: border-box; padding: 8px; background-color: rgb(243, 245, 247);" shadow="always">
    <div class="task-summary" style="display: flex; width: 100%;">
      <div v-for="(stat, index) in statItems" :key="index" style="flex: 1; padding: 0 8px; min-width: 0;">
        <el-statistic :value="stat.value" :precision="stat.needDecimal ? 2 : 0">
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
import { computed, watch } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'

const props = defineProps({
  stats: {
    type: Object,
    required: true
  }
})

// 使用计算属性确保响应式更新
const statItems = computed(() => {
  return [{
    title: '任务饱和度',
    value: props.stats.saturation,
    suffix: '%',
    needDecimal: true,
    tooltip: '任务饱和度 = (总工作量 / 当前选中人员任务的总工作日) × 100%'
  },
  {
    title: '已完成任务',
    value: props.stats.completed,
    suffix: `/${props.stats.totalTasks}`,
    suffix: "/5",
    needDecimal: false,
    tooltip: '已完成任务数量'
  },
  {
    title: '总工作量',
    value: props.stats.total,
    suffix: '小时',
    needDecimal: true,
    tooltip: '所有任务总工时'
  },
  {
    title: '待完成量',
    value: Math.max(0, props.stats.remaining),
    suffix: '小时',
    needDecimal: true,
    tooltip: '剩余待完成工时'
  }
]})
</script>