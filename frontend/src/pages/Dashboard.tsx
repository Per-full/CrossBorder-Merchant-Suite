import React from 'react';
import { Row, Col, Card, Statistic, Table } from 'antd';
import { ShoppingOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">仪表板</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总产品数"
              value={1234}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="草稿"
              value={56}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已发布"
              value={1178}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总销售额"
              value={45320.5}
              prefix="¥"
              precision={2}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="平台发布统计">
            <div style={{ height: 300, textAlign: 'center', color: '#999' }}>
              图表加载中... (集成 ECharts)
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="最近发布">
            <Table
              columns={[
                { title: '产品名称', dataIndex: 'name', key: 'name' },
                { title: '平台', dataIndex: 'platform', key: 'platform' },
                { title: '状态', dataIndex: 'status', key: 'status' },
              ]}
              dataSource={[
                { key: 1, name: '产品 1', platform: 'TikTok Shop', status: '已发布' },
                { key: 2, name: '产品 2', platform: '咸鱼', status: '已发布' },
              ]}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
