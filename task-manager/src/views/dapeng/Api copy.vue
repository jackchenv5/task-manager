<template>
    <div style="display:flex;flex-derection:column">
        <div class="header">
            <div>班组数据</div>
            <div style="display:flex;gap:10px;">
                <el-card style="width: 300px;">
                    <template #header>
                        <div class="card-header">
                            <span>设备1</span>
                        </div>
                    </template>
                    <span>序列号：XXXXXX</span>
                </el-card>
                <el-card style="width: 300px;">
                    <template #header>
                        <div class="card-header">
                            <span>设备2</span>
                        </div>
                    </template>
                    <span>序列号：XXXXXX</span>
                </el-card>
            </div>
            <div style="margin-top: 10px;">
                <span class="demonstration">选择时间范围：</span>
                <el-date-picker v-model="value2" type="daterange" unlink-panels range-separator="To"
                    start-placeholder="Start date" end-placeholder="End date" :shortcuts="shortcuts" :size="size" />
            </div>
        </div>
        <el-divider></el-divider>
        <div style="display:flex;gap:10px;">
            <div>1</div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'

const size = ref < 'default' | 'large' | 'small' > ('default')

const value2 = ref('')

const shortcuts = [
    {
        text: 'Last week',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: 'Last month',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: 'Last 3 months',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]
</script>