<template>
    <el-menu default-active="1" class="el-menu-vertical-demo"
    background-color="black"
    text-color="#fff"
    active-text-color="#ffd04b"
     @select="handleSelect"
     >
        <el-menu-item index="1">
            <template #title>
                <el-icon>
                    <House />
                </el-icon>
                <span>组配置</span>
            </template>
        </el-menu-item>
        <el-menu-item index="2">
            <el-icon><User /></el-icon>
            <span>用户权限</span>
        </el-menu-item>
        <el-menu-item index="3">
            <el-icon><User /></el-icon>
            <span>项目</span>
        </el-menu-item>
    </el-menu>

</template>

<script setup>
import {ElMenu,ElMenuItem,ElIcon} from 'element-plus'
const emit = defineEmits(['update:modelValue'])
import {
    House,
    User,
    Location,
    Setting,
} from '@element-plus/icons-vue'
const handleSelect = (key, keyPath) => {
    emit('update:modelValue',key)
}
const props = defineProps({
    modelValue: {  // 默认的 v-model 属性名
        type:String,
        default: '',
    },
})
</script>

<style scoped>
.el-menu-item.is-active {
    background: #a8abb2;
}
</style>