<template>
    <div class="user-bar">
        <el-dialog v-model="dialogVisible" :title="`${selectUser.username}`" width="500px">
            <p style="color:#aaa">此评价和评语只会展示给组长，作为绩效参考~</p>
            <p style="color:red" v-if="evaulateForm.id">此人已评价，修改视为跟新评价~</p>
            <el-form ref="form" :model="evaulateForm" label-width="80px">

                <el-form-item label="评价：">
                    <el-rate v-model="evaulateForm.score" :max="7" text-color="#ff9900" :texts="EvaluateList"
                        show-text>
                    </el-rate>
                </el-form-item>
                <el-form-item label="评语：">
                    <el-input type="textarea" v-model="evaulateForm.comment" placeholder="请输入内容"
                        :rows="5"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="confirmEvalution">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <div class="user-info">
            <el-tooltip content="当前状态：繁忙" placement="right" effect="light">

                <!-- <Icon icon="gridicons:status" :width="35" color="red" /> -->
                <!-- <Icon icon="svg-spinners:270-ring-with-bg" :width="35" color="red" /> -->
                <Icon icon="lucide:user" :width="35" color="black" />

            </el-tooltip>

            <div class="user-tag">{{ selectUser.username }}</div>

        </div>
        <div class="user-item">
            <Icon icon="hugeicons:date-time" :width="35" color="#337ecc" />
            <div class="user-stats-content">
                <el-tooltip content="本项目投入总工时:天" placement="right" effect="light">
                    <div class="user-label">总工时</div>
                </el-tooltip>
                <div style="font-size:0.8rem">{{ curSelectUserStat.total?.toFixed(1) }}天</div>
            </div>
            <div class="user-stats-content">
                <el-tooltip content="本项目已完成工时:天" placement="right" effect="light">
                    <div class="user-label">已完成</div>
                </el-tooltip>
                <div style="font-size:0.8rem">{{ curSelectUserStat.completed.toFixed(1) }}天</div>
            </div>
            <div class="user-stats-content">
                <el-tooltip content="本项目完成进度：个人已完成工时/个人总工时" placement="right" effect="light">
                    <div class="user-label">进度</div>
                </el-tooltip>
                <div style="font-size:0.8rem">{{ curSelectUserStat.progress }}%</div>
            </div>

        </div>
        <div class="user-item">
            <Icon icon="mdi:achievement-outline" :width="35" color="rgb(245 111 108)" />
            <div class="user-stats-content">
                <el-tooltip content="本项目投入比例：本人总工时/项目总工时" placement="right" effect="light">
                    <div class="user-label">贡献</div>
                </el-tooltip>
                <div style="font-size:0.8rem">{{ curSelectUserStat.participation }}%</div>
            </div>
            <div class="user-stats-content">
                <el-tooltip content="按时达成率：按时完成数/已完成任务数" placement="right" effect="light">
                    <div class="user-label">达成率</div>
                </el-tooltip>
                <div style="font-size:0.8rem">{{ curSelectUserStat.finishCount ? (curSelectUserStat.achieveCount/curSelectUserStat.finishCount * 100).toFixed(1) : 0 }}%</div>
            </div>
        </div>

        <div class="user-item">
            <Icon icon="iconoir:leaderboard-star" :width="35" color="#537cfa" />
            <div class="user-stats-content">
                <el-tooltip content="本项目投入比例：本人工时/项目工时" placement="right" effect="light">
                    <div class="user-label">组长</div>
                </el-tooltip>
                <div style="font-size:0.8rem">{{ curUserEvalution.group?.scoreValue || '-' }}</div>
            </div>
            <div class="user-stats-content">
                <el-tooltip content="本项目完成率：按时完成/已完成任务数" placement="right" effect="light">
                    <div class="user-label">TL</div>
                </el-tooltip>
                <div style="font-size:0.8rem">{{ curUserEvalution.project?.scoreValue || '-' }}</div>
            </div>
            <div class="user-stats-content">
                <el-tooltip content="本项目完成率：按时完成/已完成任务数" placement="right" effect="light">
                    <div class="user-label">自评</div>
                </el-tooltip>
                <div style="font-size:0.8rem">{{ curUserEvalution.user?.scoreValue || '-' }}</div>
            </div>
        </div>
        <div class="user-tool">
            <el-button @click="clickEvalution">评价</el-button>
        </div>
    </div>
</template>
<script setup>
import { Icon } from '@iconify/vue';
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
const projectStore = useProjectStore()
const { selectUser,curSelectUserStat ,curUserEvalution } = storeToRefs(projectStore)

import { EvaluateList } from '@/constants/public'

const dialogVisible = ref(false)
const evaulateForm = ref({
    score: 0,
    comment:'',
    id:0
})

const clickEvalution = () => {
    if (!selectUser.value.username) {
        ElMessage.error('请选择评价用户！')
        return
    }
    evaulateForm.value.score = curUserEvalution.value.project?.score || 0
    evaulateForm.value.comment = curUserEvalution.value.project?.comment || ''
    evaulateForm.value.id = curUserEvalution.value.project?.id || 0
    dialogVisible.value = true
}
const confirmEvalution = async () => {
    console.log(evaulateForm.value)
    const ret = await projectStore.commitCurUserEvalution(evaulateForm.value)
    if (!ret) {
        ElMessage.error(`${selectUser.value.username}评价失败！`)

    } else {
        ElMessage.success(`${selectUser.value.username}评价成功！`)
    }
    evaulateForm.value = {
        score: 0,
        comment:'',
        id:0
    }
    dialogVisible.value = false
}
</script>
<style scoped>
.user-bar {
    border-left: 5px solid rgb(51, 53, 51);
    margin-top: 5px;
    background: white;
    height: 6vh;
    display: flex;
}

.user-info {
    width: 8vw;
    border: 1px solid rgb(198, 207, 207);
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgb(247, 245, 244);
    /* margin: 0 10px; */

    padding: 8px;
    /* border: 0; */
    transition: all 0.2s;

}

.user-item {
    width: 11vw;
    border: 1px solid rgb(198, 207, 207);
    display: flex;
    justify-content: space-around;
    align-items: center;
    /* margin: 0 10px; */

    padding: 8px;
    /* border: 0; */
    transition: all 0.2s;

}

.user-item:hover {
    border: 0;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
    /* box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.2); 内部阴影 */
}

.user-tool {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    /* margin: 0 10px; */

    padding: 8px;
    /* border: 0; */
    transition: all 0.2s;

}

.user-tag {
    background-color: black;
    padding: 5px 10px;
    color: white;
    border: 1px solid black;
    border-radius: 10px;
}

.user-status {
    background-color: red;
    width: 30px;
    height: 20px;
    border-radius: 10px;

}

.user-stats-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-around;
    align-items: center;
}

.user-label {
    color: #00000073;
    font-size: 0.8rem;
}
</style>