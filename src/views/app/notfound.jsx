import React from 'react';
import { Button } from 'antd';

class NotFoundPage extends React.Component {
    goBack() {
        window.history.go(-1);
    }
    render() {
        return (
            <div className="page-notfound">
                <div className="container container-fullpage container-notfound">
                    <div className="notfound-text">
                        <p>404 not found</p>
                        <p>你来到了一片荒原</p>
                    </div>
                    <div className="notfound-action">
                        <Button type="primary" size="large" shape="round" onClick={this.goBack}>返回之前的页面</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default NotFoundPage;