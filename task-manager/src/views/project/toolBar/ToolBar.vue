<template>
    <div class="user-bar">
        <el-button class="bar-item">导出报表</el-button>
        <el-button class="bar-item">邮件通知</el-button>
        <el-badge :value="12" class="item">
            <el-button >查看日志</el-button>
        </el-badge>
        
    </div>
</template>
<style scoped>
.user-bar  {
    border-left: 5px solid rgb(51, 53, 51);
    margin-top:5px;
    background:white;
    height:6vh;
    display: flex;
    align-items:center;

}

.bar-item{
    margin:0 10px;
}
</style>