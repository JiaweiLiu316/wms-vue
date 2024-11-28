import axios from 'axios';
import { ElMessage } from 'element-plus';

console.log('Base URL:', import.meta.env.VITE_APP_BASE_API);

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API + '/api', // url = base url + request url
  timeout: 15 * 1000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.error('Request Error:', error); // 调试用
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data; // 返回 data 部分
    }
  },
  error => {
    if (error.response) {
      console.error('Error Response:', error.response);
      ElMessage({
        message: error.response.data.message || 'Request failed',
        type: 'error',
        duration: 5 * 1000
      });
    } else if (error.request) {
      console.error('No Response:', error.request);
      ElMessage({
        message: 'No response from server',
        type: 'error',
        duration: 5 * 1000
      });
    } else {
      console.error('Error Message:', error.message);
      ElMessage({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      });
    }
    return Promise.reject(error);
  }
);

export default service;
