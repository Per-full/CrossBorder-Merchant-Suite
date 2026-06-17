import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  ImportOutlined,
  TemplateOutlined,
  HistoryOutlined,
  SettingOutlined
} from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import SingleUpload from './pages/SingleUpload';
import BulkImport from './pages/BulkImport';
import Templates from './pages/Templates';
import ListingHistory from './pages/ListingHistory';
import Settings from './pages/Settings';
import './App.css';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [current, setCurrent] = React.useState('dashboard');

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: 'single-upload',
      icon: <ShoppingOutlined />,
      label: '单个上货',
    },
    {
      key: 'bulk-import',
      icon: <ImportOutlined />,
      label: '批量导入',
    },
    {
      key: 'templates',
      icon: <TemplateOutlined />,
      label: '产品模板',
    },
    {
      key: 'listing-history',
      icon: <HistoryOutlined />,
      label: '发布历史',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  const renderPage = () => {
    switch (current) {
      case 'dashboard':
        return <Dashboard />;
      case 'single-upload':
        return <SingleUpload />;
      case 'bulk-import':
        return <BulkImport />;
      case 'templates':
        return <Templates />;
      case 'listing-history':
        return <ListingHistory />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={200}
      >
        <div className="logo">
          <h2>{collapsed ? 'CBS' : 'CrossBorder'}</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[current]}
          items={menuItems}
          onClick={(e) => setCurrent(e.key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: 600 }}>
            {menuItems.find(item => item.key === current)?.label}
          </span>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            {collapsed ? '☰' : '✕'}
          </button>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {renderPage()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
