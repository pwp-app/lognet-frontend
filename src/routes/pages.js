import DashboardPage from '../views/app/dashboard';
import SitesPage from '../views/app/sites';
import SiteDetailPage from '../views/app/sitedetail';
import UserSettingsPage from '../views/app/usersettings';
import MissionPage from '../views/app/mission';
import UserManagePage from '../views/app/usermanage';
import SiteManagePage from '../views/app/sitemanage';

export default [
    {
        path: '',
        title: '仪表盘',
        icon: 'DashboardOutlined',
        component: DashboardPage,
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
    },
    {
        path: '/system',
        title: '系统管理',
        icon: 'UserOutlined',
        auth: 'admin',
        children: [
            {
                path: '/user',
                title: '用户管理',
                auth: 'admin',
                component: UserManagePage,
            },
            {
                path: '/sites',
                title: '站点管理',
                auth: 'admin',
                component: SiteManagePage,
            }
        ]
    }
]