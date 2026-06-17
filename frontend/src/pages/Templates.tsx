import React from 'react';
import { Card, Row, Col, Button, Space, Modal, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Templates: React.FC = () => {
  const [templates] = React.useState([
    { id: 1, name: '服装模板', platform: ['tiktok', 'xianyu'], fields: ['品牌', '尺码', '材质', '颜色'] },
    { id: 2, name: '电子产品', platform: ['1688'], fields: ['品牌', '型号', '保修期', '颜色'] },
  ]);

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">产品模板管理</h1>

      <Button type="primary" icon={<PlusOutlined />} size="large" onClick={showModal} style={{ marginBottom: 24 }}>
        创建新模板
      </Button>

      <Row gutter={[16, 16]}>
        {templates.map(template => (
          <Col xs={24} sm={12} lg={8} key={template.id}>
            <Card
              hoverable
              title={template.name}
              extra={
                <Space>
                  <EditOutlined style={{ cursor: 'pointer' }} />
                  <DeleteOutlined style={{ cursor: 'pointer', color: 'red' }} />
                </Space>
              }
            >
              <p><strong>适用平台:</strong> {template.platform.join(', ')}</p>
              <p><strong>字段数:</strong> {template.fields.length}</p>
              <p><strong>字段:</strong> {template.fields.join(', ')}</p>
              <Button type="primary" block style={{ marginTop: 12 }}>
                使用此模板
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="创建新模板"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="模板名称"
            name="templateName"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="e.g. 服装模板" />
          </Form.Item>
          <Form.Item
            label="模板描述"
            name="description"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Templates;
