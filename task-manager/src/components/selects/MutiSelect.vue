<!-- MyButton.vue -->

<template>
    <el-select ref="selectRef" v-model="selectedValue" :placeholder="placeholder" :multiple="multiple" @focus="focus" :value-key="valueField ? valueField:'id'"
        :clearable="clearable" :loading="loading" :filterable="filterable" :remote="remote" :remote-method="remoteMethod">
        <el-option v-for="item in options" :key="valueField ? item[valueField] : item['id']" :label="item[labelField]" :value="valueField ? item[valueField] : item" />
    </el-select>
</template>
  
<script setup>
import {ElSelect,ElOption} from 'element-plus'
//  支持传入api
//  支持指定 data 字段
//  支持指定 label 字段
//  支持指定 value 字段
//  支持指定 过滤字段 [多选]
const props = defineProps({
    // 是否启用远程搜索
    remote: {
        type: Boolean,
        default: true
    },
    // 是否支持多选
    multiple: {
        type: Boolean,
        default: false
    },
    // 是否可清空
    clearable: {
        type: Boolean,
        default: false
    },
    // 是否可搜索
    filterable: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: '请选择'
    },
    api: {
        type: [String, Function],
        default: ''
    },
    dataFiled: {
        type: String,
        default: 'result'
    },
    itemsFiled: {
        type: String,
        default: 'items'
    },
    labelField: {
        type: String,
        default: 'label'
    },
    valueField: {
        type: String,
        default: ''
    },
    filterField: {
        type: Array
    },
    modelValue: {  // 默认的 v-model 属性名
        type: [Number, Array, String],
        default: '',
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

import { ref, watch, onMounted } from 'vue'

const loading = ref(false)

const selectedValue = ref(props.modelValue)
const selectRef = ref(null)
const options = ref([])
const orginOptions = ref([])
const originData = ref([])

// 通过绑定api，初始化options，根据dataField字段获取数据，根据labelField、valueField 字段初始化options

const loadOptions = async () => {
    loading.value = true
    if (!props.remote) {
        options.value = props.options ? props.options : []
        orginOptions.value = props.options ? props.options : []
        loading.value = false
        return
    }

    try {
        const response = await props.api()
        // 处理API返回数据

        if(Array.isArray(response)){
        originData.value = response
        orginOptions.value = response
        options.value = orginOptions.value
        return
        }
        if (!response.hasOwnProperty(props.dataFiled)) {

            loading.value = false
            return
        }

        if (!response[props.dataFiled].hasOwnProperty(props.itemsFiled)) {

            loading.value = false
            return
        }
        const data = response[props.dataFiled][props.itemsFiled]
        originData.value = Array.isArray(data) ? data : []
        orginOptions.value = Array.isArray(data) ? data : []
        options.value = orginOptions.value
    } catch (error) {
        console.error('加载选项失败:', error)
    } finally {
        loading.value = false
    }
}

// 触发过滤
const remoteMethod = (query) => {
    if (!props.filterField || props.filterField.length === 0 || !query) {
        return
    }
    const filterData = []
    originData.value.forEach(x => {
        for (let i = 0; i < props.filterField.length; i++) {
            if (x[props.filterField[i]].includes(query)) {
                filterData.push(x)
                return
            }
        }
    })
    options.value = filterData
}

// 处理下拉框出现隐藏事件
const focus = () =>{
    setTimeout(()=>{
        if (selectRef.value) {
        selectRef.value.inputRef.value = ''
    }
    },500)
}

// 监听父组件传递的 modelValue 变化
watch(() => props.modelValue, (newVal) => {

    selectedValue.value = newVal
    options.value = orginOptions.value
    setTimeout(()=>{
        if (selectRef.value) {
        selectRef.value.inputRef.value = ''
    }
    },500)

})

// 监听 selectedValue 变化并通知父组件
watch(selectedValue, (newVal) => {

    //选项还原为默认值
    //查询字符清空
    emit('update:modelValue', newVal)
    emit('change', newVal)
})

// 初始化加载
onMounted(() => {
    loadOptions()
})
</script>
  
<style scoped></style>