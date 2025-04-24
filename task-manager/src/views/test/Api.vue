<template>
    <button @click="testGetUserDataApi">getUserDataApi</button>
    <!-- 使用默认样式 -->
    <Test @click="handleClick">默认按钮</Test>
    <!-- <Select style="width: 500px;"  @change="handleSelectChange" v-model="selectedOption" :api="getUserApi"  label-field="username" value-field="id" filterable multiple :filter-field="['username','emp_num','email']" ></Select> -->
    <SelectUserDialog :visible="isShowSelectUserDialog" v-model="selectUsers" @change="handleSelectChange" @update:visible="updateVisible"></SelectUserDialog>
</template>
<script setup>
import { useUserStore } from '@/stores/user'
import Test from '@/components/tests/Test.vue'
import Select from '@/components/selects/MutiSelect.vue'
import SelectUserDialog from '@/components/dialog/SelectUser.vue'
import { getUserApi } from '@/api/data/data'
const userStore = useUserStore()
// import { loginUser, checkAndLogin, getUserConfig, setUserConfig, saveUserConfig } from '@/stores/user'

import { ref, watch } from 'vue'

const isShowSelectUserDialog = ref(true)


const handleClick = () => {
    console.log('按钮被点击了')
    // isShowSelectUserDialog.value = false
    isShowSelectUserDialog.value = true
}

const updateVisible= (newValue) =>{
    console.log('来自子组件的更新:',newValue)
    isShowSelectUserDialog.value = newValue
}

const selectUsers = ref() // 默认选中 Option1


const handleSelectChange = (value) => {
    console.log('在父组件 Selected value:', value)
    console.log(selectUsers.value)
}

</script>