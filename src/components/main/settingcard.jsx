import React from 'react';
import { Card } from 'antd';
import { RightOutlined } from '@ant-design/icons';

class SettingCard extends React.Component {
    render() {
        return (
            <Card className="setting-card" title={this.props.title}>
                <div className="setting-card-content">
                    { this.props.content }
                </div>
                <div className="setting-card-action">
                    <span>{ this.props.actionName }<RightOutlined/></span>
                </div>
            </Card>
        );
    }
}

export default SettingCard;
