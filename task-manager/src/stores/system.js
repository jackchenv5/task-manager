import { defineStore } from 'pinia'

import { ref } from 'vue'

import {
    groupListApi, groupModifyApi, groupAddApi, groupDeleteApi,
    getUserApi,userModifyApi,getProjectList,modifyProject,deleteProject,addProject,
    roleListApi
} from '@/api/data/data'


export const useSystemStore = defineStore('system', () => {

    // 组数据
    const groupTableDataRef = ref([])
    const groupSearchTextRef = ref('')

    // 更新查询字符
    const updateSearchText = (searchText) => {
        groupSearchTextRef.value = searchText
    }

    const addGroup = async (data) => {
        const ret = await groupAddApi(data)
        updateGroupTableData()
        return ret.id ? true : false
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

    const roleListRef = ref([])
    const updateRoleList = async () => {
        const tmpData = await roleListApi()
        roleListRef.value = tmpData.result?.items.length > 0 ? tmpData.result.items : []
    }

    const modifyUser = async (id, data) => {
        const ret = await userModifyApi(id, data)
        console.log('返回组修改结果：', id, ret)
        updateUserData()
    }

    // 角色数据 END

    // 项目数据
    const projectListRef = ref()
    const updateProjectList = async () => {
        const tmpData = await getProjectList()
        projectListRef.value = tmpData?.length > 0 ? tmpData : []
        console.log(projectListRef.value)
    }
    const modifyP = async (name,data) => {
        const ret = await modifyProject(name,data)
        updateProjectList()
    }

    const delProject = async (name) => {
        const ret = await deleteProject(name)
        updateProjectList()
    }

    const addP = async (data) => {
        const ret = await addProject(data)
        updateProjectList()
    }
    // 项目数据 END
    return {
        groupTableDataRef, groupSearchTextRef, updateSearchText, updateGroupTableData, modifyGroup, addGroup, deleteGroup,
        // 用户数据
        userListData, updateUserData,modifyUser,
        //角色数据
        roleListRef,updateRoleList,
        //项目数据
        projectListRef,updateProjectList,modifyP,delProject,addP
    }

})
