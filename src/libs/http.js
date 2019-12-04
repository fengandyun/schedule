import axios from 'axios';
import { Message } from 'element-ui';
require('promise.prototype.finally').shim()

axios.defaults.timeout = 3000;
// axios.defaults.baseURL = 'https://www.sensorsdata.cn/api/support/';
// Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api/support'
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Cache-Control'] = 'no-cache';


axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    });
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error)
    });
const http = (request, data) => {
    
    return new Promise((resolve, reject) => {
        let method = request.method,
            params = ['get', 'delete', 'head'].indexOf(method) > -1 ? {
                params: data
            } : {
                data: data
                };
        axios({
            ...request,
            ...params
        }).then(response => {
            // Message.success(request.url + ':调用成功');
            resolve(response.data.data);
        }, err => { // 统一处理后端返回的 error 信息
            Message.error(request.url + ':调用失败');
            reject(err)
        })
    })
}


const url = {
    submit: {
        url: '/submitScheduling',
        method: 'post'
    },
    search: {
        url: '/getScheduling',
        method: 'get',
    },
    getPersonAndAccount: {
        url:'/getDutyPersonsAndAccounts',
        method:'get'
    }
}

export {
    http,
    url
}