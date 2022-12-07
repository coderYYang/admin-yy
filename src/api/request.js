import axios from "axios"
import nprogress from 'nprogress'
// 引入样式
import 'nprogress/nprogress.css'

const request = axios.create({
  baseURL: 'https://lianghj.top:8888/api/private/v1',
  timeout: 5000
})

request.interceptors.request.use(config => {
  nprogress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
}, error => {
  console.log(error)
})

request.interceptors.response.use(res => {
  nprogress.done();
  return res;
},error => {
  console.log(error)
})

export default request
