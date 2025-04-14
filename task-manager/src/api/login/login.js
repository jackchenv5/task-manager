import { get} from '@/utils/httpLogin'


// 获取用户列表（GET请求带参数）
export const checkLogin = (params) => get('/check_login', params)