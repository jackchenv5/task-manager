<template>
<button @click="testGetUserDataApi">getUserDataApi</button>
</template>
<script setup>
import {getUserDataApi} from '@/api/data/data'

const testGetUserDataApi = async ()=>{
    const data = await getUserDataApi({recever:1009,start_time:'2025-04-11',deadline_time: "2025-05-11",})
    console.log(data)
}

</script>