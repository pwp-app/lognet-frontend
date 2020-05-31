import React from 'react';
import { Row, Col, Card, Table, message } from 'antd';
import { connect } from 'react-redux';
import SettingCard from '../../components/main/settingcard';
import SettingIconCard from '../../components/main/settingiconcard';
import axios from '../../utils/axios';

const mapState = (state) => ({
    user: state.user,
});
const mapDispatch = ({ user: { setUser, setEmail } }) => ({
    setUser: (user) => setUser(user),
    setEmail: (email) => setEmail(email),
});

const logTableColumns = [
    {
        title: '登录时间',
        dataIndex: 'createTime',
        key: 'createTime',
    },
    {
        title: '登录IP',
        dataIndex: 'ip',
        key: 'ip',
    },
    {
        title: '登陆地点',
        dataIndex: 'geo',
        key: 'geo',
    },
];

class UserSettingsPage extends React.Component {
    state = {
        recentLogs: [],
    };
    componentDidMount = () => {
        axios
            .get('/user/fetchLoginLog')
            .then((res) => {
                if (res.data && res.data.code === 200) {
                    this.setState({
                        recentLogs: res.data.data,
                    });
                } else {
                    message.error('获取登录记录失败');
                }
            })
            .catch(() => {
                message.error('获取登录记录失败');
            });
    };
    render() {
        return (
            <div className="page-us">
                <Row gutter={[18, 18]}>
                    <Col span={12}>
                        <SettingCard
                            title="邮箱设置"
                            content={
                                <>
                                    <p>您当前绑定的邮箱为：</p>
                                    <p>{this.props.user.email}</p>
                                </>
                            }
                            actionName="更换绑定"
                        />
                    </Col>
                    <Col span={12}>
                        <SettingCard
                            title="头像设置"
                            content={
                                <>
                                    <p>我们将根据您绑定的邮箱来获取您的头像，</p>
                                    <p>如果您需要设置您的头像，需要前往 Gravatar 进行设置。</p>
                                </>
                            }
                            actionName="立即前往"
                        />
                    </Col>
                    <Col span={12}>
                        <SettingIconCard icon="LockFilled" title="修改密码" content={<p>我们建议您定期修改密码来提升帐号的安全保护强度</p>} actionName="立即修改" />
                    </Col>
                    <Col span={12}></Col>
                    <Col span={24}>
                        <Card className="us-card-logs" title="最近 10 次登录记录">
                            <Table dataSource={this.state.recentLogs} columns={logTableColumns} pagination={false} />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(mapState, mapDispatch)(UserSettingsPage);
