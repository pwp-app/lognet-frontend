const CracoLessPlugin = require('craco-less');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': '#facd4b' },
                        javascriptEnabled: true,
                    }
                },
            },
        },
        {
            plugin: AntdDayjsWebpackPlugin
        }
    ],
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8800',
                pathRewrite: {'^/api' : ''}
            }
        }
    }
};
