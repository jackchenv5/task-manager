import { defineStore } from 'pinia'

import { ref } from 'vue'

import {
    groupListApi, groupModifyApi, groupAddApi, groupDeleteApi,
    getUserApi
} from '@/api/data/data'


export const useSystemStore = defineStore('system', () => {

    // 组数据
    const groupTableDataRef = ref([])
    const groupSearchTextRef = ref('')

    // 更新查询字符
    const updateSearchText = (searchText) => {
        groupSearchTextRef.value = searchText
    }

    const addGroup = async (id, data) => {
        const ret = await groupAddApi(id, data)
        console.log('返回组修改结果：', id, ret)
        updateGroupTableData()
    }

    const deleteGroup = async (id) => {
        const ret = await groupDeleteApi(id)
        console.log('返回组修改结果：', id, ret)
        updateGroupTableData()
    }

    const modifyGroup = async (id, data) => {
        const ret = await groupModifyApi(id, data)
        console.log('返回组修改结果：', id, ret)
        updateGroupTableData()
    }

    const updateGroupTableData = async (params) => {
        const groupList = await groupListApi(params)

        groupTableDataRef.value = groupList?.result?.items.length > 0 ? groupList.result.items : []
    }

    // 组数据 END

    // 用户数据

    const userListData = ref([])
    const updateUserData = async () => {
        const tmpData = await getUserApi()
        userListData.value = tmpData.result?.items.length > 0 ? tmpData.result.items : []
    }
    // 用户数据 END

    // 角色数据
    // 角色数据 END

    //group数据
    return {
        groupTableDataRef, groupSearchTextRef, updateSearchText, updateGroupTableData, modifyGroup, addGroup, deleteGroup,
        // 用户数据
        userListData, updateUserData
    }

})
