import _axios from 'axios';
import qs from 'qs';

const axios = _axios.create();

axios.defaults.baseURL = '';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
    return qs.stringify(data, {
        arrayFormat: 'brackets'
    });
}];

export default axios;