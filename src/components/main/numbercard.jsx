import React from 'react';
import { Card, Col } from 'antd'

class NumberCard extends React.Component {
    render() {
        return (
            <Col span={this.props.span}>
                <Card className="numbercard">
                    <div className="numbercard-title">
                        <span>{this.props.title}</span>
                    </div>
                    <div className="numbercard-number">
                        <span>{this.props.number}</span>
                    </div>
                </Card>
            </Col>
        )
    }
}

export default NumberCard