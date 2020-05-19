const CracoLessPlugin = require('craco-less');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    modifyVars: { '@primary-color': '#facd4b' },
                    javascriptEnabled: true,
                },
            },
        },
        {
            plugin: AntdDayjsWebpackPlugin
        }
    ],
};
