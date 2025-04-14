import { get} from '@/utils/httpData'


// 获取用户列表（GET请求带参数）
export const getDataApi = (params) => get('/task_status', params)


export const postDataApi = (data) => post('/post_data', data)