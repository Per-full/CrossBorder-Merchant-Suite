import React from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Row, Col, Upload, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Search } = Input;

const SingleUpload: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = React.useState<any[]>([]);
  const [importing, setImporting] = React.useState(false);
  const [urlToImport, setUrlToImport] = React.useState('');

  const platforms = [
    { label: 'TikTok Shop', value: 'tiktok' },
    { label: '咸鱼 (Xianyu)', value: 'xianyu' },
    { label: '1688 (Alibaba)', value: '1688' },
  ];

  const onFinish = (values: any) => {
    console.log('表单数据:', values);
    message.success('表单已提交（示例）');
    // TODO: 调用 API 提交数据
  };

  const handleImportByUrl = async (value?: string) => {
    const url = (value || urlToImport || '').trim();
    if (!url) return message.warn('请输入商品页面 URL');
    setImporting(true);
    try {
      const resp = await axios.post('/api/import-by-url', { url });
      const result = resp.data;
      if (!result || !result.data) {
        message.error('解析失败：返回数据为空');
        return;
      }
      const d = result.data;

      // 填充表单字段
      form.setFieldsValue({
        productName: d.title || undefined,
        description: d.description || undefined,
        price: d.price ? Number(d.price) : undefined,
        stock: undefined,
        platforms: ['1688'],
      });

      // 将后端返回的图片（可能是 /uploads/xxx 或外链）转换为 Upload 的 fileList
      if (Array.isArray(d.images) && d.images.length > 0) {
        const newFileList = d.images.map((img: string, idx: number) => ({
          uid: `import-${idx}`,
          name: `image-${idx}`,
          status: 'done',
          url: img,
        }));
        setFileList(newFileList);
      }

      message.success('导入成功，表单已填充，请检查并修改后发布');
    } catch (err: any) {
      console.error('import error', err);
      const msg = err?.response?.data?.error || err?.message || '导入失败';
      message.error(`导入失败: ${msg}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">单个上货</h1>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="产品信息">
            {/* URL 导入控件 */}
            <div style={{ marginBottom: 16 }}>
              <Search
                placeholder="粘贴 1688 商品页面 URL，按回车或点击导入"
                enterButton={importing ? '导入中...' : '导入'}
                value={urlToImport}
                onChange={(e) => setUrlToImport(e.target.value)}
                onSearch={handleImportByUrl}
                loading={importing}
              />
            </div>

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
                  fileList={fileList}
                  onPreview={(file) => window.open((file as any).url || (file as any).thumbUrl)}
                  onChange={({ fileList: newList }) => setFileList(newList)}
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
