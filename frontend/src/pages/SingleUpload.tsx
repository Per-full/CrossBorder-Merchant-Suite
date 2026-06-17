import React from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Row, Col, Upload, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const SingleUpload: React.FC = () => {
  const [form] = Form.useForm();

  const platforms = [
    { label: 'TikTok Shop', value: 'tiktok' },
    { label: '咸鱼 (Xianyu)', value: 'xianyu' },
    { label: '1688 (Alibaba)', value: '1688' },
  ];

  const onFinish = (values: any) => {
    console.log('表单数据:', values);
    // TODO: 调用 API 提交数据
  };

  return (
    <div className="page-container">
      <h1 className="page-title">单个上货</h1>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="产品信息">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="产品名称"
                name="productName"
                rules={[{ required: true, message: '请输入产品名称' }]}
              >
                <Input placeholder="输入产品名称" />
              </Form.Item>

              <Form.Item
                label="产品描述"
                name="description"
                rules={[{ required: true, message: '请输入产品描述' }]}
              >
                <Input.TextArea rows={4} placeholder="输入产品描述" />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="价格 (¥)"
                    name="price"
                    rules={[{ required: true, message: '请输入价格' }]}
                  >
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="库存"
                    name="stock"
                    rules={[{ required: true, message: '请输入库存' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="选择平台"
                name="platforms"
                rules={[{ required: true, message: '请选择至少一个平台' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="选择要发布的平台"
                  options={platforms}
                />
              </Form.Item>

              <Form.Item label="产品图片">
                <Upload
                  listType="picture-card"
                  multiple
                  maxCount={9}
                  beforeUpload={() => false}
                >
                  <div>
                    <PlusOutlined />
                    <div>上传图片</div>
                  </div>
                </Upload>
              </Form.Item>

              <Space>
                <Button type="primary" size="large" htmlType="submit">
                  发布产品
                </Button>
                <Button size="large">保存草稿</Button>
              </Space>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="平台说明">
            <div style={{ fontSize: 14, lineHeight: 1.8 }}>
              <h4>TikTok Shop</h4>
              <p>需要配置 API Key 和 Secret</p>

              <h4>咸鱼 (Xianyu)</h4>
              <p>阿里旗下二手交易平台</p>

              <h4>1688</h4>
              <p>阿里巴巴国内贸易平台</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SingleUpload;
