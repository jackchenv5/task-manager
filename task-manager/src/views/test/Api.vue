<template>
<button @click="testGetUserDataApi">getUserDataApi</button>
</template>
<script setup>
import {useUserStore}  from '@/stores/user'

const userStore = useUserStore()
// import { loginUser, checkAndLogin, getUserConfig, setUserConfig, saveUserConfig } from '@/stores/user'

const testGetUserDataApi = () =>{
    userStore.setUserConfig('c',{d:1})
    console.log(userStore.getUserConfig())
    console.log(userStore.getUserConfig('c'))
    userStore.saveUserConfig()
}

</script>