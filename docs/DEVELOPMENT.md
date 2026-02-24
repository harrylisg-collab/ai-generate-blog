# 开发经验总结

## 1. 测试策略

### 测试分层
| 类型 | 工具 | 时机 |
|------|------|------|
| 单元测试 | Vitest | 开发中 (TDD) |
| API 测试 | Vitest + Supertest | 部署前 |
| E2E 测试 | Playwright | 测试环境 |

### E2E 测试最佳实践
```typescript
// ✅ 正确：避免 CSS 选择器中的逗号
await page.locator('article').isVisible();

// ❌ 错误：逗号在 CSS 选择器中有特殊含义
await page.locator('article, text=No posts').isVisible();
```

### 测试环境配置
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/api.test.ts'], // 排除非 E2E 测试
  use: {
    baseURL: 'https://ai-generate-blog-test.vercel.app',
  },
});
```

## 2. Next.js 开发经验

### Server vs Client Components
- 组件文件分离：`AdminClient.tsx` (Client) vs `AdminPage.tsx` (Server)
- `'use client'` 指令必须在文件顶部
- 复杂交互用 Client 组件，静态内容用 Server 组件

### searchParams 处理
```typescript
// Next.js 14+：searchParams 是 Promise
export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q || '';
}
```

### 数据库查询
```typescript
// 避免显示当前文章作为上下篇
const result = await dbQuery(
  'SELECT * FROM posts WHERE id != $1 AND slug < $2 ORDER BY slug DESC LIMIT 1',
  [currentPostId, currentSlug]
);
```

## 3. 环境配置

### Vercel 环境变量
```
NEXTAUTH_SECRET=生成密钥
NEXTAUTH_URL=https://ai-generate-blog-test.vercel.app
POSTGRES_URL=数据库连接
```

### 生成密钥
```bash
openssl rand -base64 32
```

## 4. 工作流程

### 任务拆分原则
- 每个任务 2-5 分钟
- 单个职责
- 频繁提交

### 提交信息规范
```
<类型>: <简短描述>

示例：
Fix: Simplify regression tests
Docs: Add README with test credentials
Feature: Add user management API
```

### 部署流程
1. 推送代码到 GitHub
2. 自动部署到测试环境
3. 运行 E2E 测试
4. 测试通过后部署到生产

## 5. 常见问题

### 登录失败
- 检查 NEXTAUTH_SECRET 是否配置
- 检查数据库用户是否存在
- 检查用户角色是否正确

### 500 错误
- 查看 Vercel 服务器日志
- 检查环境变量配置
- 验证数据库连接

### Playwright 超时
- 增加等待时间
- 使用 waitForURL 代替固定等待
- 检查网络请求状态

## 6. 项目结构

```
anthropic-blog/
├── src/
│   ├── app/           # Next.js 页面
│   ├── components/    # React 组件
│   │   └── AdminClient.tsx  # 客户端组件
│   ├── lib/           # 工具函数
│   │   ├── db.ts      # 数据库
│   │   ├── auth.ts    # 认证
│   │   └── posts.ts   # 文章
│   └── test/          # 单元测试
├── tests/             # E2E 测试
│   └── regression.spec.ts
├── docs/              # 设计文档
└── playwright.config.ts
```

## 7. 团队协作

| 角色 | 职责 |
|------|------|
| dev | 开发功能、编写测试 |
| ops | 部署、环境配置 |
| main | 项目管理、决策 |
| content | 内容管理 |

## 8. 关键命令

```bash
# 开发
npm run dev          # 启动开发服务器

# 测试
npm test             # 单元测试
npm run test:api     # API 测试
npm run test:e2e     # E2E 测试

# 构建
npm run build        # 构建生产版本
npm start            # 启动生产服务器
```
