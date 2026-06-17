# CrossBorder Merchant Suite

跨境电商上货工具 - 支持 TikTok Shop、咸鱼、1688 一站式上货管理系统

## 🌟 功能特性

- ✅ **单个上货** - 快速添加单个产品信息
- ✅ **批量导入** - 支持 CSV/Excel 批量导入产品
- ✅ **多平台支持** - TikTok Shop、咸鱼、1688 一键发布
- ✅ **产品模板** - 预设模板快速填充产品信息
- ✅ **发布管理** - 发布历史、草稿管理、批量操作
- ✅ **库存同步** - 跨平台库存实时同步
- ✅ **数据统计** - 销售数据、浏览量等实时统计

## 📋 支持的平台

| 平台 | API | 状态 |
|------|-----|------|
| TikTok Shop | ✅ 已集成 | 生产就绪 |
| 咸鱼 (Xianyu) | ✅ 已集成 | 生产就绪 |
| 1688 (Alibaba) | ✅ 已集成 | 生产就绪 |

## 🛠️ 技术栈

### 前端
- React 18.2
- TypeScript
- Ant Design 5
- Axios
- React Router v6

### 后端
- Node.js 18+
- Express.js
- TypeScript
- SQLite / PostgreSQL
- Sequelize ORM

### 其他工具
- Docker & Docker Compose
- Nginx (生产环境)
- Redis (缓存)

## 📁 项目结构

```
CrossBorder-Merchant-Suite/
├── frontend/               # React 前端应用
│   ├── public/
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── pages/          # 页面
│   │   ├── services/       # API 服务
│   │   ├── types/          # TypeScript 类型
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
├── backend/                # Node.js 后端应用
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── services/       # 业务逻辑
│   │   ├── middleware/     # 中间件
│   │   ├── config/         # 配置文件
│   │   ├── utils/          # 工具函数
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml      # Docker 编排
├── .env.example            # 环境变量示例
└── README.md               # 本文件
```

## 🚀 快速开始

### 前置要求
- Node.js 18+
- npm 或 yarn
- Docker (可选)

### 本地开发

1. 克隆仓库
```bash
git clone https://github.com/Per-full/CrossBorder-Merchant-Suite.git
cd CrossBorder-Merchant-Suite
```

2. 安装依赖
```bash
# 前端
cd frontend
npm install

# 后端
cd ../backend
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的 API 密钥
```

4. 启动开发服务器
```bash
# 后端 (在 backend 目录)
npm run dev

# 前端 (新终端，在 frontend 目录)
npm start
```

5. 访问应用
- 前端: http://localhost:3000
- 后端 API: http://localhost:3001

## 🔐 环境变量配置

参考 `.env.example` 文件，需要配置：

```
# TikTok Shop
TIKTOK_SHOP_API_KEY=your_key
TIKTOK_SHOP_API_SECRET=your_secret

# 咸鱼 (Xianyu)
XIANYU_API_KEY=your_key
XIANYU_API_SECRET=your_secret

# 1688 (Alibaba)
ALIBABA_1688_API_KEY=your_key
ALIBABA_1688_API_SECRET=your_secret

# 数据库
DATABASE_URL=sqlite://./database.db

# Redis
REDIS_URL=redis://localhost:6379
```

## 📖 API 文档

详见 `backend/docs/API.md`

### 主要端点

- `POST /api/products` - 创建产品
- `GET /api/products` - 获取产品列表
- `PUT /api/products/:id` - 更新产品
- `DELETE /api/products/:id` - 删除产品
- `POST /api/products/bulk-import` - 批量导入
- `POST /api/listings` - 发布到平台
- `GET /api/listings` - 获取发布列表

## 🧪 测试

```bash
# 后端单元测试
cd backend
npm run test

# 前端组件测试
cd ../frontend
npm run test
```

## 🐳 Docker 部署

```bash
# 构建并运行
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License

## 👨‍💻 作者

Per-full

## 📞 联系方式

如有问题或建议，请提出 Issue 或 PR。

---

**最后更新**: 2026-06-17
