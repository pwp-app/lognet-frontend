import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { ConfigProvider } from 'antd';
import './styles/main.less';

ReactDOM.render(
    <ConfigProvider autoInsertSpaceInButton={false}>
        <App />
    </ConfigProvider>,
    document.getElementById('root')
);
