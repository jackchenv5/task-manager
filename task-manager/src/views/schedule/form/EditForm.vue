<template>
    <el-form :mode="curTaskDetailRef" label-width="auto" label-position="top">
        <el-row>
            <el-col :span="12">
                <el-form-item label="名称:" prop="name">
                    <el-input v-model="curTaskDetailRef.name"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="项目:">
                    <el-input v-model="curTaskDetailRef.project"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="执行人:" prop="receiver">
                    <Select style="width: 95%;" v-model="curTaskDetailRef.receiver" :api="getUserApi" label-field="username"
                        value-field="id" filterable :filter-field="['username', 'emp_num', 'email']"></Select>

                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="抄送:">
                    <Select style="width: 95%;" v-model="curTaskDetailRef.sender" :api="getUserApi" label-field="username"
                        value-field="username" filterable multiple
                        :filter-field="['username', 'emp_num', 'email']"></Select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="时间范围:">
                    <el-date-picker v-model="curTaskDetailRef.start_time" type="date" placeholder="Pick a day"
                        size="default" style="width: 7vw;" />
                    <span>~</span>
                    <el-date-picker v-model="curTaskDetailRef.deadline_time" type="date" placeholder="Pick a day"
                        size="default" style="width:7vw;" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="工作量:" prop="workload">
                    <el-input-number v-model="curTaskDetailRef.workload" :precision="1" :step="0.5" style="width: 95%" />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="任务内容:" prop="content">
                    <el-input type="textarea" :rows="5" v-model="curTaskDetailRef.content"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="挑战目标:">
                    <el-input type="textarea" :rows="5" v-model="curTaskDetailRef.challenge"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="任务描述:">
            <el-input type="textarea" :rows="2" v-model="curTaskDetailRef.description"></el-input>
        </el-form-item>
        <!-- <el-form-item label="关联任务:">
            <el-input type="text" v-model="curTaskDetailRef.related_task"></el-input>
        </el-form-item> -->
    </el-form>
</template>

<script setup>

import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'
import Select from '@/components/selects/MutiSelect.vue'
import { getUserApi} from '@/api/data/data'

const scheduleStore = useScheduleStore()
const {curTaskDetailRef } = storeToRefs(scheduleStore)

</script>