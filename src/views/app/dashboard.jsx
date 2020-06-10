import React from 'react';
import { Row, Col, Card, Table, Button, message } from 'antd';
import { EyeFilled } from '@ant-design/icons';
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
        running: [],
        running_loading: true,
        running_pagination: {
            page: 1,
            pageSize: 10,
        }
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
        }, () => {
            message.error('获取日志统计数据失败');
        })
    }
    fetchRunning = (pagination) => {
        axios.get('/dashboard/listRunningMission', {
            params: {
                page: pagination.page,
                pageSize: pagination.pageSize
            }
        }).then(res => {
            if (res.data.code === 200) {
                this.setState({
                    running: res.data.data.data,
                    running_loading: false,
                    running_pagination: {
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                        total: res.data.data.total,
                    }
                });
            }
        }, () => {
            message.error('获取任务数据失败');
        })
    }
    handleRunningMissionChange = (pagination, filters, sorter) => {
        this.setState({
            running_pagination: pagination,
        }, () => {
            this.fetchRunning(this.state.running_pagination);
        });
    }
    componentDidMount = () => {
        // 初始化统计数据
        this.fetchStats();
        this.fetchHotPath();
        this.fetchRunning(this.state.running_pagination);
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
        ];
        const running_columns = [
            {
                title: '站点域名',
                dataIndex: 'domain',
                key: 'domain',
            },
            {
                title: '任务名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '开始日期',
                dataIndex: 'startTime',
                key: 'startTime',
                render: (text) => text && text.length > 0 ? text.split(' ')[0] : '-'
            },
            {
                title: '结束日期',
                dataIndex: 'endTime',
                key: 'endTime',
                render: (text) => text && text.length > 0 ? text.split(' ')[0] : '-'
            },
            {
                title: '操作',
                key: 'operation',
                render: (_, record) => {
                    return (
                        <Button key={'btn_edit_' + record.id} icon={<EyeFilled/>} onClick={
                            () => {
                                this.props.history.push(`/app/sites/mission/${record.id}?from=dashboard`);
                            }
                        }></Button>
                    )
                }
            }
        ];
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
                        <Card title="正在运行的日志收集任务" className="card-table">
                            <Table columns={running_columns} dataSource={this.state.running} loading={this.state.running_loading} pagination={this.state.running_pagination} rowKey={(row) => row.id} />                       </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default DashBoardPage;