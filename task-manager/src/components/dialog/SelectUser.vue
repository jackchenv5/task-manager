<template>
    <el-dialog v-model="dialogFormVisible" title="用户选择" width="500">
        <el-form :model="form">
            <el-form-item label="用户选择" :label-width="formLabelWidth">
                <Select style="width: 500px;"  v-model="selectedOption" :api="getUserApi"  label-field="username" value-field="id" filterable multiple :filter-field="['username','emp_num','email']" ></Select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancelAddUser">取消</el-button>
                <el-button type="primary" @click="addUserOk">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
  
<script setup>

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
import { getUserApi } from '@/api/data/data'
import { reactive, ref,watch} from 'vue'
const emit = defineEmits(['update:modelValue','update:visible', 'change'])
const dialogFormVisible = ref(props.visible)
const selectedOption = ref(props.modelValue) 

// const handleSelectChange = (value) => {
//     console.log('Selected value:', value)
// }

//监听父组件visable的变化
watch(()=>props.visible,(newVal)=>{
    console.log('监听父组件visable的变化',newVal)
    dialogFormVisible.value = newVal
})

//监听子组件visable的变化
watch(dialogFormVisible,(newVal)=>{
    // console.log(newVal)
    console.log('监听子组件visable的变化',newVal)

    emit('update:visible', newVal)
})

// 监听 selectedValue 变化并通知父组件
watch(selectedOption, (newVal) => {
    emit('update:modelValue', newVal)
    emit('change', newVal)
})


// 监听父组件传递的 modelValue 变化
watch(() => props.modelValue, (newVal) => {
    selectedOption.value = newVal
})

const formLabelWidth = '140px'

const form = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
})

const cancelAddUser = ()=>{
    dialogFormVisible.value = false
    selectedOption.value = null
}
const addUserOk = ()=>{
    dialogFormVisible.value = false
}
</script>