import React from 'react';
import { Card, Col } from 'antd';
import Icon from '../common/icon';

class IconCard extends React.Component {
    render() {
        return (
            <Col span={this.props.span}>
                <Card className="icon-card">
                    <div className="icon-card-left">
                        <div className="icon-card-left-inner">
                            <Icon type={this.props.icon}></Icon>
                        </div>
                    </div>
                    <div className="icon-card-right">
                        <div className="icon-card-right-desc">
                            <span>{this.props.desc}</span>
                        </div>
                        <div className="icon-card-right-num">
                            <span>{this.props.number}</span>
                        </div>
                    </div>
                </Card>
            </Col>
        )
    }
}

export default IconCard;