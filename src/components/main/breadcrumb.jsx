import React from 'react';
import { Breadcrumb } from 'antd';
import { withRouter, Link } from 'react-router-dom';
class BreadCrumbPart extends React.Component {
    state = {
        breadcrumb: null,
    };

    getRouteTitle = (routes, path) => {
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].path === path) {
                return routes[i].title;
            }
            if (routes[i].children) {
                let ret = this.getRouteTitle(routes[i].children, path);
                if (ret) {
                    return ret;
                }
            }
        }
        return null;
    };

    getPath = (routes) => {
        let path = window.location.pathname.replace('/app/', '').replace('/app', '').split('/');
        if (path[path.length - 1].length === 32) {
            path = path.slice(0, path.length - 1);
        }
        let ret = [];
        let link = '';
        for (let i = 0; i < path.length; i++) {
            let p = path[i].length > 0 ? `/${path[i]}` : null;
            link += ('/' + path[i]);
            if (p) {
                console.log(this.getRouteTitle(routes, p));
                ret.push(<Breadcrumb.Item key={p}>{i < path.length - 1 ? <Link to={`/app${link}`}>{this.getRouteTitle(routes, p)}</Link> : this.getRouteTitle(routes, p)}</Breadcrumb.Item>);
            }
        }
        ret = ret.filter((i) => i);
        if (ret.length < 1) {
            ret.push(<Breadcrumb.Item key="/app">仪表盘</Breadcrumb.Item>);
        }
        return ret;
    };

    componentDidMount() {
        this.setState({
            breadcrumb: this.getPath(this.props.routes),
        });
        this.props.history.listen(() => {
            this.setState({
                breadcrumb: this.getPath(this.props.routes),
            });
        });
    }

    render() {
        return <Breadcrumb style={{ display: 'inline-block' }}>{this.state.breadcrumb}</Breadcrumb>;
    }
}

export default withRouter(BreadCrumbPart);
