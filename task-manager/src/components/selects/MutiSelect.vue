<!-- MyButton.vue -->

<template>
    <el-select v-model="selectedValue" filterable placeholder="Select" style="width: 240px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>
  
<script setup>
const props = defineProps({
    options: {
        type: Array,
    },
    modelValue: {  // 默认的 v-model 属性名
        type: String,
        default: '',
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

import { ref,watch } from 'vue'
const selectedValue = ref(props.modelValue)

// 监听父组件传递的 modelValue 变化
watch(() => props.modelValue, (newVal) => {
    console.log('父组件传入新值:',props.modelValue,newVal)
    selectedValue.value = newVal
})

// 监听 selectedValue 变化并通知父组件
watch(selectedValue, (newVal) => {
    console.log('子组件修改：',selectedValue.value,newVal)
    emit('update:modelValue', newVal)
    emit('change', newVal)
})

</script>
  
<style scoped></style>