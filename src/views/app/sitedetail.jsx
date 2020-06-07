import React from 'react';
import { connect } from 'react-redux';
import { Card, Row, Col } from 'antd';

const mapState = (state) => ({
    sites: state.sites,
});

class SiteDetailPage extends React.Component {
    state = {
        site: null,
    }
    findSite(id) {
        
    }
    render() {
        return (
            <div className="page-site">
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card>
                            
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(mapState, null)(SiteDetailPage);