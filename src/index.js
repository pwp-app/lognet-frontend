import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { ConfigProvider } from 'antd';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import keys from './config/keys';
import './styles/main.less';

ReactDOM.render(
    <ConfigProvider autoInsertSpaceInButton={false}>
        <GoogleReCaptchaProvider reCaptchaKey={keys.recaptcha} language="zh-CN" useRecaptchaNet="true">
            <App />
        </GoogleReCaptchaProvider>
    </ConfigProvider>,
    document.getElementById('root')
);
