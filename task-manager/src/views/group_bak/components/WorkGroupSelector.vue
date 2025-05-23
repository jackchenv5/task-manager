<template>
  <el-card class="group-selector">
    <el-radio-group v-model="selectedGroup" class="group-radio">
      <el-radio 
        v-for="group in groups" 
        :key="group.id" 
        :label="group.id"
        border
      >
        {{ group.name }}
      </el-radio>
    </el-radio-group>
    
    <div class="group-info">
      <el-tag type="info">总人数: {{ currentGroup.totalMembers }}</el-tag>
      <el-tag type="warning">总工作量: {{ currentGroup.totalWorkload }}h</el-tag>
      <el-tag :type="saturationTagType">工作饱和度: {{ currentGroup.saturation }}%</el-tag>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const groups = ref([
  { id: 1, name: '前端开发组', totalMembers: 8, totalWorkload: 320, saturation: 85 },
  { id: 2, name: '后端开发组', totalMembers: 10, totalWorkload: 400, saturation: 90 },
  { id: 3, name: '测试组', totalMembers: 5, totalWorkload: 150, saturation: 75 }
])

const selectedGroup = ref(1)

const currentGroup = computed(() => {
  return groups.value.find(group => group.id === selectedGroup.value) || {}
})

const saturationTagType = computed(() => {
  const saturation = currentGroup.value.saturation || 0
  if (saturation > 90) return 'danger'
  if (saturation > 80) return 'warning'
  if (saturation > 60) return 'success'
  return 'info'
})
</script>

<style scoped>
.group-selector {
  margin-bottom: 20px;
}

.group-radio {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.group-info {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.el-tag {
  font-size: 14px;
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
}
</style>