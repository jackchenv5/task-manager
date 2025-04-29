import { get,patch} from '@/utils/httpData'

// 获取用户任务数据
export const getUserApi = (params) => get('/users', params)

export const getUserDetailApi = (id) => get(`/users/${id}`);

// 保存用户配置

export const saveConfig = (id,data) => patch(`/users/${id}/`,{config:data})

// 获取用户任务数据
export const getTaskDataApi = (params) => get('/tasks', params)

// 提交任务修改
export const taskModifyApi = (pk, params) => patch(`/tasks/${pk}/`,params);

// 批量下发任务
export const taskPublishApi = (params) => get('/task/notify-tasks-by-receiver/',params);
// 用法：
//  ids: 以","衔接的ID字符串
//  publisher : 发布者的用户ID
// data = [1,2,3,4,5]
// const params = {
//     ids: data.join(","),
//     publisher: userInfo.id
//   }

// 获取用户组信息
export const getUserGroupApi = (params) => get('/groups', params)

