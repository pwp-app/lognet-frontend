import SitesPage from '../views/app/sites';

export default [
    {
        path: '/',
        title: '仪表盘',
        icon: 'DashboardOutlined',
        auth: 'user',
    },
    {
        path: '/sites',
        title: '站点管理',
        icon: 'CloudServerOutlined',
        component: SitesPage,
        auth: 'user',
    },
    {
        path: '/user',
        title: '用户设置',
        icon: 'SettingOutlined',
        auth: 'user',
    }
]