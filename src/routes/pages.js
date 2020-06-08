import SitesPage from '../views/app/sites';
import SiteDetailPage from '../views/app/sitedetail';
import UserSettingsPage from '../views/app/usersettings';
import MissionPage from '../views/app/mission';

export default [
    {
        path: '',
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
        noSubmenu: true,
        children: [
            {
                path: '/detail',
                param: '/:id',
                title: '站点详情',
                component: SiteDetailPage,
                auth: 'user'
            },
            {
                path: '/mission',
                param: '/:id',
                title: '任务详情',
                component: MissionPage,
                auth: 'user'
            }
        ]
    },
    {
        path: '/user',
        title: '用户设置',
        icon: 'SettingOutlined',
        component: UserSettingsPage,
        auth: 'user',
    }
]