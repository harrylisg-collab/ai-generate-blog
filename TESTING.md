# 测试规范文档

## 1. 测试策略概述

本项目采用多层次测试策略，确保代码质量和功能正确性。

### 测试金字塔

```
        /\
       /E2E\        ← Playwright (少量，关键流程)
      /------\
     / API  \      ← Supertest (中量，核心逻辑)
    /--------\
   / Unit   \      ← Vitest (大量，单元测试)
  /----------\
```

---

## 2. 测试类型

### 2.1 单元测试 (Unit Tests)

| 项目 | 说明 |
|------|------|
| **工具** | Vitest |
| **时机** | 开发过程中 (TDD) |
| **原则** | 先写测试，再写代码 |
| **范围** | 单个函数、工具函数、业务逻辑 |

**命令**: `npm test`

**示例**:
```javascript
// 先写测试
test('add function', () => {
  expect(add(1, 2)).toBe(3);
});

// 再写代码
function add(a, b) {
  return a + b;
}
```

---

### 2.2 API 测试 (API Tests)

| 项目 | 说明 |
|------|------|
| **工具** | Vitest + Supertest |
| **时机** | 开发完成后，部署前 |
| **范围** | 所有 API 端点 |

**命令**: `npm run test:api`

**测试端点**:

| 端点 | 方法 | 测试内容 |
|------|------|----------|
| `/api/posts` | GET | 获取文章列表 |
| `/api/posts` | POST | 创建文章 |
| `/api/posts/[id]` | PUT | 更新文章 |
| `/api/posts/[id]` | DELETE | 删除文章 |
| `/api/users` | GET | 获取用户列表 |
| `/api/users` | POST | 创建用户 |
| `/api/subscribe` | POST | 订阅 Newsletter |

**示例**:
```javascript
import request from 'supertest';
import app from '../src/app';

describe('API Tests', () => {
  test('GET /api/posts returns 200', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
  });

  test('POST /api/posts creates article', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ title: 'Test', content: 'Content' });
    expect(res.status).toBe(201);
  });
});
```

---

### 2.3 E2E 测试 (End-to-End Tests)

| 项目 | 说明 |
|------|------|
| **工具** | Playwright |
| **时机** | 部署到测试环境后 |
| **范围** | 关键用户流程 |

**命令**: 
- `npm run test:e2e` - 命令行模式
- `npm run test:e2e:ui` - UI 模式（可交互）

**测试用例**:

| 分类 | 测试用例 |
|------|----------|
| 首页 | 首页加载、文章列表显示 |
| 搜索 | 搜索页面、搜索结果 |
| 文章 | 文章详情页、代码高亮 |
| 认证 | 登录页面、登录流程 |
| 管理 | Dashboard、用户管理、订阅者管理 |

---

## 3. 开发流程中的测试

### 3.1 TDD 流程 (开发时)

```
1. 写测试 (red)      → 测试失败
2. 写代码 (green)   → 测试通过
3. 重构 (refactor)  → 保持测试通过
```

### 3.2 提交前检查

```bash
# 运行所有测试
npm test           # 单元测试
npm run test:api   # API 测试
```

### 3.3 部署流程

```
dev 开发 → 本地测试 → GitHub
    ↓
自动部署到测试环境
    ↓
运行 E2E 测试 (Playwright)
    ↓
测试通过 → 部署到生产
    ↓
生产验证
```

---

## 4. 测试覆盖率目标

| 类型 | 目标 |
|------|------|
| 单元测试 | 80%+ |
| API 测试 | 100% 核心端点 |
| E2E 测试 | 关键流程全覆盖 |

---

## 5. 测试环境

| 环境 | URL | 用途 |
|------|-----|------|
| 测试 | ai-generate-blog-test.vercel.app | E2E 测试 |
| 生产 | ai-generate-blog.vercel.app | 验证 |

---

## 6. 命令汇总

```bash
# 单元测试 (开发时)
npm test

# API 测试
npm run test:api

# E2E 测试
npm run test:e2e

# E2E UI 模式
npm run test:e2e:ui
```

---

## 7. Superpowers 测试原则

参考 Superpowers 测试指南：

1. **小步提交** - 每个小任务完成后立即提交测试
2. **测试驱动** - 先写测试，再写代码
3. **快速反馈** - 测试应该在几秒内完成
4. **可读性** - 测试代码应该清晰表达意图
