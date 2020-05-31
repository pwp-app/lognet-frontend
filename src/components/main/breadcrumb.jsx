import React from "react";
import { Breadcrumb } from "antd";
import { withRouter } from 'react-router-dom';
class BreadCrumbPart extends React.Component {

    state = {
        breadcrumb: null
    }

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
        let path = window.location.pathname.replace('/app', '').split("/");
        let ret = path.map(item => {
            let p = item.length > 0 ? `/${item}` : null;
            if (p) {
                return <Breadcrumb.Item key={p}>{this.getRouteTitle(routes, p)}</Breadcrumb.Item>;
            }
            return null;
        });
        ret = ret.filter(i=>i);
        if (ret.length < 1) {
            ret.push(<Breadcrumb.Item key="/app">仪表盘</Breadcrumb.Item>)
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
        return <Breadcrumb style={{ display: "inline-block" }}>{this.state.breadcrumb}</Breadcrumb>;
    }
}

export default withRouter(BreadCrumbPart);