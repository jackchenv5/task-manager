<template>
    <el-button @click="exportEvent">导出</el-button>
    <vxe-table border :data="mergedData" :merge-cells="mergeCells" ref="tableRef">
        <vxe-column field="receiver_name" title="执行人"></vxe-column>
        <vxe-column field="project" title="项目"></vxe-column>
        <vxe-column field="workloads" title="计划工时"></vxe-column>
        <vxe-column field="start_time" title="开始时间" width="100" show-overflow></vxe-column>
        <vxe-column field="deadline_time" title="截止时间" width="100" show-overflow></vxe-column>
        <vxe-column field="name" title="包含任务"></vxe-column>
        <!-- 其他列 -->
    </vxe-table>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
const tableRef = ref(null)

import { useGroupStore } from '@/stores/group.js'

const groupStore = useGroupStore();
const { allTask } = storeToRefs(groupStore);
const exportEvent = () => {
    const $table = tableRef.value
    if ($table) {
        $table.exportData()
    }
}
const mergedData = ref([])
const mergeCells = ref([])

// 配置合并字段
const mergeFieldsConfig = {
    receiver_name: {},
    project: {},
}

// 配置求和字段
const sumFields = ['workloads']

const concatFieldsConfig = {
    name: {},
}

watch(allTask, (newVal) => {
    const result = mergeTaskDataWithConcat(
        allTask.value,
        mergeFieldsConfig,
        concatFieldsConfig,
        sumFields
    )
    mergedData.value = result.mergedData
    mergeCells.value = result.mergeCells
})
onMounted(() => {
    const result = mergeTaskDataWithConcat(
        allTask.value,
        mergeFieldsConfig,
        concatFieldsConfig,
        sumFields
    )
    mergedData.value = result.mergedData
    mergeCells.value = result.mergeCells
})

/**
 * 合并任务数据，支持字段合并、字符串拼接和数值求和
 * @param {Array} data - 原始数据数组
 * @param {Object} mergeFieldsConfig - 合并字段配置（字段名作为key，顺序决定合并优先级）
 * @param {Object} [concatFieldsConfig={}] - 拼接字段配置（字段名作为key，值为{separator, prefix, suffix}）
 * @param {Array} [sumFields=[]] - 需要求和的字段名数组
 * @returns {Object} 包含合并后数据和合并单元格配置的对象
 */
function mergeTaskDataWithConcat(data, mergeFieldsConfig, concatFieldsConfig = {}, sumFields = []) {
    if (!data || data.length === 0) return { mergedData: [], mergeCells: [] };

    /*---- 阶段1：数据预处理 ----*/
    const sortFields = Object.keys(mergeFieldsConfig);
    const sortedData = [...data].sort((a, b) => {
        for (const field of sortFields) {
            const compareResult = String(a[field]).localeCompare(String(b[field]));
            if (compareResult !== 0) return compareResult;
        }
        return 0;
    });
    console.log('sortedData====>',sortedData)
    const mergedData = [];
    const mergeCells = [];
    const mergeState = {};
    const sumState = {};
    const concatState = {};

    sortFields.forEach((field, index) => {
        mergeState[field] = {
            currentValue: null,
            startRow: 0,
            rowCount: 0,
            fieldIndex: index
        };
    });

    // 初始化求和和拼接状态
    sumFields.forEach(field => sumState[field] = 0);
    Object.keys(concatFieldsConfig).forEach(field => concatState[field] = []);

    let currentGroupData = [];
    // const fieldIndexMap = createFieldIndexMap(data[0] || {}); // 预计算字段索引
    const $table = tableRef.value
    console.log('tableRef.value.getColumns()===>',$table.getColumns())
    const columnFields = tableRef.value.getColumns().map(col => col.property);
    const fieldIndexMap = columnFields.reduce((map, field, index) => {
        map[field] = index;
        return map;
    }, {});
    console.log('fieldIndexMap===============>',fieldIndexMap)
    // console.log('2 field index ............',fieldIndexMap)
    /*---- 阶段3：处理数据合并 ----*/
    sortedData.forEach((item, rowIndex) => {
        // 检测本行是否有 字段变化 mergeState 字段  
        const changedField = getFirstChangedField(item, mergeState, sortFields);
        // console.log('changedField ............',changedField)
        if (changedField && currentGroupData.length > 0) {
            // console.log('mergeState, mergeCells,fieldIndexMap............',mergeState,mergeCells,fieldIndexMap)
            processMergeGroup(mergeState, mergeCells, fieldIndexMap);
        }

        // 更新合并状态
        updateMergeState(item, mergeState, sortFields, changedField, rowIndex);

        // 累计数据
        accumulateData(item, sumFields, sumState, concatFieldsConfig, concatState);
        currentGroupData.push(item);

        // 最后一行处理
        if (rowIndex === sortedData.length - 1) {
            processMergeGroup(mergeState, mergeCells, fieldIndexMap);
        }
    });

    /*---- 阶段4：生成合并后的行数据 ----*/
    function processMergeGroup() {
        if (currentGroupData.length === 0) return;

        // 创建合并行
        // console.log('======currentGroupData,sumFields,sumState,concatFieldsConfig,concatState',currentGroupData,sumFields,sumState,concatFieldsConfig,concatState)
        const mergedRow = createMergedRow(currentGroupData, sumFields, sumState, concatFieldsConfig, concatState);
        mergedData.push(mergedRow);

        // 生成合并单元格配置
        generateMergeCells(mergeState, mergeCells, fieldIndexMap, sortFields);

        // 重置状态
        resetStates(sumFields, sumState, concatFieldsConfig, concatState);
        currentGroupData = [];
    }

    /*---- 辅助函数 ----*/
    function createFieldIndexMap(firstItem) {
        return Object.keys(firstItem).reduce((map, field, index) => {
            map[field] = index;
            return map;
        }, {});
    }

    function getFirstChangedField(item, mergeState, sortFields) {
        for (const field of sortFields) {
            if (item[field] !== mergeState[field].currentValue) {
                return field;
            }
        }
        return null;
    }

    function updateMergeState(item, mergeState, sortFields, changedField, index) {
        sortFields.forEach(field => {
            // if (changedField && mergeState[field].currentValue !== item[field]) {
            if (changedField) {
                mergeState[field] = {
                    currentValue: item[field],
                    startRow: index ,
                    // startRow: 0,
                    rowCount: 1,
                    fieldIndex: mergeState[field].fieldIndex
                };
            } else {
                mergeState[field].rowCount++;
            }
        });
    }

    function accumulateData(item, sumFields, sumState, concatFieldsConfig, concatState) {
        sumFields.forEach(field => sumState[field] += Number(item[field]) || 0);
        Object.keys(concatFieldsConfig).forEach(field => {
            if (item[field] != null) concatState[field].push(item[field]);
        });
    }

    function createMergedRow(groupData, sumFields, sumState, concatFieldsConfig, concatState) {
        const mergedRow = { ...groupData[0] };

        // 处理求和字段
        sumFields.forEach(field => mergedRow[field] = sumState[field]);

        // 处理拼接字段
        Object.entries(concatFieldsConfig).forEach(([field, config]) => {
            const { separator = '\n', prefix = '', suffix = '' } = config;
            mergedRow[field] = prefix + concatState[field].join(separator) + suffix;
        });
        // console.log('mergedRow......', mergedRow)
        return mergedRow;
    }

    function generateMergeCells(mergeState, mergeCells, fieldIndexMap, sortFields) {
        sortFields.forEach(field => {
            const state = mergeState[field];
            if (state.rowCount > 1) {
                mergeCells.push({
                    row: state.startRow,
                    col: fieldIndexMap[field],
                    rowspan: state.rowCount,
                    colspan: 1
                });
            }
        });
    }

    function resetStates(sumFields, sumState, concatFieldsConfig, concatState) {
        sumFields.forEach(field => sumState[field] = 0);
        Object.keys(concatFieldsConfig).forEach(field => concatState[field] = []);

        console.log('mergedData=====================', mergedData)
    }
    console.log('mergeCells=====================', mergeCells)
    return {
        mergedData,
        mergeCells
    };
}
</script>