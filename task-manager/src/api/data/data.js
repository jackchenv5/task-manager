import { get, patch, post, del } from '@/utils/httpData'
import { objectToQueryString } from '@/utils/public'

// 获取用户任务数据
export const getTaskDataApi = (params) => get('/tasks', params)

// 提交任务修改
export const taskModifyApi = (pk, params) => patch(`/tasks/${pk}/`, params);

// 提交任务增加
export const taskAddApi = (params) => post(`/tasks/`, params);

// 提交任务删除
export const taskDeleteApi = (id) => del(`/tasks/${id}`);

// 批量下发任务
export const taskPublishApi = (params) => get('/task/notify-tasks-by-receiver/', params);
// 用法：
//  ids: 以","衔接的ID字符串
//  publisher : 发布者的用户ID
// data = [1,2,3,4,5]
// const params = {
//     ids: data.join(","),
//     publisher: userInfo.id
//   }

// 获取组信息
export const getUserGroupApi = (params) => get('/groups', params);


export const groupListApi = getUserGroupApi

export const groupDeleteApi = (pk) => del(`groups/${pk}`);

export const groupModifyApi = (pk, data) => patch(`groups/${pk}/`, data);

export const groupAddApi = (params) => {
  let postData = params ? params : { name: '' }
  return post('groups/', postData);
}
// 获取组信息 END


// 用户信息

// 获取用户任务数据

// 模拟登陆，用于测试
export const checkLogin = () => get('/users/check_login/')
export const getUserByUsername = (name) => get(`/users/get_by_username/${name}`)

export const getUserApi = (params) => get('/users', params)

export const getUserDetailApi = (id) => get(`/users/${id}`);

// 保存用户配置
export const saveConfig = (id, data) => patch(`/users/${id}/`, { config: data })


export const userIDApi = (usernames) => get(`/users/ids/by_usernames/${usernames}`);

// export const userDetailApi = (id) =>get(`/users/${id}`);

// export const userListApi = (params) =>get('/users/',params);

export const userDeleteApi = (pk) => del(`/users/${pk}`);

export const userModifyApi = (pk, data) => patch(`/users/${pk}/`, data);

export const roleListApi = (params) => get('/roles/', params);


// 获取项目信息

export const getProjectList = (params) => get('/projects/', params)
export const addProject = (params) => post('/projects/', params)
export const modifyProject = (name, params) => patch(`/projects/${name}/`, params)
export const deleteProject = (name) => del(`/projects/${name}`)

// 评论
export const commitEvalution = (params) => post('/evaluations/', params)

export const updateEvalution = (id, params) => patch(`/evaluations/${id}/`, params)

export const getEvaluation = (params) => get('/evaluations/', params)


//获取日志

export const getLogList = (params) => get('/logs/', params)


export const importTask = (uerId) => {
 const ret = `${import.meta.env.VITE_API_BASE_URL}task/import/${uerId}/`
 console.log('ret url ...',ret)
 return ret
}

export const exportUrl = (filterObj) => {
  let params = objectToQueryString(filterObj)
  let url = `${import.meta.env.VITE_API_BASE_URL}task/export/`
  if (params) {
    url = `${import.meta.env.VITE_API_BASE_URL}task/export/?${params}`
  }
  window.open(url);
}

export const exportTestUrl = (filterObj) => {
  let params = objectToQueryString(filterObj)
  let url = `${import.meta.env.VITE_API_BASE_URL}task/export_test/`
  if (params) {
    url = `${import.meta.env.VITE_API_BASE_URL}task/export_test/?${params}`
  }
  window.open(url);
}
export const exportTemplateUrl = () => {
  let url = `${import.meta.env.VITE_API_BASE_URL}task/export_template/`
  window.open(url);
}