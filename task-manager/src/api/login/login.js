import { get} from '@/utils/httpLogin'


// 检查登陆
export const checkLogin = () => get('/api/check_login')