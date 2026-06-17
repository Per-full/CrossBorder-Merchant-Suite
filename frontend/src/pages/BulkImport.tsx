import React, { useState } from 'react';
import { Card, Upload, Button, Table, Space, message, Tag } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import Papa from 'papaparse';

const BulkImport: React.FC = () => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);

  const downloadTemplate = () => {
    const template = [
      ['产品名称', '价格', '库存', '描述', '平台', '图片URL'],
      ['示例产品', '99.99', '100', '这是一个示例产品', 'tiktok,xianyu', 'https://example.com/image.jpg'],
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '产品导入模板.csv');
    link.click();
    message.success('模板已下载');
  };

  const handleUpload = (file: any) => {
    Papa.parse(file, {
      header: true,
      complete: (results: any) => {
        setUploadedData(results.data.filter((row: any) => row.产品名称));
        message.success(`成功导入 ${results.data.length} 条产品信息`);
      },
      error: () => {
        message.error('CSV 文件解析失败');
      },
    });
    return false;
  };

  const columns = [
    { title: '产品名称', dataIndex: '产品名称', key: 'name' },
    { title: '价格', dataIndex: '价格', key: 'price' },
    { title: '库存', dataIndex: '库存', key: 'stock' },
    { title: '平台', dataIndex: '平台', key: 'platform', render: (text: string) => (
      <>{text?.split(',').map(p => <Tag key={p}>{p}</Tag>)}</>
    ) },
    { title: '状态', dataIndex: 'status', key: 'status', render: () => <Tag color="blue">待发布</Tag> },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">批量导入</h1>

      <Card title="上传 CSV 文件" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Upload
            accept=".csv,.xlsx,.xls"
            maxCount={1}
            beforeUpload={handleUpload}
          >
            <Button icon={<UploadOutlined />} size="large">
              点击上传 CSV 或 Excel 文件
            </Button>
          </Upload>
          <p style={{ color: '#999', fontSize: 12 }}>
            支持 CSV、XLS、XLSX 格式。建议先下载模板按格式填写。
          </p>
          <Button
            type="dashed"
            icon={<DownloadOutlined />}
            onClick={downloadTemplate}
          >
            下载导入模板
          </Button>
        </Space>
      </Card>

      {uploadedData.length > 0 && (
        <Card title={`已导入 ${uploadedData.length} 条产品`}>
          <Table
            columns={columns}
            dataSource={uploadedData.map((item, index) => ({ ...item, key: index }))}
            pagination={{ pageSize: 10 }}
          />
          <Space style={{ marginTop: 16 }}>
            <Button type="primary" size="large">
              批量发布到平台
            </Button>
            <Button>保存为草稿</Button>
          </Space>
        </Card>
      )}
    </div>
  );
};

export default BulkImport;
