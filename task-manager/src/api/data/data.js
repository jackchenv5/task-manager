import { get,patch} from '@/utils/httpData'

// 获取用户任务数据
export const getUserApi = (params) => get('/users', params)

// 保存用户配置

export const saveConfig = (id,data) => patch(`/users/${id}/`,{config:data})

// 获取用户任务数据
export const getTaskDataApi = (params) => get('/tasks', params)

