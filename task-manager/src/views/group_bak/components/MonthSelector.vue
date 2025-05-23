<template>
  <el-card class="month-selector">
    <div class="month-control">
      <el-button 
        type="primary" 
        icon="el-icon-arrow-left" 
        circle 
        @click="prevMonth"
      />
      
      <div class="month-display">
        <span class="month-text">{{ currentMonth }}月</span>
        <el-button 
          type="text" 
          @click="resetToCurrentMonth"
        >
          回到本月
        </el-button>
      </div>
      
      <el-button 
        type="primary" 
        icon="el-icon-arrow-right" 
        circle 
        @click="nextMonth"
      />
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

const currentMonth = ref(new Date().getMonth() + 1)

const prevMonth = () => {
  currentMonth.value = currentMonth.value === 1 ? 12 : currentMonth.value - 1
}

const nextMonth = () => {
  currentMonth.value = currentMonth.value === 12 ? 1 : currentMonth.value + 1
}

const resetToCurrentMonth = () => {
  currentMonth.value = new Date().getMonth() + 1
}
</script>

<style scoped>
.month-selector {
  margin-bottom: 20px;
}

.month-control {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.month-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.month-text {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.el-button {
  font-size: 16px;
}
</style>