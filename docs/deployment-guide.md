# 发布注意事项文档

## 1. 部署流程

### 标准流程

```
1. 拉取最新代码 (git pull)
2. 部署到测试环境 (ai-generate-blog-test)
3. 运行 E2E 测试 (npm run test:e2e)
4. 测试通过后，部署到生产环境 (ai-generate-blog)
```

### 部署命令

```bash
# 测试环境
vercel --project ai-generate-blog-test --prod

# 生产环境  
vercel --project ai-generate-blog --prod
```

---

## 2. 常见问题与解决方案

### 问题 1：Vercel CLI 需要 Token

**症状**：部署时提示需要登录

**解决**：
```bash
# 方式 1：设置环境变量
export VERCEL_TOKEN=your_token

# 方式 2：CLI 传 token
vercel --token your_token --prod
```

### 问题 2：Preview 部署需要认证

**症状**：Preview URL 返回 401/403

**解决**：
1. 关闭项目的 SSO Protection
2. 或在浏览器中登录 Vercel 后访问

### 问题 3：数据库连接失败

**症状**：500 错误，日志显示数据库连接错误

**解决**：
1. 确认 POSTGRES_URL 环境变量已配置
2. 确认 NODE_TLS_REJECT_UNAUTHORIZED=0（用于 Supabase）
3. 确认测试/生产环境使用正确的数据库

### 问题 4：环境变量不生效

**症状**：代码已部署但功能异常

**解决**：
1. 检查 Vercel 项目设置中的 Environment Variables
2. 确认变量_TARGET_正确（production/preview/development）
3. 重新部署以加载新变量

### 问题 5：NEXTAUTH 登录失败

**症状**：登录后无法跳转或 session 无效

**解决**：
1. 确认 NEXTAUTH_SECRET 已配置
2. 确认 NEXTAUTH_URL 与部署 URL 匹配
3. 生产环境和测试环境需要不同的 NEXTAUTH_SECRET

---

## 3. 环境配置

### 测试环境 (ai-generate-blog-test)
- URL: https://ai-generate-blog-test.vercel.app
- 数据库: 测试库 (ijoiakxaqecghboayxel)
- 环境变量:
  - TEST_POSTGRES_URL
  - TEST_POSTGRES_URL_NON_POOLING
  - NEXTAUTH_SECRET
  - NEXTAUTH_URL
  - RESEND_API_KEY

### 生产环境 (ai-generate-blog)
- URL: https://ai-generate-blog.vercel.app
- 数据库: 生产库 (pkhthszpnzyveargpalf)
- 环境变量:
  - POSTGRES_URL
  - POSTGRES_URL_NON_POOLING
  - NEXTAUTH_SECRET
  - NEXTAUTH_URL
  - RESEND_API_KEY

---

## 4. 测试账号

### 测试环境
| 账号 | 密码 | 角色 |
|------|------|------|
| admin@example.com | admin123 | admin |
| editor@test.com | test123 | editor |
| author@test.com | test123 | author |

### 生产环境
| 账号 | 密码 | 角色 |
|------|------|------|
| admin@example.com | admin123 | admin |

---

## 5. E2E 测试

### 运行测试

```bash
# 运行 E2E 测试
npm run test:e2e

# 运行特定测试文件
npx playwright test tests/regression.spec.ts
```

### 测试配置

测试配置文件: `playwright.config.ts`
- 测试 URL: baseURL 从环境变量或配置读取
- 浏览器: Chromium

### 测试类别

| 类型 | 工具 | 命令 |
|------|------|------|
| 单元测试 | Vitest | npm run test |
| API 测试 | Vitest | npm run test:api |
| E2E 测试 | Playwright | npm run test:e2e |

---

## 6. 回滚

### Vercel Dashboard 回滚

1. 打开 Vercel Dashboard
2. 进入项目 → Deployments
3. 找到正常工作的部署
4. 点击 "..." → Promote to Production

### CLI 回滚

```bash
vercel rollback ai-generate-blog
```

---

## 7. 相关链接

- Vercel Dashboard: https://vercel.com/dashboard
- 测试环境: https://ai-generate-blog-test.vercel.app
- 生产环境: https://ai-generate-blog.vercel.app
- GitHub: https://github.com/harrylisg-collab/ai-generate-blog

---

## 8. 紧急联系人

- **Harry**: Vercel/Supabase 授权
- **ops**: 部署操作
- **dev**: 代码问题
