import React from 'react';
import { Card } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import Icon from '../common/icon';

class SettingIconCard extends React.Component {
    actionClicked = (e) => {
        if (typeof this.props.action === 'function') {
            this.props.action(e);
        }
    };
    render() {
        return (
            <Card className="setting-iconcard">
                <div className="setting-iconcard-icon">
                    <Icon type={this.props.icon} />
                </div>
                <div className="setting-iconcard-main">
                    <div className="setting-iconcard-title">
                        <span>{this.props.title}</span>
                    </div>
                    <div className="setting-iconcard-content">{this.props.content}</div>
                    <div className="setting-iconcard-action" onClick={this.actionClicked}>
                        <span>
                            {this.props.actionName}
                            <RightOutlined />
                        </span>
                    </div>
                </div>
            </Card>
        );
    }
}

export default SettingIconCard;
