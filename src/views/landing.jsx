import React from 'react';
import { Button } from 'antd';
import { Html5Outlined, DeploymentUnitOutlined, BugOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import logo from '../assets/image/lognet.png';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

class LandingPage extends React.Component {
    goPortal = () => {
        this.props.history.push('/portal');
    }
    render() {
        return (
            <div className="page-landing">
                <Header/>
                <div className="container container-fullpage container-landing">
                    <div className="landing-title">
                        <div className="landing-title-logo">
                            <img src={ logo } alt="Lognet"/>
                        </div>
                        <div className="landing-title-text">
                            <span>专为 WebApps 提供日志收集服务</span>
                        </div>
                        <div className="landing-title-action">
                            <Button type="primary" size="large" shape="round" onClick={this.goPortal}>开始使用</Button>
                        </div>
                    </div>
                    <div className="landing-desc">
                        <div className="landing-desc-title">
                            <span>Tech Spots</span>
                        </div>
                        <div className="landing-desc-content">
                            <div className="landing-desc-row">
                                <span><Html5Outlined/>基于前沿技术打造的面板，稳定易用</span>
                            </div>
                            <div className="landing-desc-row">
                                <span><DeploymentUnitOutlined />简单配置，简单调用，减少你的麻烦</span>
                            </div>
                            <div className="landing-desc-row">
                                <span><BugOutlined />直观的日志呈现，助你快速定位错误</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default withRouter(LandingPage);