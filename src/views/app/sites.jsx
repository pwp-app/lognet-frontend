import React from 'react';
import { Row } from 'antd';
import IconCard from '../../components/main/iconcard';

class SitesPage extends React.Component {
    state = {
        stats: {
            total: 0,
            recentWeekSubmit: 0,
            recentMonthSubmit: 0,
        }
    }
    render() {
        return (
            <div className="page-sites">
                <Row gutter={16}>
                    <IconCard span={8} icon="CloudServerOutlined" desc="站点数" number={this.state.stats.total}></IconCard>
                    <IconCard span={8} icon="BugOutlined" desc="近 7 天错误提交量" number={this.state.stats.recentWeekSubmit}></IconCard>
                    <IconCard span={8} icon="FileOutlined" desc="近 30 天错误提交量" number={this.state.stats.recentMonthSubmit}></IconCard>
                </Row>
                <Row>

                </Row>
            </div>
        );
    }
}

export default SitesPage;