import { get} from '@/utils/httpLogin'


// 检查登陆
export const checkLogin = () => get('/users/check_login/')