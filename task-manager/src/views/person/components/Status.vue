<template>
  <div style="display: flex; justify-content: center; width: 100%; margin-top: 5px;">
    <div style="display: flex; align-items: center; width: 100%; max-width: 800px; position: relative;">
      <el-radio-group 
        v-model="selectedValue"
        size="small" 
        style="flex-grow: 1; justify-content: center;" 
        @change="handleRadioChange"
      >
        <el-radio-button label="所有任务" value="all" />
        <el-radio-button label="待下发" value="pending" />
        <el-radio-button label="进行中" value="running" />
        <el-radio-button label="已完成" value="done" />
      </el-radio-group>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  personCfg: {
    type: Object,
    required: true
  }
})

const myUserStore = useUserStore()

const emit = defineEmits(['update:modelValue'])

const selectedValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const handleRadioChange = (val) => {
  props.personCfg['typeRadio'] = val;
  myUserStore.setUserConfig("person", props.personCfg);
}
</script>