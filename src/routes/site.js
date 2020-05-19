import LandingPage from '../views/landing';
import PortalPage from '../views/portal';
import NotFoundPage from '../views/404';

const config = [
    {
        path: '/',
        component: LandingPage
    },
    {
        path: '/portal',
        component: PortalPage,
    },
    {
        path: '/404',
        component: NotFoundPage,
    }
]

export default config;