import axios from 'axios';
let API_BASE_URL = '/api/v1/pca';

// 创建axios实例
const _axios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000
});
// 请求拦截器
_axios.interceptors.request.use(
  (config) => {
    // 添加请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    // 处理错误请求
    return Promise.reject(new Error(error));
  }
);

// 响应拦截器
_axios.interceptors.response.use();

export default _axios;
