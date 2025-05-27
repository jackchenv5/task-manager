import { get,patch,post,del} from '@/utils/httpData'


// 获取用户任务数据
export const getTaskDataApi = (params) => get('/tasks', params)

// 提交任务修改
export const taskModifyApi = (pk, params) => patch(`/tasks/${pk}/`,params);

// 提交任务增加
export const taskAddApi = (params) => post(`/tasks/`,params);

// 提交任务删除
export const taskDeleteApi = (id) => del(`/tasks/${id}`);

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

// 获取组信息
export const getUserGroupApi = (params) => get('/groups', params);


export const groupListApi = getUserGroupApi

export const groupDeleteApi = (pk) => del(`groups/${pk}`);

export const groupModifyApi = (pk, data) =>patch(`groups/${pk}/`,data);

export const groupAddApi = (params) =>{
    let postData = params ? params : {name: ''}
    return  post('groups/',postData);
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
export const saveConfig = (id,data) => patch(`/users/${id}/`,{config:data})


export const userIDApi = (usernames) => get(`/users/ids/by_usernames/${usernames}`);

// export const userDetailApi = (id) =>get(`/users/${id}`);

// export const userListApi = (params) =>get('/users/',params);

export const userDeleteApi =  (pk) =>del(`/users/${pk}`);

export const userModifyApi =  (pk,data) =>patch(`/users/${pk}/`,data);

export const roleListApi = (params) =>get('/roles/',params);


// 获取项目信息
// export const getProjectApi = (params) => get('/projects', params)
export const getProjectApi = (params) => {
    return {
        code: 0,
        message: "ok",
        result: {
            items: [{id: 1, name: "SW-V001R008C008(PB076)_信创盒式智联交换机产品研发"},
                    {id: 2, name: "SW-V001R006C000_A50 7132 sonic交换机项目"},
                    {id: 3, name: "SW-V001R007C000_A80 25G Sonic盒式交换机产品研发"},
                    {id: 4, name: ""},
                    {id: 5, name: "SW-V010R002C002(PB069)_4U及1U高端数据中心交换机项目"},
                    {id: 6, name: "SW-V010R002C305_25年园区网交换机专项版本"},
                    {id: 7, name: "部门管理"},
                    {id: 8, name: "SW-V010R001C236(PB072)_2U4槽数据中心盒式交换机"},
                    {id: 9, name: "SW-V010R002C306_2025年数据中心专项版本"},
                    {id: 10, name: "FITAP-TT-2024-001_2024无线专项能力提升改进"},
                    {id: 11, name: "FITAP-V400R001C000(PW010)_基于Wi-Fi 7技术的全新一代AP产品开发项目"},
                    {id: 12, name: "SW-V010R002C004(PB073)_信创智能无损TOR交换机产品研发"},
                    {id: 13, name: "CP-V003R016C000_嵌入式软件平台智算网络快速收敛及设备健康度检查等关键技术研发"},
                    {id: 14, name: "临时任务"}],
            total: 10
        },
        type: "success"
    }
}

// 真实project api

export const getProjectList = (params) => get('/projects/',params)
export const addProject = (params) => post('/projects/',params)
export const modifyProject = (name,params) => patch(`/projects/${name}/`,params)
export const deleteProject = (name) => del(`/projects/${name}`)

// 评论
export const commitEvalution = (params) => post('/evaluations/',params)

export const updateEvalution = (id,params) => patch(`/evaluations/${id}/`,params)

export const getEvaluation= (params) => get('/evaluations/',params)


//获取日志

export const getLogList = (params) => get('/logs/',params)


