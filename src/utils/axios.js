import axios from 'axios';

const ignoreURL = ['/user/fetchInfo'];

axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

axios.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        if (error.response) {
            // 拦截401，发生401就跳回登录
            if (error.response.status === 401 && !ignoreURL.includes(error.response.config.url)) {
                window.location.href = '/portal';
            }
            return Promise.reject(error.response.data);
        }
    }
);

export default axios;