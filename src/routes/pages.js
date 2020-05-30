import SitesPage from '../views/app/sites';

export default [
    {
        path: '/',
        title: '仪表盘',
        icon: 'DashboardOutlined',
    },
    {
        path: '/sites',
        title: '站点管理',
        icon: 'CloudServerOutlined',
        component: SitesPage,
    },
    {
        path: '/user',
        title: '用户设置',
        icon: 'SettingOutlined'
    }
]