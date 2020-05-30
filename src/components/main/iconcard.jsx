import React from 'react';
import { Card, Col } from 'antd';
import Icon from '../common/icon';

class IconCard extends React.Component {
    render() {
        return (
            <Col span={this.props.span}>
                <Card className="iconcard">
                    <div className="iconcard-left">
                        <Icon type={this.props.icon}></Icon>
                    </div>
                    <div className="iconcard-right">
                        <div className="iconcard-right-desc">
                            <span>{this.props.desc}</span>
                        </div>
                        <div className="iconcard-right-num">
                            <span>{this.props.number}</span>
                        </div>
                    </div>
                </Card>
            </Col>
        )
    }
}

export default IconCard;