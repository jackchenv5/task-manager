<template>
    <div style="height: 4vh;">
        <el-row>
            <el-col :span="12">
                <div style="margin-top: 5px;color:white;background-color: black;border-radius: 5px;">项目池</div>
            </el-col>
            <el-col :span="8" :offset="3">
                <el-button>添加</el-button>
                <el-button>清空</el-button>
            </el-col>
        </el-row>
        <el-scrollbar style="height: 14vh;">
            <el-tag v-for="item in projectPool" :key="item" type="warning" style="width: 95%;margin-bottom: 3px;"
                closable>{{
                    item }}</el-tag>
        </el-scrollbar>
    </div>
</template>
<script setup>

</script>