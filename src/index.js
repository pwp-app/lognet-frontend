import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import keys from './config/keys';
import './styles/main.less';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
    <ConfigProvider locale={zhCN} autoInsertSpaceInButton={false}>
        <GoogleReCaptchaProvider reCaptchaKey={keys.recaptcha} language="zh-CN" useRecaptchaNet="true">
            <Provider store={ store }>
                <App />
            </Provider>
        </GoogleReCaptchaProvider>
    </ConfigProvider>,
    document.getElementById('root')
);
