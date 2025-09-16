<template>
    <el-dialog v-model="dialogFormVisible" title="项目选择器" width="60%">
        <el-form :model="form">
            <el-form-item label="项目选择：" :label-width="formLabelWidth">
                <Select style="width: 95%;" v-model="selectedOption" :api="getProjectList" label-field="name"
                    value-field="name" filterable multiple :filter-field="['name']"></Select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancelAddProject">取消</el-button>
                <el-button type="primary" @click="addProjectOk">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>
  
<script setup>
import {ElDialog,ElForm,ElFormItem,ElButton} from "element-plus";

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    modelValue: {  // 默认的 v-model 属性名
        type: Object,
        // default: [],
    },
})

import Select from '@/components/selects/MutiSelect.vue'
import { getProjectList } from '@/api/data/data'
import { ref, watch } from 'vue'
const emit = defineEmits(['update:modelValue', 'update:visible', 'change','comfirm'])
const dialogFormVisible = ref(props.visible)
const selectedOption = ref(props.modelValue)

const isConfirm = ref(false)

//监听父组件visable的变化
watch(() => props.visible, (newVal) => {
    dialogFormVisible.value = newVal
})

//监听子组件visable的变化
watch(dialogFormVisible, (newVal) => {
    emit('update:visible', newVal, isConfirm)
})

const formLabelWidth = '140px'

//取消：
// 1. 清空当前用户选择框
// 2. 将confirm 设置为false
// 3. 触发comfirm事件给父组件处理
const cancelAddProject = () => {
    dialogFormVisible.value = false
    isConfirm.value = false
    selectedOption.value = []
    emit('comfirm',false,[])
}

//确认：
// 1. 清空当前用户选择框
// 2. 将confirm 设置为true
// 3. 触发comfirm事件给父组件处理，并传递当前选择用户
const addProjectOk = () => {
    dialogFormVisible.value = false
    isConfirm.value = true
    emit('comfirm',true,selectedOption.value)
    selectedOption.value = []
}
</script>