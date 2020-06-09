import React from 'react';
import { Row, Col, Card, Table } from 'antd';
import NumberCard from '../../components/main/numbercard';
import axios from '../../utils/axios';

class DashBoardPage extends React.Component {
    state = {
        stats: {
            sites: 0,
            runningMission: 0,
            todayGeneralLog: 0,
            todayMissionLog: 0,
        },
        hotpath: [],
        hotpath_loading: true,
    }
    fetchStats = () => {
        axios.get('/dashboard/fetchStats').then(res => {
            if (res.data.code === 200) {
                this.setState({
                    stats: res.data.data
                });
            }
        });
    }
    fetchHotPath = () => {
        axios.get('/dashboard/listHotPath').then(res => {
            if (res.data.code === 200) {
                this.setState({
                    hotpath_loading: false,
                    hotpath: res.data.data
                });
            }
        })
    }
    componentDidMount = () => {
        // 初始化统计数据
        this.fetchStats();
        this.fetchHotPath();
    }
    render() {
        const hotpath_columns = [
            {
                title: '站点域名',
                dataIndex: 'domain',
                key: 'domain'
            },
            {
                title: '路径',
                dataIndex: 'path',
                key: 'path'
            },
            {
                title: '错误日志数',
                dataIndex: 'count',
                key: 'count'
            }
        ]
        return (
            <div className="page-dashboard">
                <Row gutter={[16, 16]}>
                    <NumberCard title="接入站点数" number={this.state.stats.sites} span={6}/>
                    <NumberCard title="进行中的任务" number={this.state.stats.runningMission} span={6}/>
                    <NumberCard title="今日普通日志提交量" number={this.state.stats.todayGeneralLog} span={6}/>
                    <NumberCard title="今日任务日志提交量" number={this.state.stats.todayMissionLog} span={6}/>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card title="近3天错误日志较多的路径" className="card-table">
                            <Table columns={hotpath_columns} dataSource={this.state.hotpath} loading={this.state.hotpath_loading} rowKey={(row) => row.domain + row.path} pagination={false}/>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="正在运行的日志收集任务" className="card-title">

                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default DashBoardPage;