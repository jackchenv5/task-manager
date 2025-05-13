<template>
  <div style="display: flex; justify-content: center; width: 100%; margin-top: 5px;">
    <div style="display: flex; align-items: center; width: 100%; max-width: 800px; position: relative;">
      <el-radio-group 
        v-model="typeRadio" 
        size="small" 
        style="flex-grow: 1; justify-content: center;" 
        @change="handleRadioChange"
      >
        <el-radio-button label="所有任务" value="all"></el-radio-button>
        <el-radio-button label="待下发" value="pending"></el-radio-button>
        <el-radio-button label="进行中" value="running"></el-radio-button>
        <el-radio-button label="已完成" value="done"></el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const typeRadio = ref('all')
const myUserStore = useUserStore()
const personCfg = ref({})

const handleRadioChange = (val) => {
  personCfg.value['typeRadio'] = val
  myUserStore.setUserConfig("person", personCfg.value)
}

defineExpose({
  typeRadio
})
</script>