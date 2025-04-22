<template>
    <button @click="testGetUserDataApi">getUserDataApi</button>
    <!-- 使用默认样式 -->
    <Test @click="handleClick">默认按钮</Test>
    <Select :options="Options" @change="handleSelectChange" v-model="selectedOption" ></Select>
</template>
<script setup>
import { useUserStore } from '@/stores/user'
import Test from '@/components/tests/Test.vue'
import Select from '@/components/selects/MutiSelect.vue'
const userStore = useUserStore()
// import { loginUser, checkAndLogin, getUserConfig, setUserConfig, saveUserConfig } from '@/stores/user'

import { ref } from 'vue'
const handleClick = () => {
    console.log('按钮被点击了')
}
const Options = [
    { value: 'Option1', label: 'Option1' },
    { value: 'Option2', label: 'Option2' },
    { value: 'Option3', label: 'Option3' },
    { value: 'Option4', label: 'Option4' },
    { value: 'Option5', label: 'Option5' }
]

const selectedOption = ref('Option1') // 默认选中 Option1

const handleSelectChange = (value) => {
    console.log('Selected value:', value)
}
const testGetUserDataApi = () => {
    userStore.setUserConfig('c', { d: 1 })
    console.log(userStore.getUserConfig())
    console.log(userStore.getUserConfig('c'))
    userStore.saveUserConfig()
}

</script>