import axios from 'axios';

axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

export default axios;