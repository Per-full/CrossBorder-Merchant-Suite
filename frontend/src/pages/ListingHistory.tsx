import React from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const ListingHistory: React.FC = () => {
  const columns = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        let color = 'blue';
        if (text === '已下架') color = 'red';
        if (text === '销售中') color = 'green';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      productName: '产品 A',
      platform: 'TikTok Shop',
      publishTime: '2026-06-17 10:30',
      status: '销售中',
    },
    {
      key: '2',
      productName: '产品 B',
      platform: '咸鱼',
      publishTime: '2026-06-16 15:20',
      status: '销售中',
    },
    {
      key: '3',
      productName: '产品 C',
      platform: '1688',
      publishTime: '2026-06-15 09:00',
      status: '已下架',
    },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">发布历史</h1>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ListingHistory;
