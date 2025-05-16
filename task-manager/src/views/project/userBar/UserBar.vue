<template>
    <div class="user-bar">
        <div class="user-info">
            <el-tooltip content="当前状态：繁忙" placement="right" effect="light">
                <div class="user-status"></div>
            </el-tooltip>

            <div class="user-tag">陈成</div>

        </div>
        <div class="user-item">
            <Icon icon="hugeicons:date-time" :width="35" color="#337ecc" />
            <div class="user-stats-content">
                <el-tooltip content="本项目投入总工时:天" placement="right" effect="light">
                    <div  class="user-label">总工时</div>
            </el-tooltip>
                <div  style="font-size:0.8rem">60天</div>
            </div>
            <div class="user-stats-content">
                <el-tooltip content="本项目已完成工时:天" placement="right" effect="light">
                    <div  class="user-label">已完成</div>
            </el-tooltip>
                <div  style="font-size:0.8rem">30天</div>
            </div>
            <div class="user-stats-content">
                <el-tooltip content="本项目完成进度：个人已完成工时/个人总工时" placement="right" effect="light">
                    <div class="user-label">进度</div>
            </el-tooltip>
                <div  style="font-size:0.8rem">60%</div>
            </div>
            
        </div>
        <div class="user-item">
            <Icon icon="mdi:achievement-outline" :width="35" color="rgb(245 111 108)" />
            <div class="user-stats-content">
                <el-tooltip content="本项目投入总工时:天" placement="right" effect="light">
                    <div  class="user-label">贡献</div>
            </el-tooltip>
                <div  style="font-size:0.8rem">大</div>
            </div>
            <div class="user-stats-content">
                <el-tooltip content="本项目投入比例：本人工时/项目工时" placement="right" effect="light">
                    <div  class="user-label">参与度</div>
            </el-tooltip>
                <div  style="font-size:0.8rem">6%</div>
            </div>
            <div class="user-stats-content">
                <el-tooltip content="本项目完成率：按时完成/已完成任务数" placement="right" effect="light">
                    <div class="user-label">完成率</div>
            </el-tooltip>
                <div  style="font-size:0.8rem">60%</div>
            </div>
            
        </div>
    </div>
</template>
<script setup>
import { Icon } from '@iconify/vue';

</script>
<style scoped>
.user-bar {
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
    /* margin: 0 10px; */

    padding:8px;
    /* border: 0; */
    transition: all 0.2s;

}

.user-item {
    width: 12vw;
    border: 1px solid rgb(198, 207, 207);
    display: flex;
    justify-content: space-around;
    align-items: center;
    /* margin: 0 10px; */

    padding:8px;
    /* border: 0; */
    transition: all 0.2s;

}
.user-item:hover {
    border:0;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
    /* box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.2); 内部阴影 */
}
.user-tag {
    background-color:black;
    padding: 5px 10px;
    color:white;
    border: 1px solid black;
    border-radius: 10px;
}

.user-status {
    background-color: red;
    width: 30px;
    height: 20px;
    border-radius: 10px;

}
.user-stats-content{
    display:flex;
    flex-direction:column;
    height:100%;
    justify-content:space-around;
}

.user-label{
    color: #00000073;  
    font-size: 0.8rem;
}
</style>