import React from 'react';
import { Card } from 'antd';
import { RightOutlined } from '@ant-design/icons';

class SettingCard extends React.Component {
    actionClicked = (e) => {
        if (typeof this.props.action === 'function') {
            this.props.action(e);
        }
    }
    render() {
        return (
            <Card className="setting-card" title={this.props.title}>
                <div className="setting-card-content">
                    { this.props.content }
                </div>
                <div className="setting-card-action" onClick={this.actionClicked}>
                    <span>{ this.props.actionName }<RightOutlined/></span>
                </div>
            </Card>
        );
    }
}

export default SettingCard;