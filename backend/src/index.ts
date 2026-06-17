import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// 日志中间件
app.use(morgan('combined'));

// 解析中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 静态映射 uploads 目录（用于展示抓取并下载的图片）
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 导入路由（动态加载，避免循环依赖问题）
import importByUrlRouter from './routes/importByUrl';
app.use('/api', importByUrlRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 根
app.get('/api/v1', (req, res) => {
  res.json({ message: 'CrossBorder Merchant Suite API v1' });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
