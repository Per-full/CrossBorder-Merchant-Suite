import React from 'react';
import { Card, Form, Input, Button, Divider, Space } from 'antd';

const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('设置:', values);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">系统设置</h1>

      <Card title="API 配置" style={{ marginBottom: 24, maxWidth: 600 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Divider>TikTok Shop</Divider>
          <Form.Item
            label="API Key"
            name="tiktokApiKey"
          >
            <Input.Password placeholder="输入 TikTok Shop API Key" />
          </Form.Item>
          <Form.Item
            label="API Secret"
            name="tiktokApiSecret"
          >
            <Input.Password placeholder="输入 TikTok Shop API Secret" />
          </Form.Item>

          <Divider>咸鱼 (Xianyu)</Divider>
          <Form.Item
            label="API Key"
            name="xianyuApiKey"
          >
            <Input.Password placeholder="输入咸鱼 API Key" />
          </Form.Item>
          <Form.Item
            label="API Secret"
            name="xianyuApiSecret"
          >
            <Input.Password placeholder="输入咸鱼 API Secret" />
          </Form.Item>

          <Divider>1688</Divider>
          <Form.Item
            label="API Key"
            name="alibabaApiKey"
          >
            <Input.Password placeholder="输入 1688 API Key" />
          </Form.Item>
          <Form.Item
            label="API Secret"
            name="alibabaApiSecret"
          >
            <Input.Password placeholder="输入 1688 API Secret" />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" size="large">
              保存设置
            </Button>
            <Button>重置</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;
