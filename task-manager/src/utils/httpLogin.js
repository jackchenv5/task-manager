import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建实例
const service = axios.create({
  baseURL: import.meta.env.VITE_LOGIN_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

// 请求拦截器（自动注入Token）
service.interceptors.request.use(config => {
  console.log('请求拦截器：...')
  return config
})

// 响应拦截器（统一错误处理）
service.interceptors.response.use(
  response => response.data,
  error => {
    const statusMessages = {
      400: '请求参数错误',
      401: '登录已过期',
      403: '没有权限',
      500: '服务器错误'
    }
    ElMessage.error(statusMessages[error.response?.status] || '网络异常')
    return Promise.reject(error)
  }
)

// 封装基础方法
export const request = (options) => service(options)
export const get = (url, params) => service.get(url, { params })
export const post = (url, data) => service.post(url, data)