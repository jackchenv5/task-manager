<template>
    <div style="display:flex;flex-direction:column;height:100vh;">
        <div style="height:12vh;width:100%;border:1px solid">
            <div>班组数据</div>
            <div style="display:flex;gap:10px;">
                <div
                    style="display:flex;flex-direction:column;width:200px;border:1px solid black;border-radius:5px;background: rgb(245, 245, 235);padding: 5px 8px;">
                    <div>设备1</div>
                    <div>序列号：xxxxxxx</div>
                </div>
                <div
                    style="display:flex;flex-direction:column;width:200px;border:1px solid black;border-radius:5px;background: rgb(245, 245, 235);padding: 5px 8px;">
                    <div>设备2</div>
                    <div>序列号：xxxxxxx</div>
                </div>
            </div>
        </div>
        <div style="flex-grow:1;width:100%;display:flex;flex-direction:column;">
            <div style="display:flex;flex-direction:column;">
                <div style="margin-top:5px;">
                    <el-date-picker v-model="value2" type="daterange" unlink-panels range-separator="到"
                        start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="shortcuts" :size="size" />
                </div>
            </div>
            <div style="display:flex;">
                <Chart1></Chart1>
                <Chart2></Chart2>
            </div>
            <div style="display:flex;">
                <Chart1></Chart1>
                <Chart2></Chart2>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
const size = ref < 'default' | 'large' | 'small' > ('default')
import Chart1 from './chart/Chart1.vue'
import Chart2 from './chart/Chart2.vue'
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