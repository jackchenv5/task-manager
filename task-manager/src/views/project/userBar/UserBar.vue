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
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="0.9"><circle cx="12" cy="7" r="5"/><path stroke-linecap="round" stroke-linejoin="round" d="M17 14h.352a3 3 0 0 1 2.976 2.628l.391 3.124A2 2 0 0 1 18.734 22H5.266a2 2 0 0 1-1.985-2.230l.39-3.124A3 3 0 0 1 6.649 14H7"/></g></svg>

            </el-tooltip>

            <div class="user-tag">{{ selectUser.username }}</div>

        </div>
        <div class="user-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#3866a4" d="m15.3 16.7l1.4-1.4l-3.7-3.7V7h-2v5.4zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.325 0 5.663-2.337T20 12t-2.337-5.663T12 4T6.337 6.338T4 12t2.338 5.663T12 20"/></svg>
            <div class="user-stats-content">
                <el-tooltip content="本项目投入总工时:天" placement="right" effect="light">
                    <div class="user-label">总工时</div>
                </el-tooltip>
                <div style="font-size:0.5rem">{{ curSelectUserStat.total?.toFixed(1) }}天</div>
            </div>
            <div class="user-stats-content">
                <el-tooltip content="本项目已完成工时:天" placement="right" effect="light">
                    <div class="user-label">已完成</div>
                </el-tooltip>
                <div style="font-size:0.5rem">{{ curSelectUserStat.completed.toFixed(1) }}天</div>
            </div>
            <div class="user-stats-content">
                <el-tooltip content="本项目完成进度：个人已完成工时/个人总工时" placement="right" effect="light">
                    <div class="user-label">进度</div>
                </el-tooltip>
                <div style="font-size:0.5rem">{{ curSelectUserStat.progress }}%</div>
            </div>

        </div>
        <div class="user-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#dd7027" d="M18 2c-.9 0-2 1-2 2H8c0-1-1.1-2-2-2H2v9c0 1 1 2 2 2h2.2c.4 2 1.7 3.7 4.8 4v2.08C8 19.54 8 22 8 22h8s0-2.46-3-2.92V17c3.1-.3 4.4-2 4.8-4H20c1 0 2-1 2-2V2zM6 11H4V4h2zm10 .5c0 1.93-.58 3.5-4 3.5c-3.41 0-4-1.57-4-3.5V6h8zm4-.5h-2V4h2z"/></svg>
            <div class="user-stats-content">
                <el-tooltip content="本项目投入比例：本人总工时/项目总工时" placement="right" effect="light">
                    <div class="user-label">贡献</div>
                </el-tooltip>
                <div style="font-size:0.6rem">{{ curSelectUserStat.participation }}%</div>
            </div>
            <div class="user-stats-content">
                <el-tooltip content="按时达成率：按时完成数/已完成任务数" placement="right" effect="light">
                    <div class="user-label">达成率</div>
                </el-tooltip>
                <div style="font-size:0.5rem">{{ curSelectUserStat.finishCount ? (curSelectUserStat.achieveCount/curSelectUserStat.finishCount * 100).toFixed(1) : 0 }}%</div>
            </div>
        </div>

        <div class="user-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 1024 1024"><path fill="#2763dd" d="M573 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40m-280 0c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40"/><path fill="#2763dd" d="M894 345c-30.1-66-115.3-110.1-189-130v.1c-17.1-19-36.4-36.5-58-52.1c-163.7-119-393.5-82.7-513 81c-96.3 133-92.2 311.9 6 439l.8 132.6c0 3.2.5 6.4 1.5 9.4c5.3 16.9 23.3 26.2 40.1 20.9L309 806c33.5 11.9 68.1 18.7 102.5 20.6l-.5.4c89.1 64.9 205.9 84.4 313 49l127.1 41.4c3.2 1 6.5 1.6 9.9 1.6c17.7 0 32-14.3 32-32V753c88.1-119.6 90.4-284.9 1-408M323 735l-12-5l-99 31l-1-104l-8-9c-84.6-103.2-90.2-251.9-11-361c96.4-132.2 281.2-161.4 413-66c132.2 96.1 161.5 280.6 66 412c-80.1 109.9-223.5 150.5-330 102m505-17l-8 10l1 104l-98-33l-12 5c-56 20.8-115.7 22.5-171 7l-.2-.1C613.7 788.2 680.7 742.2 729 676c76.4-105.3 88.8-237.6 44.4-350.4l.6.4c23 16.5 44.1 37.1 62 62c72.6 99.6 68.5 235.2-8 330"/><path fill="#2763dd" d="M433 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40"/></svg>
            <div class="user-stats-content">
                <el-tooltip content="本项目投入比例：本人工时/项目工时" placement="right" effect="light">
                    <div class="user-label">组长</div>
                </el-tooltip>
                <div style="font-size:0.5rem">{{ curUserEvalution.group?.scoreValue || '-' }}</div>
            </div>
            <div class="user-stats-content">
                <el-tooltip content="本项目完成率：按时完成/已完成任务数" placement="right" effect="light">
                    <div class="user-label">TL</div>
                </el-tooltip>
                <div style="font-size:0.5rem">{{ curUserEvalution.project?.scoreValue || '-' }}</div>
            </div>
            <div class="user-stats-content">
                <el-tooltip content="本项目完成率：按时完成/已完成任务数" placement="right" effect="light">
                    <div class="user-label">自评</div>
                </el-tooltip>
                <div style="font-size:0.5rem">{{ curUserEvalution.user?.scoreValue || '-' }}</div>
            </div>
        </div>
        <div class="user-tool">
            <el-button @click="clickEvalution">评价</el-button>
        </div>
    </div>
</template>
<script setup>
import {ElButton,ElTooltip,ElRate,ElDialog,ElForm,ElFormItem} from "element-plus";
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
    font-size: 0.5rem;
}
</style>