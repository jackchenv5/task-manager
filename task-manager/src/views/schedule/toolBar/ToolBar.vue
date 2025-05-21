<template>
    <div class="tool-class">
        <el-badge :value="lastPendTasksLength" class="item" type="info">
            <el-button color="orange" @click="updateType('last')">最近添加</el-button>
        </el-badge>
    </div>

    <div class="tool-class">
        <el-badge :value="curPendTasksLength" class="item" type="primary">
            <el-button color="green" @click="updateType('cur')">待下发</el-button>
        </el-badge>
    </div>
    <div class="tool-class">
        <el-button type="info">Excel 模版下载</el-button>
    </div>
    <div class="tool-class">
        <el-button type="warning">Excel 导入任务</el-button>
    </div>
    <!-- <el-drawer v-model="drawer" title="任务调整"  direction="btt" :close-on-click-modal="false" size="80%" :with-header="true" > -->
    <el-drawer v-model="drawer" title="任务调整" direction="btt" size="80%" :with-header="false">
        <div style="display: flex;justify-content:space-between;margin-bottom: 10px;">
            <div style="font-size: 1.2rem;font-weight:bolder">任务调整</div>
            <div style="display: flex;align-items:center"><span>任务组织形式：</span>
                <el-radio-group v-model="joinType" >
                    <el-radio-button label="项目" value="project" />
                    <el-radio-button label="执行人" value="recevier" />
                    <el-radio-button label="全部任务" value="all" />
                </el-radio-group>
            </div>
            <el-button class="material-symbols--close" @click="drawer = false"></el-button>

        </div>

        <Gantt v-model="taskType" :join-type="joinType"></Gantt>
    </el-drawer>
</template>


<script setup>
import { ref, onMounted } from 'vue'
const drawer = ref(false)
const joinType = ref('project')
import Gantt from './Gantt.vue'

import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'

const scheduleStore = useScheduleStore()
const { curPendTasksLength, lastPendTasksLength } = storeToRefs(scheduleStore)
const taskType = ref('')

const updateType = (type) => {
    drawer.value = true
    taskType.value = type
}

</script>

<style scoped>
.tool-class {
    margin: 0px 10px;
}

.material-symbols--close {
    display: inline-block;
    width: 12px;
    height: 12px;
    --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z'/%3E%3C/svg%3E");
    background-color: currentColor;
    -webkit-mask-image: var(--svg);
    mask-image: var(--svg);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
}
</style>