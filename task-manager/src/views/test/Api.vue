<template>
    <button @click="testGetUserDataApi">getUserDataApi</button>
    <!-- 使用默认样式 -->
    <Test @click="handleClick">默认按钮</Test>
    <!-- <Select style="width: 500px;"  @change="handleSelectChange" v-model="selectedOption" :api="getUserApi"  label-field="username" value-field="id" filterable multiple :filter-field="['username','emp_num','email']" ></Select> -->
    <SelectUserDialog :visible="isShowSelectUserDialog" v-model="selectUsers" @change="handleSelectChange" @update:visible="updateVisible" @comfirm="selectUserConfirm"></SelectUserDialog>
</template>
<script setup>
import { useUserStore } from '@/stores/user'
import Test from '@/components/tests/Test.vue'
import Select from '@/components/selects/MutiSelect.vue'
import SelectUserDialog from '@/components/dialog/SelectUser.vue'
import { getTaskDataApi } from '@/api/data/data'
const userStore = useUserStore()
// import { loginUser, checkAndLogin, getUserConfig, setUserConfig, saveUserConfig } from '@/stores/user'

import { ref, watch } from 'vue'

const isShowSelectUserDialog = ref(true)

const handleClick = () => {

    // isShowSelectUserDialog.value = false
    isShowSelectUserDialog.value = true
}

const updateVisible= (newValue,isConfirm) =>{

    isShowSelectUserDialog.value = newValue
}

const selectUsers = ref() // 默认选中 Option1


const handleSelectChange = (value) => {


}
const selectUserConfirm = (isConfirm) =>{

}

</script>